#!/bin/sh -ex

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

CONFIG_TEMPLATE_PATH="/var/www/ghost/config.template.json"
CONFIG_PATH="/var/www/ghost/config.development.json"

echo "Configuring Ghost with environment variables..."
envsubst < "$CONFIG_TEMPLATE_PATH" > "$CONFIG_PATH"

echo "Ensuring correct ownership for /var/www/ghost and subdirectories:"
chown -R ghostuser:ghostuser /var/www/ghost

echo "Setting correct permissions for /var/www/ghost/content:"
chmod -R 755 /var/www/ghost/content

# Ensure the directory for ghost-local.db exists
echo "Ensuring /var/www/ghost/content/data directory exists..."
mkdir -p /var/www/ghost/content/data
chown ghostuser:ghostuser /var/www/ghost/content/data

# Check if ghost-local.db exists, create if not
echo "Checking for ghost-local.db..."
GHOST_DB_PATH="/var/www/ghost/content/data/ghost-local.db"
if [ ! -f "$GHOST_DB_PATH" ]; then
    echo "ghost-local.db does not exist, creating..."
    touch "$GHOST_DB_PATH"
    chown ghostuser:ghostuser "$GHOST_DB_PATH"
    # Note: Additional initialization for ghost-local.db might be required here
fi

# Start Nginx
nginx &

su ghostuser -c 'cd /var/www/ghost && ghost config url $BLOG_URL && ghost start'

# Prisma migrations
npx prisma migrate resolve --applied 0_init

# Seed Content API Key
npm run seed:prod

# Unlock the migrations lock in the Ghost SQLite database
echo "Unlocking the Ghost migrations lock..."
sqlite3 "$GHOST_DB_PATH" "UPDATE migrations_lock SET locked=0 WHERE lock_key='km01';"

# Restart to apply url and theme config
su ghostuser -c 'cd /var/www/ghost && ghost restart'

# Start Remix app
cd /myapp
npm run start
