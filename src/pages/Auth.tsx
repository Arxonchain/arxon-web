import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Activity, ArrowLeft, Eye, EyeOff, User, Building2, FileText, Lock, KeyRound } from "lucide-react";
import { authSchema, adminSignupSchema } from "@/lib/validations";
import { notifyAdminSignup, verifyApprovedAdminAccess } from "@/lib/adminAccess";
import { motion } from "framer-motion";
import PageMeta from "@/components/PageMeta";

type AuthMode = "login" | "signup" | "forgot" | "reset";

const RATE_LIMIT_KEY = "auth_attempts";
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;

const checkRateLimit = (): { allowed: boolean; remainingTime?: number } => {
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  if (!stored) return { allowed: true };
  const { count, timestamp } = JSON.parse(stored);
  const timeSinceFirst = Date.now() - timestamp;
  if (timeSinceFirst > LOCKOUT_DURATION) {
    localStorage.removeItem(RATE_LIMIT_KEY);
    return { allowed: true };
  }
  if (count >= MAX_ATTEMPTS) {
    return { allowed: false, remainingTime: Math.ceil((LOCKOUT_DURATION - timeSinceFirst) / 60000) };
  }
  return { allowed: true };
};

const recordAttempt = () => {
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  const now = Date.now();
  if (!stored) {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: 1, timestamp: now }));
    return;
  }
  const { count, timestamp } = JSON.parse(stored);
  if (Date.now() - timestamp > LOCKOUT_DURATION) {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: 1, timestamp: now }));
  } else {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: count + 1, timestamp }));
  }
};

const inputCls =
  "w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-4 py-3 text-white/85 text-sm font-mono placeholder:text-white/60 focus:outline-none focus:border-[#a8c3f0]/35 focus:bg-[#a8c3f0]/[0.02] transition-all";

