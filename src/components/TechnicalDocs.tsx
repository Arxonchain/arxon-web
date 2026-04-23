import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const TechnicalDocs = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [tab, setTab] = useState<"roadmap" | "consensus" | "tokenomics">("roadmap");

  const tabs = [
    { key: "roadmap" as const, label: "Roadmap" },
    { key: "consensus" as const, label: "Consensus" },
    { key: "tokenomics" as const, label: "Tokenomics" },
  ];

  return (
    <section id="roadmap" className="relative bg-[#09090b] py-24 md:py-32" ref={ref}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-[44px] leading-[1.1] tracking-[-0.03em] text-white font-extralight">
            From mining to{" "}
            <span className="text-[#7c93c3] font-bold">global adoption</span>
          </h2>
          <p className="mt-5 text-[#71717a] text-base max-w-[500px] font-light">
            Our path to scarcity. Every phase is designed to maximize fairness, security, and long-term value.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="rounded-xl border border-white/[0.06] overflow-hidden bg-[#0f0f13]"
        >
          {/* Tab bar */}
          <div className="border-b border-white/[0.06] flex">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-5 py-3.5 text-[13px] font-bold transition-colors relative ${
                  tab === t.key ? "text-white" : "text-[#52525b] hover:text-[#a1a1aa]"
                }`}
              >
                {t.label}
                {tab === t.key && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-white"
                    transition={{ duration: 0.25 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-6 md:p-8">
            {tab === "roadmap" && (
              <motion.div
                key="roadmap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-10">
                  <p className="text-[#52525b] text-[11px] font-black uppercase tracking-[0.15em] mb-5">
                    Confirmed Launch
                  </p>
                  <div className="border-b border-white/[0.04] pb-4 mb-4">
                    <div className="flex items-baseline gap-4 flex-wrap">
                      <span className="text-[#7c93c3] text-[13px] font-bold tracking-wide min-w-[80px]">JAN 2026</span>
                      <span className="text-white text-[14px] font-bold">Mining Web App Launch</span>
                      <span className="text-[#52525b] text-[13px] font-light">Mine ARX-P to earn real ARX.</span>
                    </div>
                  </div>
                </div>

                <p className="text-[#52525b] text-[11px] font-black uppercase tracking-[0.15em] mb-5">
                  Development Pipeline
                </p>
                <div className="space-y-0">
                  {[
                    { title: "Marketing Ongoing", desc: "Adding exciting mining features." },
                    { title: "Private wallet v1 & voting Đapp", desc: "Mobile & web wallet with one-tap privacy & đapp for voting by organisation, communities and governments." },
                    { title: "Testnet for our wallets and Đapp", desc: "Users earn more tokens through participating and testing with us." },
                    { title: "Voting dApp Live", desc: "First national, organisations election integrated." },
                    { title: "Global Adoption", desc: "100+ countries, Billions in TVL." },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-baseline gap-4 flex-wrap py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.01] -mx-2 px-2 rounded transition-colors"
                    >
                      <span className="text-white text-[14px] font-bold min-w-[250px]">{item.title}</span>
                      <span className="text-[#52525b] text-[13px] font-light">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === "consensus" && (
              <motion.div
                key="consensus"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-0"
              >
                {[
                  { phase: "Phase 1", timeline: "Pre-TGE", mechanism: "Points Mining", purpose: "Mine ARX-P via web app on mobile & desktop. Early adopters accumulate points for token airdrop." },
                  { phase: "Phase 2", timeline: "At TGE", mechanism: "Proof of Stake", purpose: "Stake ARX tokens for APY rewards. Secure the network and earn passive yield." },
                  { phase: "Phase 3", timeline: "Post-TGE", mechanism: "Deflationary Model", purpose: "Fixed supply cap reached. Value accrues to long-term holders." },
                ].map((row, i) => (
                  <div
                    key={i}
                    className="py-5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.01] -mx-2 px-2 rounded transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[#7c93c3] text-[12px] font-bold">{row.phase}</span>
                      <span className="text-[#3f3f46]">·</span>
                      <span className="text-[#52525b] text-[12px] font-medium">{row.timeline}</span>
                    </div>
                    <p className="text-white text-[15px] font-bold mb-1">{row.mechanism}</p>
                    <p className="text-[#52525b] text-[13px] leading-relaxed font-light">{row.purpose}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {tab === "tokenomics" && (
              <motion.div
                key="tokenomics"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="py-16 text-center"
              >
                <p className="text-[#3f3f46] text-sm uppercase tracking-[0.2em] font-bold mb-3">Tokenomics</p>
                <h3 className="text-white text-3xl md:text-5xl font-black tracking-[-0.03em] mb-5">Coming Soon</h3>
                <p className="text-[#52525b] text-sm max-w-md mx-auto leading-relaxed font-light">
                  Revolutionary token distribution mechanics and economic models
                  are being crafted for maximum fairness and sustainability.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechnicalDocs;
