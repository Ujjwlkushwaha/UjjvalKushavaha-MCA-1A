// Tiny data layer. Products and orders are kept in JSON files inside /data,
// so they are still there after the server restarts.
const fs = require("fs");
const path = require("path");

function load(name) {
  const file = path.join(__dirname, "data", name + ".json");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function save(name, list) {
  const file = path.join(__dirname, "data", name + ".json");
  fs.writeFileSync(file, JSON.stringify(list, null, 2));
}

module.exports = {
  getProducts: function () { return load("products"); },
  saveProducts: function (list) { save("products", list); },
  getOrders: function () { return load("orders"); },
  saveOrders: function (list) { save("orders", list); },

  // next free id for a list; "start" is used when the list is empty
  nextId: function (list, start) {
    if (list.length === 0) return start;
    return Math.max.apply(null, list.map(function (item) { return item.id; })) + 1;
  }
};
