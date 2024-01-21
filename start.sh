#!/bin/sh -ex

# This file is how Fly starts the server (configured in fly.toml). Before starting
# the server though, we need to run any prisma migrations that haven't yet been
# run, which is why this file exists in the first place.
# Learn more: https://community.fly.io/t/sqlite-not-getting-setup-properly/4386

# Allocate swap space
if [ -w "/proc/sys/vm/swappiness" ]; then
    fallocate -l 512M /swapfile
    chmod 0600 /swapfile
    mkswap /swapfile
    echo 10 > /proc/sys/vm/swappiness
    swapon /swapfile
    echo 1 > /proc/sys/vm/overcommit_memory
else
   echo "/proc/sys/vm/swappiness is not writable, skipping modification."
fi

echo "Ensuring correct ownership for /var/www/ghost and subdirectories:"
chown -R ghostuser:ghostuser /var/www/ghost

echo "Setting correct permissions for /var/www/ghost/content:"
chmod -R 755 /var/www/ghost/content

if [ "$ENVIRONMENT" = "local" ]; then
    # Use the local Nginx configuration
    cp /etc/nginx/nginx.local.conf /etc/nginx/nginx.conf
else
    # Use the production Nginx configuration
    # First, substitute environment variables in the production config
    envsubst '${BLOG_URL} ${NEWSLETTER_URL}' < /etc/nginx/nginx.prod.conf > /etc/nginx/nginx.conf
fi

# Start Nginx
nginx &

su ghostuser -c 'cd /var/www/ghost && ghost config url https://$NEWSLETTER_URL && ghost start'

# Prisma migrations
npx prisma migrate resolve --applied 0_init

# Seed Content API Key
npm run seed:prod

# Seed theme
npm run seed:theme

# Unlock the migrations lock in the Ghost SQLite database
echo "Unlocking the Ghost migrations lock..."
sqlite3 /var/www/ghost/content/data/ghost-local.db "UPDATE migrations_lock SET locked=0 WHERE lock_key='km01';"

# Restart to apply url and theme config
su ghostuser -c 'cd /var/www/ghost && ghost restart'

# Start Remix app
cd /myapp
npm run start