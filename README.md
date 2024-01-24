# Smooth Jazz

## Description

- Ghost as a headless CMS with Remix and Chakra UI

## Dependencies

- [NPM](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)
- [Tilt](https://tilt.dev/)

## Local Development

- Start Tilt

```
tilt up
```

- Seed

```
# Basic Seed

Seed button in Ghost section of Tilt UI

# Newsletter Theme Seed

Seed theme button in Ghost section of Tilt UI
```

- Test Docker Build

```
# Build

make all

# Cleanup

make clean-all
```

## Deploy to Fly.io

- Create [Fly.io](https://fly.io)

### Automated

- Get Deploy API Token from Fly dashboard

- Set secrets in GitHub repository settings

### Manual

- Install CLI

```
brew install flyctl
```

- Authenticate

```
flyctl auth login
```

- Create App

```
flyctl launch
```

- Set secrets

```
flyctl secrets set GHOST_CONTENT_API_KEY="my-api-key-value" \
OWNER_EMAIL="my-email-value" \
OWNER_PASSWORD="my-password-value" \
MAILGUN_DOMAIN="somedomain" \
MAILGUN_API_KEY="somekey" \
MAILGUN_BASE_URL="mailgunbase" \
JWT_SECRET="somejwtsecret"
```

- Deploy

```
flyctl deploy --env SITE_TITLE="My Site" \
--env SITE_DESCRIPTION="My website" \
--env OWNER_NAME="Admin" \
--env OWNER_SLUG="admin" \
--env BLOG_URL="mysite.com"
```
