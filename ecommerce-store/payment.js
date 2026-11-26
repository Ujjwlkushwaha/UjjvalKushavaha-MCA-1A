// A pretend payment gateway. No real money moves here.
// It only checks that the details look right, then returns a result,
// the same shape a real gateway (Razorpay, Stripe...) would give back.

function makeReference() {
  return "PAY" + Date.now().toString(36).toUpperCase();
}

function checkCard(details) {
  const number = (details.cardNumber || "").replace(/\s/g, "");
  const expiry = (details.cardExpiry || "").trim();
  const cvv = (details.cardCvv || "").trim();

  if (!/^\d{16}$/.test(number)) return "Enter a 16 digit card number.";
  if (!/^\d{3}$/.test(cvv)) return "CVV should be 3 digits.";

  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return "Enter expiry as MM/YY.";
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  const now = new Date();
  const expired = year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1);
  if (month < 1 || month > 12 || expired) return "This card has expired.";

  // for the demo: a card ending in 0000 is always declined
  if (number.endsWith("0000")) return "The bank declined this card. Try another one.";

  return null;   // null means no problem
}

function processPayment(method, details) {
  if (method === "cod") {
    return { ok: true, reference: "COD", label: "Cash on delivery" };
  }

  if (method === "upi") {
    const upi = (details.upiId || "").trim();
    if (!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upi)) {
      return { ok: false, message: "Enter a valid UPI ID, for example name@upi." };
    }
    return { ok: true, reference: makeReference(), label: "UPI" };
  }

  if (method === "card") {
    const problem = checkCard(details);
    if (problem) return { ok: false, message: problem };
    return { ok: true, reference: makeReference(), label: "Card" };
  }

  return { ok: false, message: "Please choose a payment method." };
}

module.exports = { processPayment };
