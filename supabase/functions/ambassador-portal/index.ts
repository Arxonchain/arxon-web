import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BUCKET = "ambassador-reports";
const SESSION_TTL_SEC = 60 * 60 * 12;
const MAX_LINKS = 24;
const MAX_IMAGES = 12;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

type ApplicationRow = {
  id: string;
  full_name: string;
  x_handle: string;
  arxon_account_id: string;
  country: string | null;
  status: string;
  follower_count: number;
  approved_at: string | null;
  created_at: string;
};

type SessionPayload = {
  sub: string;
  app_id: string;
  account_id: string;
  role: "ambassador";
  exp: number;
  iat: number;
};

type ReportItemInput = {
  item_type: string;
  url?: string | null;
  storage_path?: string | null;
  caption?: string | null;
  sort_order?: number;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getSecret(): string {
  return Deno.env.get("AMBASSADOR_PORTAL_SECRET")
    ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    ?? "";
}

function base64UrlEncodeString(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlEncodeBytes(data: Uint8Array): string {
  let binary = "";
  data.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((str.length + 3) % 4);
  const bin = atob(padded);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function signToken(payload: Omit<SessionPayload, "iat">): Promise<string> {
  const secret = getSecret();
  if (!secret) throw new Error("Portal secret not configured");

  const header = base64UrlEncodeString(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const fullPayload: SessionPayload = { ...payload, iat: Math.floor(Date.now() / 1000) };
  const body = base64UrlEncodeString(JSON.stringify(fullPayload));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${header}.${body}`));
  return `${header}.${body}.${base64UrlEncodeBytes(new Uint8Array(sig))}`;
}

async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const secret = getSecret();
    if (!secret) return null;
    const [header, body, sig] = token.split(".");
    if (!header || !body || !sig) return null;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64UrlDecode(sig),
      new TextEncoder().encode(`${header}.${body}`),
    );
    if (!valid) return null;

    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(body))) as SessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (payload.role !== "ambassador") return null;
    return payload;
  } catch {
    return null;
  }
}

function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

function sanitizeText(value: unknown, maxLen: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, maxLen);
  return trimmed.length ? trimmed : null;
}

function weekStartFromDate(d = new Date()): string {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = date.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setUTCDate(date.getUTCDate() + diff);
  return date.toISOString().slice(0, 10);
}

function publicProfile(app: ApplicationRow) {
  return {
    id: app.id,
    full_name: app.full_name,
    x_handle: app.x_handle,
    arxon_account_id: app.arxon_account_id,
    country: app.country,
    status: app.status,
    follower_count: app.follower_count,
    approved_at: app.approved_at,
    created_at: app.created_at,
  };
}

async function miningHeaders() {
  const miningUrl = Deno.env.get("MINING_SUPABASE_URL");
  const miningKey = Deno.env.get("MINING_SUPABASE_SERVICE_ROLE_KEY");
  if (!miningUrl || !miningKey) return null;
  return {
    url: miningUrl,
    headers: {
      apikey: miningKey,
      Authorization: `Bearer ${miningKey}`,
      "Content-Type": "application/json",
    },
  };
}

async function resolveNexusAddress(rawId: string): Promise<string | null> {
  const id = rawId.trim();
  if (!id) return null;

  const mining = await miningHeaders();
  if (!mining) return null;

  const { url, headers } = mining;

  const byNexus = await fetch(
    `${url}/rest/v1/profiles?nexus_address=eq.${encodeURIComponent(id)}&select=nexus_address&limit=1`,
    { headers },
  );
  if (byNexus.ok) {
    const rows = await byNexus.json();
    if (rows?.[0]?.nexus_address) return rows[0].nexus_address;
  }

  const byReferral = await fetch(
    `${url}/rest/v1/profiles?referral_code=eq.${encodeURIComponent(id)}&select=nexus_address&limit=1`,
    { headers },
  );
  if (byReferral.ok) {
    const rows = await byReferral.json();
    if (rows?.[0]?.nexus_address) return rows[0].nexus_address;
  }

  return null;
}

async function findApplication(
  supabase: ReturnType<typeof createClient>,
  rawAccountId: string,
): Promise<ApplicationRow | null> {
  const id = rawAccountId.trim();
  if (!id) return null;

  const { data: direct } = await supabase
    .from("ambassador_applications")
    .select("id, full_name, x_handle, arxon_account_id, country, status, follower_count, approved_at, created_at")
    .eq("arxon_account_id", id)
    .maybeSingle();

  if (direct) return direct as ApplicationRow;

  const nexus = await resolveNexusAddress(id);
  if (nexus) {
    const { data: byNexus } = await supabase
      .from("ambassador_applications")
      .select("id, full_name, x_handle, arxon_account_id, country, status, follower_count, approved_at, created_at")
      .eq("arxon_account_id", nexus)
      .maybeSingle();
    if (byNexus) return byNexus as ApplicationRow;
  }

  const { data: byReferral } = await supabase
    .from("ambassador_applications")
    .select("id, full_name, x_handle, arxon_account_id, country, status, follower_count, approved_at, created_at")
    .ilike("arxon_account_id", `%${id}%`)
    .limit(5);

  if (byReferral?.length === 1) return byReferral[0] as ApplicationRow;

  return null;
}

async function assertApprovedAmbassador(
  supabase: ReturnType<typeof createClient>,
  session: SessionPayload,
): Promise<ApplicationRow | null> {
  const { data: app } = await supabase
    .from("ambassador_applications")
    .select("id, full_name, x_handle, arxon_account_id, country, status, follower_count, approved_at, created_at")
    .eq("id", session.app_id)
    .eq("arxon_account_id", session.account_id)
    .eq("status", "approved")
    .maybeSingle();

  return (app as ApplicationRow) ?? null;
}

async function loadReports(
  supabase: ReturnType<typeof createClient>,
  accountId: string,
) {
  const { data: reports, error } = await supabase
    .from("ambassador_weekly_reports")
    .select(`
      id,
      week_start,
      status,
      summary,
      submitted_at,
      created_at,
      updated_at,
      admin_points,
      admin_points_note,
      admin_points_assigned_at,
      ambassador_report_items (
        id,
        item_type,
        url,
        storage_path,
        caption,
        sort_order,
        created_at
      )
    `)
    .eq("arxon_account_id", accountId)
    .order("week_start", { ascending: false })
    .limit(20);

  if (error) throw error;

  const enriched = await Promise.all((reports ?? []).map(async (report) => {
    const items = (report.ambassador_report_items ?? []).sort(
      (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order,
    );

    const itemsWithUrls = await Promise.all(items.map(async (item: { storage_path: string | null; [key: string]: unknown }) => {
      if (!item.storage_path) return item;
      const { data } = await supabase.storage.from(BUCKET).createSignedUrl(item.storage_path, 60 * 60);
      return { ...item, signed_url: data?.signedUrl ?? null };
    }));

    return { ...report, ambassador_report_items: itemsWithUrls };
  }));

  return enriched;
}

function validateItems(items: ReportItemInput[], accountId: string): { ok: true; items: ReportItemInput[] } | { ok: false; error: string } {
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, error: "Add at least one link or image" };
  }
  if (items.length > MAX_LINKS + MAX_IMAGES) {
    return { ok: false, error: "Too many items in this report" };
  }

  let linkCount = 0;
  let imageCount = 0;
  const cleaned: ReportItemInput[] = [];

  for (let i = 0; i < items.length; i++) {
    const raw = items[i];
    const itemType = String(raw.item_type ?? "").toLowerCase();
    if (!["post", "space", "video", "image", "link", "other"].includes(itemType)) {
      return { ok: false, error: "Invalid item type" };
    }

    const url = sanitizeText(raw.url, 2048);
    const storagePath = sanitizeText(raw.storage_path, 512);
    const caption = sanitizeText(raw.caption, 280);

    if (storagePath) {
      if (!storagePath.startsWith(`${accountId}/`)) {
        return { ok: false, error: "Invalid upload path" };
      }
      imageCount++;
      if (imageCount > MAX_IMAGES) return { ok: false, error: `Maximum ${MAX_IMAGES} images per report` };
    }

    if (url) {
      if (!isValidUrl(url)) return { ok: false, error: "Links must start with http:// or https://" };
      linkCount++;
      if (linkCount > MAX_LINKS) return { ok: false, error: `Maximum ${MAX_LINKS} links per report` };
    }

    if (!url && !storagePath) continue;

    cleaned.push({
      item_type: itemType,
      url,
      storage_path: storagePath,
      caption,
      sort_order: i,
    });
  }

  if (!cleaned.length) return { ok: false, error: "Add at least one valid link or image" };
  return { ok: true, items: cleaned };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const body = await req.json().catch(() => ({}));
    const action = String(body.action ?? "");

    if (action === "auth") {
      const accountId = sanitizeText(body.account_id, 128);
      if (!accountId) return json({ error: "Account ID is required" }, 400);

      const app = await findApplication(supabase, accountId);
      if (!app) return json({ ok: true, found: false, status: "not_found" });

      const profile = publicProfile(app);
      if (app.status !== "approved") {
        return json({ ok: true, found: true, status: app.status, profile });
      }

      const token = await signToken({
        sub: app.arxon_account_id,
        app_id: app.id,
        account_id: app.arxon_account_id,
        role: "ambassador",
        exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SEC,
      });

      const reports = await loadReports(supabase, app.arxon_account_id);

      return json({
        ok: true,
        found: true,
        status: "approved",
        profile,
        session_token: token,
        expires_in: SESSION_TTL_SEC,
        reports,
        current_week: weekStartFromDate(),
      });
    }

    const token = String(body.session_token ?? "");
    const session = await verifyToken(token);
    if (!session) return json({ error: "Session expired. Sign in again." }, 401);

    const app = await assertApprovedAmbassador(supabase, session);
    if (!app) return json({ error: "Access denied" }, 403);

    if (action === "dashboard") {
      const reports = await loadReports(supabase, app.arxon_account_id);
      return json({
        ok: true,
        profile: publicProfile(app),
        reports,
        current_week: weekStartFromDate(),
      });
    }

    if (action === "upload_url") {
      const contentType = String(body.content_type ?? "");
      const filename = sanitizeText(body.filename, 120);
      if (!filename || !ALLOWED_IMAGE_TYPES.has(contentType)) {
        return json({ error: "Only JPEG, PNG, WebP, or GIF images are allowed" }, 400);
      }

      const ext = filename.includes(".") ? filename.split(".").pop()?.toLowerCase() : "jpg";
      const safeExt = ["jpg", "jpeg", "png", "webp", "gif"].includes(ext ?? "") ? ext : "jpg";
      const weekStart = sanitizeText(body.week_start, 10) ?? weekStartFromDate();
      const objectPath = `${app.arxon_account_id}/${weekStart}/${crypto.randomUUID()}.${safeExt}`;

      const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(objectPath);
      if (error || !data) return json({ error: error?.message ?? "Upload URL failed" }, 500);

      return json({
        ok: true,
        storage_path: objectPath,
        signed_url: data.signedUrl,
        token: data.token,
      });
    }

    if (action === "submit_report") {
      const weekStart = sanitizeText(body.week_start, 10) ?? weekStartFromDate();
      const summary = sanitizeText(body.summary, 2000);
      const submitFinal = Boolean(body.finalize);
      const itemsInput = (body.items ?? []) as ReportItemInput[];

      const validated = validateItems(itemsInput, app.arxon_account_id);
      if (!validated.ok) return json({ error: validated.error }, 400);

      const { data: existing } = await supabase
        .from("ambassador_weekly_reports")
        .select("id, status")
        .eq("arxon_account_id", app.arxon_account_id)
        .eq("week_start", weekStart)
        .maybeSingle();

      if (existing?.status === "submitted" && submitFinal) {
        return json({ error: "This week is already submitted" }, 409);
      }

      let reportId = existing?.id as string | undefined;
      const now = new Date().toISOString();

      if (reportId) {
        const { error: updateError } = await supabase
          .from("ambassador_weekly_reports")
          .update({
            summary,
            status: submitFinal ? "submitted" : "draft",
            submitted_at: submitFinal ? now : null,
            updated_at: now,
          })
          .eq("id", reportId)
          .eq("arxon_account_id", app.arxon_account_id);

        if (updateError) throw updateError;
        await supabase.from("ambassador_report_items").delete().eq("report_id", reportId);
      } else {
        const { data: created, error: createError } = await supabase
          .from("ambassador_weekly_reports")
          .insert({
            application_id: app.id,
            arxon_account_id: app.arxon_account_id,
            week_start: weekStart,
            summary,
            status: submitFinal ? "submitted" : "draft",
            submitted_at: submitFinal ? now : null,
            updated_at: now,
          })
          .select("id")
          .single();

        if (createError) throw createError;
        reportId = created.id;
      }

      const rows = validated.items.map((item, index) => ({
        report_id: reportId,
        item_type: item.item_type,
        url: item.url,
        storage_path: item.storage_path,
        caption: item.caption,
        sort_order: item.sort_order ?? index,
      }));

      const { error: itemsError } = await supabase.from("ambassador_report_items").insert(rows);
      if (itemsError) throw itemsError;

      const reports = await loadReports(supabase, app.arxon_account_id);
      const report = reports.find((r) => r.id === reportId);

      return json({
        ok: true,
        message: submitFinal ? "Weekly report submitted" : "Draft saved",
        report,
        reports,
      });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return json({ error: message }, 500);
  }
});
