import { motion } from "framer-motion";
import {
  Award, ExternalLink, Heart, Loader2, LogOut, MessageCircle, Pickaxe, UserPlus,
} from "lucide-react";
import { AmbassadorProfile } from "@/lib/ambassadorPortalApi";
import { portalCard, portalLabel, portalSubtitle, portalTitle } from "./portalTheme";

const DISCORD_URL = "https://discord.gg/R7PwgreGZ";
const MINING_URL = "https://arxonchain.xyz/";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=xyz.arxonchain.app";

function ProfileStrip({ profile }: { profile: AmbassadorProfile }) {
  return (
    <div className={`${portalCard} flex items-center gap-4 p-5`}>
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#a8c3f0]/30 bg-[#a8c3f0]/12 text-xl font-bold text-[#a8c3f0]">
        {profile.full_name.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-lg font-bold text-white">{profile.full_name}</p>
        <p className="text-sm text-[#a8c3f0]">{profile.x_handle}</p>
        <p className="mt-1 truncate text-xs text-white/45">{profile.arxon_account_id}</p>
      </div>
    </div>
  );
}

export function StatusScreen({
  profile,
  onSignOut,
}: {
  profile: AmbassadorProfile;
  onSignOut: () => void;
}) {
  const isRejected = profile.status === "rejected";
  const isConsideration = profile.status === "consideration";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className={portalLabel}>Application status</p>
        <button
          type="button"
          onClick={onSignOut}
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white/80"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>

      <ProfileStrip profile={profile} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${portalCard} mt-5 overflow-hidden`}
      >
        <div
          className={`border-b border-white/[0.08] px-6 py-5 ${
            isRejected ? "bg-red-400/[0.06]" : "bg-[#a8c3f0]/[0.05]"
          }`}
        >
          {isRejected ? (
            <>
              <div className="mb-2 flex items-center gap-2 text-red-200">
                <Heart size={18} />
                <span className="text-sm font-semibold uppercase tracking-wide">Not selected this round</span>
              </div>
              <h2 className={`${portalTitle} text-xl md:text-2xl`}>Thank you for applying</h2>
              <p className={`${portalSubtitle} mt-2`}>
                You were not selected for this ambassador cohort. You can still grow with Arxon through mining and referrals.
              </p>
            </>
          ) : (
            <>
              <div className="mb-2 flex items-center gap-2 text-[#a8c3f0]">
                <Award size={18} />
                <span className="text-sm font-semibold uppercase tracking-wide">
                  {isConsideration ? "Under detailed review" : "Application in review"}
                </span>
              </div>
              <h2 className={`${portalTitle} text-xl md:text-2xl`}>
                {isConsideration ? "Your profile is in audit review" : "Selection is still in progress"}
              </h2>
              <p className={`${portalSubtitle} mt-2`}>
                {isConsideration
                  ? "Our team is reviewing your activity and content quality in detail. Check back soon for an update."
                  : "We are still reviewing applications for this cohort. Check back here for your result."}
              </p>
            </>
          )}
        </div>

        {isRejected ? (
          <div className="space-y-4 p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                <div className="mb-2 flex items-center gap-2 text-white">
                  <UserPlus size={16} className="text-[#a8c3f0]" />
                  <span className="font-semibold">Refer and earn</span>
                </div>
                <p className="text-sm leading-relaxed text-white/50">
                  Share your referral link in the mining app and earn points when your network stays active.
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                <div className="mb-2 flex items-center gap-2 text-white">
                  <Pickaxe size={16} className="text-emerald-300" />
                  <span className="font-semibold">Keep mining</span>
                </div>
                <p className="text-sm leading-relaxed text-white/50">
                  Consistent mining keeps you positioned inside the Arxon network for future opportunities.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={MINING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-[#08080c]"
                style={{ background: "linear-gradient(135deg, #a8c3f0, #c8d8f8)" }}
              >
                <Pickaxe size={14} />
                Open mining app
              </a>
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.07]"
              >
                <ExternalLink size={14} />
                Get Android app
              </a>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="rounded-xl border border-[#a8c3f0]/20 bg-[#a8c3f0]/[0.05] p-4">
              <div className="flex items-start gap-3">
                <MessageCircle size={18} className="mt-0.5 shrink-0 text-[#a8c3f0]" />
                <p className="text-sm leading-relaxed text-white/65">
                  The weekly work hub opens only after you are officially selected. You will receive Discord and portal instructions by email or X when approved.
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export function ApprovedHeader({
  profile,
  onSignOut,
}: {
  profile: AmbassadorProfile;
  onSignOut: () => void;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className={portalLabel}>Ambassador Work Hub</p>
        <h1 className={`${portalTitle} mt-2`}>Welcome back, {profile.full_name.split(" ")[0]}</h1>
        <p className={`${portalSubtitle} mt-2 max-w-2xl`}>
          Submit your weekly content report here. Add post links, space links, and screenshots so the team can review your work quickly.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-[#5865F2] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4752c4]"
        >
          <ExternalLink size={14} />
          Discord
        </a>
        <button
          type="button"
          onClick={onSignOut}
          className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/[0.07]"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </div>
  );
}

export { ProfileStrip, DISCORD_URL };
