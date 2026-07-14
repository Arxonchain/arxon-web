import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const page = (title: string, body: string) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; background:#09090b; color:#f4f4f5; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; }
    .card { max-width:520px; background:#111114; border:1px solid rgba(168,195,240,.15); border-radius:16px; padding:32px; }
    h1 { margin:0 0 12px; font-size:24px; }
    p { color:#a1a1aa; line-height:1.6; }
    .ok { color:#4ade80; }
    .bad { color:#f87171; }
  </style>
</head>
<body><div class="card">${body}</div></body>
</html>`;

serve(async (req) => {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const action = url.searchParams.get("action");

  if (!token || !action) {
    return new Response(page("Invalid Link", "<h1 class='bad'>Invalid review link</h1><p>Missing token or action.</p>"), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
      status: 400,
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data, error } = await supabase.rpc("review_admin_access_request", {
    _token: token,
    _action: action,
    _reviewed_by: "gabemetax@gmail.com",
  });

  if (error) {
    return new Response(page("Review Failed", `<h1 class='bad'>Review failed</h1><p>${error.message}</p>`), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
      status: 500,
    });
  }

  if (!data?.success) {
    return new Response(
      page(
        "Already Reviewed",
        `<h1>Request already reviewed</h1><p>${data?.error ?? "This request has already been processed."}</p>`,
      ),
      { headers: { "Content-Type": "text/html; charset=utf-8" } },
    );
  }

  const approved = data.status === "approved";
  const title = approved ? "Admin Approved" : "Admin Rejected";
  const body = approved
    ? `<h1 class="ok">Access approved</h1><p><strong>${data.full_name}</strong> (${data.email}) can now sign in to the Arxon admin dashboard.</p>`
    : `<h1 class="bad">Access rejected</h1><p><strong>${data.full_name}</strong> (${data.email}) will not be able to sign in to the admin dashboard.</p>`;

  return new Response(page(title, body), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
});
