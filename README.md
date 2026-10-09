# Few Threads

Interactive system design sandbox & university.

## Getting started

```bash
npm install
npm run dev
```

- Client: http://localhost:5173
- API: http://localhost:5000 (falls back to an in-memory MongoDB when `MONGODB_URI` is unset)

Copy `.env.example` to `.env` to configure `MONGODB_URI`, `JWT_SECRET`, and `GEMINI_API_KEY`.

## Deploying to Vercel

The repo deploys as one Vercel project: the Vite app is served as static files and the Express API runs as a serverless function (`api/index.ts` → `server/app.ts`). `vercel.json` routes `/api/*` to the function and everything else to the SPA.

Set these in **Vercel → Project → Settings → Environment Variables**, then redeploy:

| Variable | Required | Notes |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string. Empty collections are seeded automatically on first request. |
| `JWT_SECRET` | Yes | Long random string used to sign login tokens. |
| `GEMINI_API_KEY` / `GROQ_API_KEY` | Optional | Enables the server-side AI features. |
| `CORS_ORIGINS` | Optional | Extra allowed origins, comma-separated. Not needed when the app and API share a domain. |

Do not set `VITE_API_URL` on Vercel; production builds call the API on the same origin.
