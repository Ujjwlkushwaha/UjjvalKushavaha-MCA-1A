// Show only the fields for the chosen payment method
const radios = document.querySelectorAll('input[name="method"]');
const panels = document.querySelectorAll(".pay-fields");

function showSelected() {
  const chosen = document.querySelector('input[name="method"]:checked').value;
  panels.forEach(function (panel) {
    panel.hidden = panel.dataset.for !== chosen;
  });
}

radios.forEach(function (r) { r.addEventListener("change", showSelected); });
showSelected();

// put a space after every 4 digits in the card number
const cardNumber = document.getElementById("cardNumber");
cardNumber.addEventListener("input", function () {
  const digits = cardNumber.value.replace(/\D/g, "").slice(0, 16);
  cardNumber.value = digits.replace(/(.{4})/g, "$1 ").trim();
});
