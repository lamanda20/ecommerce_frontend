# Frontend — E-commerce (React + TypeScript + Vite)

This README describes the frontend app, how to run it locally, and the simple API contract the frontend expects (useful for Postman/curl).

## Short technical note (2–3 sentences)
The frontend is built with React, TypeScript and Vite. It communicates with a REST API (typical backend: Node.js + TypeScript + Prisma) to fetch products, manage the cart and place orders. The app is intended to be started locally with `npm` and can run with mocked data if the backend is not available.

## Tech stack
- Frontend: React, TypeScript, Vite
- Styling: plain CSS / CSS modules (project-specific)
- Typical backend (for reference): Node.js, TypeScript, Prisma

## How to run the project
1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

By default Vite will serve at http://localhost:5173 (it may use a different port if 5173 is busy).

Note: the frontend uses `VITE_API_BASE_URL` to locate the backend API. Set this environment variable if your API runs on a different host/port (for example `http://localhost:4000`).

## Useful environment variables
- VITE_API_BASE_URL — API base URL (e.g. `http://localhost:4000`)

Create a `.env` or `.env.local` file at the frontend root with for example:

```
VITE_API_BASE_URL=http://localhost:4000
```

## API documentation (endpoints the frontend expects)
These endpoints define a minimal contract the frontend uses. Adjust URLs and payloads if your backend differs.

1) Get product list
- Method: GET
- URL: `{{API_BASE_URL}}/api/products`
- Description: returns an array of product objects
- Example response (200):

```json
[
  {"id": "1", "title": "Shoes", "price": 49.99, "image": "/images/shoe.jpg", "description": "..."},
  {"id": "2", "title": "T-shirt", "price": 19.99, "image": "/images/tshirt.jpg", "description": "..."}
]
```

2) Get product by id
- Method: GET
- URL: `{{API_BASE_URL}}/api/products/:id`
- Example response (200):

```json
{"id":"1","title":"Shoes","price":49.99,"image":"/images/shoe.jpg","description":"..."}
```

3) Add item to cart (server-side or client-side depending on implementation)
- Method: POST
- URL: `{{API_BASE_URL}}/api/cart`
- Body (JSON):

```json
{ "productId": "1", "quantity": 2 }
```

- Example response (201):

```json
{ "cartId": "abc123", "items": [{ "productId": "1", "quantity": 2 }] }
```

4) Get cart
- Method: GET
- URL: `{{API_BASE_URL}}/api/cart`
- Example response (200):

```json
{ "cartId": "abc123", "items": [{ "productId": "1", "quantity": 2 }], "total": 99.98 }
```

5) Create order
- Method: POST
- URL: `{{API_BASE_URL}}/api/orders`
- Body (JSON):

```json
{ "cartId": "abc123", "paymentMethod": "card", "shippingAddress": { "line1": "..." } }
```

- Example response (201):

```json
{ "orderId": "order_01", "status": "created" }
```

> These endpoints are common examples for an e-commerce frontend. Adapt the routes or payloads if your backend uses different names or schemas.

## Curl examples (adapt to `VITE_API_BASE_URL`)
- List products:

```bash
curl -X GET "${VITE_API_BASE_URL:-http://localhost:4000}/api/products" -H "Accept: application/json"
```

- Get a product:

```bash
curl -X GET "${VITE_API_BASE_URL:-http://localhost:4000}/api/products/1" -H "Accept: application/json"
```

- Add to cart:

```bash
curl -X POST "${VITE_API_BASE_URL:-http://localhost:4000}/api/cart" \
  -H "Content-Type: application/json" \
  -d '{"productId":"1","quantity":2}'
```

- Create an order:

```bash
curl -X POST "${VITE_API_BASE_URL:-http://localhost:4000}/api/orders" \
  -H "Content-Type: application/json" \
  -d '{"cartId":"abc123","paymentMethod":"card"}'
```

## Postman
You can import the curl commands above into Postman (File -> Import -> Raw text) or create a collection manually with the routes listed.

## Mock mode (if the backend is not available)
If you don't have a backend ready, you can:
- Use local fixtures/JSON inside `src/` and replace fetch/axios calls with imports of that JSON.
- Use msw (Mock Service Worker) to intercept HTTP requests during development.

## Quick FAQ
- Vite dev port: 5173 by default.
- Change API URL: set `VITE_API_BASE_URL` in `.env`.

---

If you want, I can:
- Generate an exportable Postman collection (.json) based on these endpoints.
- Add a `.env.example` file and a small msw mock setup for development without a backend.
- Implement a real API call in `src/App.tsx` to fetch and display products and provide a PR ready to merge.

Tell me which option you want me to implement next.
