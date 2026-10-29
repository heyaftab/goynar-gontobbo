# Goynar Gontobbo catalog API

This Laravel 12 application provides the store's public catalog API and email/password customer account endpoints. The customer storefront lives in `../frontend`. Checkout and administration are not implemented by this service.

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

## Password recovery and email delivery

Password reset requests use Laravel's password broker and send a single-use link to the account email. The link opens the storefront's `/reset-password` page; tokens expire after 60 minutes and reset requests are rate limited. The forgot-password response does not reveal whether an email is registered.

For local development, the default `MAIL_MAILER=log` writes reset emails to the Laravel log instead of delivering them. Production is configured for Gmail SMTP at `smtp.gmail.com:587` (TLS/STARTTLS). Set `MAIL_USERNAME` and `MAIL_FROM_ADDRESS` to the sender Gmail address and enter a Google App Password as `MAIL_PASSWORD` in the Render service environment. App passwords require 2-Step Verification. Keep the password in Render environment variables, never in the repository. Port 587 and the sender name are preconfigured. `FRONTEND_URL` must point to the deployed storefront so reset links return to the right site. Password recovery remains unavailable until valid SMTP settings are present.

## Commands

```bash
php artisan test
php artisan migrate --seed
```

The root [README](../README.md) documents environment variables and the Vercel/Render demo deployment. Render runs the migrations and sample seeder at startup; the included free database is temporary and is not suitable for production data.
