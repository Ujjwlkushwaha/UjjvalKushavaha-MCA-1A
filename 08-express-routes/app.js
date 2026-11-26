const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// EJS is the template engine. Express looks for .ejs files in the "views" folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// lets us read form data sent with POST (req.body)
app.use(express.urlencoded({ extended: true }));

// serves files from the "public" folder (our CSS)
app.use(express.static(path.join(__dirname, "public")));

// small list of data used by the services page
const services = [
  { name: "Web Design", price: 5000 },
  { name: "Web Development", price: 12000 },
  { name: "Hosting", price: 2000 }
];

// Route 1 - GET: home page
app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

// Route 2 - GET: about page
app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

// Route 3 - GET: services page (sends an array to the template)
app.get("/services", (req, res) => {
  res.render("services", { title: "Services", services: services });
});

// Route 4 - GET: dynamic route, the name comes from the URL  e.g. /user/Rahul
app.get("/user/:name", (req, res) => {
  res.render("user", { title: "User", name: req.params.name });
});

// Route 5 - GET: contact form
app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact" });
});

// Route 6 - POST: receives the contact form
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  console.log("New message from", name, email, ":", message);
  res.render("thanks", { title: "Thank You", name: name });
});

app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});
