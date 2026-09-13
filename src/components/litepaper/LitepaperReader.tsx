import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Code,
  List,
  X,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import arxonLogo from "@/assets/arxon-logo-wide.svg";
import {
  LITEPAPER_CHAPTERS,
  CHAPTER_BY_SLUG,
  TOTAL_CHAPTERS,
  type ContentBlock,
  type LitepaperChapter,
} from "./litepaperContent";

const Corner = ({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) => {
  const c = {
    tl: "top-0 left-0 border-t border-l",
    tr: "top-0 right-0 border-t border-r",
    bl: "bottom-0 left-0 border-b border-l",
    br: "bottom-0 right-0 border-b border-r",
  }[pos];
  return <div className={`absolute ${c} w-4 h-4 border-[#a8c3f0]/30`} />;
};

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`relative p-5 rounded-xl bg-[#0a0a0d] border border-white/[0.10] overflow-hidden hover:border-[#a8c3f0]/18 transition-colors ${className}`}
  >
    <Corner pos="tl" />
    {children}
  </div>
);

const roadmapVariant = {
  green: {
    border: "border-emerald-400/15",
    bg: "bg-emerald-400/[0.03]",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  amber: {
    border: "border-amber-400/15",
    bg: "bg-amber-400/[0.03]",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  blue: {
    border: "border-[#a8c3f0]/18",
    bg: "bg-[#a8c3f0]/[0.02]",
    text: "text-[#a8c3f0]",
    dot: "bg-[#a8c3f0]",
  },
};

function BlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-white/65 leading-relaxed text-sm md:text-base">
          {block.text}
        </p>
      );
    case "quote":
      return (
        <p className="text-white/60 text-sm md:text-base italic text-center py-2">
          &ldquo;{block.text}&rdquo;
        </p>
      );
    case "problem-cards":
      return (
        <div className="space-y-3">
          {block.items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-md bg-[#a8c3f0]/8 border border-[#a8c3f0]/12 flex items-center justify-center">
                    <item.icon size={13} className="text-[#a8c3f0]/70" />
                  </div>
                  <span className="font-mono text-[8px] text-white/60">
                    {item.id}
                  </span>
                  <h3 className="text-white font-semibold text-sm">
                    {item.title}
                  </h3>
                </div>
                <p className="text-white/60 text-sm leading-relaxed pl-9">
                  {item.desc}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      );
    case "built-list":
      return (
        <div className="space-y-2">
          {block.items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 py-3.5 px-4 border border-white/[0.08] rounded-xl bg-[#0a0a0d] hover:border-[#a8c3f0]/15 transition-colors group"
            >
              <div className="w-6 h-6 rounded-md bg-emerald-400/10 border border-emerald-400/15 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={11} className="text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="font-mono text-[8px] text-white/38">
                    {item.id}
                  </span>
                  <h3 className="text-white font-semibold text-sm group-hover:text-[#a8c3f0]/90 transition-colors">
                    {item.title}
                  </h3>
                </div>
                <p className="text-white/60 text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      );
    case "feature-cards":
      return (
        <div className="space-y-4">
          {block.items.map((item, i) => (
            <Card key={i}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-md bg-[#a8c3f0]/8 border border-[#a8c3f0]/12 flex items-center justify-center">
                  <item.icon size={13} className="text-[#a8c3f0]" />
                </div>
                <h3 className="text-white font-semibold text-sm">
                  {item.title}
                </h3>
              </div>
              <p className="text-white/60 text-sm leading-relaxed pl-9">
                {item.desc}
              </p>
            </Card>
          ))}
        </div>
      );
    case "developer-list":
      return (
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-md bg-[#a8c3f0]/8 border border-[#a8c3f0]/12 flex items-center justify-center">
              <Code size={13} className="text-[#a8c3f0]" />
            </div>
            <h3 className="text-white font-semibold text-sm">{block.title}</h3>
          </div>
          <ul className="pl-9 space-y-2">
            {block.items.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-white/60 text-sm"
              >
                <span className="w-1 h-1 rounded-full bg-[#a8c3f0]/50 mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      );
    case "roadmap":
      return (
        <div className="space-y-4">
          {block.phases.map((phase, i) => {
            const v = roadmapVariant[phase.variant];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`relative p-5 rounded-xl border ${v.border} ${v.bg} overflow-hidden`}
              >
                <Corner pos="tl" />
                <span
                  className={`font-mono text-[9px] font-bold ${v.text} tracking-widest`}
                >
                  {phase.status}
                </span>
                <ul className="mt-4 space-y-2">
                  {phase.items.map((item, j) => (
                    <li
                      key={j}
                      className="text-white/60 text-sm flex items-start gap-2"
                    >
                      <span
                        className={`mt-2 w-1 h-1 rounded-full shrink-0 ${v.dot}`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      );
    case "why-cards":
      return (
        <div className="space-y-3">
          {block.items.map((item, i) => (
            <Card key={i}>
              <h3 className="text-white font-semibold text-sm mb-2">
                {item.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {item.desc}
              </p>
            </Card>
          ))}
        </div>
      );
    case "closing":
      return (
        <div className="relative bg-[#0a0a0d] border border-[#a8c3f0]/18 rounded-2xl overflow-hidden p-8 md:p-12 text-center">
          <Corner pos="tl" />
          <Corner pos="tr" />
          <Corner pos="bl" />
          <Corner pos="br" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center,rgba(124,147,195,0.04) 0%,transparent 65%)",
            }}
          />
          <div className="relative z-10 space-y-5">
            {block.paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-white/65 leading-relaxed text-sm max-w-xl mx-auto"
              >
                {p}
              </p>
            ))}
            <p className="text-[#a8c3f0] font-semibold text-lg italic">
              &ldquo;{block.tagline}&rdquo;
            </p>
            <p className="text-white/60 text-xs max-w-md mx-auto font-mono pt-4">
              {block.disclaimer}
            </p>
          </div>
        </div>
      );
    default:
      return null;
  }
}

function ChapterHeader({ chapter }: { chapter: LitepaperChapter }) {
  if (chapter.isCover) {
    return (
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="w-16 h-16 rounded-2xl bg-[#a8c3f0]/10 border border-[#a8c3f0]/20 flex items-center justify-center mx-auto mb-6"
        >
          <img src={arxonLogo} alt="Arxon" className="w-10" />
        </motion.div>
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="h-px w-8 bg-[#a8c3f0]/30" />
          <span className="font-mono text-[9px] text-[#a8c3f0]/50 tracking-widest">
            LITEPAPER_2026 · INFORMATIONAL_ONLY
          </span>
          <div className="h-px w-8 bg-[#a8c3f0]/30" />
        </div>
        <h1 className="text-[clamp(26px,4.5vw,44px)] font-bold text-white mb-2 leading-tight">
          {chapter.title}
          {chapter.subtitle && (
            <>
              <br />
              <span className="text-[#a8c3f0]">{chapter.subtitle}</span>
            </>
          )}
        </h1>
      </div>
    );
  }

  const Icon = chapter.icon;
  return (
    <div className="flex items-center gap-3 mb-8">
      {Icon && (
        <div className="w-9 h-9 rounded-lg bg-[#a8c3f0]/8 border border-[#a8c3f0]/15 flex items-center justify-center shrink-0">
          <Icon size={16} className="text-[#a8c3f0]" />
        </div>
      )}
      <div>
        {chapter.sectionId && (
          <div className="font-mono text-[8px] text-[#a8c3f0]/40 tracking-widest mb-0.5">
            {chapter.sectionId}
          </div>
        )}
        <h2 className="text-xl md:text-2xl font-bold text-white">
          {chapter.title}
        </h2>
      </div>
    </div>
  );
}

const slideVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? 48 : -48,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir > 0 ? -48 : 48,
  }),
};

const LitepaperReader = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [direction, setDirection] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);

  const chapterSlug = searchParams.get("chapter") ?? "introduction";
  const chapterIndex = Math.max(
    0,
    LITEPAPER_CHAPTERS.findIndex((ch) => ch.slug === chapterSlug)
  );
  const safeIndex =
    chapterIndex >= 0 ? chapterIndex : 0;
  const chapter = LITEPAPER_CHAPTERS[safeIndex];
  const progress = ((safeIndex + 1) / TOTAL_CHAPTERS) * 100;

  const goToChapter = useCallback(
    (index: number, dir: number) => {
      const clamped = Math.max(0, Math.min(TOTAL_CHAPTERS - 1, index));
      setDirection(dir);
      setSearchParams({ chapter: LITEPAPER_CHAPTERS[clamped].slug }, { replace: true });
      setTocOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setSearchParams]
  );

  const goNext = useCallback(
    () => goToChapter(safeIndex + 1, 1),
    [goToChapter, safeIndex]
  );
  const goPrev = useCallback(
    () => goToChapter(safeIndex - 1, -1),
    [goToChapter, safeIndex]
  );

  useEffect(() => {
    if (!CHAPTER_BY_SLUG[chapterSlug]) {
      setSearchParams({ chapter: "introduction" }, { replace: true });
    }
  }, [chapterSlug, setSearchParams]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        if (safeIndex < TOTAL_CHAPTERS - 1) goNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        if (safeIndex > 0) goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, safeIndex]);

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.016]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <Navbar />

      {/* Progress bar */}
      <div className="fixed top-[72px] left-0 right-0 z-40 h-0.5 bg-white/[0.04]">
        <motion.div
          className="h-full bg-gradient-to-r from-[#7c93c3] to-[#a8c3f0]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className="relative z-10 flex-1 pt-24 pb-32">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 font-mono text-xs text-[#a8c3f0]/60 hover:text-[#a8c3f0] transition-colors"
            >
              <ArrowLeft size={12} />
              BACK
            </button>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[9px] text-[#a8c3f0]/45 tracking-widest hidden sm:inline">
                CHAPTER {String(safeIndex + 1).padStart(2, "0")} /{" "}
                {String(TOTAL_CHAPTERS).padStart(2, "0")}
              </span>
              <button
                onClick={() => setTocOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#a8c3f0]/15 bg-[#a8c3f0]/5 font-mono text-[10px] text-[#a8c3f0]/70 hover:text-[#a8c3f0] transition-colors"
              >
                <List size={12} />
                CHAPTERS
              </button>
            </div>
          </div>

          <div className="flex gap-10">
            {/* Desktop TOC sidebar */}
            <aside className="hidden lg:block w-56 shrink-0">
              <nav className="sticky top-28 space-y-1">
                <p className="font-mono text-[8px] text-[#a8c3f0]/35 tracking-widest mb-3 px-2">
                  CONTENTS
                </p>
                {LITEPAPER_CHAPTERS.map((ch, i) => (
                  <button
                    key={ch.slug}
                    onClick={() => goToChapter(i, i > safeIndex ? 1 : -1)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-all text-sm ${
                      i === safeIndex
                        ? "bg-[#a8c3f0]/10 border border-[#a8c3f0]/20 text-[#a8c3f0] font-semibold"
                        : "text-white/45 hover:text-white/70 hover:bg-white/[0.03] border border-transparent"
                    }`}
                  >
                    <span className="font-mono text-[8px] opacity-50 mr-2">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {ch.isCover ? "Introduction" : ch.title}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 min-w-0 max-w-3xl">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={chapter.slug}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                  className="space-y-6"
                >
                  <ChapterHeader chapter={chapter} />
                  {chapter.blocks.map((block, i) => (
                    <BlockRenderer key={i} block={block} />
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Dot nav — mobile/tablet */}
              <div className="flex justify-center gap-2 mt-10 lg:hidden">
                {LITEPAPER_CHAPTERS.map((ch, i) => (
                  <button
                    key={ch.slug}
                    onClick={() => goToChapter(i, i > safeIndex ? 1 : -1)}
                    aria-label={`Go to ${ch.title}`}
                    className={`rounded-full transition-all ${
                      i === safeIndex
                        ? "w-6 h-2 bg-[#a8c3f0]"
                        : "w-2 h-2 bg-white/15 hover:bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.06] bg-[#09090b]/90 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
          <button
            onClick={goPrev}
            disabled={safeIndex === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all disabled:opacity-25 disabled:cursor-not-allowed border border-white/[0.08] text-white/70 hover:border-[#a8c3f0]/25 hover:text-[#a8c3f0]"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">PREVIOUS</span>
          </button>

          <span className="font-mono text-[9px] text-[#a8c3f0]/40 tracking-widest text-center">
            {chapter.isCover ? "INTRODUCTION" : chapter.label ?? chapter.title.toUpperCase()}
          </span>

          <button
            onClick={goNext}
            disabled={safeIndex === TOTAL_CHAPTERS - 1}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all disabled:opacity-25 disabled:cursor-not-allowed text-[#09090b] hover:brightness-110"
            style={{
              background: "linear-gradient(135deg,#a8c3f0,#a8b8d8)",
            }}
          >
            <span className="hidden sm:inline">
              {safeIndex === TOTAL_CHAPTERS - 1 ? "FINISH" : "NEXT"}
            </span>
            {safeIndex < TOTAL_CHAPTERS - 1 ? (
              <ChevronRight size={16} />
            ) : (
              <ArrowRight size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile TOC drawer */}
      <AnimatePresence>
        {tocOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setTocOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-[#0a0a0d] border-l border-[#a8c3f0]/15 p-6 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <p className="font-mono text-[9px] text-[#a8c3f0]/50 tracking-widest">
                  CHAPTER LIST
                </p>
                <button
                  onClick={() => setTocOpen(false)}
                  className="text-white/40 hover:text-white/70 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-1">
                {LITEPAPER_CHAPTERS.map((ch, i) => (
                  <button
                    key={ch.slug}
                    onClick={() => goToChapter(i, i > safeIndex ? 1 : -1)}
                    className={`w-full text-left px-3 py-3 rounded-lg transition-all text-sm ${
                      i === safeIndex
                        ? "bg-[#a8c3f0]/10 border border-[#a8c3f0]/20 text-[#a8c3f0] font-semibold"
                        : "text-white/50 hover:text-white/75 hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className="font-mono text-[8px] opacity-50 block mb-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {ch.isCover ? "Introduction" : ch.title}
                  </button>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default LitepaperReader;
