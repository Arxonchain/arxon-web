import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvestorSubmission {
  full_name: string;
  email: string;
  x_username?: string | null;
  country: string;
  company?: string | null;
  investment_range: string;
  investment_timeline: string;
  area_of_interest: string;
  linkedin_profile?: string | null;
  additional_notes?: string | null;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function row(label: string, value: string | null | undefined): string {
  const display = value?.trim() ? escapeHtml(value.trim()) : "—";
  return `<tr><td style="padding:8px 0;color:#666">${label}</td><td><strong>${display}</strong></td></tr>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const submission = (await req.json()) as InvestorSubmission;

    if (!submission.full_name?.trim() || !submission.email?.trim()) {
      throw new Error("full_name and email are required");
    }

    const notifyEmail =
      Deno.env.get("RESEND_TO_EMAIL") ??
      Deno.env.get("INVESTOR_NOTIFY_EMAIL") ??
      "team@arxon.io";

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#111">
        <h2 style="margin-bottom:8px">New Investor Inquiry</h2>
        <p style="color:#555;margin-top:0">A new investor form submission was received on arxon.io.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          ${row("Name", submission.full_name)}
          ${row("Email", submission.email)}
          ${row("X Username", submission.x_username)}
          ${row("Country", submission.country)}
          ${row("Company", submission.company)}
          ${row("Investment Range", submission.investment_range)}
          ${row("Timeline", submission.investment_timeline)}
          ${row("Area of Interest", submission.area_of_interest)}
          ${row("LinkedIn", submission.linkedin_profile)}
          ${row("Notes", submission.additional_notes)}
        </table>
        <p style="color:#888;font-size:12px;margin-top:24px">View all submissions in the admin dashboard under Investors.</p>
      </div>
    `;

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      console.log("RESEND_API_KEY missing — investor notification payload:", {
        to: notifyEmail,
        submission,
      });
      return new Response(JSON.stringify({ success: true, mode: "logged" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: Deno.env.get("RESEND_FROM_EMAIL") ?? "Arxon Investors <onboarding@resend.dev>",
        to: [notifyEmail],
        reply_to: submission.email.trim(),
        subject: `Investor inquiry — ${submission.full_name.trim()}`,
        html,
      }),
    });

    if (!emailRes.ok) {
      throw new Error(`Email delivery failed: ${await emailRes.text()}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
