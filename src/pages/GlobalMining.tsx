import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import Footer from "@/components/Footer";

const COUNTRIES = [
  { flag: "🇨🇦", code: "CA", name: "Canada", x: 16, y: 22, pct: 1.4, color: "#e74c3c" },
  { flag: "🇺🇸", code: "US", name: "United States", x: 18, y: 36, pct: 4.8, color: "#3498db" },
  { flag: "🇧🇷", code: "BR", name: "Brazil", x: 28, y: 70, pct: 1.6, color: "#27ae60" },
  { flag: "🇬🇧", code: "GB", name: "United Kingdom", x: 42, y: 18, pct: 3.0, color: "#c0392b" },
  { flag: "🇩🇪", code: "DE", name: "Germany", x: 48, y: 24, pct: 3.3, color: "#f39c12" },
  { flag: "🇳🇬", code: "NG", name: "Nigeria", x: 43, y: 48, pct: 37.3, color: "#1abc9c" },
  { flag: "🇬🇭", code: "GH", name: "Ghana", x: 38, y: 54, pct: 7.1, color: "#d4a017" },
  { flag: "🇨🇲", code: "CM", name: "Cameroon", x: 45, y: 58, pct: 2.9, color: "#2ecc71" },
  { flag: "🇪🇬", code: "EG", name: "Egypt", x: 53, y: 34, pct: 1.5, color: "#9b59b6" },
  { flag: "🇰🇪", code: "KE", name: "Kenya", x: 56, y: 52, pct: 5.5, color: "#27ae60" },
  { flag: "🇹🇿", code: "TZ", name: "Tanzania", x: 54, y: 60, pct: 2.2, color: "#1abc9c" },
  { flag: "🇿🇦", code: "ZA", name: "South Africa", x: 50, y: 72, pct: 2.7, color: "#f1c40f" },
  { flag: "🇦🇪", code: "AE", name: "UAE", x: 62, y: 38, pct: 1.8, color: "#e74c3c" },
  { flag: "🇵🇰", code: "PK", name: "Pakistan", x: 67, y: 30, pct: 3.2, color: "#27ae60" },
  { flag: "🇮🇳", code: "IN", name: "India", x: 71, y: 44, pct: 12.2, color: "#ff9933" },
  { flag: "🇧🇩", code: "BD", name: "Bangladesh", x: 75, y: 36, pct: 5.2, color: "#1abc9c" },
  { flag: "🇮🇩", code: "ID", name: "Indonesia", x: 79, y: 58, pct: 4.1, color: "#e74c3c" },
  { flag: "🇵🇭", code: "PH", name: "Philippines", x: 84, y: 44, pct: 3.0, color: "#d4a017" },
];

const SORTED = [...COUNTRIES].sort((a, b) => b.pct - a.pct);
const MAX_PCT = SORTED[0].pct;

// Better continent outlines for realistic dot map
const CONTINENTS: number[][][] = [
  // North America
  [[8,8],[8,12],[10,12],[12,10],[14,10],[18,14],[22,14],[26,18],[28,24],[28,32],[26,36],[22,40],[18,42],[14,44],[10,42],[8,38],[6,30],[6,20],[8,8]],
  // Central America
  [[16,42],[18,44],[20,46],[22,48],[24,50],[22,52],[20,50],[18,48],[16,42]],
  // South America
  [[22,52],[24,54],[26,56],[28,58],[30,62],[32,66],[34,70],[34,76],[32,80],[30,84],[28,86],[26,84],[24,80],[22,74],[20,68],[20,62],[20,56],[22,52]],
  // Europe
  [[36,8],[38,10],[40,12],[44,10],[48,12],[52,14],[54,16],[56,18],[54,22],[52,26],[50,28],[48,30],[44,28],[40,26],[38,24],[36,20],[34,16],[36,8]],
  // Africa
  [[36,30],[38,28],[42,28],[46,30],[50,30],[54,32],[56,34],[58,38],[58,44],[58,50],[56,56],[54,62],[52,68],[50,74],[48,78],[44,78],[40,74],[38,68],[36,62],[34,56],[34,50],[34,44],[34,38],[36,30]],
  // Middle East
  [[54,24],[58,22],[62,24],[66,28],[68,32],[66,36],[64,40],[60,42],[56,38],[54,34],[54,24]],
  // India/South Asia
  [[66,28],[70,26],[74,28],[78,30],[80,34],[78,38],[76,42],[74,46],[72,50],[70,48],[68,44],[66,40],[64,36],[66,28]],
  // Southeast Asia
  [[78,36],[82,34],[86,38],[88,42],[86,46],[84,50],[82,54],[80,58],[78,56],[76,52],[76,48],[78,44],[78,36]],
  // Russia/Northern Asia
  [[56,8],[60,6],[66,6],[72,8],[78,10],[84,12],[88,14],[90,18],[88,22],[84,24],[80,22],[76,20],[72,18],[68,16],[64,14],[60,12],[56,10],[56,8]],
  // Australia
  [[82,62],[86,60],[90,62],[92,66],[90,72],[86,74],[82,72],[80,68],[82,62]],
];

