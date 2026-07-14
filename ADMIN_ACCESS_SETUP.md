# Admin Access Approval Setup

New admin registrations require email approval before login works.

## Flow

1. User registers at `/auth` with name, email, password, organization, and reason.
2. A row is created in `admin_access_requests` (status: `pending`).
3. An email is sent to **gabemetax@gmail.com** with **Approve** and **Reject** links.
4. Until approved, sign-in is rejected on `/auth` and all admin pages.
5. Clicking **Approve** grants the `admin` role and allows login.

## One-time Supabase setup

### 1. Run the migration

```bash
# If using Supabase CLI linked to your project
supabase db push
```

Or paste and run `supabase/migrations/20260713160000_admin_access_requests.sql` in the Supabase SQL editor.

### 2. Deploy edge functions

```bash
supabase functions deploy notify-admin-signup --no-verify-jwt
supabase functions deploy review-admin-access --no-verify-jwt
```

`review-admin-access` must be public (no JWT) so email approve/reject links work.

### 3. Set edge function secrets

In Supabase Dashboard → **Project Settings** → **Edge Functions** → **Secrets**:

| Secret | Value |
|--------|--------|
| `ADMIN_APPROVER_EMAIL` | `gabemetax@gmail.com` |
| `RESEND_API_KEY` | Your [Resend](https://resend.com) API key |
| `RESEND_FROM_EMAIL` | Verified sender, e.g. `Arxon Admin <notifications@yourdomain.com>` |
| `SITE_URL` | `https://arxon.io` |

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided automatically to edge functions.

### 4. Resend (email delivery)

1. Create a Resend account and verify your sending domain.
2. Create an API key and add it as `RESEND_API_KEY`.
3. Set `RESEND_FROM_EMAIL` to an address on that verified domain.

Without `RESEND_API_KEY`, signup still works but the function only logs the notification (no email).

## Approving from email

Each signup email contains:

- **Approve Access** → grants admin role
- **Reject Access** → blocks login

You can also approve manually in Supabase:

```sql
SELECT review_admin_access_request(
  '<approval_token>'::uuid,
  'approve',
  'manual'
);
```

Find `approval_token` in the `admin_access_requests` table.

## Existing admins

Accounts that already had the `admin` role **before** this migration (no row in `admin_access_requests`) keep access without re-approval.

## Website deploy

After Supabase is configured:

```bash
npm install
npm run build
```

Push to GitHub — **main** deploys production on Cloudflare Pages; **pull requests** get preview URLs.
