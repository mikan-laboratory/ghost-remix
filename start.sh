#!/bin/sh -ex

# This file is how Fly starts the server (configured in fly.toml). Before starting
# the server though, we need to run any prisma migrations that haven't yet been
# run, which is why this file exists in the first place.
# Learn more: https://community.fly.io/t/sqlite-not-getting-setup-properly/4386

# allocate swap space
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

if [ "$ENVIRONMENT" = "local" ]; then
    # Start Ghost in local mode
    su ghostuser -c 'cd /var/www/ghost && ghost start' &
else
    # Set Ghost URL from environment variable and start Ghost in production mode
    su ghostuser -c 'cd /var/www/ghost && ghost config url $NEWSLETTER_URL && ghost start' &
fi
# Prisma migrations
npx prisma migrate resolve --applied 0_init

# Seed Content API Key
npm run seed:prod

# Start Remix app
cd /myapp
npm run start