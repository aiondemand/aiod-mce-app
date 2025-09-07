# Metadata Catalogue Editor (MCE App)

A web-based UI for creating, editing, and deleting metadata assets on the AI-on-Demand (AIoD) platform via the AIoD metadata catalogue API.

## Getting Started (local dev deployment)

### Install dependencies

e.g. `npm install`

### Create a file called `.env.local` with content

```
AUTH_SECRET=your-dev-secret
AUTH_KEYCLOAK_CLIENT_ID=your-dev-client-id
AUTH_KEYCLOAK_CLIENT_SECRET=your-dev-client-secret
AUTH_KEYCLOAK_ISSUER=https://aiod-dev.i3a.es/aiod-auth/realms/aiod #example
BACKEND_URL=https://aiod-dev.i3a.es #example
NEXT_PUBLIC_BASEPATH=/mce #example or remove this line if not needed
```

Additional line `AUTH_TRUST_HOST=true` if you need it and know what you are doing.

### Start the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker deployment

### Create a .env file

```
APP_DEPLOYMENT_URL=https://your-deployment-url.com
AUTH_SECRET=your-secure-random-secret
NEXTAUTH_URL=https://your-deployment-url.com
AUTH_KEYCLOAK_CLIENT_ID=your-client-id
AUTH_KEYCLOAK_CLIENT_SECRET=your-client-secret
AUTH_KEYCLOAK_ISSUER=https://your-keycloak-domain/realms/your-realm
BACKEND_URL=https://your-backend-url
NEXT_PUBLIC_BASEPATH=/mce
```

> Docker’s --env-file **does not support** comments or quotes.

### Build and run the container

```
docker build -t aiod-mce-app .
docker run --env-file .env -p PORT:PORT aiod-mce-app
```

## Auth

Setup Application: OAuth

Callback URL: [origin]/api/auth/callback/keycloak
