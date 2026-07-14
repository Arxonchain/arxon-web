import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();
    if (!user_id) {
      throw new Error("user_id is required");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: request, error } = await supabase
      .from("admin_access_requests")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (error || !request) {
      throw new Error("Admin access request not found");
    }

    const approverEmail = Deno.env.get("ADMIN_APPROVER_EMAIL") ?? "gabemetax@gmail.com";
    const functionsUrl = `${Deno.env.get("SUPABASE_URL")}/functions/v1`;
    const approveUrl = `${functionsUrl}/review-admin-access?token=${request.approval_token}&action=approve`;
    const rejectUrl = `${functionsUrl}/review-admin-access?token=${request.approval_token}&action=reject`;

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#111">
        <h2 style="margin-bottom:8px">New Arxon Admin Access Request</h2>
        <p style="color:#555;margin-top:0">A new admin registration needs your approval.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <tr><td style="padding:8px 0;color:#666">Name</td><td><strong>${request.full_name}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#666">Email</td><td><strong>${request.email}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#666">Organization</td><td>${request.organization || "—"}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Reason</td><td>${request.reason || "—"}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Submitted</td><td>${new Date(request.created_at).toLocaleString()}</td></tr>
        </table>
        <p style="margin:24px 0 12px">Approve or reject this request:</p>
        <p>
          <a href="${approveUrl}" style="display:inline-block;background:#16a34a;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold;margin-right:12px">Approve Access</a>
          <a href="${rejectUrl}" style="display:inline-block;background:#dc2626;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Reject Access</a>
        </p>
        <p style="color:#888;font-size:12px;margin-top:24px">Until approved, this user cannot sign in to the admin dashboard.</p>
      </div>
    `;

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      console.log("RESEND_API_KEY missing — notification payload:", {
        to: approverEmail,
        approveUrl,
        rejectUrl,
        request,
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
        from: Deno.env.get("RESEND_FROM_EMAIL") ?? "Arxon Admin <onboarding@resend.dev>",
        to: [approverEmail],
        subject: `Admin access request — ${request.full_name}`,
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
