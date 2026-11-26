const express = require("express");
const session = require("express-session");
const path = require("path");
const store = require("./store");
const payment = require("./payment");

const app = express();
const PORT = 3000;
const SELLER_PASSWORD = "seller123";      // change this if you like
const FREE_DELIVERY_ABOVE = 999;
const DELIVERY_CHARGE = 60;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: "thela-lab-secret", resave: false, saveUninitialized: true }));

// helpers that every template can use
app.locals.money = function (n) { return "₹" + Number(n).toLocaleString("en-IN"); };
app.locals.fmtDate = function (iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

// runs on every request: sets up the cart and the values the header needs
app.use(function (req, res, next) {
  if (!req.session.cart) req.session.cart = {};            // { productId: quantity }
  if (!req.session.orderIds) req.session.orderIds = [];    // orders placed from this browser

  let count = 0;
  Object.values(req.session.cart).forEach(function (q) { count += q; });

  res.locals.cartCount = count;
  res.locals.isSeller = Boolean(req.session.isSeller);
  res.locals.flash = req.session.flash || null;            // one-time message
  req.session.flash = null;
  next();
});

// ---------- cart helpers ----------

// Turns the { id: qty } object in the session into full product rows
function getCartItems(req) {
  const products = store.getProducts();
  const items = [];

  Object.keys(req.session.cart).forEach(function (id) {
    const product = products.find(function (p) { return p.id === Number(id); });
    if (!product) return;                                   // product was deleted by the seller
    const qty = Math.min(req.session.cart[id], product.stock);
    if (qty < 1) return;                                    // sold out meanwhile
    items.push({ product: product, qty: qty, lineTotal: product.price * qty });
  });
  return items;
}

function getTotals(items) {
  let subtotal = 0;
  items.forEach(function (i) { subtotal += i.lineTotal; });
  const delivery = (subtotal === 0 || subtotal >= FREE_DELIVERY_ABOVE) ? 0 : DELIVERY_CHARGE;
  return { subtotal: subtotal, delivery: delivery, total: subtotal + delivery, freeAbove: FREE_DELIVERY_ABOVE };
}

// ---------- shop ----------

app.get("/", function (req, res) {
  const all = store.getProducts();
  const categories = ["All"];
  all.forEach(function (p) { if (!categories.includes(p.category)) categories.push(p.category); });

  const selected = categories.includes(req.query.cat) ? req.query.cat : "All";
  const products = selected === "All" ? all : all.filter(function (p) { return p.category === selected; });

  res.render("shop", { title: "Shop", products: products, categories: categories, selected: selected });
});

// ---------- cart ----------

app.get("/cart", function (req, res) {
  const items = getCartItems(req);
  res.render("cart", { title: "Your cart", items: items, totals: getTotals(items) });
});

app.post("/cart/add/:id", function (req, res) {
  const product = store.getProducts().find(function (p) { return p.id === Number(req.params.id); });
  if (!product) return res.redirect("/");

  const inCart = req.session.cart[product.id] || 0;
  if (inCart + 1 > product.stock) {
    req.session.flash = "Only " + product.stock + " of " + product.name + " in stock.";
  } else {
    req.session.cart[product.id] = inCart + 1;
    req.session.flash = product.name + " added to your cart.";
  }
  res.redirect(req.get("referer") || "/");
});

// one route for the + button, the - button and the remove button
app.post("/cart/update/:id", function (req, res) {
  const id = Number(req.params.id);
  const product = store.getProducts().find(function (p) { return p.id === id; });
  const change = req.body.change;
  let qty = req.session.cart[id] || 0;

  if (change === "remove") qty = 0;
  if (change === "1") qty = qty + 1;
  if (change === "-1") qty = qty - 1;
  if (product && qty > product.stock) qty = product.stock;

  if (qty <= 0) delete req.session.cart[id];
  else req.session.cart[id] = qty;

  res.redirect("/cart");
});

// ---------- checkout ----------

function showCheckout(req, res, items, error, form) {
  res.render("checkout", {
    title: "Checkout",
    items: items,
    totals: getTotals(items),
    error: error,
    form: form || {}
  });
}

app.get("/checkout", function (req, res) {
  const items = getCartItems(req);
  if (items.length === 0) return res.redirect("/cart");
  showCheckout(req, res, items, null, {});
});

app.post("/checkout", function (req, res) {
  const items = getCartItems(req);
  if (items.length === 0) return res.redirect("/cart");

  const form = req.body;

  // 1. check the delivery details
  if (!form.name || !form.address || !form.city) {
    return showCheckout(req, res, items, "Please fill in your name, address and city.", form);
  }
  if (!/^\d{10}$/.test(form.phone || "")) {
    return showCheckout(req, res, items, "Phone number should be 10 digits.", form);
  }
  if (!/^\d{6}$/.test(form.pincode || "")) {
    return showCheckout(req, res, items, "Pincode should be 6 digits.", form);
  }

  // 2. take the payment
  const result = payment.processPayment(form.method, form);
  if (!result.ok) {
    return showCheckout(req, res, items, result.message, form);
  }

  // 3. payment worked: reduce stock and save the order
  const products = store.getProducts();
  items.forEach(function (item) {
    const p = products.find(function (x) { return x.id === item.product.id; });
    p.stock = p.stock - item.qty;
  });
  store.saveProducts(products);

  const totals = getTotals(items);
  const orders = store.getOrders();
  const order = {
    id: store.nextId(orders, 1001),
    date: new Date().toISOString(),
    items: items.map(function (i) {
      return { name: i.product.name, price: i.product.price, qty: i.qty };
    }),
    subtotal: totals.subtotal,
    delivery: totals.delivery,
    total: totals.total,
    customer: { name: form.name, phone: form.phone, address: form.address, city: form.city, pincode: form.pincode },
    payment: { method: result.label, reference: result.reference }
  };
  orders.push(order);
  store.saveOrders(orders);

  // 4. empty the cart and remember this order for the Orders page
  req.session.cart = {};
  req.session.orderIds.push(order.id);
  res.redirect("/orders?placed=" + order.id);
});

// ---------- orders ----------

app.get("/orders", function (req, res) {
  const mine = req.session.orderIds;
  const orders = store.getOrders()
    .filter(function (o) { return mine.includes(o.id); })
    .reverse();                                              // newest first

  res.render("orders", { title: "Your orders", orders: orders, placed: Number(req.query.placed) || null });
});

// ---------- seller panel ----------

function requireSeller(req, res, next) {
  if (!req.session.isSeller) return res.redirect("/seller/login");
  next();
}

// reads and checks the product form; returns { product, error }
function readProductForm(body) {
  const product = {
    name: (body.name || "").trim(),
    category: (body.category || "").trim(),
    price: Number(body.price),
    stock: Number(body.stock),
    image: (body.image || "").trim(),
    description: (body.description || "").trim()
  };

  let error = null;
  if (!product.name || !product.category || !product.description) error = "Name, category and description are required.";
  else if (!Number.isInteger(product.price) || product.price < 1) error = "Price must be a whole number above 0.";
  else if (!Number.isInteger(product.stock) || product.stock < 0) error = "Stock must be 0 or more.";

  return { product: product, error: error };
}

app.get("/seller/login", function (req, res) {
  res.render("seller-login", { title: "Seller login", error: null });
});

app.post("/seller/login", function (req, res) {
  if (req.body.password === SELLER_PASSWORD) {
    req.session.isSeller = true;
    return res.redirect("/seller");
  }
  res.render("seller-login", { title: "Seller login", error: "Wrong password." });
});

app.post("/seller/logout", function (req, res) {
  req.session.isSeller = false;
  res.redirect("/");
});

app.get("/seller", requireSeller, function (req, res) {
  res.render("seller", {
    title: "Seller panel",
    products: store.getProducts(),
    orders: store.getOrders().reverse()
  });
});

app.get("/seller/products/new", requireSeller, function (req, res) {
  res.render("seller-form", {
    title: "Add product", heading: "Add a product", action: "/seller/products",
    product: { name: "", category: "", price: "", stock: "", image: "", description: "" }, error: null
  });
});

app.post("/seller/products", requireSeller, function (req, res) {
  const result = readProductForm(req.body);
  if (result.error) {
    return res.render("seller-form", {
      title: "Add product", heading: "Add a product", action: "/seller/products",
      product: result.product, error: result.error
    });
  }

  const products = store.getProducts();
  result.product.id = store.nextId(products, 1);
  products.push(result.product);
  store.saveProducts(products);

  req.session.flash = result.product.name + " was added.";
  res.redirect("/seller");
});

app.get("/seller/products/:id/edit", requireSeller, function (req, res) {
  const product = store.getProducts().find(function (p) { return p.id === Number(req.params.id); });
  if (!product) return res.redirect("/seller");

  res.render("seller-form", {
    title: "Edit product", heading: "Edit product", action: "/seller/products/" + product.id,
    product: product, error: null
  });
});

app.post("/seller/products/:id", requireSeller, function (req, res) {
  const id = Number(req.params.id);
  const result = readProductForm(req.body);
  if (result.error) {
    result.product.id = id;
    return res.render("seller-form", {
      title: "Edit product", heading: "Edit product", action: "/seller/products/" + id,
      product: result.product, error: result.error
    });
  }

  const products = store.getProducts();
  const index = products.findIndex(function (p) { return p.id === id; });
  if (index === -1) return res.redirect("/seller");

  result.product.id = id;
  products[index] = result.product;
  store.saveProducts(products);

  req.session.flash = result.product.name + " was updated.";
  res.redirect("/seller");
});

app.post("/seller/products/:id/delete", requireSeller, function (req, res) {
  const id = Number(req.params.id);
  const products = store.getProducts().filter(function (p) { return p.id !== id; });
  store.saveProducts(products);

  req.session.flash = "Product removed.";
  res.redirect("/seller");
});

// anything else
app.use(function (req, res) {
  res.status(404).render("message", { title: "Not found", text: "We couldn't find that page." });
});

app.listen(PORT, function () {
  console.log("Store running at http://localhost:" + PORT);
  console.log("Seller panel: http://localhost:" + PORT + "/seller  (password: " + SELLER_PASSWORD + ")");
});
