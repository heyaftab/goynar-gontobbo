# Goynar Gontobbo catalog API

This Laravel 12 application provides the store's public, read-only catalog API. The customer storefront lives in `../frontend`. Customer accounts, checkout, and administration are not implemented by this service.

## Requirements

- PHP 8.2+
- Composer 2
- SQLite for local development, or another Laravel-supported database

## Local setup

From this directory:

```bash
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve
```

The API is available at <http://127.0.0.1:8000>. Laravel defaults to SQLite at `database/database.sqlite`. Configure `DB_CONNECTION` and related `DB_*` settings in `.env` before migrating if you use MySQL, MariaDB, PostgreSQL, or SQL Server. `CatalogSeeder` is safe to run repeatedly and loads demo categories and products; its image paths refer to the storefront's `frontend/public/assets` files.

## API

All endpoints are public and read-only:

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/v1/categories` | Active categories and counts of active products |
| GET | `/api/v1/products` | Paginated active products; supports `q`, `category`, `new_arrivals`, `best_sellers`, and `per_page` |
| GET | `/api/v1/products/{slug}` | One active product by slug |

Product responses include category, material, purity, images, and active variants. Example:

```bash
curl "http://127.0.0.1:8000/api/v1/products?category=rings&per_page=12"
```

`/up` is the framework health endpoint used by the Render deployment.

## Commands

```bash
php artisan test
php artisan migrate --seed
```

The root [README](../README.md) documents environment variables and the Vercel/Render demo deployment. Render runs the migrations and sample seeder at startup; the included free database is temporary and is not suitable for production data.
