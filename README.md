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

- Seed DB

```
prisma db seed
```

- Prisma DB GUI

```
prisma studio
```

- Build/Run Docker

```
docker build -t your-image-name .
docker run -e GHOST_CONTENT_API_KEY=your-api-key-value your-image-name
```

## Deploy to Fly.io

- Create Fly.io account, app, and install CLI

- Set secrets

```
flyctl secrets set GHOST_CONTENT_API_KEY=value_of_var -a your-app-name
```

- Deploy

```
flyctl deploy -a your-app-name
```
