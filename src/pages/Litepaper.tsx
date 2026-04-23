import { motion } from "framer-motion";
import { Download, Shield, Globe, Vote, Code, Coins, FileText, ArrowRight, Users, Lock, Eye, EyeOff, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import arxonLogo from "@/assets/arxon-logo-square.png";

const sectionVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const Litepaper = () => {
  return (
    <div className="min-h-screen bg-[#050508]">
      <Navbar />
      <BackButton />

      {/* Hero */}
      <section className="pt-28 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,hsl(220_50%_40%/0.08)_0%,transparent_70%)]" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <img src={arxonLogo} alt="Arxon" className="w-20 h-20 mx-auto rounded-xl" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#7D93C4]/20 bg-[#7D93C4]/5 text-[#7D93C4] text-xs font-medium mb-6"
          >
            <FileText size={12} />
            Litepaper 2026
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight"
          >
            Sovereign Privacy Blockchain
            <span className="block text-[#7D93C4]">for the Unbanked World</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 text-sm md:text-base italic mb-4"
          >
            "Financial sovereignty is not a privilege. It is a right."
          </motion.p>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-20">

        {/* The Problem */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Globe size={16} className="text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">The Problem</h2>
          </div>
          <p className="text-white/60 leading-relaxed mb-6">
            The global financial system was not built for everyone. Despite two generations of cryptocurrency innovation, over 1.4 billion adults worldwide remain without access to basic financial services. Blockchain promised to change this. In practice, the benefits have mostly flowed to those who were already financially included.
          </p>
          <div className="grid gap-4">
            {[
              { icon: Users, title: "Financial Exclusion", desc: "Hundreds of millions of people in Africa, Asia, and Latin America conduct their entire financial lives in cash. Without bank accounts, they cannot save securely, access credit, or participate in the digital economy." },
              { icon: Eye, title: "Financial Surveillance", desc: "Public blockchains solve financial exclusion but introduce total transparency. Your wallet balance, every transaction, and every person you have ever paid is permanently visible to anyone on earth." },
              { icon: Coins, title: "The Cost of Sending Money Home", desc: "The Nigerian diaspora alone sends over $20 billion home every year. At current fees of 6-8%, over $1.5 billion is extracted from the world's poorest families every single year." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <item.icon size={14} className="text-[#7D93C4]" />
                  <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                </div>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* The Arxon Solution */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#7D93C4]/10 flex items-center justify-center">
              <Shield size={16} className="text-[#7D93C4]" />
            </div>
            <h2 className="text-2xl font-bold text-white">The Arxon Solution</h2>
          </div>
          <p className="text-white/60 leading-relaxed mb-6">
            Arxon is a sovereign Layer-1 blockchain built from the ground up to serve the people that existing financial systems have failed. It is not a modification of another chain. Arxon is its own independent network with its own consensus, token, rules, and mission.
          </p>
          <p className="text-white/60 leading-relaxed mb-6">
            The core innovation is the <span className="text-[#7D93C4] font-semibold">Selective Privacy System</span>. Every transaction on Arxon carries four independent privacy flags:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: EyeOff, label: "Hide sender address" },
              { icon: EyeOff, label: "Hide receiver address" },
              { icon: EyeOff, label: "Hide transaction amount" },
              { icon: Lock, label: "Hide wallet balance" },
            ].map((flag, i) => (
              <motion.div
                key={flag.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#7D93C4]/5 border border-[#7D93C4]/10"
              >
                <flag.icon size={14} className="text-[#7D93C4] shrink-0" />
                <span className="text-white/70 text-xs font-medium">{flag.label}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-white/50 text-sm mt-4 leading-relaxed">
            No other blockchain offers this level of user control. Arxon is the first.
          </p>
        </motion.section>

        {/* What Arxon Has Built */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Zap size={16} className="text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">What Arxon Has Built</h2>
          </div>
          <p className="text-white/60 leading-relaxed mb-6">
            Arxon is not a concept or a whitepaper project. The chain is running. Blocks are being produced. Transactions are being processed.
          </p>
          <div className="space-y-4">
            {[
              { title: "A Live Sovereign Blockchain", desc: "Running BABE/GRANDPA consensus with a new block every six seconds in multi-node testnet configuration." },
              { title: "Unique Chain ID & ARX Token", desc: "Fixed supply with its own unique identity, no inflation." },
              { title: "Full Ethereum Compatibility", desc: "Any smart contract written for Ethereum deploys on Arxon without changes. MetaMask connects out of the box." },
              { title: "Selective Privacy System", desc: "Four independent privacy flags working in any combination, eight distinct privacy modes." },
              { title: "Private Transaction Receipts", desc: "Tamper-proof records with single-use disclosure codes for third-party verification." },
              { title: "ARX-P Mining System", desc: "14k+ community of real miners earning points before mainnet, convertible to ARX tokens at launch." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex gap-3 items-start"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#7D93C4] mt-2 shrink-0" />
                <div>
                  <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                  <p className="text-white/50 text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* What We Are Building */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Code size={16} className="text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">What We Are Building</h2>
          </div>

          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Lock size={14} className="text-[#7D93C4]" />
                Zero-Knowledge Cryptographic Privacy
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Halo2 zero-knowledge proofs make hidden information impossible to reveal, even with complete access to the blockchain's raw data. Halo2 requires no trusted setup, the security is mathematical, not ceremonial.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Vote size={14} className="text-[#7D93C4]" />
                On-Chain Private Voting
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                A voting system where coercion is cryptographically impossible. Voters prove eligibility without revealing identity. Results are tallied through Layer-2 ZK batch proofs, one billion votes across 10,000 batches settles on-chain in seconds.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Code size={14} className="text-[#7D93C4]" />
                Developer Ecosystem
              </h3>
              <ul className="text-white/50 text-sm leading-relaxed space-y-1.5">
                <li className="flex items-start gap-2"><span className="text-[#7D93C4] mt-0.5">•</span>Privacy-preserving DeFi, trading, lending with confidential amounts</li>
                <li className="flex items-start gap-2"><span className="text-[#7D93C4] mt-0.5">•</span>Private remittance applications for diaspora markets</li>
                <li className="flex items-start gap-2"><span className="text-[#7D93C4] mt-0.5">•</span>Confidential payroll systems with private salary information</li>
                <li className="flex items-start gap-2"><span className="text-[#7D93C4] mt-0.5">•</span>ZK voting applications for communities, DAOs, and governments</li>
                <li className="flex items-start gap-2"><span className="text-[#7D93C4] mt-0.5">•</span>Private NFT marketplaces and confidential identity systems</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Roadmap */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <ArrowRight size={16} className="text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Roadmap</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                status: "COMPLETE", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20",
                items: [
                  "Sovereign Layer-1 blockchain in multi-node testnet",
                  "ARX native token with fixed supply",
                  "Full EVM compatibility, MetaMask, Solidity, all Ethereum tooling",
                  "Selective privacy system, four independent per-transaction flags",
                  "Private Transaction Receipt system with disclosure codes",
                  "ARX-P mining system, 14k+ community",
                  "On-chain ARX claim pallet for unlimited miners",
                ]
              },
              {
                status: "IN BUILDING PROCESS", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20",
                items: [
                  "Public testnet launch, anyone can connect and transact",
                  "Block explorer, browse all Arxon transactions publicly",
                  "Testnet faucet for developers",
                  "Validator expansion",
                  "Anti-rug protection registry",
                  "Developer documentation and SDK release",
                  "MetaMask official chain registration",
                  "Halo2 zero-knowledge proof integration",
                  "Cryptographic enforcement of all four privacy flags",
                  "ZK voting Phase 1, private on-chain votes",
                  "Privacy-preserving DeFi primitives",
                  "Third-party ZK circuit security audit",
                ]
              },
              {
                status: "AHEAD, ECOSYSTEM", color: "text-[#7D93C4]", bg: "bg-[#7D93C4]/10 border-[#7D93C4]/20",
                items: [
                  "ZK voting Phase 2, national-scale batch proof elections",
                  "Remittance corridor integrations for Nigeria and diaspora",
                  "Mobile wallet with built-in privacy controls",
                  "Cross-chain bridges to major ecosystems",
                  "Mainnet launch with ARX-P conversion",
                ]
              },
            ].map((phase, i) => (
              <motion.div
                key={phase.status}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-5 rounded-xl border ${phase.bg}`}
              >
                <span className={`text-xs font-bold ${phase.color} tracking-wider`}>{phase.status}</span>
                <ul className="mt-3 space-y-1.5">
                  {phase.items.map((item) => (
                    <li key={item} className="text-white/50 text-sm flex items-start gap-2">
                      <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${phase.color.replace('text-', 'bg-')}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Why Arxon */}
        <motion.section variants={sectionVariant} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#7D93C4]/10 flex items-center justify-center">
              <Shield size={16} className="text-[#7D93C4]" />
            </div>
            <h2 className="text-2xl font-bold text-white">Why Arxon</h2>
          </div>
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-white font-semibold text-sm mb-1">The problem is real and the users are real</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Financial exclusion affects hundreds of millions right now. The diaspora paying 7% fees to send money home is real. The voter who fears coercion is real. Arxon is built for these people.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-white font-semibold text-sm mb-1">The technology is original</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Selective transaction privacy does not exist on any other production blockchain. This is not an incremental improvement, it is a new capability.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Closing */}
        <motion.section
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center py-12"
        >
          <p className="text-white/60 leading-relaxed mb-6 text-sm max-w-xl mx-auto">
            Bitcoin proved money without banks was possible. Ethereum proved programmable money was possible. Arxon is proving that private, accessible, fair money is possible, and building it for the people who need it most.
          </p>
          <p className="text-[#7D93C4] font-semibold text-lg mb-8 italic">
            "Arxon is Built For the World."
          </p>
          <a href="/Arxon_Litepaper_2026.pdf" download>
            <Button className="bg-[#7D93C4] hover:bg-[#8da3d3] text-[#050508] font-bold px-8 py-3 rounded-xl gap-2">
              <Download size={16} />
              Download Full Litepaper
            </Button>
          </a>
          <p className="text-white/30 text-xs mt-8 max-w-md mx-auto">
            This litepaper is for informational purposes. It does not constitute financial advice or an offer of any kind. Arxon is in active development.
          </p>
        </motion.section>
      </div>
    </div>
  );
};

export default Litepaper;