const Corner = ({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) => {
  const c = {
    tl: "top-0 left-0 border-t border-l",
    tr: "top-0 right-0 border-t border-r",
    bl: "bottom-0 left-0 border-b border-l",
    br: "bottom-0 right-0 border-b border-r",
  }[pos];
  return <div className={`absolute ${c} w-4 h-4 border-[#a8c3f0]/30`} />;
};

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [reason, setReason] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const routeIfApproved = async (userId: string) => {
    const access = await verifyApprovedAdminAccess(userId);
    if (access.allowed) {
      navigate("/admin");
      return;
    }
    await supabase.auth.signOut();
    toast({
      title: "Access denied",
      description: access.reason ?? "You do not have approved admin access.",
      variant: "destructive",
    });
  };

  useEffect(() => {
    const isRecoveryLink = window.location.hash.includes("type=recovery");
    if (isRecoveryLink) setMode("reset");

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("reset");
        return;
      }
      if (session?.user && event !== "PASSWORD_RECOVERY" && !window.location.hash.includes("type=recovery")) {
        routeIfApproved(session.user.id);
      }
    });

    if (!isRecoveryLink) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) routeIfApproved(session.user.id);
      });
    }

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLoginOrSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const rl = checkRateLimit();
    if (!rl.allowed) {
      toast({
        title: "Too many attempts",
        description: `Try again in ${rl.remainingTime} minutes.`,
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      recordAttempt();

      if (mode === "login") {
        authSchema.parse({ email, password });
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast({ title: "Error", description: error.message, variant: "destructive" });
          return;
        }
        if (data.user) await routeIfApproved(data.user.id);
        return;
      }

      adminSignupSchema.parse({ email, password, fullName, organization, reason });
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            admin_signup: true,
            full_name: fullName.trim(),
            organization: organization.trim() || null,
            reason: reason.trim(),
          },
        },
      });

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }

      if (data.user) await notifyAdminSignup(data.user.id);
      await supabase.auth.signOut();

      toast({
        title: "Request submitted",
        description:
          "Your admin access request was sent to gabemetax@gmail.com for approval. You cannot sign in until approved.",
      });
      setMode("login");
      setPassword("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Validation error";
      toast({ title: "Validation error", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({ title: "Email required", description: "Enter your admin email address.", variant: "destructive" });
      return;
    }
    try {
      setLoading(true);
      const redirectTo = `${window.location.origin}/auth`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
      toast({
        title: "Reset email sent",
        description: "Check your inbox for a password reset link. It may take a few minutes.",
      });
      setMode("login");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    try {
      setLoading(true);
      authSchema.shape.password.parse(newPassword);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        return;
      }
      window.history.replaceState(null, "", "/auth");
      toast({
        title: "Password updated",
        description: "Your password has been changed. Sign in with your new password.",
      });
      setNewPassword("");
      setConfirmPassword("");
      setPassword("");
      setMode("login");
      await supabase.auth.signOut();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Validation error";
      toast({ title: "Validation error", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const modeLabel = {
    login: "SIGN_IN",
    signup: "REGISTER",
    forgot: "RESET_REQUEST",
    reset: "NEW_PASSWORD",
  }[mode];

  const modeTitle = {
    login: "Admin Access",
    signup: "Admin Access",
    forgot: "Forgot Password",
    reset: "Set New Password",
  }[mode];

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6 overflow-hidden py-10">
      <PageMeta title="Admin Sign In | ARXON" description="Secure admin access for the Arxon control center." />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center,rgba(124,147,195,0.04) 0%,transparent 65%)" }}
      />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative max-w-[460px] w-full"
      >
        <div className="relative bg-[#0a0a0d] border border-white/[0.10] rounded-2xl overflow-hidden">
          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />
          <div className="flex items-center gap-2 px-6 py-3.5 border-b border-white/[0.09]">
            <Lock size={10} className="text-[#a8c3f0]/40" />
            <span className="font-mono text-[9px] text-white/60 tracking-widest">ADMIN_AUTH</span>
            <div className="flex-1" />
            <div className="flex items-center gap-1.5">
              <Activity size={9} className="text-[#a8c3f0]/40 animate-pulse" />
              <span className="font-mono text-[8px] text-white/55">SECURE</span>
            </div>
          </div>
          <div className="p-8">
            <div className="w-12 h-12 rounded-xl bg-[#a8c3f0]/8 border border-[#a8c3f0]/15 flex items-center justify-center mb-5">
              {mode === "reset" || mode === "forgot" ? (
                <KeyRound size={20} className="text-[#a8c3f0]" />
              ) : (
                <Lock size={20} className="text-[#a8c3f0]" />
              )}
            </div>
            <div className="font-mono text-[9px] text-[#a8c3f0]/50 tracking-widest mb-2">{modeLabel}</div>
            <h1 className="text-xl font-bold text-white mb-2">{modeTitle}</h1>

            {mode === "signup" && (
              <p className="text-white/55 text-xs mb-5 leading-relaxed">
                Submit your details for review. Access is granted only after approval from gabemetax@gmail.com.
              </p>
            )}
            {mode === "forgot" && (
              <p className="text-white/55 text-xs mb-5 leading-relaxed">
                Enter your admin email and we will send a link to reset your password.
              </p>
            )}
            {mode === "reset" && (
              <p className="text-white/55 text-xs mb-5 leading-relaxed">
                Choose a new password for your admin account.
              </p>
            )}

            {mode === "forgot" ? (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="font-mono text-[9px] text-white/50 block mb-1.5 tracking-widest">EMAIL_ADDRESS</label>
                  <input
                    className={inputCls}
                    type="email"
                    placeholder="admin@arxon.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <SubmitButton loading={loading} label="SEND RESET LINK" loadingLabel="SENDING..." />
              </form>
            ) : mode === "reset" ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <PasswordField
                  label="NEW_PASSWORD"
                  value={newPassword}
                  onChange={setNewPassword}
                  show={showNewPw}
                  onToggle={() => setShowNewPw(!showNewPw)}
                />
                <PasswordField
                  label="CONFIRM_PASSWORD"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  show={showNewPw}
                  onToggle={() => setShowNewPw(!showNewPw)}
                />
                <SubmitButton loading={loading} label="UPDATE PASSWORD" loadingLabel="UPDATING..." />
              </form>
            ) : (
              <form onSubmit={handleLoginOrSignup} className="space-y-4">
                {mode === "signup" && (
                  <>
                    <div>
                      <label className="font-mono text-[9px] text-white/50 block mb-1.5 tracking-widest">FULL_NAME</label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                          className={`${inputCls} pl-10`}
                          type="text"
                          placeholder="Jane Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-mono text-[9px] text-white/50 block mb-1.5 tracking-widest">ORGANIZATION</label>
                      <div className="relative">
                        <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                          className={`${inputCls} pl-10`}
                          type="text"
                          placeholder="Arxon / Team name (optional)"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
                <div>
                  <label className="font-mono text-[9px] text-white/50 block mb-1.5 tracking-widest">EMAIL_ADDRESS</label>
                  <input
                    className={inputCls}
                    type="email"
                    placeholder="admin@arxon.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <PasswordField
                  label="PASSWORD"
                  value={password}
                  onChange={setPassword}
                  show={showPw}
                  onToggle={() => setShowPw(!showPw)}
                />
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="font-mono text-[10px] text-[#a8c3f0]/70 hover:text-[#a8c3f0] transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
                {mode === "signup" && (
                  <div>
                    <label className="font-mono text-[9px] text-white/50 block mb-1.5 tracking-widest">REASON_FOR_ACCESS</label>
                    <div className="relative">
                      <FileText size={14} className="absolute left-3 top-3 text-white/40" />
                      <textarea
                        className={`${inputCls} pl-10 min-h-[96px] resize-y`}
                        placeholder="Why do you need admin access?"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}
                <SubmitButton
                  loading={loading}
                  label={mode === "login" ? "SIGN IN" : "SUBMIT FOR APPROVAL"}
                  loadingLabel={mode === "login" ? "AUTHENTICATING..." : "SUBMITTING..."}
                />
              </form>
            )}

            {mode === "login" && (
              <button
                onClick={() => setMode("signup")}
                className="w-full text-center font-mono text-[10px] text-white/65 hover:text-white/50 transition-colors mt-4"
              >
                Need admin access? Register →
              </button>
            )}
            {mode === "signup" && (
              <button
                onClick={() => setMode("login")}
                className="w-full text-center font-mono text-[10px] text-white/65 hover:text-white/50 transition-colors mt-4"
              >
                Already approved? Sign in →
              </button>
            )}
            {(mode === "forgot" || mode === "reset") && (
              <button
                onClick={() => setMode("login")}
                className="w-full text-center font-mono text-[10px] text-white/65 hover:text-white/50 transition-colors mt-4"
              >
                Back to sign in →
              </button>
            )}
          </div>
        </div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 font-mono text-[10px] text-white/60 hover:text-white/60 transition-colors mx-auto mt-4 w-fit"
        >
          <ArrowLeft size={10} /> BACK TO HOME
        </button>
      </motion.div>
    </div>
  );
};

const PasswordField = ({
  label,
  value,
  onChange,
  show,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
}) => (
  <div>
    <label className="font-mono text-[9px] text-white/50 block mb-1.5 tracking-widest">{label}</label>
    <div className="relative">
      <input
        className={`${inputCls} pr-10`}
        type={show ? "text" : "password"}
        placeholder="••••••••••"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/65 hover:text-white/50 transition-colors"
      >
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  </div>
);

const SubmitButton = ({
  loading,
  label,
  loadingLabel,
}: {
  loading: boolean;
  label: string;
  loadingLabel: string;
}) => (
  <motion.button
    type="submit"
    disabled={loading}
    whileHover={{ scale: 1.01, boxShadow: "0 0 30px rgba(124,147,195,0.22)" }}
    whileTap={{ scale: 0.98 }}
    className="w-full relative overflow-hidden flex items-center justify-center gap-2 py-3.5 rounded-xl font-mono text-sm font-bold text-[#09090b] disabled:opacity-40 mt-2"
    style={{ background: "linear-gradient(135deg,#a8c3f0,#a8b8d8)" }}
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      animate={{ x: ["-200%", "200%"] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
    />
    <span className="relative z-10 flex items-center gap-2">
      {loading ? (
        <>
          <Activity size={13} className="animate-spin" />
          {loadingLabel}
        </>
      ) : (
        label
      )}
    </span>
  </motion.button>
);

export default Auth;
