import { supabase } from "@/integrations/supabase/client";

export type AdminAccessResult = {
  allowed: boolean;
  reason?: string;
};

export async function verifyApprovedAdminAccess(userId: string): Promise<AdminAccessResult> {
  const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });

  if (roleError) {
    return { allowed: false, reason: "Unable to verify admin role. Please try again." };
  }

  if (isAdmin) {
    return { allowed: true };
  }

  const { data: request, error: requestError } = await supabase
    .from("admin_access_requests")
    .select("status")
    .eq("user_id", userId)
    .maybeSingle();

  if (requestError) {
    return { allowed: false, reason: "Unable to verify admin access. Please try again." };
  }

  if (request?.status === "pending") {
    return {
      allowed: false,
      reason: "Your admin access request is pending approval. You will be notified once approved.",
    };
  }

  if (request?.status === "rejected") {
    return {
      allowed: false,
      reason: "Your admin access request was not approved. Contact gabemetax@gmail.com if you need help.",
    };
  }

  return { allowed: false, reason: "You do not have admin access." };
}

export async function notifyAdminSignup(userId: string) {
  const { error } = await supabase.functions.invoke("notify-admin-signup", {
    body: { user_id: userId },
  });

  if (error) {
    console.error("Failed to notify admin approver:", error);
  }
}
