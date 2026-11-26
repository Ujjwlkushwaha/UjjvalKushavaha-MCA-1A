const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// read JSON sent in the request body (used by the POST route)
app.use(express.json());

// serve the front end (index.html, style.css, script.js) from "public"
app.use(express.static(path.join(__dirname, "public")));

let products = [
  { id: 1, name: "Laptop", price: 55000, rating: 4.5 },
  { id: 2, name: "Headphones", price: 1500, rating: 4.1 },
  { id: 3, name: "Smart Watch", price: 3500, rating: 3.9 }
];
let nextId = 4;

// API 1: get all products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// API 2: get one product by id
app.get("/api/products/:id", (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// API 3: add a new product
app.post("/api/products", (req, res) => {
  const { name, price, rating } = req.body;

  if (!name || price === undefined || rating === undefined) {
    return res.status(400).json({ message: "name, price and rating are required" });
  }

  const newProduct = { id: nextId++, name: name, price: Number(price), rating: Number(rating) };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});
