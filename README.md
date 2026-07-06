# GymPilot AI — Product Discovery App

A premium landing page + professional survey + analytics dashboard + admin panel to
**validate the Gym AI SaaS market** before building the full product. Built per the
Product Discovery Blueprint.

Built for gyms **worldwide** (country dropdown + free-text city, USD pricing, WhatsApp).

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + shadcn/ui-style components
- **Framer Motion** (animations)
- **Firebase** — Firestore (data) + Auth (admin login)
- **Recharts** (dashboard charts)
- Deploy on **Vercel**

## Routes

| Route        | What it is                                           | Access          |
| ------------ | ---------------------------------------------------- | --------------- |
| `/`          | Premium landing page (Hero, Features, Mockups, Benefits, FAQ, Beta signup) | Public |
| `/survey`    | 6-step professional survey (~3 min)                  | Public          |
| `/dashboard` | Analytics — responses, cities, sizes, pain points, AI demand, pricing, MVP signals | Admin (login) |
| `/admin`     | Admin panel — search, filter, CSV export, mark beta, notes, contact owners | Admin (login) |

## Firestore collections

- `surveyResponses` — full survey submissions (gym profile, pain points, AI interest, pricing, contact)
- `waitingList` — beta signups from the landing page
- `contacts` — contact / interview requests

## Getting started

```bash
cd Frontend
npm install

# copy the env template, then fill in your Firebase keys:
#   macOS / Linux / Git Bash:
cp .env.local.example .env.local
#   Windows cmd.exe:
copy .env.local.example .env.local
#   Windows PowerShell:
Copy-Item .env.local.example .env.local

npm run dev
```

Open http://localhost:3000.

> Without Firebase keys the site renders fully, but form submissions and the
> dashboard/admin will show a "Firebase isn't configured" message.

## Firebase setup

1. Create a project at <https://console.firebase.google.com>.
2. **Build → Firestore Database → Create database** (production mode).
3. **Build → Authentication → Sign-in method → Email/Password → Enable.**
4. **Authentication → Users → Add user** — create your admin account
   (e.g. `admin@gympilot.ai`). This is who logs into `/dashboard` and `/admin`.
5. **Project settings → Your apps → Web app** — copy the config values into
   `.env.local` (see `.env.local.example`).
6. Deploy the security rules in [`firestore.rules`](./firestore.rules):
   - Firebase Console → Firestore → Rules → paste → Publish, **or**
   - `firebase deploy --only firestore:rules` (Firebase CLI).

### Restricting admin access

Set `NEXT_PUBLIC_ADMIN_EMAILS` to a comma-separated allowlist. Any signed-in email
outside the list is rejected by the admin gate. Leave blank to allow any
authenticated user.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import into Vercel. Set **Root Directory** to `Frontend`.
3. Add all `NEXT_PUBLIC_*` env vars from `.env.local` in the Vercel project settings.
4. Deploy.

## The Decision Framework

The dashboard turns raw answers into MVP signals, e.g.:

- Excel/Sheets users → build **Excel import** first
- WhatsApp is a top tool/feature → lead with the **AI WhatsApp assistant**
- Top pain point → prioritise that automation
- Most common budget tier → anchor pricing

## Success metrics (from the blueprint)

100 survey responses · 20 interviews · 10 beta signups · identify top 5 pain points.
Track these live on `/dashboard`.
