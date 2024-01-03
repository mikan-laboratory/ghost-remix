# Base node image
FROM node:16-bullseye-slim as base

# Set environment for base and all layers that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma, sqlite3 for Ghost, and Nginx for routing
RUN apt-get update && apt-get install -y openssl sqlite3 nginx

# Install Ghost CLI
RUN npm install ghost-cli@latest -g

# Set up Ghost
RUN mkdir -p /var/www/ghost
WORKDIR /var/www/ghost
RUN ghost install local --no-start

# Install all node_modules, including dev dependencies for Remix
FROM base as deps

WORKDIR /myapp

ADD package.json .npmrc ./
RUN npm install --include=dev

# Setup production node_modules for Remix
FROM base as production-deps

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
ADD package.json .npmrc ./
RUN npm prune --omit=dev

# Build the Remix app
FROM base as build

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules

ADD prisma .
RUN npx prisma generate

ADD . .
RUN npm run build

# Final production image setup
FROM base

# Environment variables
ENV DATABASE_URL=file:/var/lib/ghost/content/data/ghost.db
ENV GHOST_URL=http://localhost:2368
ENV PORT=3000
ENV NODE_ENV=production
# Disable Prisma telemetry
ENV CHECKPOINT_DISABLE=1

# Shortcut for connecting to database CLI
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli
RUN chmod +x /usr/local/bin/database-cli

# Copy built Remix app
WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules
COPY --from=build /myapp/node_modules/.prisma /myapp/node_modules/.prisma
COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public
COPY --from=build /myapp/package.json /myapp/package.json

# Copy Ghost
COPY --from=base /var/www/ghost /var/www/ghost

# Copy Nginx configuration
COPY nginx.prod.conf /etc/nginx/nginx.conf

# Start script
COPY start.sh /start.sh

RUN chmod +x /start.sh

ENTRYPOINT [ "./start.sh" ]
