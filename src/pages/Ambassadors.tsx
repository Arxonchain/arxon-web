import { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import {
  Terminal, Cpu, Network, Shield, ChevronRight,
  Activity, Radio, Hash,
  Users, Globe, Video, MessageSquare, Award, ArrowRight,
  TrendingUp, AlertCircle, Clock, Unlock, Lock, Twitter
} from "lucide-react";

const LAUNCH_UTC = Date.UTC(2026, 5, 15, 14, 0, 0);

function useCountdown() {
  // PREVIEW MODE: buttons always visible for development
  // Restore original calc() before going live to production
  return { total: 0, hours: 0, minutes: 0, seconds: 0, launched: true };
}

const DigitBlock = ({ value, label }: { value: number; label: string }) => {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="relative w-[96px] h-[84px] bg-[#090910] border border-[#a8c3f0]/20 rounded-xl overflow-hidden flex items-center justify-center"
        style={{ boxShadow: "0 0 30px rgba(168,195,240,0.07), inset 0 1px 0 rgba(168,195,240,0.07)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(168,195,240,0.012) 3px,rgba(168,195,240,0.012) 4px)" }} />
        <div className="absolute left-0 right-0 top-1/2 h-px bg-[#a8c3f0]/8" />
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#a8c3f0]/35 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#a8c3f0]/35 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#a8c3f0]/35 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#a8c3f0]/35 rounded-br-xl" />
        <AnimatePresence mode="wait">
          <motion.span key={display}
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="font-mono text-[42px] font-bold text-white relative z-10 tabular-nums leading-none"
            style={{ textShadow: "0 0 24px rgba(168,195,240,0.5)" }}>
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="font-mono text-[9px] tracking-[0.2em] text-[#a8c3f0]/55 uppercase">{label}</span>
    </div>
  );
};

const Sep = () => (
  <div className="flex flex-col gap-3 pb-7">
    <div className="w-1.5 h-1.5 rounded-full bg-[#a8c3f0]/40" style={{ boxShadow: "0 0 8px rgba(168,195,240,0.7)" }} />
    <div className="w-1.5 h-1.5 rounded-full bg-[#a8c3f0]/40" style={{ boxShadow: "0 0 8px rgba(168,195,240,0.7)" }} />
  </div>
);

const CircuitBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let W = 0, H = 0, raf: number;
    type Node = { x: number; y: number; pulse: number; speed: number };
    const nodes: Node[] = [];
    const resize = () => {
      W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight;
      nodes.length = 0;
      for (let i = 0; i < 50; i++) nodes.push({ x: Math.random() * W, y: Math.random() * H, pulse: Math.random() * Math.PI * 2, speed: 0.008 + Math.random() * 0.008 });
    };
    resize(); window.addEventListener("resize", resize);
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      nodes.forEach(n => { n.x += (Math.random() - 0.5) * 0.15; n.y += (Math.random() - 0.5) * 0.15; n.x = Math.max(0, Math.min(W, n.x)); n.y = Math.max(0, Math.min(H, n.y)); n.pulse += n.speed; });
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
        if (d < 140) { const a = (1 - d / 140) * 0.06; ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.strokeStyle = `rgba(124,147,195,${a})`; ctx.lineWidth = 0.5; ctx.stroke(); }
      }
      nodes.forEach(n => { const p = Math.sin(n.pulse) * 0.5 + 0.5; ctx.beginPath(); ctx.arc(n.x, n.y, 1.5 + p, 0, Math.PI * 2); ctx.fillStyle = `rgba(124,147,195,${0.15 + p * 0.25})`; ctx.fill(); });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

const Scanline = () => (
  <motion.div className="absolute inset-x-0 h-px pointer-events-none z-10"
    style={{ background: "linear-gradient(90deg,transparent,rgba(124,147,195,0.12),transparent)" }}
    animate={{ top: ["0%", "100%"] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
);

const TypeLine = ({ text, delay = 0, color = "text-[#a8c3f0]/60" }: { text: string; delay?: number; color?: string }) => {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), delay * 1000); return () => clearTimeout(t); }, []);
  if (!show) return null;
  return <motion.p initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className={`font-mono text-[11px] leading-relaxed ${color}`}>{text}</motion.p>;
};

