#!/bin/sh
set -eu

# Render's generateValue produces base64 text; Laravel requires the base64: prefix.
APP_KEY="$(php -r '
$key = getenv("APP_KEY") ?: "";

if (str_starts_with($key, "base64:")) {
    $decoded = base64_decode(substr($key, 7), true);
    if (! is_string($decoded) || strlen($decoded) !== 32) {
        fwrite(STDERR, "APP_KEY must decode to 32 bytes for AES-256-CBC.\n");
        exit(1);
    }
} elseif (strlen($key) === 32) {
    // Laravel also accepts an unencoded 32-byte key.
} else {
    $decoded = base64_decode($key, true);
    if (! is_string($decoded) || strlen($decoded) !== 32) {
        fwrite(STDERR, "APP_KEY must be a 32-byte key or a base64-encoded 32-byte key.\n");
        exit(1);
    }

    $key = "base64:".$key;
}

echo $key;
')"
export APP_KEY

php artisan migrate --force
php artisan db:seed --force

exec apache2-foreground
