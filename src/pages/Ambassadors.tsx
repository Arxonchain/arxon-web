import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import {
  Terminal, Cpu, Network, Shield, Zap, ChevronRight,
  Activity, Radio, Database, Lock, GitBranch, Hash,
  Users, Globe, Video, MessageSquare, Award, ArrowRight,
  Signal, Server, Code2, Layers, TrendingUp,
  AlertCircle, CheckCircle2, Clock, ExternalLink, ArrowUpRight
} from "lucide-react";

/* ─── Canvas Grid Background ─── */
const CircuitBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, raf: number;

    type Node = { x: number; y: number; pulse: number; speed: number };
    const nodes: Node[] = [];

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      nodes.length = 0;
      for (let i = 0; i < 50; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          pulse: Math.random() * Math.PI * 2,
          speed: 0.008 + Math.random() * 0.008,
        });
      }
    };
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      frame++;
      nodes.forEach(n => {
        n.x += (Math.random() - 0.5) * 0.15;
        n.y += (Math.random() - 0.5) * 0.15;
        n.x = Math.max(0, Math.min(W, n.x));
        n.y = Math.max(0, Math.min(H, n.y));
        n.pulse += n.speed;
      });
      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < 140) {
            const a = (1 - d / 140) * 0.06;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(124,147,195,${a})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      // Draw nodes
      nodes.forEach((n) => {
        const p = Math.sin(n.pulse) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.5 + p, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,147,195,${0.15 + p * 0.25})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

/* ─── Scanline ─── */
const Scanline = () => (
  <motion.div
    className="absolute inset-x-0 h-px pointer-events-none z-10"
    style={{ background: "linear-gradient(90deg,transparent,rgba(124,147,195,0.12),transparent)" }}
    animate={{ top: ["0%", "100%"] }}
    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
  />
);

/* ─── Terminal type-in ─── */
const TypeLine = ({ text, delay = 0, color = "text-[#7c93c3]/60" }: { text: string; delay?: number; color?: string }) => {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), delay * 1000); return () => clearTimeout(t); }, [delay]);
  if (!show) return null;
  return (
    <motion.p initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className={`font-mono text-[11px] leading-relaxed ${color}`}>
      {text}
    </motion.p>
  );
};

/* ─── Status pill ─── */
const Pill = ({ label, variant = "blue" }: { label: string; variant?: "blue" | "green" | "amber" }) => {
  const v = { blue: "text-[#7c93c3] bg-[#7c93c3]/8 border-[#7c93c3]/20", green: "text-emerald-400 bg-emerald-400/8 border-emerald-400/20", amber: "text-amber-400 bg-amber-400/8 border-amber-400/20" }[variant];
  const dot = { blue: "bg-[#7c93c3]", green: "bg-emerald-400", amber: "bg-amber-400" }[variant];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border font-mono text-[10px] font-semibold tracking-wider ${v}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse`} />
      {label}
    </span>
  );
};

/* ─── Grid overlay ─── */
const Grid = ({ size = 60, opacity = 0.025 }) => (
  <div className="absolute inset-0 pointer-events-none" style={{
    backgroundImage: `linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)`,
    backgroundSize: `${size}px ${size}px`, opacity,
  }} />
);

/* ─── Corner chrome ─── */
const Corner = ({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) => {
  const cls = { tl: "top-0 left-0", tr: "top-0 right-0", bl: "bottom-0 left-0", br: "bottom-0 right-0" }[pos];
  const bord = { tl: "border-t border-l rounded-tl-sm", tr: "border-t border-r rounded-tr-sm", bl: "border-b border-l rounded-bl-sm", br: "border-b border-r rounded-br-sm" }[pos];
  return <div className={`absolute ${cls} w-4 h-4 ${bord} border-[#7c93c3]/30`} />;
};

