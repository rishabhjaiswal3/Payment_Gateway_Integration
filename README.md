# Payment Gateway Integration

A reference implementation of **Razorpay** and **Stripe PaymentElement** using a React + Vite frontend and an Express.js backend.

---

## Project Structure

```
Payment_Gateway_Integration/
├── Payment_backend/          # Express.js server (Node.js)
│   ├── constants/
│   │   └── payment.js        # Reads keys from environment variables
│   ├── routes/
│   │   └── payment.js        # /payment/order (Razorpay), /payment/create-payment-intent (Stripe)
│   ├── .env                  # Your secret keys — never commit this
│   └── index.js              # Entry point, loads dotenv, mounts routes
│
└── Payment_Integration/      # React + Vite frontend
    └── src/
        └── components/
            ├── razorpay/
            │   └── RazorpayGateway.jsx
            └── stripe/
                └── Stripe.jsx
```

---

## Setup

### 1. Clone and branch

```bash
git clone <repo-url>
git checkout dev
```

### 2. Backend — `Payment_backend/`

**Install dependencies**
```bash
cd Payment_backend
npm install
```

**Create `.env`** (already exists — fill in your real keys)
```env
STRIPE_SECRET_KEY=sk_test_...
RAZORPAY_API_KEY=rzp_test_...
RAZORPAY_API_SECRET=your_razorpay_secret
```

> The `.env` file is gitignored. Never hardcode keys in source files.

**Start the server**
```bash
npm start
```
Server runs on `http://localhost:3000`

---

### 3. Frontend — `Payment_Integration/`

**Install dependencies**
```bash
cd Payment_Integration
npm install
```

**Create `.env`**
```env
VITE_API_ENDPOINT=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

> `VITE_STRIPE_PUBLISHABLE_KEY` is safe to expose — it is a public key by design and cannot create charges.

**Start the dev server**
```bash
npm run dev
```

---


### Stripe PaymentElement

| Step | Where | What happens |
|------|-------|-------------|
| 1 | Frontend mounts | `POST /payment/create-payment-intent` — backend creates a PaymentIntent using secret key |
| 2 | Backend → Frontend | Returns `clientSecret` (a one-time token for this payment) |
| 3 | Frontend | Initializes `<Elements>` provider with `clientSecret` |
| 4 | Frontend | Renders `<PaymentElement>` — Stripe's unified UI (card, Apple Pay, Google Pay, etc.) |
| 5 | User | Fills in payment details |
| 6 | Frontend | Calls `stripe.confirmPayment()` — card data goes **directly to Stripe**, never touches your backend |

**Keys needed:**
- `STRIPE_SECRET_KEY` in backend `.env` — used to create PaymentIntents
- `VITE_STRIPE_PUBLISHABLE_KEY` in frontend `.env` — used to initialize Stripe.js

**Why two keys?**
- The **secret key** (`sk_test_...`) lives only on the server. It can create charges and access your account — must never be exposed.
- The **publishable key** (`pk_test_...`) is intentionally public. It only authorizes the browser to send card data directly to Stripe's servers.

---

## API Endpoints

| Method | Endpoint | Gateway | Description |
|--------|----------|---------|-------------|
| POST | `/payment/order` | Razorpay | Creates a Razorpay order |
| POST | `/payment/create-payment-intent` | Stripe | Creates a Stripe PaymentIntent, returns `clientSecret` |

### `POST /payment/order`
```json
Request:  { "amount": 2000 }
Response: { "id": "order_xxx", "amount": 2000, "currency": "INR", ... }
```

### `POST /payment/create-payment-intent`
```json
Request:  { "item": { "id": "prod_001", "price": 20 } }
Response: { "intentId": "uuid", "clientSecret": "pi_xxx_secret_xxx", "item": { ... } }
```

---

## Environment Variables Reference

### Backend (`Payment_backend/.env`)

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe secret key — from Stripe Dashboard |
| `RAZORPAY_API_KEY` | Razorpay key ID — from Razorpay Dashboard |
| `RAZORPAY_API_SECRET` | Razorpay key secret — from Razorpay Dashboard |

### Frontend (`Payment_Integration/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_ENDPOINT` | Backend base URL, e.g. `http://localhost:3000` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key — safe to expose |
