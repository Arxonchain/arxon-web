# GitHub Actions — Required Secrets

Before the CI/CD pipeline can deploy to Cloudflare Pages automatically,
you need to add 4 secrets to your GitHub repository.

---

## How to Add GitHub Secrets

1. Go to your GitHub repo
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each one below

---

## Required Secrets

### 1. `VITE_SUPABASE_URL`
Your Supabase project URL.

Where to find it:
→ Supabase Dashboard → your project → Settings → API → Project URL

Example value:
```
https://abcdefghijkl.supabase.co
```

---

### 2. `VITE_SUPABASE_PUBLISHABLE_KEY`
Your Supabase anon/public key (safe to expose — RLS protects your data).

Where to find it:
→ Supabase Dashboard → Settings → API → Project API Keys → **anon public**

Example value:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
```

---

### 3. `CLOUDFLARE_API_TOKEN`
A Cloudflare API token with Pages deploy permissions.

How to create it:
1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click **Create Token**
3. Use the **Edit Cloudflare Workers** template (it covers Pages too)
4. Or create a custom token with:
   - **Account → Cloudflare Pages → Edit**
   - **Zone → Zone → Read** (optional, only if using custom domain)
5. Click **Continue to Summary** → **Create Token**
6. Copy the token value immediately (shown only once)

---

### 4. `CLOUDFLARE_ACCOUNT_ID`
Your Cloudflare account ID.

Where to find it:
→ Cloudflare Dashboard → right sidebar on any zone/page → **Account ID**

Example value:
```
1234567890abcdef1234567890abcdef
```

---

## After Adding All 4 Secrets

Push any commit to `main` and the GitHub Action will:
1. Install dependencies
2. Build the Vite app (injecting your Supabase env vars at build time)
3. Deploy the `dist/` folder to Cloudflare Pages
4. Cloudflare will serve it live at `arxon.io`

For pull requests, a **preview URL** is automatically generated and
posted as a comment on the PR so you can review changes before merging.

---

## Verify the Action Ran

→ GitHub repo → **Actions** tab → click the latest workflow run

Green checkmark = deployed. If it fails, click the run to see logs.
