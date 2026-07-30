import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const MINING_URL = Deno.env.get("MINING_SUPABASE_URL") ?? "";
const MINING_KEY = Deno.env.get("MINING_SUPABASE_SERVICE_ROLE_KEY") ?? "";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const h = {
  "apikey": MINING_KEY,
  "Authorization": `Bearer ${MINING_KEY}`,
  "Content-Type": "application/json",
};

const countHeaders = { ...h, "Prefer": "count=exact", "Range": "0-0" };

async function countReferrals(uuid: string): Promise<number> {
  const res = await fetch(
    `${MINING_URL}/rest/v1/referrals?referrer_id=eq.${encodeURIComponent(uuid)}&select=id`,
    { headers: countHeaders }
  );
  if (!res.ok) return 0;
  const cr = res.headers.get("content-range") ?? "";
  if (!cr.includes("/")) return 0;
  const n = parseInt(cr.split("/")[1], 10);
  return isNaN(n) ? 0 : n;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    let accountId: string | null = null;
    const url = new URL(req.url);
    accountId = url.searchParams.get("account_id");
    if (!accountId && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      accountId = body.account_id ?? null;
    }
    if (!accountId?.trim()) {
      return new Response(JSON.stringify({ error: "account_id is required" }),
        { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }

    if (!MINING_URL || !MINING_KEY) {
      return new Response(
        JSON.stringify({ error: "Mining Supabase credentials not configured" }),
        { status: 500, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    const id = accountId.trim();
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    /* ── If already a UUID, try it directly first ── */
    if (isUUID) {
      const count = await countReferrals(id);
      return new Response(
        JSON.stringify({ account_id: id, referral_count: count }),
        { status: 200, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    /* ── Look up profile by nexus_address — get BOTH id and user_id ── */
    const profileRes = await fetch(
      `${MINING_URL}/rest/v1/profiles?nexus_address=eq.${encodeURIComponent(id)}&select=id,user_id&limit=1`,
      { headers: h }
    );

    if (!profileRes.ok) {
      return new Response(
        JSON.stringify({ account_id: id, referral_count: 0, note: "Profile lookup failed" }),
        { status: 200, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    const profiles = await profileRes.json();
    if (!Array.isArray(profiles) || profiles.length === 0) {
      return new Response(
        JSON.stringify({ account_id: id, referral_count: 0, note: "Account not found in mining app" }),
        { status: 200, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    const profile = profiles[0];
    const profileId  = profile.id;      // profiles.id  (uuid)
    const profileUserId = profile.user_id; // profiles.user_id (uuid) — auth user id

    /* ── Try BOTH uuids, take whichever returns a non-zero count ── */
    let referralCount = 0;
    let matchedUUID = "";

    // Try user_id first (auth UUID — most likely what referrals links to)
    if (profileUserId) {
      const c = await countReferrals(profileUserId);
      if (c > 0) { referralCount = c; matchedUUID = profileUserId; }
    }

    // Try profiles.id if user_id gave 0
    if (referralCount === 0 && profileId) {
      const c = await countReferrals(profileId);
      if (c > 0) { referralCount = c; matchedUUID = profileId; }
    }

    return new Response(
      JSON.stringify({
        account_id: id,
        referral_count: referralCount,
        matched_uuid: matchedUUID || profileUserId || profileId,
      }),
      { status: 200, headers: { ...cors, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "Internal error", detail: err?.message ?? String(err) }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
});
