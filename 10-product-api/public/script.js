const form = document.getElementById("productForm");
const productBody = document.getElementById("productBody");

// Ask the server for all products and draw them in the table.
// The browser builds the HTML, the server only sends JSON.
async function loadProducts() {
  const response = await fetch("/api/products");
  const products = await response.json();

  productBody.innerHTML = "";

  products.forEach(function (p) {
    const row = document.createElement("tr");
    row.innerHTML =
      "<td>" + p.id + "</td>" +
      "<td></td>" +
      "<td>Rs. " + p.price + "</td>" +
      "<td>" + p.rating + " / 5</td>";
    row.children[1].textContent = p.name;   // textContent keeps user input safe
    productBody.appendChild(row);
  });
}

// Send the form data to the server as JSON, then reload the table
form.addEventListener("submit", async function (event) {
  event.preventDefault();   // stop the page from refreshing

  const newProduct = {
    name: document.getElementById("name").value,
    price: document.getElementById("price").value,
    rating: document.getElementById("rating").value
  };

  const response = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProduct)
  });

  if (response.ok) {
    form.reset();
    loadProducts();
  } else {
    alert("Could not add the product");
  }
});

loadProducts();
