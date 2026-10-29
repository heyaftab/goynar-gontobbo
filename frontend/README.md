# Goynar Gontobbo storefront

The customer-facing storefront is built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4. It provides product discovery, category and product pages, a browser-local cart and wishlist, and Laravel-backed email/password customer registration and login. Checkout and server-side administration are not implemented.

## Local development

Requirements: Node.js 20.9+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. Without an API URL, catalog pages use the local sample catalog, but registration and login require the Laravel backend. Set `LARAVEL_API_URL=http://127.0.0.1:8000` in `.env.local`, then start Laravel at that address. Authentication requests go through same-origin Next.js routes, which forward them to Laravel and return validation or service errors to the form.

Set `NEXT_PUBLIC_STOREFRONT_URL` to the absolute canonical public storefront origin in production. It supplies canonical links, social metadata, structured data, the XML sitemap, and robots.txt; it also ensures relative catalog image URLs resolve to the storefront when the API and frontend use separate hosts. The value in `.env.example` is an example and must be replaced with the actual production domain before deployment.

Google Identity Services is optional. Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_ID` to the same Web application client ID. Register the storefront's exact origin in Google Cloud. Google login is a short-lived browser session only; it does not create or persist a customer record. Registration's Google button fills the form but does not submit or save it.

## Account role preview

The sign-in page offers local demo accounts for system admin, admin, moderator, marketing, and customer roles. Changes to profile details, preferences, private notes, role assignments, and the fallback catalog are stored in the current browser's local storage. They are not sent to the Laravel API and do not sync between browsers. Role checks are UI-only and must not be used as production access control. There is no persisted order system; customer order history remains empty until checkout and backend order management are implemented.

Each demo role receives a local getting-started notification. System admins can compose a notification for a role (for example `moderator` or `system admin`) or one exact demo email. Recipients see it in Notifications and guidance and can mark it read. This preview does not send email, push notifications, or cross-device updates. Newly registered customer credentials are stored by Laravel; browser workspace preferences remain local.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Catalog integration

`data/catalog-api.ts` reads the public Laravel catalog endpoints under `/api/v1`. It falls back to the local mock catalog when the variable is missing, the request fails, or the API returns an error. The API is server-side only; do not rename it to a `NEXT_PUBLIC_` variable.

For deployment, set the Vercel project root to `frontend/` and configure `LARAVEL_API_URL` in the Vercel environment. If Laravel and the storefront use separate hosts, set `NEXT_PUBLIC_STOREFRONT_URL` to the storefront origin so seeded `/assets/...` URLs point to the frontend's public assets.
