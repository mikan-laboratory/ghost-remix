# Smooth Jazz

Ghost as a headless CMS with Remix and Chakra UI. Easy deployment to Fly.io.

## Table of Contents

- [Smooth Jazz](#smooth-jazz)
  - [Dependencies](#dependencies)
  - [Local Development](#local-development)
  - [Deploy to Fly.io](#deploy-to-flyio)
    - [Automated](#automated)
    - [Manual](#manual)

## Dependencies

- [NPM](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)
- [Tilt](https://tilt.dev/)
- [flyctl](https://fly.io/docs/flyctl/installing/)

## Local Development

### Mailgun

You don't need Mailgun to get started, but you'll need for email-based workflows like member sign up.

Don't worry about the $35 a month price tag, immediately after signing up for the trial, you can downgrade to the flex plan.

1. Create [Mailgun](https://www.mailgun.com/) account.

2. Navigate to Sending -> Domains. You should see a test domain that looks like `sandbox1234567890abcdef1234567890ab.mailgun.org`

3. Add your email as an authorized recipient.

4. Scroll down and select API Keys. Create a new API key and copy the key.

5. Find the correct base URL [here](https://documentation.mailgun.com/en/latest/api-intro.html#base-url).

6. Add values to .env file.

### Basics

1. Create [Mailgun](https://www.mailgun.com/) account.

2. Install dependencies with `npm i`

3. Start services with `tilt up`

4. Seed database with button in Ghost section of Tilt UI

   - If you want to inspect the database, you can manually trigger a GUI from the Tilt UI.

## Test Docker Build

1. Build image and run container with `make all`.

2. Clean image and container with `make clean-all`.

## Deploy to Fly.io

### Prerequisites

1. Create [Fly.io](https://fly.io) account.

2. Authenticate with `flyctl auth login`.

3. Create app with `flyctl launch`.

### GitHub Actions

1. Get Deploy API Token from Fly dashboard

2. Set secrets in GitHub repository settings

3. Manually trigger by going to Actions tab and selecting `Fly Deploy`. Click `Run workflow` and enter the branch name to deploy.
   - You can update this action to trigger on push to `main` by changing the `on` section of the workflow file to `push: [main]`

### Command Line

1. Set secrets

```
flyctl secrets set GHOST_CONTENT_API_KEY="my-api-key-value" \
OWNER_EMAIL="my-email-value" \
OWNER_PASSWORD="my-password-value" \
MAILGUN_DOMAIN="somedomain" \
MAILGUN_API_KEY="somekey" \
MAILGUN_BASE_URL="mailgunbase" \
JWT_SECRET="somejwtsecret"
```

2. Deploy

```
flyctl deploy --env SITE_TITLE="My Site" \
--env SITE_DESCRIPTION="My website" \
--env OWNER_NAME="Admin" \
--env OWNER_SLUG="admin" \
--env BLOG_URL="mysite.com"
```
