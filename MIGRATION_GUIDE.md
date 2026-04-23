# Arxon — Migration Guide: Lovable → Your Own Supabase + Cloudflare

## Overview

This guide takes you from a Lovable-controlled project to a fully self-hosted setup where:
- **Database & Auth** → Your own Supabase project
- **Frontend hosting** → Cloudflare Pages (connected to arxon.io)
- **Code** → Fully yours on GitHub, no Lovable dependency

---

## What Has Already Been Changed in This Codebase

| File | What changed |
|---|---|
| `vite.config.ts` | Removed `lovable-tagger` plugin completely |
| `package.json` | Removed `lovable-tagger` dev dependency, renamed to `arxon-web` |
| `.env` | Cleared old Lovable Supabase credentials (ready for yours) |
| `.env.example` | New template showing what values are needed |
| `supabase/config.toml` | Cleared old Lovable project ID |
| `public/_redirects` | Added Cloudflare Pages SPA redirect rule |
| `.gitignore` | Added `.env` to ignored files so secrets stay off GitHub |

---

## STEP 1 — Create Your Own Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in (or create a free account)
2. Click **New Project**
3. Fill in:
   - **Name**: `arxon` (or anything you like)
   - **Database Password**: generate a strong one and save it somewhere safe
   - **Region**: choose closest to your users (e.g. `West EU` or `US East`)
4. Wait ~2 minutes for the project to spin up
5. When it's ready, go to **Settings → API**
6. Copy these two values — you'll need them in Step 3:
   - **Project URL** (looks like `https://abcdefghijkl.supabase.co`)
   - **anon public** key (the long JWT string under "Project API Keys")

---

## STEP 2 — Run Your Database Migrations

Your Supabase project starts empty. You need to push the schema that Lovable built.

### Option A: Using the Supabase CLI (recommended)

```bash
# Install the CLI if you don't have it
npm install -g supabase

# Log in
supabase login

# Link to your new project (use your Project Ref from Dashboard → Settings → General)
supabase link --project-ref YOUR_PROJECT_REF

# Push all migrations (this creates all tables, RLS policies, triggers, etc.)
supabase db push
```

### Option B: Run SQL manually in Supabase Studio

1. Go to your Supabase Dashboard → **SQL Editor**
2. Run each file from `supabase/migrations/` **in chronological order** (oldest timestamp first):
   - `20251102131453_...sql`
   - `20251102132850_...sql`
   - `20251102133713_...sql`
   - `20251102142624_...sql`
   - `20251102143508_...sql`
   - `20251112132102_...sql`
   - `20260111053304_...sql`
   - `20260307055316_...sql`
   - `20260414081446_...sql`

This creates the following tables with full RLS:
- `waitlist`
- `user_roles` (with `app_role` enum: admin/user)
- `investor_submissions`
- `ambassador_applications`
- `ambassador_submissions`

And sets up:
- Row Level Security on every table
- A trigger that makes the **first registered user an admin automatically**
- A `has_role()` security definer function

---

## STEP 3 — Update Your Environment Variables

Open the `.env` file in the project root and fill in your values:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-public-key-here
```

> ⚠️ Never commit `.env` to GitHub. It's already in `.gitignore`.

---

## STEP 4 — Configure Supabase Auth for Your Domain

1. Go to Supabase Dashboard → **Authentication → URL Configuration**
2. Set **Site URL** to: `https://arxon.io`
3. Under **Redirect URLs**, add:
   - `https://arxon.io/**`
   - `https://arxon.io/auth`
   - `http://localhost:8080/**` (for local development)

This ensures email magic links and OAuth redirects land on the right pages.

---

## STEP 5 — Push Your Code to GitHub

```bash
cd arxon-migrated   # or whatever folder you're working in

# If not already a git repo:
git init
git remote add origin https://github.com/YOUR_ORG/arxon-web.git

# Commit and push
git add .
git commit -m "chore: migrate from Lovable to self-hosted Supabase + Cloudflare"
git push -u origin main
```

