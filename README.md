# ClickNCart

React/TypeScript storefront and Express/MongoDB API with catalog browsing, browser-local favorites, reviews, carts, promotional discounts and cash-on-delivery checkout.

## Local development

Use Node.js 24 LTS. Install dependencies with `npm ci` inside both `server` and `client`. Copy each `.env.example` to `.env` and supply your own configuration. Start the API with `npm run dev` in `server`, then Vite with `npm run dev` in `client`.

MongoDB **must support transactions**: use Atlas or a local replica set. A standalone MongoDB server cannot complete checkout. Vite proxies `/api` to port 3000 in development.

## Validation

- `cd client && npm run build`: TypeScript validation and production bundle.
- `cd server && npm run check`: JavaScript syntax checks.
- `cd server && npm run test:unit`: isolated controller/schema regression tests.
- `cd server && npm test`: includes integration tests against an isolated MongoDB replica set. The first run downloads a MongoDB binary; it requires a runner that permits starting MongoDB.
- Run `npm audit --audit-level=high` in both packages.

GitHub Actions runs the full checks on pushes and pull requests. Do not merge or deploy with failing checks.

## Deployment

1. Back up the existing database and test the migration on a staging copy first. Stop API writes during migration. Run `npm run migrate` from `server`. This normalizes emails/categories, consolidates duplicate brands and updates product references, refreshes review aggregates, and creates required unique indexes. It intentionally clears **legacy untrusted carts** once; customers must rebuild those carts. Duplicate users/carts cause a preflight failure and need manual reconciliation. Historical orders with missing money fields are retained without fabricated values.
2. Set `NODE_ENV=production`, `MONGO_URI`, a random `JWT_SECRET` of at least 32 characters, and an HTTPS `CLIENT_URL`. Set `TRUST_PROXY` only to the known number of trusted proxy hops. Runtime automatic index creation is disabled in production; run the migration before starting the API.
3. Provision the first administrator deliberately through your database administration tool: set `role: "admin"` only on the verified owner account. Signup always creates a customer. There is no public administrator-registration route.
4. Deploy the API as a persistent Node service using `npm start`. Check `/health` for database readiness. Enable HTTPS and configure database backups, monitoring and an external rate limit for deployments with multiple API replicas (the application limiter is per process).
5. Build the frontend with `VITE_API_BASE_URL=https://YOUR_API_HOST/api` when using a separate API host. Deploy `client/dist`; configure SPA rewrites so direct order/product URLs work. Included Vercel/Netlify-style SPA rules do not deploy or proxy the API. Same-origin hosting must explicitly route `/api` to the server.
6. Set `EMAIL_USER` and `EMAIL_PASS` and verify a real password-reset delivery. Mail is initialized on demand; absent mail credentials do not prevent catalog startup. Password recovery always returns the same generic response; delivery failures are logged.
7. **Revoke and rotate the AI key that previously appeared in repository source**, including any active copy from Git history. Optional AI discounts require `AI_DISCOUNT_URL` and a fresh `AI_API_KEY`; moderation uses `REVIEW_ML_URL`. Leave them unset to disable these integrations. They have bounded timeouts and do not block normal shopping.
8. Supply `VITE_SUPPORT_EMAIL` if you want a working support contact. Publish your actual store policies before launch; this repository does not invent legal, warranty or return policies.
9. Complete a staging smoke test: mobile signup/login, browse/search/filter through multiple pages, favorites, quantity changes, promo, shipping/address validation, checkout and double-click/retry, order refresh and ownership checks, password reset, and delivered-purchase reviews.

## Checkout and service scope

Prices are loaded from the catalog and recalculated at checkout. Cash on delivery is the only supported payment method; online payment strings are rejected. A database transaction creates the order and clears the cart together. A user-scoped idempotency key, cart version and expected total prevent duplicate or unreviewed checkout submissions.

The existing pricing policy remains: standard shipping is free above $100, otherwise $15; express is $15; tax is 8% of subtotal; promotions reduce subtotal. Confirm the currency, tax and shipping policy for your actual store before launch. Availability uses the existing `inStock` flag, not warehouse inventory quantities. Fulfillment and marking orders delivered/paid require an operator process; there is no carrier tracking integration.

Favorites persist in this browser under separate account/guest keys, not across devices. Only delivered orders qualify for a verified-purchase badge. Receipt printing uses the browser's print/save-to-PDF feature. Unimplemented newsletter, review-photo, engagement, receipt-email and carrier-tracking controls were removed rather than claiming success.

See [AUDIT-FIXES.md](AUDIT-FIXES.md) for the 40-item mapping and verification limitations. These code changes are **not a production certification**; the staging and operational checks above remain required.