const Pill = ({ label, variant = "blue" }: { label: string; variant?: "blue" | "green" | "amber" }) => {
  const v = { blue: "text-[#a8c3f0] bg-[#a8c3f0]/8 border-[#a8c3f0]/20", green: "text-emerald-400 bg-emerald-400/8 border-emerald-400/20", amber: "text-amber-400 bg-amber-400/8 border-amber-400/20" }[variant];
  const dot = { blue: "bg-[#a8c3f0]", green: "bg-emerald-400", amber: "bg-amber-400" }[variant];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border font-mono text-[10px] font-semibold tracking-wider ${v}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse`} />{label}
    </span>
  );
};

const Grid = ({ size = 60, opacity = 0.025 }) => (
  <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)`, backgroundSize: `${size}px ${size}px`, opacity }} />
);

const Corner = ({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) => {
  const cls = { tl: "top-0 left-0", tr: "top-0 right-0", bl: "bottom-0 left-0", br: "bottom-0 right-0" }[pos];
  const bord = { tl: "border-t border-l rounded-tl-sm", tr: "border-t border-r rounded-tr-sm", bl: "border-b border-l rounded-bl-sm", br: "border-b border-r rounded-br-sm" }[pos];
  return <div className={`absolute ${cls} w-4 h-4 ${bord} border-[#a8c3f0]/30`} />;
};

const CountdownSection = ({ hours, minutes, seconds }: { hours: number; minutes: number; seconds: number }) => {
  const launchLocal = new Date(LAUNCH_UTC);
  const localTimeStr = launchLocal.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  const localDateStr = launchLocal.toLocaleDateString([], { weekday: "short", month: "long", day: "numeric" });
  const tzLabel = Intl.DateTimeFormat().resolvedOptions().timeZone || "your timezone";
  const totalSecs = hours * 3600 + minutes * 60 + seconds;
  const progress = Math.max(0, Math.min(100, (1 - totalSecs / (72 * 3600)) * 100));
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
      className="relative bg-[#09090e]/90 border border-[#a8c3f0]/18 rounded-2xl overflow-hidden backdrop-blur-sm"
      style={{ boxShadow: "0 0 80px rgba(168,195,240,0.06)" }}>
      <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />
      <div className="flex items-center gap-2.5 px-6 py-3.5 border-b border-[#a8c3f0]/10 bg-[#a8c3f0]/[0.03]">
        <Lock size={10} className="text-[#a8c3f0]/70" />
        <span className="font-mono text-[9px] text-[#a8c3f0]/70 tracking-widest">AMBASSADOR_PROGRAM · APPLICATIONS_LOCKED</span>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-mono text-[9px] text-amber-400/80 tracking-wider">OPENING JUNE 15 · 14:00 UTC</span>
        </div>
      </div>
      <div className="px-6 md:px-10 py-10">
        <div className="text-center mb-8">
          <p className="font-mono text-[10px] text-[#a8c3f0]/55 tracking-[0.25em] mb-3 uppercase">Applications Open In</p>
          <p className="text-white/40 text-xs font-mono">
            <Clock size={10} className="inline mr-1.5 text-[#a8c3f0]/50" />
            That's <span className="text-[#a8c3f0]/75 font-semibold">{localTimeStr} · {localDateStr}</span> in your local time
            <span className="text-white/25 ml-1">({tzLabel})</span>
          </p>
        </div>
        <div className="flex items-end justify-center gap-4 mb-10">
          <DigitBlock value={hours} label="Hours" />
          <Sep />
          <DigitBlock value={minutes} label="Minutes" />
          <Sep />
          <DigitBlock value={seconds} label="Seconds" />
        </div>
        <div className="relative h-[3px] bg-white/[0.05] rounded-full overflow-hidden mb-3 mx-auto max-w-[480px]">
          <motion.div className="absolute left-0 top-0 h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#7c93c3,#a8c3f0,#c8d8f8)", width: `${progress}%` }} />
        </div>
        <div className="flex justify-between font-mono text-[9px] text-white/20 max-w-[480px] mx-auto mb-6">
          <span>NOW</span><span>JUNE 15 · 14:00 UTC</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 border-t border-[#a8c3f0]/8">
          <div className="flex items-center gap-2">
            <AlertCircle size={10} className="text-[#a8c3f0]/35" />
            <p className="font-mono text-[9px] text-white/30">The countdown is universal — stops for everyone at the same moment.</p>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/[0.06]" />
          <p className="font-mono text-[9px] text-white/20">Apply & portal buttons appear automatically.</p>
        </div>
      </div>
    </motion.div>
  );
};