function pointInPolygon(x: number, y: number, polygon: number[][]) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function isLand(x: number, y: number) {
  return CONTINENTS.some(c => pointInPolygon(x, y, c));
}

const MAP_DOTS: { cx: number; cy: number; op: number }[] = [];
for (let x = 2; x < 98; x += 1.3) {
  for (let y = 2; y < 92; y += 1.3) {
    if (isLand(x, y)) {
      MAP_DOTS.push({ cx: x, cy: y, op: 0.08 + Math.random() * 0.22 });
    }
  }
}

const DottedWorldMap = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setActiveIdx(p => (p + 1) % COUNTRIES.length), 1800);
    return () => clearInterval(iv);
  }, []);

  const active = COUNTRIES[activeIdx];

  return (
    <div className="relative w-full" style={{ aspectRatio: "2.2/1" }}>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 45%, rgba(18,26,46,0.5) 0%, #080a12 65%, #060810 100%)",
      }} />

      <svg viewBox="0 0 100 92" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="dotGlow">
            <stop offset="0%" stopColor="#4a9eff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4a9eff" stopOpacity="0" />
          </radialGradient>
        </defs>
        {MAP_DOTS.map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r={0.28} fill="#4a9eff" opacity={d.op} />
        ))}
      </svg>

      {/* Active glow */}
      <AnimatePresence mode="sync">
        <motion.div
          key={activeIdx}
          className="absolute pointer-events-none"
          style={{
            left: `${active.x}%`,
            top: `${active.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <div className="rounded-full" style={{
            width: 80,
            height: 80,
            background: `radial-gradient(circle, ${active.color}35 0%, ${active.color}10 45%, transparent 70%)`,
            filter: "blur(6px)",
          }} />
        </motion.div>
      </AnimatePresence>

      {/* Country markers */}
      {COUNTRIES.map((c, i) => {
        const isActive = i === activeIdx;
        return (
          <div
            key={c.code}
            className="absolute flex flex-col items-center"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: isActive ? 20 : 10,
            }}
          >
            {isActive && (
              <motion.div
                className="absolute rounded-full"
                style={{ border: `1px solid ${c.color}` }}
                initial={{ width: 26, height: 26, opacity: 0.7 }}
                animate={{ width: 44, height: 44, opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            <motion.div
              className="rounded-full flex items-center justify-center"
              animate={{
                scale: isActive ? 1.1 : 1,
                boxShadow: isActive
                  ? `0 0 12px ${c.color}70, 0 0 24px ${c.color}25`
                  : `0 0 4px ${c.color}20`,
              }}
              transition={{ duration: 0.3 }}
              style={{
                width: 28,
                height: 28,
                background: "rgba(8,12,20,0.9)",
                border: `1.5px solid ${isActive ? c.color : c.color + "50"}`,
                fontSize: 14,
              }}
            >
              {c.flag}
            </motion.div>
            <span
              className="mt-0.5 font-medium tracking-wide"
              style={{
                fontSize: 7,
                color: isActive ? c.color : "rgba(255,255,255,0.3)",
                textShadow: isActive ? `0 0 6px ${c.color}60` : "none",
                transition: "all 0.3s",
              }}
            >
              {c.code}
            </span>
          </div>
        );
      })}

      {/* Bottom dots */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1">
        {COUNTRIES.map((c, i) => (
          <div
            key={c.code}
            className="rounded-full cursor-pointer transition-all duration-300"
            style={{
              width: i === activeIdx ? 7 : 4,
              height: i === activeIdx ? 7 : 4,
              background: i === activeIdx ? c.color : "rgba(255,255,255,0.15)",
              boxShadow: i === activeIdx ? `0 0 6px ${c.color}` : "none",
            }}
            onClick={() => setActiveIdx(i)}
          />
        ))}
      </div>
    </div>
  );
};

const BarChart = () => (
  <div className="space-y-px">
    {SORTED.map((c, i) => (
      <motion.div
        key={c.name}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.03, duration: 0.4 }}
        className="flex items-center gap-2.5 py-1.5 px-1.5 rounded hover:bg-white/[0.03] transition-colors group"
      >
        <span className="text-white/65 w-5 text-right font-mono text-[10px] tabular-nums">{i + 1}</span>
        <span className="text-sm w-6 text-center leading-none">{c.flag}</span>
        <span className="text-white/70 w-28 truncate text-xs font-medium group-hover:text-white/90 transition-colors">{c.name}</span>
        <div className="flex-1 h-[18px] bg-white/[0.03] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max((c.pct / MAX_PCT) * 100, 2.5)}%` }}
            transition={{ delay: 0.2 + i * 0.03, duration: 0.7, ease: "easeOut" }}
            style={{
              background: `linear-gradient(90deg, ${c.color}aa, ${c.color})`,
              boxShadow: `0 0 8px ${c.color}30`,
            }}
          />
        </div>
        <span className="text-white/50 font-mono text-[11px] w-12 text-right tabular-nums">{c.pct}%</span>
      </motion.div>
    ))}
  </div>
);

