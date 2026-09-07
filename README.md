# Goynar Gontobbo

Goynar Gontobbo is a full-stack jewellery storefront for showcasing handcrafted Bangladeshi jewellery. It pairs a responsive customer-facing catalog with a Laravel backend foundation for managing products, categories, materials, purities, images, and variants.

> **Project status:** The frontend is an in-progress storefront and currently renders local mock catalog data. The Laravel backend includes the database foundation but does not yet expose a project API.

## Key features

- Responsive, polished jewellery storefront with desktop and mobile navigation
- Homepage sections for hero content, categories, new arrivals, best sellers, brand story, and customer assurances
- Product category presentation for earrings, rings, bangles, necklaces, jhumka, cuffs, tana, and sets
- Bangladeshi Taka (`৳`) pricing in the current catalog mock data
- Product-oriented database schema with categories, materials, purities, products, product images, and product variants
- Laravel-ready support for users, database-backed sessions, cache, and queues

## Tech stack

| Area | Technology |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4, PostCSS |
| Backend | Laravel 12, PHP 8.2+ |
| Data | SQLite by default; MySQL, MariaDB, PostgreSQL, and SQL Server are configurable |
| Tooling | ESLint, PHPUnit, Vite |

## Project structure

```text
goynar-gontobbo/
├── frontend/                  # Next.js customer storefront
│   ├── app/                   # App Router pages and global styles
│   ├── components/            # Reusable UI sections and product cards
│   ├── data/                  # Temporary mock categories and products
│   ├── public/                # Static assets
│   └── types/                 # TypeScript domain types
├── backend/                   # Laravel application
│   ├── app/                   # Application code
│   ├── config/                # Laravel configuration
│   ├── database/migrations/   # Catalog and framework migrations
│   ├── routes/                # Server routes
│   └── tests/                 # PHPUnit tests
└── README.md                  # This project guide
```

## Prerequisites

- Node.js 20.9 or later and npm
- PHP 8.2 or later
- Composer 2
- SQLite (recommended for local development) or a supported database server

## Backend setup

From the repository root:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Configure the database as described below, then run the migrations:

```bash
php artisan migrate
```

Start the Laravel application:

```bash
php artisan serve
```

The backend will be available at `http://127.0.0.1:8000` by default.

## Frontend setup

In a separate terminal, run:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser. Other useful frontend commands are:

```bash
npm run lint
npm run build
npm run start
```

## Environment and configuration

Copy `backend/.env.example` to `backend/.env`; never commit the resulting `.env` file or any credentials. Important backend values include:

| Variable | Purpose | Local example |
| --- | --- | --- |
| `APP_NAME` | Laravel application name | `Goynar Gontobbo` |
| `APP_ENV` | Runtime environment | `local` |
| `APP_KEY` | Laravel encryption key | Generated with `php artisan key:generate` |
| `APP_URL` | Public backend URL | `http://127.0.0.1:8000` |
| `DB_CONNECTION` | Database driver | `sqlite` or `mysql` |
| `DB_DATABASE` | SQLite file path or database name | `database.sqlite` or `goynar_gontobbo` |
| `DB_HOST`, `DB_PORT` | Database host and port | `127.0.0.1`, `3306` for MySQL |
| `DB_USERNAME`, `DB_PASSWORD` | Database credentials | Your local database credentials |
| `SESSION_DRIVER`, `CACHE_STORE`, `QUEUE_CONNECTION` | Laravel service drivers | `database`, `database`, `database` |

The current frontend does not require environment variables because it reads local mock data. When the Laravel API is connected, add a public variable such as `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000` in `frontend/.env.local` and use it only for values safe to expose in the browser.

## Database setup

### SQLite (default)

Laravel defaults to SQLite. Create the local database file, then migrate:

```bash
cd backend
touch database/database.sqlite
php artisan migrate
```

Keep `DB_CONNECTION=sqlite` in `backend/.env`. Laravel will use `database/database.sqlite` unless `DB_DATABASE` specifies another path.

### MySQL or MariaDB

Create a database, then set the following in `backend/.env`:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=goynar_gontobbo
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
```

Run `php artisan migrate` after saving the configuration. The migrations create the catalog tables and their relationships, including categories, materials, purities, products, product images, and product variants.

## Run the project locally

Run these in separate terminals:

```bash
# Terminal 1 — backend
cd backend
php artisan serve
```

```bash
# Terminal 2 — frontend
cd frontend
npm run dev
```

Then visit `http://localhost:3000`. To run backend tests:

```bash
cd backend
php artisan test
```

## API information

No application API endpoints have been implemented yet. The only registered web route is Laravel's default welcome-page route (`GET /`). The storefront currently consumes `frontend/data/mock-categories.ts` and `frontend/data/mock-products.ts`.

When implementing the integration, define versioned API routes (for example, under `/api/v1`) for product listing and detail, categories, inventory, customer accounts, carts, and checkout. Update the frontend to consume those endpoints and document request/response contracts here.

## Deployment

The frontend and backend can be deployed independently:

1. Build the frontend with `cd frontend && npm ci && npm run build`, then deploy it to a Next.js-compatible host such as Vercel or a Node.js platform.
2. Deploy `backend/` to a PHP 8.2+/Laravel-compatible host. Set the document root to `backend/public`.
3. Configure production environment variables, a managed database, `APP_ENV=production`, `APP_DEBUG=false`, and the public `APP_URL`.
4. Install production PHP dependencies with `composer install --no-dev --optimize-autoloader`, then run `php artisan migrate --force`.
5. Configure HTTPS, a queue worker if `QUEUE_CONNECTION` is not `sync`, and scheduled tasks if the application adds them.
6. When the frontend calls the backend, configure the backend's allowed origins and set the frontend's `NEXT_PUBLIC_API_URL` to the deployed API URL.

## Future improvements

- Build authenticated, versioned Laravel API endpoints and connect the frontend to live data
- Add an admin workflow for catalog, image, material, purity, and inventory management
- Complete product listing, filtering, search, detail, wishlist, cart, and checkout experiences
- Add payment gateway, delivery tracking, order management, and customer notifications
- Add database seeders, test coverage for catalog workflows, API documentation, and CI/CD
- Optimize product images, accessibility, SEO, observability, and production security controls