> Make sure `.env` shows as untracked (it should, it's in `.gitignore`).
> Run `git status` and confirm `.env` is NOT listed under "Changes to be committed".

---

## STEP 6 — Deploy to Cloudflare Pages

### 6a. Connect your GitHub repo

1. Log in to [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. Go to **Workers & Pages → Create → Pages → Connect to Git**
3. Select your GitHub account and choose the `arxon-web` repository
4. Click **Begin Setup**

### 6b. Configure the build settings

| Setting | Value |
|---|---|
| **Framework preset** | `Vite` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` (leave blank) |
| **Node.js version** | `18` or `20` |

### 6c. Add environment variables in Cloudflare

Under **Environment variables → Add variable** (do this for both Production and Preview):

| Variable | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://YOUR_PROJECT_REF.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | your anon key |

> ⚠️ Vite embeds env variables at build time — they must be added in Cloudflare's dashboard, not just in your local `.env`.

### 6d. Deploy

Click **Save and Deploy**. Cloudflare will build and deploy your site.
Your site will be live at something like `arxon-web.pages.dev`.

---

## STEP 7 — Connect arxon.io to Cloudflare Pages

### If arxon.io DNS is already on Cloudflare:

1. In Cloudflare Pages → your project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter `arxon.io` and also `www.arxon.io`
4. Cloudflare will automatically add the CNAME records

### If arxon.io DNS is with another registrar (GoDaddy, Namecheap, etc.):

Either:
- **Option A**: Transfer DNS to Cloudflare (recommended for full control):
  - In Cloudflare dashboard, add site → follow nameserver instructions at your registrar
  - Then follow the steps above once DNS is on Cloudflare

- **Option B**: Add a CNAME at your current registrar:
  ```
  Type: CNAME
  Name: @  (or arxon.io)
  Value: arxon-web.pages.dev
  ```
  And for www:
  ```
  Type: CNAME
  Name: www
  Value: arxon-web.pages.dev
  ```

---

## STEP 8 — Verify Everything Works

Go through this checklist after deployment:

- [ ] Homepage loads at `https://arxon.io`
- [ ] `/auth` page loads (Supabase auth is connected)
- [ ] Register a new account — you should become admin (first user trigger)
- [ ] `/waitlist` → submit an entry → check Supabase Table Editor for the row
- [ ] `/investor-form` → submit → check `investor_submissions` table
- [ ] `/ambassadors/apply` → submit → check `ambassador_applications` table
- [ ] `/waitlist-admin` → only visible when logged in as admin
- [ ] Direct URL navigation works (e.g. pasting `https://arxon.io/faq` in browser) — this tests the `_redirects` file is working

---

## Local Development After Migration

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:8080
```

Make sure your `.env` has valid Supabase credentials before running locally.

---

## Architecture Summary

```
arxon.io (domain)
    ↓
Cloudflare Pages (hosts the React/Vite build from GitHub)
    ↓
Supabase (your own project — auth, database, RLS)
    ↓
PostgreSQL tables: waitlist, user_roles, investor_submissions,
                   ambassador_applications, ambassador_submissions
```

---

## Security Notes

- The `anon` key in `.env` is **safe to be public** — it only works within your Supabase RLS rules
- The `service_role` key is **dangerous** (bypasses RLS) — never put it in the frontend
- All tables have Row Level Security enabled — no data is exposed unless the policy allows it
- Admin access is controlled via the `user_roles` table — only you can promote users to admin

---

## Removing Lovable Entirely

Once you've confirmed everything works on your own infrastructure:

1. You can safely delete the Lovable project from their dashboard
2. The old Supabase project (`qswjescezkajsinmypne`) under Lovable's account will stop working — that's fine, all data should be re-entered into your new Supabase project (or you can export/import it via Supabase's dashboard before deleting)
3. Your GitHub repo is now the single source of truth

---

_Generated for Arxon migration — April 2026_