/* ═══════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════ */
const Hero = () => {
  const navigate = useNavigate();
  const [ts, setTs] = useState("");
  useEffect(() => {
    const iv = setInterval(() => setTs(new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC"), 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-[#09090b]">
        <CircuitBackground />
        <Scanline />
        <Grid size={64} opacity={0.022} />
        {/* Radial bloom */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(124,147,195,0.055) 0%,transparent 65%)" }} />
        {/* Corner circuit traces */}
        <svg className="absolute top-20 left-0 w-48 h-48 opacity-20 pointer-events-none" viewBox="0 0 192 192" fill="none">
          <path d="M0 8h24l8 8h40" stroke="#7c93c3" strokeWidth="0.5"/>
          <path d="M0 24h12l8 8h32" stroke="#7c93c3" strokeWidth="0.5"/>
          <path d="M8 0v24l8 8v40" stroke="#7c93c3" strokeWidth="0.5"/>
          <rect x="68" y="12" width="6" height="6" stroke="#7c93c3" strokeWidth="0.5"/>
          <rect x="36" y="12" width="4" height="4" fill="rgba(124,147,195,0.3)"/>
        </svg>
        <svg className="absolute top-20 right-0 w-48 h-48 opacity-20 pointer-events-none" viewBox="0 0 192 192" fill="none">
          <path d="M192 8h-24l-8 8h-40" stroke="#7c93c3" strokeWidth="0.5"/>
          <path d="M192 24h-12l-8 8h-32" stroke="#7c93c3" strokeWidth="0.5"/>
          <path d="M184 0v24l-8 8v40" stroke="#7c93c3" strokeWidth="0.5"/>
          <rect x="118" y="12" width="6" height="6" stroke="#7c93c3" strokeWidth="0.5"/>
        </svg>
      </div>

      <div className="relative z-10 max-w-[1120px] mx-auto px-6 pt-28 pb-20 w-full">
        {/* System path */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-12">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/20">
            <Terminal size={10} className="text-[#7c93c3]/40" />
            <span>ARXON</span><span className="text-[#7c93c3]/25">/</span>
            <span>PROTOCOLS</span><span className="text-[#7c93c3]/25">/</span>
            <span className="text-[#7c93c3]/50">AMBASSADOR_NODE</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-[#7c93c3]/15 to-transparent" />
          <span className="font-mono text-[9px] text-white/15">{ts}</span>
          <Pill label="LIVE" variant="green" />
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_440px] gap-12 items-center">
          {/* Left */}
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#7c93c3]/20 bg-[#7c93c3]/5 rounded font-mono text-[9px] text-[#7c93c3]/80 tracking-widest uppercase mb-6">
              <Radio size={8} className="animate-pulse" />
              Arxon Ambassador Campaign v1.0 · 30-Day Campaign · $100K ARX Allocation
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="text-[clamp(38px,5.5vw,68px)] font-bold leading-[1.04] tracking-tight text-white mb-6">
              Ambassador<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#7c93c3,#a8b8d8 50%,#7c93c3)" }}>
                Ambassador Program
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
              className="text-white/45 text-[15px] leading-relaxed max-w-[500px] mb-10">
              Get deployed as Arxon Blockchain representative in your country and community. 30 days of verified output. 
              Quality over vanity metrics. Share the $100,000 ARX reward pool at TGE.
            </motion.p>

            {/* Metric strip */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="relative flex gap-0 mb-10 rounded-xl overflow-hidden border border-white/[0.07] bg-white/[0.02]">
              <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />
              {[
                { label: "REWARD_POOL", val: "$100K", sub: "ARX Token" },
                { label: "DURATION", val: "30D", sub: "Challenge" },
              ].map((m, i) => (
                <div key={i} className="flex-1 px-5 py-4 border-r border-white/[0.06] last:border-0">
                  <div className="font-mono text-[9px] text-white/20 mb-1 tracking-widest">{m.label}</div>
                  <div className="font-mono text-2xl font-bold text-white">{m.val}</div>
                  <div className="font-mono text-[9px] text-[#7c93c3]/50 mt-0.5">{m.sub}</div>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
              className="flex flex-col sm:flex-row gap-3">
              <motion.button
                onClick={() => navigate("/ambassador-apply")}
                whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(124,147,195,0.3)" }}
                whileTap={{ scale: 0.97 }}
                className="relative group flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-mono text-sm font-bold text-[#09090b] overflow-hidden"
                style={{ background: "linear-gradient(135deg,#7c93c3,#a8b8d8)" }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "linear-gradient(135deg,#a8b8d8,#7c93c3)" }} />
                <span className="relative z-10 flex items-center gap-2"><Cpu size={13} /> APPLY NOW <ChevronRight size={13} /></span>
              </motion.button>
              <motion.button
                onClick={() => navigate("/ambassador-portal")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-mono text-sm font-semibold text-[#7c93c3] border border-[#7c93c3]/25 hover:bg-[#7c93c3]/5 hover:border-[#7c93c3]/40 transition-all">
                <Terminal size={13} /> ACCESS PORTAL
              </motion.button>
            </motion.div>
          </div>

          {/* Right: terminal */}
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="relative">
            {/* Floating cards */}
            <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-5 -right-4 z-20 bg-[#0c0c10] border border-[#7c93c3]/20 rounded-lg px-4 py-3 shadow-xl">
              <div className="font-mono text-[9px] text-white/25 mb-1">REWARD_ALLOCATION</div>
              <div className="font-mono text-base font-bold text-[#7c93c3]">$100,000 ARX</div>
            </motion.div>
            <motion.div animate={{ y: [4, -4, 4] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 z-20 bg-[#0c0c10] border border-emerald-400/20 rounded-lg px-4 py-3 shadow-xl flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <div className="font-mono text-[9px] text-white font-semibold">CAMPAIGN STATUS</div>
                <div className="font-mono text-[9px] text-emerald-400">ACCEPTING APPLICATIONS</div>
              </div>
            </motion.div>

            {/* Terminal panel */}
            <div className="relative bg-[#0a0a0d] border border-[#7c93c3]/15 rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#7c93c3]/10 bg-[#7c93c3]/[0.02]">
                <div className="flex gap-1.5">
                  {["bg-white/8","bg-white/8","bg-white/8"].map((c,i) => <div key={i} className={`w-2.5 h-2.5 rounded-full ${c}`} />)}
                </div>
                <span className="font-mono text-[9px] text-white/25 ml-2">arxon://ambassador Challenge.sh</span>
                <div className="flex-1" />
                <Activity size={9} className="text-[#7c93c3]/40 animate-pulse" />
              </div>
              <div className="p-5 space-y-1 min-h-[310px]">
                <TypeLine text="$ ./init --protocol ambassador --network arxon" delay={0.3} color="text-white/50" />
                <TypeLine text="  ↳ Bootstrapping reward allocation module..." delay={0.9} />
                <TypeLine text="  ↳ Verifying ARX TGE contract binding..." delay={1.5} />
                <TypeLine text="  ↳ Loading node eligibility criteria..." delay={2.1} />
                <TypeLine text="" delay={2.6} />
                <TypeLine text="[PASS] POOL SIZE          = 100,000 ARX" delay={2.9} color="text-emerald-400/60" />
                <TypeLine text="[PASS] CAMPAIGN DURATION  = 30 DAYS" delay={3.3} color="text-emerald-400/60" />
                <TypeLine text="[PASS] SELECTION MODE     = QUALITY FIRST" delay={4.1} color="text-emerald-400/60" />
                <TypeLine text="[PASS] CHAIN              = ARXONCHAIN" delay={4.5} color="text-emerald-400/60" />
                <TypeLine text="" delay={4.9} />
                <TypeLine text="[INFO] Min requirements: 8 posts + 100 referrals" delay={5.2} />
                <TypeLine text="[INFO] Video content earns priority scoring" delay={5.6} />
                <TypeLine text="" delay={6.0} />
                <TypeLine text="$ ready. awaiting applications_" delay={6.3} color="text-[#7c93c3]/80" />
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none overflow-hidden">
                <Grid size={8} opacity={0.05} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════
   BENEFITS / INFRASTRUCTURE MODULES
═══════════════════════════════════════════════ */
const modules = [
  {
    id: "MOD-001", icon: TrendingUp, label: "REWARD_NODE",
    title: "ARX Reward Pool",
    spec: "$100,000 · TGE-linked · 12mo vest",
    desc: "Top performing ambassadors earn proportional allocations from the $100K ARX pool. Distributed at TGE.",
    tags: ["ARX_TOKEN","TGE_LINKED","QUALITY_SCORED"],
    status: "green" as const,
  },
  {
    id: "MOD-002", icon: Shield, label: "CREDENTIAL_NODE",
    title: "Official Ambassador Badge",
    spec: "Verified status · Early access · Core comms",
    desc: "Earn verified Arxon Ambassador credentials. Unlocks early access to feature previews, protocol updates, and direct dev communication channels.",
    tags: ["VERIFIED","EARLY_ACCESS","CORE_COMMS","PRIVILEGED"],
    status: "blue" as const,
  },
  {
    id: "MOD-003", icon: Network, label: "NETWORK_ACCESS",
    title: "Network Layer Access",
    spec: "Private channels · Exclusive events · VIP privileges",
    desc: "Private collaboration channels, exclusive ambassador-only events, and embedded network-level privileges unavailable to standard users.",
    tags: ["PRIVATE_CHANNELS","EXCLUSIVE_EVENTS","NETWORK_PRIV","VIP_TIER"],
    status: "blue" as const,
  },
];

const BenefitsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} className="py-24 px-6 relative bg-[#09090b]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7c93c3]/10 to-transparent" />
      <Grid size={80} opacity={0.018} />
      <div className="max-w-[1120px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#7c93c3]/40" />
            <span className="font-mono text-[9px] text-[#7c93c3]/50 tracking-widest uppercase">Campaign modules.config</span>
          </div>
          <h2 className="text-[clamp(28px,4vw,40px)] font-bold text-white mb-2">
            What You <span className="text-[#7c93c3]">Deploy Into</span>
          </h2>
          <p className="font-mono text-xs text-white/25">3 modules initialized · awaiting ambassador allocation</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {modules.map((m, i) => (
            <motion.div key={m.id}
              initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }}
              className="group relative bg-[#0a0a0d] border border-white/[0.06] rounded-xl overflow-hidden hover:border-[#7c93c3]/30 transition-all duration-500">
              {/* Header bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04] bg-white/[0.01]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-white/20">{m.id}</span>
                  <span className="font-mono text-[9px] text-[#7c93c3]/35 tracking-widest">/{m.label}</span>
                </div>
                <Pill label="ACTIVE" variant={m.status} />
              </div>

              <div className="p-5">
                <motion.div whileHover={{ scale: 1.08, rotate: 4 }}
                  className="w-10 h-10 rounded-lg bg-[#7c93c3]/8 border border-[#7c93c3]/15 flex items-center justify-center mb-5 group-hover:bg-[#7c93c3]/14 transition-colors">
                  <m.icon size={17} className="text-[#7c93c3]" />
                </motion.div>
                <h3 className="text-white font-bold text-[17px] mb-1">{m.title}</h3>
                <p className="font-mono text-[9px] text-[#7c93c3]/55 mb-3 tracking-wide">{m.spec}</p>
                <p className="text-white/45 text-sm leading-relaxed mb-5">{m.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {m.tags.map(t => (
                    <span key={t} className="font-mono text-[8px] text-white/20 bg-white/[0.025] border border-white/[0.05] px-2 py-1 rounded tracking-wider">{t}</span>
                  ))}
                </div>
              </div>
              {/* Hover grid glow corner */}
              <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                <Grid size={8} opacity={0.08} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════
   PROTOCOL / HOW IT WORKS
═══════════════════════════════════════════════ */
const steps = [
  { seq: "01", cmd: "PARTICIPATE IN MINING", title: "Create Arxon Mining Account", desc: "Initialize your identity at arxonchain.xyz. Your mining account ID becomes your ambassador credential and referral tracking key.", params: ["NETWORK=ARXON","ACCOUNT TYPE=MINING"] },
  { seq: "02", cmd: "SUBMIT APPLICATION", title: "Fill Your Application Form", desc: "Submit the ambassador form with your X handle, follower count, and links to your existing crypto content for initial vetting.", params: ["REQUIRED=TRUE","FORMAT=STRUCTURED","REVIEW=24-48H"] },
  { seq: "03", cmd: "PARTICIPATE IN THE 30D CHALLENGE", title: "Execute the 30-Day Ambassador Challenge", desc: "Post quality content, host Spaces, drive referrals, and tag #ArxonAmbassador. Every action builds your scoring index.", params: ["DURATION=30 DAYS","MODE=QUALITY FIRST","TAG=#ArxonAmbassador"] },
  { seq: "04", cmd: "PUSH DELIVERABLES", title: "Submit Your Best Work", desc: "Access your personal portal and push up to 8 top-performing content pieces to the evaluation queue.", params: ["MAX_ITEMS=8","PORTAL_REQUIRED=TRUE","DEADLINE=END_OF_CAMPAIGN"] },
  { seq: "05", cmd: "CLAIM ALLOCATION", title: "Selection & Reward Allocation", desc: "Top performers are minted as official Arxon Ambassadors. ARX allocations distribute at TGE.", params: ["TOKEN=ARX","TRIGGER=TGE EVENT"] },
];

const requirements = [
  { icon: MessageSquare, cmd: "POST CONTENT", req: "Minimum 8 quality tweets/threads about Arxon", type: "REQUIRED" },
  { icon: Users, cmd: "HOST SPACES", req: "2+ Twitter Spaces co-hosted with @ARXONarx", type: "REQUIRED" },
  { icon: Globe, cmd: "DRIVE REFERRALS", req: "100+ verified new users via your referral link", type: "REQUIRED" },
  { icon: Hash, cmd: "TAG PROTOCOL", req: "#ArxonAmbassador on all content + @ARXONarx mentions", type: "REQUIRED" },
  { icon: Video, cmd: "CREATE VIDEO", req: "1-2 video pieces, unlocks priority scoring weight", type: "BONUS" },
];

const ProtocolSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [active, setActive] = useState(0);

  return (
    <section ref={ref} id="how-it-works" className="py-24 px-6 relative bg-[#080810]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7c93c3]/12 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#7c93c3]/12 to-transparent" />
      <Grid size={80} opacity={0.015} />

      <div className="max-w-[1120px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#7c93c3]/40" />
            <span className="font-mono text-[9px] text-[#7c93c3]/50 tracking-widest uppercase">Campaign.execution</span>
          </div>
          <h2 className="text-[clamp(28px,4vw,40px)] font-bold text-white mb-2">
            Campaign <span className="text-[#7c93c3]">Execution</span>
          </h2>
          <p className="font-mono text-xs text-white/25">5 sequential operations · all required for selection eligibility</p>
        </motion.div>

        {/* Steps + detail */}
        <div className="grid lg:grid-cols-[360px_1fr] gap-5 mb-16">
          <div className="space-y-2">
            {steps.map((s, i) => (
              <motion.div key={s.seq}
                initial={{ opacity: 0, x: -16 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: i * 0.08 }}
                onClick={() => setActive(i)}
                className={`group cursor-pointer relative rounded-xl p-4 border transition-all duration-300 ${active === i ? "border-[#7c93c3]/35 bg-[#7c93c3]/[0.04]" : "border-white/[0.05] hover:border-[#7c93c3]/18 bg-white/[0.01]"}`}>
                <div className="flex items-start gap-3">
                  <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-colors ${active === i ? "bg-[#7c93c3]/20 text-[#7c93c3]" : "bg-white/[0.04] text-white/25"}`}>{s.seq}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[9px] text-white/20 mb-0.5">{s.cmd}</div>
                    <h3 className={`text-sm font-semibold transition-colors ${active === i ? "text-white" : "text-white/55 group-hover:text-white/75"}`}>{s.title}</h3>
                  </div>
                  <ChevronRight size={12} className={`shrink-0 mt-1.5 transition-all ${active === i ? "text-[#7c93c3]" : "text-white/15"}`} />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="relative bg-[#0a0a0d] border border-[#7c93c3]/18 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-[#7c93c3]/10 bg-[#7c93c3]/[0.015]">
              <Terminal size={11} className="text-[#7c93c3]/40" />
              <span className="font-mono text-[9px] text-white/25">STEP_{steps[active].seq}.detail</span>
              <div className="flex-1" />
              <div className="font-mono text-[9px] text-white/15">{active + 1} / {steps.length}</div>
            </div>
            <div className="p-7">
              <p className="font-mono text-xs text-[#7c93c3]/50 mb-4">$ execute {steps[active].cmd}</p>
              <h3 className="text-white font-bold text-xl mb-4">{steps[active].title}</h3>
              <p className="text-white/50 leading-relaxed mb-7">{steps[active].desc}</p>
              <div className="space-y-2 p-4 bg-white/[0.02] rounded-lg border border-white/[0.04]">
                {steps[active].params.map(p => (
                  <div key={p} className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="text-[#7c93c3]/35">──</span>
                    <span className="text-white/35">{p}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-28 h-28 pointer-events-none overflow-hidden"><Grid size={8} opacity={0.04} /></div>
          </motion.div>
        </div>

        {/* Requirements table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }}>
          <div className="flex items-center gap-3 mb-5">
            <span className="font-mono text-[10px] text-white/25 tracking-widest">MINIMUM_REQUIREMENTS</span>
            <div className="flex-1 h-px bg-white/[0.05]" />
            <span className="font-mono text-[9px] text-white/15">5 OPERATIONS · {requirements.filter(r => r.type === "REQUIRED").length} REQUIRED</span>
          </div>
          <div className="bg-[#0a0a0d] border border-white/[0.05] rounded-xl overflow-hidden">
            <div className="grid grid-cols-[40px_80px_1fr_72px] gap-4 px-5 py-2.5 border-b border-white/[0.04] bg-white/[0.01]">
              {["#","OP_CODE","REQUIREMENT","TYPE"].map(h => (
                <span key={h} className="font-mono text-[8px] text-white/20 tracking-widest">{h}</span>
              ))}
            </div>
            {requirements.map((r, i) => (
              <motion.div key={i}
                initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 + i * 0.06 }}
                className="grid grid-cols-[40px_80px_1fr_72px] gap-4 px-5 py-3.5 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.01] transition-colors group items-center">
                <span className="font-mono text-[9px] text-white/15">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#7c93c3]/8 border border-[#7c93c3]/12 flex items-center justify-center group-hover:bg-[#7c93c3]/14 transition-colors">
                    <r.icon size={11} className="text-[#7c93c3]/60" />
                  </div>
                  <span className="font-mono text-[8px] text-white/18 hidden sm:block">{r.cmd}</span>
                </div>
                <span className="text-white/55 text-sm">{r.req}</span>
                <span className={`font-mono text-[8px] px-2 py-1 rounded border text-center ${r.type === "REQUIRED" ? "text-emerald-400/70 bg-emerald-400/8 border-emerald-400/15" : "text-amber-400/70 bg-amber-400/8 border-amber-400/15"}`}>{r.type}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-3 px-5 py-4 bg-[#7c93c3]/[0.03] border border-[#7c93c3]/12 rounded-xl">
            <AlertCircle size={13} className="text-[#7c93c3]/60 shrink-0 mt-0.5" />
            <p className="font-mono text-[10px] text-white/35 leading-relaxed">
              <span className="text-[#7c93c3]/60">NOTICE:</span> Rewards vest at TGE over 12 months. Selected ambassadors continue promotion through TGE. Quality and genuine engagement are prioritized over raw follower metrics.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════
   CTA
═══════════════════════════════════════════════ */
const CTASection = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} className="py-24 px-6 relative bg-[#09090b]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7c93c3]/10 to-transparent" />
      <div className="max-w-[900px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          className="relative bg-[#0a0a0d] border border-[#7c93c3]/20 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <CircuitBackground />
            <Grid size={48} opacity={0.025} />
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center,rgba(124,147,195,0.06) 0%,transparent 65%)" }} />
          </div>
          <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />

          <div className="relative z-10 px-8 md:px-16 py-14 text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12 bg-[#7c93c3]/25" />
              <span className="font-mono text-[9px] text-[#7c93c3]/45 tracking-widest">READY_TO_DEPLOY</span>
              <div className="h-px w-12 bg-[#7c93c3]/25" />
            </div>
            <h2 className="text-[clamp(28px,4vw,44px)] font-bold text-white mb-4 leading-tight">
              Initialize Your<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#7c93c3,#a8b8d8)" }}>
                Ambassador Node
              </span>
            </h2>
            <p className="font-mono text-xs text-white/35 mb-10 max-w-md mx-auto leading-relaxed">
              30 days · quality over quantity · $100K ARX pool for top performers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => navigate("/ambassador-apply")}
                whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(124,147,195,0.28)" }}
                whileTap={{ scale: 0.97 }}
                className="relative group flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-mono text-sm font-bold text-[#09090b] overflow-hidden"
                style={{ background: "linear-gradient(135deg,#7c93c3,#a8b8d8)" }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "linear-gradient(135deg,#a8b8d8,#7c93c3)" }} />
                <span className="relative z-10 flex items-center gap-2"><Cpu size={15} /> APPLY NOW <ArrowRight size={15} /></span>
              </motion.button>
              <motion.button
                onClick={() => navigate("/ambassador-portal")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-mono text-sm font-semibold text-[#7c93c3] border border-[#7c93c3]/28 hover:bg-[#7c93c3]/5 hover:border-[#7c93c3]/45 transition-all">
                <Terminal size={15} /> ACCESS PORTAL
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════ */
const Ambassadors = () => (
  <div className="min-h-screen bg-[#09090b] overflow-hidden">
    <Navbar />
    <Hero />
    <BenefitsSection />
    <ProtocolSection />
    <CTASection />
    <Footer />
  </div>
);

export default Ambassadors;
