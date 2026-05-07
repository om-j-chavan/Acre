# Acre — Full-stack ecommerce (dev branch)

Vintage-minimalist storefront with a complete backend: auth, roles, dynamic product management, orders, and an admin panel. Built with Node.js built-ins only — **zero npm dependencies**.

## Run it

```
node server.js
```

Then open <http://localhost:8080>.

On first run, `db.json` is auto-created and seeded with 12 products and a default admin account.

## Default admin

- Email: `admin@acre.local`
- Password: `admin123`

Sign in at `/login.html`, then access `/admin.html`. **Change this password before any real deployment.**

## Storefront

- `/` — Home, featured products, editorial
- `/shop.html` — Product grid, filter by `?cat=Tools`, sort
- `/product.html?id=p01` — Detail page with options, specs, related
- `/cart.html` — Cart
- `/checkout.html` — Checkout (creates a real server-side order)
- `/thanks.html` — Order confirmation
- `/about.html` — Studio story

## Account

- `/signup.html` — Create customer account
- `/login.html` — Sign in (redirects to admin or account based on role)
- `/account.html` — Profile, password change, order history, sign out

## Admin (role: admin)

`/admin.html` — three tabs:
- **Products** — list, create, edit, delete (image URL, options, specs)
- **Orders** — view all orders, change status (paid → packed → shipped → delivered → refunded)
- **Users** — promote/demote, disable/enable, delete

## API

All under `/api`, JSON in/out. Sessions are HttpOnly cookies (30-day expiry, scrypt-hashed passwords).

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| POST   | /api/auth/signup | — | Returns user + sets session |
| POST   | /api/auth/login  | — | |
| POST   | /api/auth/logout | — | |
| GET    | /api/auth/me     | — | Current user or null |
| GET    | /api/products    | — | |
| GET    | /api/products/:id | — | |
| POST   | /api/products    | admin | |
| PUT    | /api/products/:id | admin | |
| DELETE | /api/products/:id | admin | |
| POST   | /api/orders      | — | Anonymous checkout allowed |
| GET    | /api/orders      | user/admin | Customer sees own; admin sees all |
| PUT    | /api/orders/:id  | admin | Update status |
| GET    | /api/users       | admin | |
| PUT    | /api/users/:id   | admin | Change role/disabled/name |
| DELETE | /api/users/:id   | admin | |
| PUT    | /api/account     | user | Update own profile/password |

## Architecture

- `server.js` — single-file HTTP server, routing, API
- `db.json` — JSON file database (gitignored, regenerated on first run)
- `js/seed-products.js` — initial product seed
- `js/products.js` — browser-side product fetching + image rendering
- `js/app.js` — frontend Auth helper, Cart, chrome, API client
- `css/style.css` — design system

## Reset the database

Delete `db.json` and restart the server.

## To take to production

- Move from JSON file → SQLite/Postgres
- Wire payment provider (Stripe / Afterpay) — server-side keys
- Add email (transactional + marketing)
- Connect Australia Post API for live shipping rates
- HTTPS + secure cookies + CSRF tokens
- Rate limiting on auth endpoints
- Image upload to S3/Cloudinary instead of URL pasting
