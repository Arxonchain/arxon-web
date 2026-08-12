import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Lock, Shield } from "lucide-react";
import { portalCard, portalInput, portalLabel, portalSubtitle, portalTitle } from "./portalTheme";

type Props = {
  accountId: string;
  loading: boolean;
  notFound: boolean;
  onAccountIdChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function PortalLogin({
  accountId,
  loading,
  notFound,
  onAccountIdChange,
  onSubmit,
  onBack,
}: Props) {
  return (
    <div className="mx-auto max-w-5xl">
      <button
        type="button"
        onClick={onBack}
        className="mb-8 inline-flex items-center gap-2 text-sm text-[#a8c3f0]/75 transition hover:text-[#a8c3f0]"
      >
        <ArrowLeft size={14} />
        Back to Ambassador Program
      </button>

      <div className="grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${portalCard} overflow-hidden p-8 md:p-10`}
        >
          <p className={portalLabel}>Ambassador Portal</p>
          <h1 className={`${portalTitle} mt-3 mb-3`}>Sign in with your App ID</h1>
          <p className={`${portalSubtitle} mb-8 max-w-xl`}>
            Use the same Nexus address from the Arxon mining app. Selected ambassadors unlock the weekly work hub here.
          </p>

          <label htmlFor="portal-account-id" className={`${portalLabel} mb-2 block`}>
            Arxon App ID
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="portal-account-id"
              className={portalInput}
              placeholder="ARX-P-user0001"
              value={accountId}
              onChange={(e) => onAccountIdChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSubmit()}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={onSubmit}
              disabled={loading || !accountId.trim()}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-[#08080c] transition disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #a8c3f0, #c8d8f8)" }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
              Enter portal
            </button>
          </div>

          {notFound && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-200/90"
            >
              No application found for this ID. Only registered applicants can access the portal.
            </motion.p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08 }}
          className="space-y-4"
        >
          {[
            {
              title: "Secure access",
              copy: "Portal actions run through encrypted server checks. Only approved ambassadors can submit weekly reports.",
            },
            {
              title: "Weekly deliverables",
              copy: "Drop links to posts and spaces, upload screenshots, and send your work in one clean report each week.",
            },
            {
              title: "Your status",
              copy: "Applicants still in review can check selection status here without exposing private admin data.",
            },
          ].map((item) => (
            <div key={item.title} className={`${portalCard} p-5`}>
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-[#a8c3f0]/25 bg-[#a8c3f0]/10">
                <Shield size={16} className="text-[#a8c3f0]" />
              </div>
              <h3 className="text-base font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-white/55">{item.copy}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