const GlobalMining = () => (
  <div className="min-h-screen bg-[#09090b] overflow-hidden">
    <div className="absolute inset-0 pointer-events-none opacity-[0.018]" style={{backgroundImage:"linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)",backgroundSize:"64px 64px"}} />
    <Navbar />
    <div className="relative z-10 pt-28 pb-16 px-4 md:px-6 max-w-[960px] mx-auto">
      <BackButton />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-6 bg-[#a8c3f0]/40" />
          <span className="font-mono text-[9px] text-[#a8c3f0]/50 tracking-widest">GLOBAL_MINING_NETWORK.live</span>
          <div className="flex-1 h-px bg-gradient-to-r from-[#a8c3f0]/15 to-transparent max-w-[80px]" />
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-emerald-400/20 bg-emerald-400/8 font-mono text-[9px] text-emerald-400/80"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>LIVE</span>
        </div>
        <h1 className="text-[clamp(24px,4vw,44px)] font-bold text-white mb-2">
          Where <span className="text-[#a8c3f0]">Arxon</span> Miners Operate
        </h1>
        <p className="text-white/55 text-sm max-w-md font-mono">
          Decentralized mining network · 18 countries · real-time data
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl border border-[#a8c3f0]/15 bg-[#080a14] overflow-hidden mb-4"
      >
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.09]">
          <Globe size={10} className="text-[#a8c3f0]/40" />
          <span className="font-mono text-[9px] text-white/60">WORLD_MAP / MINER_DISTRIBUTION</span>
        </div>
        <DottedWorldMap />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-white/[0.10] bg-[#0a0a0d] overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.09]">
          <div className="flex items-center gap-2">
            <TrendingUp size={11} className="text-[#a8c3f0]/50" />
            <span className="font-mono text-[9px] text-white/65 tracking-widest">TOP_MINING_COUNTRIES</span>
          </div>
          <span className="font-mono text-[8px] text-white/55">BY % OF TOTAL MINERS</span>
        </div>
        <div className="p-4 md:p-6">
          <BarChart />
        </div>
      </motion.div>
    </div>
    <Footer />
  </div>
);

export default GlobalMining;
