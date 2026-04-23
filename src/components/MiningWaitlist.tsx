import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Pickaxe, ArrowRight, Zap, Shield, Globe, Users, Sparkles, MousePointerClick, Earth } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

const miningVideos = [
  "/videos/mining-1.mp4",
  "/videos/mining-2.mp4",
  "/videos/mining-3.mp4",
  "/videos/mining-4.mp4",
];

const MiningWaitlist = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const counter = useCountUp({ end: 14, duration: 2500, suffix: "k+", decimals: 0 });
  const countriesCounter = useCountUp({ end: 30, duration: 2000, suffix: "+" });
  const [activeVideo, setActiveVideo] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Set ref for each video element
  const setVideoRef = useCallback((el: HTMLVideoElement | null, index: number) => {
    videoRefs.current[index] = el;
  }, []);

  // Auto-cycle videos & manage play state
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVideo((prev) => (prev + 1) % miningVideos.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Play/pause videos based on active index
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === activeVideo) {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeVideo]);

  return (
    <section className="relative bg-[#09090b] py-14 md:py-20" ref={ref}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6">

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8 flex flex-wrap items-start gap-10 md:gap-16"
        >
          {/* Miners counter */}
          <div ref={counter.ref}>
            <div className="flex items-baseline gap-3">
              <Users size={20} className="text-[#7c93c3] self-center" />
              <span className="text-[56px] md:text-[80px] lg:text-[96px] font-black text-white tracking-[-0.04em] leading-none">
                {counter.display}
              </span>
            </div>
            <p className="text-[#52525b] text-sm md:text-base font-medium mt-2 ml-10">
              Active miners and counting
            </p>
          </div>

          {/* Countries counter */}
          <div ref={countriesCounter.ref}>
            <div className="flex items-baseline gap-3">
              <Earth size={20} className="text-[#7c93c3] self-center" />
              <span className="text-[56px] md:text-[80px] lg:text-[96px] font-black text-white tracking-[-0.04em] leading-none">
                {countriesCounter.display}
              </span>
            </div>
            <p className="text-[#52525b] text-sm md:text-base font-medium mt-2 ml-10">
              Countries onboard
            </p>
          </div>
        </motion.div>

        {/* Content card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-xl border border-white/[0.06] overflow-hidden bg-[#0f0f13]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Left panel */}
            <div className="lg:col-span-2 p-8 md:p-10 flex flex-col justify-between border-r border-white/[0.04]">
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                    <Pickaxe size={16} className="text-[#7c93c3]" />
                  </div>
                  <span className="text-[#7c93c3] text-[11px] font-black uppercase tracking-[0.15em]">
                    Now Live
                  </span>
                </div>

                <h3 className="text-white text-xl md:text-2xl font-bold tracking-[-0.02em] mb-3">
                  Arxon Mining App
                </h3>
                <p className="text-[#52525b] text-sm leading-relaxed mb-8 font-light">
                  Join thousands of miners earning ARX tokens. Register now and start mining from your browser.
                </p>

                <div className="space-y-3 mb-10">
                  {[
                    { icon: Zap, text: "Mine ARX-P offchain to earn real ARX tokens" },
                    { icon: Globe, text: "Access directly from your web browser" },
                    { icon: Shield, text: "Secure & decentralized mining experience" },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <f.icon size={14} className="text-[#52525b] flex-shrink-0" />
                      <span className="text-[#a1a1aa] text-[13px] font-medium">{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <a
                  href="https://arxonchain.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-shimmer group flex items-center justify-center gap-2 w-full bg-[#7c93c3] text-white text-sm font-bold py-3 rounded-lg hover:bg-[#6b82b2] transition-all shadow-[0_0_30px_rgba(124,147,195,0.15)]"
                >
                  Register for Mining
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
                <p className="text-center text-[#3f3f46] text-[11px] mt-3 tracking-wide font-medium">
                  arxonchain.xyz
                </p>
              </div>
            </div>

            {/* Right panel - Video carousel */}
            <div className="lg:col-span-3 relative overflow-hidden bg-[#0f0f13] aspect-video lg:aspect-auto" style={{ minHeight: 'auto' }}>
              {/* All videos rendered & preloaded, crossfade via opacity */}
              {miningVideos.map((src, i) => (
                <video
                  key={src}
                  ref={(el) => setVideoRef(el, i)}
                  src={src}
                  muted
                  playsInline
                  loop
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
                  style={{ opacity: i === activeVideo ? 1 : 0 }}
                />
              ))}

              {/* Soft left-edge blend into the text panel (desktop only) */}
              <div className="hidden lg:block absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0f0f13] to-transparent pointer-events-none" />
              {/* Top vignette (mobile only) */}
              <div className="lg:hidden absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#0f0f13] to-transparent pointer-events-none" />
              {/* Bottom vignette */}
              <div className="absolute inset-x-0 bottom-0 h-16 lg:h-24 bg-gradient-to-t from-[#0f0f13]/80 lg:from-[#0f0f13]/60 to-transparent pointer-events-none" />

              {/* Progress bar indicators */}
              <div className="absolute bottom-3 lg:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {miningVideos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveVideo(i)}
                    className="relative w-6 lg:w-8 h-1 rounded-full overflow-hidden bg-white/20 transition-all"
                  >
                    {i === activeVideo && (
                      <motion.div
                        className="absolute inset-0 bg-white rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 6, ease: "linear" }}
                        style={{ transformOrigin: "left" }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex items-center gap-3"
        >
          <button
            onClick={() => navigate("/learn-more")}
            className="btn-shimmer group relative text-white text-sm font-bold transition-all border border-[#7c93c3]/40 px-7 py-3.5 rounded-lg hover:border-[#7c93c3]/70 flex items-center gap-3 shadow-[0_0_25px_rgba(124,147,195,0.12)] bg-[#7c93c3]/10 hover:bg-[#7c93c3]/20"
          >
            <Sparkles size={14} className="text-[#7c93c3]" />
            Learn more about Arxon
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
          <motion.div
            animate={{ x: [0, -8, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <MousePointerClick size={22} className="text-[#7c93c3]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MiningWaitlist;
