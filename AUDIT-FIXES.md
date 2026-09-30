# Audit remediation

Source: the supplied `ClickNCart-Audit(1).md`, covering original main commit `4ec05f9a4459647fe3e0b3735506105c30f086d4`.

The table records implemented changes, not a claim that every possible defect has been eliminated. Real-database verification passed in GitHub CI; browser and live-service verification still need the checks described below.

| Finding | Implemented change |
|---|---|
| 1 | Admin middleware on every catalog mutation and bulk moderation route; customer-only signup. |
| 2 | Load catalog identity, availability and price; ignore submitted price/name/image. Reprice at checkout. |
| 3 | Shared cent-rounded totals calculator; persist required validated order totals. |
| 4 | Transactional order creation/cart clearing, unique user/key index, optimistic cart version, expected-total check, client in-flight guard. |
| 5 | Required contact/address validation before saving and again before order creation; matching required form fields. |
| 6 | Public review projection returns author name without email. |
| 7 | Versioned JWT sessions; atomic password reset increments version and consumes reset token. |
| 8 | Removed credential literal; use environment secret. Owner must revoke/rotate the exposed credential. |
| 9 | Configurable API base URL, development proxy and documented production URL. |
| 10 | Cart renders the primary response; optional AI no longer runs on page mount. |
| 11 | Stable authenticated order route with ownership check and missing/error states. |
| 12 | One calculator respects saved shipping method and empty carts; checkout restores saved fields and shows actual fees. |
| 13 | Product detail sends selected quantity; API validates it. |
| 14 | Finite integer quantities 1–99; explicit zero removes items. |
| 15 | Allowlisted shipping and COD-only payment methods in API and schemas. |
| 16 | Guest checkout redirects to login. |
| 17 | Removing from a nonexistent cart returns a zero-valued empty cart. |
| 18 | Shared trim/lowercase email normalization; existing-data migration. |
| 19 | Invalid/expired/deleted-user sessions return 401; centralized client session expiry clears cart counters and allows login. |
| 20 | Shared signup/reset password policy: at least 8 characters, at most 72 UTF-8 bytes. |
| 21 | AI history derives from delivered orders, with consistent first-purchase detection. |
| 22 | Optional discount must be a finite number from 0–50%; invalid response preserves previous quote. |
| 23 | Explicit coupon takes precedence; cart response identifies discount source. |
| 24 | Sale uses live discounted products; favorites store real IDs separately by account/guest in the browser. |
| 25 | Server-side filters/sort and 24-product pagination, independent category metadata. |
| 26 | No default price ceiling; optional numeric maximum filter. |
| 27 | Home featured list starts at zero; trending ranks available items by rating. |
| 28 | Working mobile menu, search/account/favorite links, expanded state and Escape handling. |
| 29 | Only active login/signup panel is visible on mobile. |
| 30 | Brand cards navigate with `_id`, including keyboard activation. |
| 31 | Shared response-driven quantity counter events; session changes reset/reload header count. |
| 32 | Review-count field and aggregate refresh; successful submission refreshes product and review data. |
| 33 | Verified-purchase badge requires a backend-confirmed delivered order. |
| 34 | Moderation uses matching delivered-order timestamps; bounded admin batches, timeout and cursor. |
| 35 | Trimmed category enum and existing-data migration. |
| 36 | Literal escaped search, bounded length, positive page/limit validation and validated filters. |
| 37 | Review creation checks actual product existence. |
| 38 | Case-insensitive unique brand index and matching import collation; migration consolidates old duplicates. |
| 39 | Imports calculate zero discount unless original price exceeds current price and return per-row failures. |
| 40 | Confirmation uses stored creation/delivery dates and actual persisted totals. |

## Other changes

Helmet security headers, constrained CORS, JSON body limit, application/auth throttles, generic password-recovery responses, lazy email setup, centralized JSON errors, database readiness endpoint, graceful shutdown, environment examples, migration and CI. Dependency lockfiles updated; obsolete `node`, `crypto` and unused Razorpay dependencies removed. Real gallery selection, favorite/share actions, paginated reviews, and functioning catalog add-to-cart buttons replace placeholders. Unsupported newsletter, fake urgency/counts, photo upload, engagement and delivery/email claims removed.

## Verification in this workspace

- Frontend TypeScript check and Vite production build passed.
- Server syntax checks passed.
- 17 isolated regression tests passed using real schemas/controllers with mocked database/upstream boundaries. These cover totals, validation, auth, trusted catalog pricing, cart absence, query validation, regex escaping, AI fallback/precedence, review privacy and import errors.
- Real MongoDB integration tests were authored, including concurrent checkout, but could not run: both downloaded MongoDB versions exited at startup with `open: Operation not permitted`. This is a blocked test run, not a pass. Full tests remain mandatory in CI.
- Browser verification could not run: browser installation failed through this environment's download/certificate restrictions. Responsive/UI changes are source/build checked only.
- A client dependency scan initially returned zero advisories after upgrades. The server scan identified Nodemailer and it was explicitly upgraded to 10.0.13 or later. Final registry audit calls were blocked by the network allowlist, so the final dependency state is not certified clean. CI runs a fresh audit for both lockfiles.
- No live database was migrated; no real mail, AI request, payment or production deployment was exercised.

Before production, obtain passing CI, run the browser and staging checkout checklist in README, test the migration on a backup, verify mail, rotate exposed credentials, and configure actual deployment URLs and policies.

## GitHub CI verification

[Run 36743399986](https://github.com/genos069/ClickNCart-/actions/runs/36743399986), commit `cd55e20b8d27b05568b3f945bee204dc033dba40`, completed successfully. All **26 tests passed**, including the 9 real MongoDB integration tests and concurrent atomic/idempotent checkout. Server syntax checks, clean installs, frontend TypeScript/production build, and both dependency audits passed; each audit reported **zero vulnerabilities**. This resolves the local database and final dependency-scan verification gaps above. Browser, migration-on-existing-data, real email/AI and production deployment checks remain outstanding.
