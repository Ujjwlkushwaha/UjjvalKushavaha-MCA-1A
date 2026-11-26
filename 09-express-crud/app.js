const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

// HTML forms can only send GET and POST.
// method-override lets us write  action="/products/1?_method=PUT"  or  DELETE
app.use(methodOverride("_method"));

// our "database" is just an array in memory (resets when the server restarts)
let products = [
  { id: 1, name: "Laptop", price: 55000, description: "Fast laptop for students" },
  { id: 2, name: "Headphones", price: 1500, description: "Wireless headphones" }
];
let nextId = 3;

// helper: find a product by id
function findProduct(id) {
  return products.find(function (p) { return p.id === Number(id); });
}

// ---------- RESTful routes ----------

// READ all        GET /products
app.get("/products", (req, res) => {
  res.render("index", { products: products });
});

// form to create  GET /products/new   (must be written BEFORE /products/:id)
app.get("/products/new", (req, res) => {
  res.render("new");
});

// CREATE          POST /products
app.post("/products", (req, res) => {
  const { name, price, description } = req.body;
  products.push({ id: nextId++, name: name, price: Number(price), description: description });
  res.redirect("/products");
});

// READ one        GET /products/:id
app.get("/products/:id", (req, res) => {
  const product = findProduct(req.params.id);
  if (!product) return res.status(404).send("Product not found");
  res.render("show", { product: product });
});

// form to edit    GET /products/:id/edit
app.get("/products/:id/edit", (req, res) => {
  const product = findProduct(req.params.id);
  if (!product) return res.status(404).send("Product not found");
  res.render("edit", { product: product });
});

// UPDATE          PUT /products/:id
app.put("/products/:id", (req, res) => {
  const product = findProduct(req.params.id);
  if (!product) return res.status(404).send("Product not found");

  product.name = req.body.name;
  product.price = Number(req.body.price);
  product.description = req.body.description;
  res.redirect("/products");
});

// DELETE          DELETE /products/:id
app.delete("/products/:id", (req, res) => {
  products = products.filter(function (p) { return p.id !== Number(req.params.id); });
  res.redirect("/products");
});

// open the product list when someone visits the home page
app.get("/", (req, res) => res.redirect("/products"));

app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});
