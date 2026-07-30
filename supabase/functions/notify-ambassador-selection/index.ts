import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PORTAL_URL = "https://arxon.io/ambassador-portal";
const DISCORD_URL = "https://discord.gg/R7PwgreGZ";

type AmbassadorRow = {
  id: string;
  full_name: string;
  arxon_account_id: string;
  email: string | null;
  selection_email_sent_at: string | null;
};

function firstName(fullName: string): string {
  const cleaned = fullName.trim();
  if (!cleaned) return "Ambassador";
  return cleaned.split(/\s+/)[0];
}

function isValidNexusId(id: string): boolean {
  const v = id.trim();
  if (!v || v.length < 3) return false;
  const invalid = ["n/a", "na", "not yet available", "not on app store", "none", "nil", "null", "—", "-"];
  return !invalid.includes(v.toLowerCase());
}

function buildEmailHtml(name: string, nexusId: string): string {
  const greeting = firstName(name);
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f4f6fb;padding:32px 16px;color:#111">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb">
      <div style="background:linear-gradient(135deg,#1a1f2e,#2d3a52);padding:28px 32px">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#a8c3f0">Arxon Ambassador Program</p>
        <h1 style="margin:0;color:#ffffff;font-size:24px;line-height:1.3">You have been selected</h1>
      </div>
      <div style="padding:32px">
        <p style="font-size:16px;line-height:1.6;margin:0 0 16px">Hello ${greeting},</p>
        <p style="font-size:15px;line-height:1.7;color:#374151;margin:0 0 16px">
          Congratulations — you have been <strong>selected as an official Arxon Ambassador</strong> for this cohort.
          Thank you for meeting our requirements and for the work you put into your application.
        </p>
        <p style="font-size:15px;line-height:1.7;color:#374151;margin:0 0 24px">
          To complete onboarding, please join our private ambassador Discord channel. Further instructions,
          coordination, and updates will be shared there first.
        </p>
        <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 28px">
          <tr>
            <td style="padding-right:12px;padding-bottom:12px">
              <a href="${DISCORD_URL}" style="display:inline-block;background:#5865F2;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 22px;border-radius:10px">Join Ambassador Discord</a>
            </td>
            <td style="padding-bottom:12px">
              <a href="${PORTAL_URL}" style="display:inline-block;background:#7c93c3;color:#091018;text-decoration:none;font-weight:700;font-size:14px;padding:14px 22px;border-radius:10px">Open Ambassador Portal</a>
            </td>
          </tr>
        </table>
        <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:24px">
          <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#111;text-transform:uppercase;letter-spacing:0.08em">Portal access</p>
          <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#4b5563">
            Visit <a href="${PORTAL_URL}" style="color:#7c93c3">${PORTAL_URL}</a> and sign in using your
            <strong>Arxon App ID</strong> — this is the same ID as your <strong>Nexus address</strong> in the mining app.
          </p>
          <p style="margin:0;font-size:14px;color:#111"><strong>Your ID:</strong> <code style="background:#eef2ff;padding:4px 8px;border-radius:6px">${nexusId}</code></p>
        </div>
        <p style="font-size:14px;line-height:1.7;color:#4b5563;margin:0 0 12px">
          Your dedicated <strong>Ambassador Work Hub</strong> for weekly deliverables is being finalized.
          Once the full cohort is confirmed, the portal will activate with your task workflow and submission tracking.
        </p>
        <p style="font-size:14px;line-height:1.7;color:#4b5563;margin:0">
          If you have questions, reply to this email or message the team in Discord after joining.
        </p>
        <p style="font-size:14px;line-height:1.7;color:#111;margin:24px 0 0">
          Welcome to the network,<br/><strong>The Arxon Team</strong>
        </p>
      </div>
      <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb">
        <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.5">
          Arxon · Ambassador Program · <a href="https://arxon.io" style="color:#7c93c3">arxon.io</a>
        </p>
      </div>
    </div>
  </div>`;
}

async function resolveEmailFromMining(nexusAddress: string): Promise<string | null> {
  const miningUrl = Deno.env.get("MINING_SUPABASE_URL");
  const miningKey = Deno.env.get("MINING_SUPABASE_SERVICE_ROLE_KEY");
  if (!miningUrl || !miningKey) return null;

  const headers = {
    apikey: miningKey,
    Authorization: `Bearer ${miningKey}`,
    "Content-Type": "application/json",
  };

  const profileRes = await fetch(
    `${miningUrl}/rest/v1/profiles?nexus_address=eq.${encodeURIComponent(nexusAddress.trim())}&select=user_id&limit=1`,
    { headers },
  );
  if (!profileRes.ok) return null;

  const profiles = await profileRes.json();
  const userId = profiles?.[0]?.user_id;
  if (!userId) return null;

  const userRes = await fetch(`${miningUrl}/auth/v1/admin/users/${userId}`, { headers });
  if (!userRes.ok) return null;

  const user = await userRes.json();
  return user?.email?.trim()?.toLowerCase() ?? null;
}

async function isAuthorized(req: Request, supabase: ReturnType<typeof createClient>): Promise<boolean> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.replace("Bearer ", "");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (serviceKey && token === serviceKey) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload?.role === "service_role") return true;
  } catch {
    // not a JWT
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return false;
  const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
  return Boolean(isAdmin);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const isAdmin = await isAuthorized(req, supabase);
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const dryRun = Boolean(body.dry_run);
    const forceResend = Boolean(body.force_resend);

    const { data: ambassadors, error } = await supabase
      .from("ambassador_applications")
      .select("id, full_name, arxon_account_id, email, selection_email_sent_at")
      .eq("status", "approved")
      .order("full_name");

    if (error) throw error;

    const resendKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") ?? "Arxon Ambassadors <onboarding@resend.dev>";

    const results: Array<Record<string, unknown>> = [];
    let sent = 0;
    let skipped = 0;
    let failed = 0;

    for (const row of (ambassadors ?? []) as AmbassadorRow[]) {
      if (!forceResend && row.selection_email_sent_at) {
        skipped++;
        results.push({ name: row.full_name, status: "already_sent", email: row.email });
        continue;
      }

      if (!isValidNexusId(row.arxon_account_id)) {
        skipped++;
        results.push({ name: row.full_name, status: "invalid_nexus_id", id: row.arxon_account_id });
        continue;
      }

      let email = row.email?.trim().toLowerCase() ?? null;
      if (!email) {
        email = await resolveEmailFromMining(row.arxon_account_id);
      }

      if (!email) {
        skipped++;
        results.push({ name: row.full_name, status: "no_email", id: row.arxon_account_id });
        continue;
      }

      if (dryRun) {
        results.push({ name: row.full_name, status: "would_send", email, id: row.arxon_account_id });
        continue;
      }

      if (!resendKey) {
        results.push({ name: row.full_name, status: "logged_only", email });
        console.log("Selection email payload:", { to: email, name: row.full_name, id: row.arxon_account_id });
        continue;
      }

      const html = buildEmailHtml(row.full_name, row.arxon_account_id.trim());
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [email],
          subject: "You’ve been selected as an Arxon Ambassador — join Discord & your portal",
          html,
        }),
      });

      if (!emailRes.ok) {
        failed++;
        results.push({
          name: row.full_name,
          status: "failed",
          email,
          error: await emailRes.text(),
        });
        continue;
      }

      await supabase
        .from("ambassador_applications")
        .update({ email, selection_email_sent_at: new Date().toISOString() })
        .eq("id", row.id);

      sent++;
      results.push({ name: row.full_name, status: "sent", email });
    }

    return new Response(
      JSON.stringify({
        success: true,
        dry_run: dryRun,
        total: ambassadors?.length ?? 0,
        sent,
        skipped,
        failed,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
