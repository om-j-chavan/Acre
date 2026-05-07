# Acre — E-commerce POC

A vintage-minimalist ecommerce site inspired by acre.com.au, nho.agency, and bfcbuilt.com.au, with shop UX in the spirit of thebalconygarden.com.au.

## Run it
Open `index.html` directly in a browser, or serve the folder:

```
python -m http.server 8080
# then visit http://localhost:8080
```

## What's here
- **index.html** — Hero, featured products, categories, editorial, newsletter
- **shop.html** — Full product grid with category filter (`?cat=Planters`) and sorting
- **product.html** — Detail page with options, quantity, specs, related products (`?id=p01`)
- **cart.html** — Cart with quantity controls, subtotal, free-shipping nudge
- **checkout.html** — Address form, shipping method, demo payment, order placement
- **thanks.html** — Order confirmation with order number and summary
- **about.html** — Journal / studio story

## Features
- 12 products across 6 categories with hand-built SVG illustrations (no external image assets needed)
- LocalStorage-backed cart that persists across pages
- Shipping calculator (standard / express / studio pickup) with free-shipping thresholds
- AU GST (10%) display, AUD pricing
- Order generation with unique order numbers
- Fully responsive layout
- No build step, no dependencies — vanilla HTML/CSS/JS

## To take to production
- Replace SVG placeholders with real product photography
- Wire payment to Stripe / Afterpay (server-side keys required)
- Add backend or move to Shopify/WooCommerce for real order processing
- Add transactional email (SendGrid / Postmark)
- Connect shipping rates to Australia Post API
- Add CMS for the journal
