# GreenCart 🛒 - MERN Stack Grocery Delivery Application

GreenCart is a premium, modern, and fully-featured grocery delivery web application built on the MERN stack (MongoDB, Express, React, Node.js). It features secure user authentication, product catalogs by category, cart management, address saving, an Admin/Seller product & order dashboard, and a fully integrated **Stripe Payment Gateway** checkout and verification flow.

---

## 🌟 Key Features

### 🛍️ Client / Customer Facing
- **Dynamic Homepage**: Featured banners, bestseller product listings, and category-wise browsing.
- **Product Details & Search**: High-resolution image gallery thumbnails, item specifications, related products recommendations, and real-time search.
- **Cart Management**: Add items to cart, dynamically modify quantities (with automatic totals and 2% tax calculation), and remove products.
- **Address Book**: Add and save multiple shipping addresses directly to the database.
- **Secure Checkout & Stripe Gateway**: Choice between Cash on Delivery (COD) and Online Payment via Stripe.
  - Dynamically redirects to Stripe's secure hosted portal.
  - Custom `/verify` callback page validating the payment session against the database.
- **Order History**: Personal dashboard tracking placed orders, payment methods, amounts, and shipping details.

### 💼 Seller / Admin Dashboard
- **Add Products**: Multi-image uploader (Cloudinary integrated), price, discount/offer price, weight, category, and bullet descriptions.
- **Inventory Control**: Live stock toggle switch to mark products in or out of stock.
- **Order Management**: Monitor store-wide orders, tracking billing details, items bought, total amounts, and payment status (Paid vs. Pending).

---

## 🛠️ Technology Stack

| Component | Technologies Used |
| :--- | :--- |
| **Frontend** | React, React Router (v7), Vite, TailwindCSS (v4), Axios, React Hot Toast |
| **Backend** | Node.js, Express, JSON Web Tokens (JWT), Cookie-Parser |
| **Database** | MongoDB (via Mongoose ODM) |
| **Integrations** | Stripe API (Payments), Cloudinary API (Media Uploads), Multer |

---

## 📦 Project Directory Structure

```text
GREENCART/
├── client/          # React (Vite) Frontend Application
│   ├── src/
│   │   ├── components/  # Reusable UI elements (Navbar, Login, ProductCard)
│   │   ├── context/     # AppContext for global states (cart, user, products)
│   │   ├── pages/       # Router page views (Cart, Verify, MyOrders, Seller)
│   │   └── assets/      # Graphical assets and layout data
│   ├── .env.example     # Environment template for frontend
│   └── package.json
│
└── server/          # Node.js Express REST API
    ├── configs/         # Database, Cloudinary, and Multer configs
    ├── controllers/     # Route logic handlers (user, product, order, cart)
    ├── middlewares/     # Authentication filters (user & seller credentials)
    ├── models/          # MongoDB Mongoose schemas
    ├── routes/          # API route definitions
    ├── .env.example     # Environment template for backend
    └── package.json
```

---

## 🚀 Setup & Installation

### Prerequisites
Make sure you have Node.js (v18+) and npm installed on your system.

### 1. Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Fill in the credentials in `server/.env`:
   - `JWT_SECRET`: Any strong secure random text.
   - `MONGODB_URI`: Your MongoDB connection string (local or Atlas cluster).
   - `CLOUDINARY_*`: Cloudinary storage credentials.
   - `STRIPE_SECRET_KEY`: Stripe API secret key (starts with `sk_test_`).

5. Start the backend development server:
   ```bash
   npm run server
   ```
   *(Running by default on `http://localhost:4000`)*

### 2. Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Confirm configuration in `client/.env`:
   - `VITE_CURRENCY`: Currency symbol (default: `$`).
   - `VITE_BACKEND_URL`: URL of the Express server (default: `http://localhost:4000`).

5. Start the frontend client dev environment:
   ```bash
   npm run dev
   ```
   *(Running by default on `http://localhost:5173`)*

---

## 💳 Payment Gateway Flow (Stripe)

1. **Initiate Payment**: The frontend client issues a checkout request to `/api/order/stripe` with the cart items and address ID.
2. **Session Creation**: The backend calculates totals, saves the order as unpaid, builds the Stripe session line items (including tax), and requests a Stripe Checkout session.
3. **Redirect**: Stripe returns a secure session URL, and the client is automatically redirected to the Stripe portal.
4. **Verification**:
   - On completion, Stripe redirects back to the client-side `/verify?success=true&orderId=<id>`.
   - The React `/verify` page displays a spinner while triggering the backend `/api/order/verifyStripe` endpoint.
   - On successful validation, the order is marked `isPaid: true` and the customer's cart is automatically emptied.