/* ════ HERO ════ */
const Hero = ({ countdown }: { countdown: ReturnType<typeof useCountdown> }) => {
  const navigate = useNavigate();
  const [ts, setTs] = useState("");
  useEffect(() => {
    const iv = setInterval(() => setTs(new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC"), 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-[#09090b]">
        <CircuitBackground /><Scanline />
        <Grid size={64} opacity={0.022} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(124,147,195,0.055) 0%,transparent 65%)" }} />
        <svg className="absolute top-20 left-0 w-48 h-48 opacity-20 pointer-events-none" viewBox="0 0 192 192" fill="none">
          <path d="M0 8h24l8 8h40" stroke="#a8c3f0" strokeWidth="0.5"/><path d="M0 24h12l8 8h32" stroke="#a8c3f0" strokeWidth="0.5"/>
          <path d="M8 0v24l8 8v40" stroke="#a8c3f0" strokeWidth="0.5"/><rect x="68" y="12" width="6" height="6" stroke="#a8c3f0" strokeWidth="0.5"/>
        </svg>
        <svg className="absolute top-20 right-0 w-48 h-48 opacity-20 pointer-events-none" viewBox="0 0 192 192" fill="none">
          <path d="M192 8h-24l-8 8h-40" stroke="#a8c3f0" strokeWidth="0.5"/><path d="M192 24h-12l-8 8h-32" stroke="#a8c3f0" strokeWidth="0.5"/>
          <path d="M184 0v24l-8 8v40" stroke="#a8c3f0" strokeWidth="0.5"/><rect x="118" y="12" width="6" height="6" stroke="#a8c3f0" strokeWidth="0.5"/>
        </svg>
      </div>
      <div className="relative z-10 max-w-[1120px] mx-auto px-6 pt-28 pb-20 w-full">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mb-12">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/60">
            <Terminal size={10} className="text-[#a8c3f0]/40" />
            <span>ARXON</span><span className="text-[#a8c3f0]/25">/</span><span>PRIVACY PROTOCOL</span><span className="text-[#a8c3f0]/25">/</span>
            <span className="text-[#a8c3f0]/50">AMBASSADOR CAMPAIGN</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-[#a8c3f0]/15 to-transparent" />
          <span className="font-mono text-[9px] text-white/55">{ts}</span>
          <Pill label="LIVE" variant="green" />
        </motion.div>
        <div className="grid lg:grid-cols-[1fr_440px] gap-12 items-start">
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#a8c3f0]/20 bg-[#a8c3f0]/5 rounded font-mono text-[9px] text-[#a8c3f0]/80 tracking-widest uppercase mb-6">
              <Radio size={8} className="animate-pulse" />
              CAMPAIGN v1.0 · 30-Day Ambassador Campaign · $100K ARX Allocation
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="text-[clamp(38px,5.5vw,68px)] font-bold leading-[1.04] tracking-tight text-white mb-6">
              Arxon<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#a8c3f0,#a8b8d8 50%,#a8c3f0)" }}>Ambassador Program</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
              className="text-white/65 text-[15px] leading-relaxed max-w-[500px] mb-10">
              Get deployed as Arxon Blockchain representative in your country and community. 30 days of verified output. Quality over vanity metrics. Share the $100,000 ARX reward pool at TGE.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="relative flex gap-0 mb-10 rounded-xl overflow-hidden border border-white/[0.07] bg-white/[0.03]">
              <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />
              {[{ label: "REWARD POOL", val: "$100K", sub: "ARX Token" }, { label: "DURATION", val: "30D", sub: "Challenge" }].map((m, i) => (
                <div key={i} className="flex-1 px-5 py-4 border-r border-white/[0.10] last:border-0">
                  <div className="font-mono text-[9px] text-white/60 mb-1 tracking-widest">{m.label}</div>
                  <div className="font-mono text-2xl font-bold text-white">{m.val}</div>
                  <div className="font-mono text-[9px] text-[#a8c3f0]/50 mt-0.5">{m.sub}</div>
                </div>
              ))}
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3">
              <motion.button onClick={() => navigate("/ambassador-portal")}
                whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(124,147,195,0.3)" }} whileTap={{ scale: 0.97 }}
                className="relative group flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-mono text-sm font-bold text-[#09090b] overflow-hidden"
                style={{ background: "linear-gradient(135deg,#a8c3f0,#a8b8d8)" }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "linear-gradient(135deg,#a8b8d8,#a8c3f0)" }} />
                <span className="relative z-10 flex items-center gap-2"><Terminal size={13} /> ACCESS PORTAL <ChevronRight size={13} /></span>
              </motion.button>
            </motion.div>
            <p className="mt-4 font-mono text-[10px] text-amber-400/70 max-w-[500px]">
              Applications are closed. If you already applied, use the portal to check whether you were selected — check back in 5 days if your status is still under review.
            </p>
          </div>
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="relative">
            <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-5 -right-4 z-20 bg-[#0c0c10] border border-[#a8c3f0]/20 rounded-lg px-4 py-3 shadow-xl">
              <div className="font-mono text-[9px] text-white/65 mb-1">REWARD ALLOCATION</div>
              <div className="font-mono text-base font-bold text-[#a8c3f0]">$100,000 ARX</div>
            </motion.div>
            <motion.div animate={{ y: [4, -4, 4] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 z-20 bg-[#0c0c10] border border-emerald-400/20 rounded-lg px-4 py-3 shadow-xl flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <div className="font-mono text-[9px] text-white font-semibold">APPLICATIONS STATUS</div>
                <div className="font-mono text-[9px] text-amber-400">CLOSED · CHECK PORTAL</div>
              </div>
            </motion.div>
            <div className="relative bg-[#0a0a0d] border border-[#a8c3f0]/15 rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#a8c3f0]/10 bg-[#a8c3f0]/[0.02]">
                <div className="flex gap-1.5">{["bg-white/8","bg-white/8","bg-white/8"].map((c,i) => <div key={i} className={`w-2.5 h-2.5 rounded-full ${c}`} />)}</div>
                <span className="font-mono text-[9px] text-white/65 ml-2">arxon://ambassador program.sh</span>
                <div className="flex-1" /><Activity size={9} className="text-[#a8c3f0]/40 animate-pulse" />
              </div>
              <div className="p-5 space-y-1 min-h-[310px]">
                <TypeLine text="$ ./init --protocol ambassador --network arxon" delay={0.3} color="text-white/50" />
                <TypeLine text="  ↳ Bootstrapping reward allocation module..." delay={0.9} />
                <TypeLine text="  ↳ Verifying ARX TGE contract binding..." delay={1.5} />
                <TypeLine text="  ↳ Loading node eligibility criteria..." delay={2.1} />
                <TypeLine text="" delay={2.6} />
                <TypeLine text="[PASS] POOL SIZE          = $100,000 ARX" delay={2.9} color="text-emerald-400/60" />
                <TypeLine text="[PASS] CAMPAIGN DURATION  = 30 DAYS" delay={3.3} color="text-emerald-400/60" />
                <TypeLine text="[PASS] SELECTION MODE     = QUALITY FIRST" delay={4.1} color="text-emerald-400/60" />
                <TypeLine text="[PASS] CHAIN              = ARXON MAINNET" delay={4.5} color="text-emerald-400/60" />
                <TypeLine text="" delay={4.9} />
                <TypeLine text="[INFO] Min requirements: follow + retweet + 8 posts + 40 referrals" delay={5.2} />
                <TypeLine text="[INFO] Video content earns priority scoring" delay={5.6} />
                <TypeLine text="" delay={6.0} />
                <TypeLine text="$ status. applications closed — portal access only_" delay={6.3} color="text-amber-400/70" />
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none overflow-hidden"><Grid size={8} opacity={0.05} /></div>
            </div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 16 }}
          className="mt-10 flex items-center gap-4 px-6 py-4 bg-amber-400/[0.05] border border-amber-400/22 rounded-xl">
          <div className="w-10 h-10 rounded-xl bg-amber-400/12 border border-amber-400/20 flex items-center justify-center shrink-0">
            <Lock size={18} className="text-amber-400" />
          </div>
          <div>
            <div className="text-amber-300 font-semibold text-sm">Applications Are Now Closed</div>
            <div className="text-amber-400/55 font-mono text-[10px] mt-0.5">Existing applicants: access the portal with your Arxon Account ID · check back in 5 days if under review</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ════ BENEFITS ════ */
const modules = [
  { id: "MOD-001", icon: TrendingUp, label: "TOKEN REWARDS", title: "ARX Reward Pool", spec: "$100,000 · TGE-linked", desc: "Top performing ambassadors earn proportional allocations from the $100K ARX pool. Distributed at TGE.", tags: ["ARX TOKEN","TGE LINKED","QUALITY SCORED"], status: "green" as const },
  { id: "MOD-002", icon: Shield, label: "CREDENTIAL REWARDS", title: "Official Ambassador Badge", spec: "Verified status · Early access · Core comms", desc: "Earn verified Arxon Ambassador credentials. Unlocks early access to feature previews, protocol updates, and direct dev communication channels.", tags: ["VERIFIED","EARLY ACCESS","CORE COMMS","PRIVILEGED"], status: "blue" as const },
  { id: "MOD-003", icon: Network, label: "NETWORK ACCESS", title: "Network Layer Access", spec: "Private channels · Exclusive events · VIP privileges", desc: "Private collaboration channels, exclusive ambassador-only events, and embedded network-level privileges unavailable to standard users.", tags: ["PRIVATE CHANNELS","EXCLUSIVE EVENTS","NETWORK PRIV","VIP TIER"], status: "blue" as const },
];

const BenefitsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} className="py-24 px-6 relative bg-[#09090b]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a8c3f0]/10 to-transparent" />
      <Grid size={80} opacity={0.018} />
      <div className="max-w-[1120px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#a8c3f0]/40" />
            <span className="font-mono text-[9px] text-[#a8c3f0]/50 tracking-widest uppercase">Campaign modules.config</span>
          </div>
          <h2 className="text-[clamp(28px,4vw,40px)] font-bold text-white mb-2">What You <span className="text-[#a8c3f0]">Deploy Into</span></h2>
          <p className="font-mono text-xs text-white/65">3 modules initialized · awaiting ambassador allocation</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-4">
          {modules.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }}
              className="group relative bg-[#0a0a0d] border border-white/[0.10] rounded-xl overflow-hidden hover:border-[#a8c3f0]/30 transition-all duration-500">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08] bg-white/[0.03]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-white/60">{m.id}</span>
                  <span className="font-mono text-[9px] text-[#a8c3f0]/35 tracking-widest">/{m.label}</span>
                </div>
                <Pill label="ACTIVE" variant={m.status} />
              </div>
              <div className="p-5">
                <motion.div whileHover={{ scale: 1.08, rotate: 4 }}
                  className="w-10 h-10 rounded-lg bg-[#a8c3f0]/8 border border-[#a8c3f0]/15 flex items-center justify-center mb-5 group-hover:bg-[#a8c3f0]/14 transition-colors">
                  <m.icon size={17} className="text-[#a8c3f0]" />
                </motion.div>
                <h3 className="text-white font-bold text-[17px] mb-1">{m.title}</h3>
                <p className="font-mono text-[9px] text-[#a8c3f0]/55 mb-3 tracking-wide">{m.spec}</p>
                <p className="text-white/65 text-sm leading-relaxed mb-5">{m.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {m.tags.map(t => <span key={t} className="font-mono text-[8px] text-white/60 bg-white/[0.04] border border-white/[0.09] px-2 py-1 rounded tracking-wider">{t}</span>)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ════ PROTOCOL ════ */
const steps = [
  { seq: "01", cmd: "PARTICIPATE IN MINING", title: "Create Arxon Mining Account", desc: "Initialize your identity at arxonchain.xyz. Your mining account ID becomes your ambassador credential and referral tracking key.", params: ["NETWORK=ARXON","ACCOUNT TYPE=MINING"] },
  { seq: "02", cmd: "FOLLOW & RETWEET", title: "Follow Arxon & Retweet Posts", desc: "Follow @arxoninfra on X (Twitter) and retweet the designated Arxon posts. This is verified as part of your application.", params: ["ACCOUNT=@arxoninfra","ACTION=FOLLOW + RETWEET","VERIFIED=TRUE"] },
  { seq: "03", cmd: "SUBMIT APPLICATION", title: "Fill Your Application Form", desc: "Submit the ambassador form with your X handle, follower count, and links to your existing crypto content for initial vetting.", params: ["REQUIRED=TRUE","FORMAT=STRUCTURED","REVIEW=24-48H"] },
  { seq: "04", cmd: "PARTICIPATE IN THE 30D CHALLENGE", title: "Execute the 30-Day Ambassador Challenge", desc: "Post quality content, host Spaces, drive referrals, and tag #ArxonAmbassador. Every action builds your scoring index.", params: ["DURATION=30 DAYS","MODE=QUALITY FIRST","TAG=#ArxonAmbassador"] },
  { seq: "05", cmd: "PUSH DELIVERABLES", title: "Submit Your Best Work", desc: "Access your personal portal and push your top-performing content pieces to the evaluation queue.", params: ["PORTAL REQUIRED=TRUE","DEADLINE=END OF CAMPAIGN"] },
  { seq: "06", cmd: "CLAIM ALLOCATION", title: "Selection & Reward Allocation", desc: "Top performers are selected as official Arxon Ambassadors. ARX allocations distribute at TGE.", params: ["TOKEN=ARX","TRIGGER=TGE_EVENT"] },
];

/* ── UPDATED requirements — follow/retweet is now #1 ── */
const requirements = [
  { icon: Twitter, cmd: "FOLLOW & RETWEET", req: "Follow @arxoninfra on X and retweet the designated Arxon posts in your application", type: "REQUIRED" },
  { icon: MessageSquare, cmd: "POST CONTENT", req: "Minimum 8 quality posts about Arxon (X/Twitter, YouTube, Facebook, Medium, blogs, etc.)", type: "REQUIRED" },
  { icon: Users, cmd: "HOST SPACES", req: "Host/Co-host 2+ Twitter(X) Spaces about Arxon while tagging @arxoninfra", type: "REQUIRED" },
  { icon: Globe, cmd: "DRIVE REFERRALS", req: "Refer minimum of 40 verified new users via your referral link", type: "REQUIRED" },
  { icon: Hash, cmd: "TAG PROTOCOL", req: "#ArxonAmbassador on all content + @arxoninfra mentions", type: "REQUIRED" },
  { icon: Video, cmd: "CREATE VIDEO", req: "1-2 video pieces — unlocks priority scoring weight (bonus)", type: "BONUS" },
];

const ProtocolSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [active, setActive] = useState(0);
  return (
    <section ref={ref} id="how-it-works" className="py-24 px-6 relative bg-[#080810]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a8c3f0]/12 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#a8c3f0]/12 to-transparent" />
      <Grid size={80} opacity={0.015} />
      <div className="max-w-[1120px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#a8c3f0]/40" />
            <span className="font-mono text-[9px] text-[#a8c3f0]/50 tracking-widest uppercase">Campaign.Execution</span>
          </div>
          <h2 className="text-[clamp(28px,4vw,40px)] font-bold text-white mb-2">Campaign <span className="text-[#a8c3f0]">Execution</span></h2>
          <p className="font-mono text-xs text-white/65">6 sequential operations · all required for selection eligibility</p>
        </motion.div>
        <div className="grid lg:grid-cols-[360px_1fr] gap-5 mb-16">
          <div className="space-y-2">
            {steps.map((s, i) => (
              <motion.div key={s.seq} initial={{ opacity: 0, x: -16 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: i * 0.08 }}
                onClick={() => setActive(i)}
                className={`group cursor-pointer relative rounded-xl p-4 border transition-all duration-300 ${active === i ? "border-[#a8c3f0]/35 bg-[#a8c3f0]/[0.04]" : "border-white/[0.09] hover:border-[#a8c3f0]/18 bg-white/[0.03]"}`}>
                <div className="flex items-start gap-3">
                  <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-colors ${active === i ? "bg-[#a8c3f0]/20 text-[#a8c3f0]" : "bg-white/[0.04] text-white/65"}`}>{s.seq}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[9px] text-white/60 mb-0.5">{s.cmd}</div>
                    <h3 className={`text-sm font-semibold transition-colors ${active === i ? "text-white" : "text-white/55 group-hover:text-white/75"}`}>{s.title}</h3>
                  </div>
                  <ChevronRight size={12} className={`shrink-0 mt-1.5 transition-all ${active === i ? "text-[#a8c3f0]" : "text-white/55"}`} />
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="relative bg-[#0a0a0d] border border-[#a8c3f0]/18 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-[#a8c3f0]/10 bg-[#a8c3f0]/[0.015]">
              <Terminal size={11} className="text-[#a8c3f0]/40" />
              <span className="font-mono text-[9px] text-white/65">STEP_{steps[active].seq}.detail</span>
              <div className="flex-1" />
              <div className="font-mono text-[9px] text-white/55">{active + 1} / {steps.length}</div>
            </div>
            <div className="p-7">
              <p className="font-mono text-xs text-[#a8c3f0]/50 mb-4">$ execute {steps[active].cmd}</p>
              <h3 className="text-white font-bold text-xl mb-4">{steps[active].title}</h3>
              <p className="text-white/50 leading-relaxed mb-7">{steps[active].desc}</p>
              <div className="space-y-2 p-4 bg-white/[0.03] rounded-lg border border-white/[0.08]">
                {steps[active].params.map(p => (
                  <div key={p} className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="text-[#a8c3f0]/35">──</span><span className="text-white/55">{p}</span>
                  </div>
                ))}
              </div>
              {active === 1 && (
                <a href="https://x.com/arxoninfra" target="_blank" rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono text-xs font-bold text-white border border-[#a8c3f0]/30 bg-[#a8c3f0]/8 hover:bg-[#a8c3f0]/15 transition-colors">
                  <Twitter size={13} className="text-[#a8c3f0]" /> FOLLOW @arxoninfra ON X
                </a>
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-28 h-28 pointer-events-none overflow-hidden"><Grid size={8} opacity={0.04} /></div>
          </motion.div>
        </div>

        {/* Requirements table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }}>
          <div className="flex items-center gap-3 mb-5">
            <span className="font-mono text-[10px] text-white/65 tracking-widest">MINIMUM REQUIREMENTS</span>
            <div className="flex-1 h-px bg-white/[0.05]" />
            <span className="font-mono text-[9px] text-white/55">{requirements.length} OPERATIONS · {requirements.filter(r => r.type === "REQUIRED").length} REQUIRED</span>
          </div>
          <div className="bg-[#0a0a0d] border border-white/[0.09] rounded-xl overflow-hidden">
            <div className="grid grid-cols-[40px_90px_1fr_72px] gap-4 px-5 py-2.5 border-b border-white/[0.08] bg-white/[0.03]">
              {["#","OP_CODE","REQUIREMENT","TYPE"].map(h => <span key={h} className="font-mono text-[8px] text-white/60 tracking-widest">{h}</span>)}
            </div>
            {requirements.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 + i * 0.06 }}
                className="grid grid-cols-[40px_90px_1fr_72px] gap-4 px-5 py-3.5 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.03] transition-colors group items-center">
                <span className="font-mono text-[9px] text-white/55">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#a8c3f0]/8 border border-[#a8c3f0]/12 flex items-center justify-center group-hover:bg-[#a8c3f0]/14 transition-colors">
                    <r.icon size={11} className="text-[#a8c3f0]/60" />
                  </div>
                  <span className="font-mono text-[8px] text-white/38 hidden sm:block">{r.cmd}</span>
                </div>
                <span className="text-white/55 text-sm">{r.req}</span>
                <span className={`font-mono text-[8px] px-2 py-1 rounded border text-center ${r.type === "REQUIRED" ? "text-emerald-400/70 bg-emerald-400/8 border-emerald-400/15" : "text-amber-400/70 bg-amber-400/8 border-amber-400/15"}`}>{r.type}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-3 px-5 py-4 bg-[#a8c3f0]/[0.03] border border-[#a8c3f0]/12 rounded-xl">
            <AlertCircle size={13} className="text-[#a8c3f0]/60 shrink-0 mt-0.5" />
            <p className="font-mono text-[10px] text-white/55 leading-relaxed">
              <span className="text-[#a8c3f0]/60">NOTICE:</span> Rewards are distributed at TGE. Selected ambassadors continue promotion through TGE. Quality and genuine engagement are prioritized over raw follower metrics. Content accepted from any platform: X/Twitter, YouTube, Facebook, Medium, blogs, etc.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ════ CTA ════ */
const CTASection = ({ countdown }: { countdown: ReturnType<typeof useCountdown> }) => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} className="py-24 px-6 relative bg-[#09090b]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a8c3f0]/10 to-transparent" />
      <div className="max-w-[900px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          className="relative bg-[#0a0a0d] border border-[#a8c3f0]/20 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <CircuitBackground /><Grid size={48} opacity={0.025} />
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center,rgba(124,147,195,0.06) 0%,transparent 65%)" }} />
          </div>
          <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />
          <div className="relative z-10 px-8 md:px-16 py-14 text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12 bg-[#a8c3f0]/25" />
              <span className="font-mono text-[9px] text-[#a8c3f0]/45 tracking-widest">READY TO DEPLOY</span>
              <div className="h-px w-12 bg-[#a8c3f0]/25" />
            </div>
            <h2 className="text-[clamp(28px,4vw,44px)] font-bold text-white mb-4 leading-tight">
              Check Your<br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#a8c3f0,#a8b8d8)" }}>Ambassador Status</span>
            </h2>
            <p className="font-mono text-xs text-white/55 mb-10 max-w-md mx-auto leading-relaxed">
              Applications are closed. If you applied before, enter your Arxon Account ID in the portal to see if you were selected. Still under review? Check back in 5 days.
            </p>
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }} className="flex justify-center">
              <motion.button onClick={() => navigate("/ambassador-portal")}
                whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(124,147,195,0.28)" }} whileTap={{ scale: 0.97 }}
                className="relative group flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-mono text-sm font-bold text-[#09090b] overflow-hidden"
                style={{ background: "linear-gradient(135deg,#a8c3f0,#a8b8d8)" }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "linear-gradient(135deg,#a8b8d8,#a8c3f0)" }} />
                <span className="relative z-10 flex items-center gap-2"><Terminal size={15} /> ACCESS PORTAL <ArrowRight size={15} /></span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Ambassadors = () => {
  const countdown = useCountdown();
  return (
    <div className="min-h-screen bg-[#09090b] overflow-hidden">
      <Navbar />
      <Hero countdown={countdown} />
      <BenefitsSection />
      <ProtocolSection />
      <CTASection countdown={countdown} />
      <Footer />
    </div>
  );
};

export default Ambassadors;
