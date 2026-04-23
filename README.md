# Arxon Web

Official website for [arxon.io](https://arxon.io) — built with React, Vite, TypeScript, Supabase, and deployed on Cloudflare Pages.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| UI | shadcn/ui + Tailwind CSS + Radix UI |
| Backend / Auth | Supabase (PostgreSQL + Row Level Security) |
| Hosting | Cloudflare Pages |
| CI/CD | GitHub Actions |

---

## Local Development

### Prerequisites
- Node.js 18+
- A Supabase project (see [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md))

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_ORG/arxon-web.git
cd arxon-web

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and fill in your Supabase URL and anon key

# 4. Start dev server
npm run dev
# → http://localhost:8080
```

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server on port 8080 |
| `npm run build` | Production build → dist/ |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Database Setup (First Time)

```bash
bash scripts/setup-supabase.sh
```

Or follow the manual steps in [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md).

---

## Deployment

- **Push to main** → production deploy to arxon.io
- **Open a Pull Request** → preview URL posted as a PR comment

See [.github/SECRETS_SETUP.md](./.github/SECRETS_SETUP.md) for required GitHub secrets.

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon/public key |
