import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import arxonHeaderText from "@/assets/arxon-header-text.svg";
import EarthPrivacyVisual from "@/components/EarthPrivacyVisual";
import { Terminal, Radio, Activity } from "lucide-react";

const Grid = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.022]" style={{
    backgroundImage: "linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)",
    backgroundSize: "64px 64px",
  }} />
);

const Scanline = () => (
  <motion.div className="absolute inset-x-0 h-px pointer-events-none z-10"
    style={{ background: "linear-gradient(90deg,transparent,rgba(124,147,195,0.1),transparent)" }}
    animate={{ top: ["0%", "100%"] }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} />
);

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    let W = 0, H = 0, raf: number;
    type N = { x: number; y: number; p: number; s: number };
    const nodes: N[] = [];
    const resize = () => {
      W = c.width = c.offsetWidth; H = c.height = c.offsetHeight;
      nodes.length = 0;
      for (let i = 0; i < 45; i++) nodes.push({ x: Math.random()*W, y: Math.random()*H, p: Math.random()*Math.PI*2, s: 0.006+Math.random()*0.008 });
    };
    resize(); window.addEventListener("resize", resize);
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      nodes.forEach(n => { n.x+=(Math.random()-.5)*.15; n.y+=(Math.random()-.5)*.15; n.p+=n.s; n.x=Math.max(0,Math.min(W,n.x)); n.y=Math.max(0,Math.min(H,n.y)); });
      for (let i=0;i<nodes.length;i++) for (let j=i+1;j<nodes.length;j++) {
        const d=Math.hypot(nodes[i].x-nodes[j].x,nodes[i].y-nodes[j].y);
        if (d<150) { ctx.beginPath();ctx.moveTo(nodes[i].x,nodes[i].y);ctx.lineTo(nodes[j].x,nodes[j].y);ctx.strokeStyle=`rgba(124,147,195,${(1-d/150)*.055})`;ctx.lineWidth=.5;ctx.stroke(); }
      }
      nodes.forEach(n => { const p=Math.sin(n.p)*.5+.5; ctx.beginPath();ctx.arc(n.x,n.y,1.5+p,0,Math.PI*2);ctx.fillStyle=`rgba(124,147,195,${.12+p*.2})`;ctx.fill(); });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <section className="relative min-h-[88vh] bg-[#09090b] overflow-hidden flex items-center">
      <div className="absolute inset-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
        <Scanline />
        <Grid />
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/60 via-transparent to-[#09090b]" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(124,147,195,0.055) 0%,transparent 65%)" }} />
        {/* Circuit traces */}
        <svg className="absolute top-20 left-0 w-40 h-40 opacity-[0.15] pointer-events-none" viewBox="0 0 160 160" fill="none">
          <path d="M0 10h20l8 8h36" stroke="#a8c3f0" strokeWidth="0.5"/>
          <path d="M0 26h10l8 8h28" stroke="#a8c3f0" strokeWidth="0.5"/>
          <path d="M10 0v20l8 8v36" stroke="#a8c3f0" strokeWidth="0.5"/>
          <rect x="60" y="14" width="5" height="5" stroke="#a8c3f0" strokeWidth="0.5"/>
          <rect x="30" y="12" width="3" height="3" fill="rgba(124,147,195,0.3)"/>
        </svg>
        <svg className="absolute top-20 right-0 w-40 h-40 opacity-[0.15] pointer-events-none" viewBox="0 0 160 160" fill="none">
          <path d="M160 10h-20l-8 8h-36" stroke="#a8c3f0" strokeWidth="0.5"/>
          <path d="M160 26h-10l-8 8h-28" stroke="#a8c3f0" strokeWidth="0.5"/>
          <path d="M150 0v20l-8 8v36" stroke="#a8c3f0" strokeWidth="0.5"/>
        </svg>
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 w-full pt-28 pb-20 md:pt-36 md:pb-28 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="flex-1">
          {/* System path */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-6">
            <Terminal size={9} className="text-[#a8c3f0]/40" />
            <span className="font-mono text-[9px] text-white/60 tracking-widest">ARXONCHAIN / PRIVACY PROTOCOL</span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#a8c3f0]/15 to-transparent max-w-[120px]" />
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-400/20 bg-emerald-400/8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[9px] text-emerald-400/80 tracking-wider">LIVE</span>
            </span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-4">
            <img src={arxonHeaderText} alt="ARXON" className="h-14 md:h-20 lg:h-24" />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25,0.1,0.25,1], delay: 0.15 }}
            className="text-[clamp(40px,7vw,88px)] leading-[1.02] tracking-[-0.04em] text-white font-extralight max-w-[800px]">
            Privacy chain<br />
            <span className="font-bold text-[#7D93C4]">for the people</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-white/60 text-base md:text-[17px] leading-relaxed max-w-[440px]">
            The future of private, fast, and secure transactions. Deliver payments with complete privacy at scale.
          </motion.p>

          {/* Metric strip */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="mt-10 flex items-center gap-6">
            {[
              { val: "<$0.01", label: "Per TX" },
              { val: "Instant", label: "Finality" },
              { val: "ZK-SNARKs", label: "Privacy" },
            ].map((m, i) => (
              <div key={i} className="flex flex-col">
                <span className="font-mono text-base font-bold text-white">{m.val}</span>
                <span className="font-mono text-[9px] text-white/65 tracking-widest">{m.label}</span>
              </div>
            ))}
            <div className="h-8 w-px bg-white/[0.06]" />
            <div className="flex items-center gap-1.5">
              <Activity size={10} className="text-[#a8c3f0]/50 animate-pulse" />
              <span className="font-mono text-[9px] text-white/65">NETWORK ACTIVE</span>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }} className="flex-shrink-0 relative">
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full pointer-events-none"
            style={{ boxShadow: "0 0 80px rgba(124,147,195,0.08)" }} />
          <EarthPrivacyVisual />
        </motion.div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#09090b] to-transparent" />
    </section>
  );
};

export default Hero;
