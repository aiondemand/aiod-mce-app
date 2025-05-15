# Metadata Catalogue Editor (MCE App)

A web-based UI for creating, editing, and deleting metadata assets on the AI-on-Demand (AIoD) platform via the AIoD metadata catalogue API.


## Getting Started

First, run the development server:

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


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Create local variables

Create a file called `.env.local` with content:
```
AUTH_SECRET="..."
AUTH_KEYCLOAK_ID=...
AUTH_KEYCLOAK_SECRET=...
AUTH_KEYCLOAK_ISSUER=... (e.g. https://aiod-dev.i3a.es/aiod-auth/realms/aiod)
BACKEND_URL=... (e.g. https://aiod-dev.i3a.es)
```

## Auth

Setup Application: OAuth

Callback URL: [origin]/api/auth/callback/keycloak
