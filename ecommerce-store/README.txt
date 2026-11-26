Thela - small e-commerce store (Express + EJS)

Run:
  npm install
  npm start
Open http://localhost:3000

Product and shop photography is loaded from Unsplash, so images require an internet connection.

Pages
  /                  all products (filter by category)
  /cart              cart, change quantity, remove
  /checkout          delivery details + payment
  /orders            successful orders (this browser)
  /seller/login      seller password: seller123
  /seller            add, edit, delete products, view all orders

Test payments (pretend gateway, no real money)
  Card  : any 16 digits, future expiry like 12/30, any 3 digit CVV
  Card ending 0000 is always declined (to show a failed payment)
  UPI   : anything like name@upi
  COD   : no details needed

Data is saved in the data/ folder (products.json, orders.json).
To reset orders, put [] inside data/orders.json.
