import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface AnimatedStatProps {
  value: string;
  numericValue: number;
  prefix?: string;
  suffix?: string;
  label: string;
  delay: number;
  inView: boolean;
}

const AnimatedStat = ({ value, numericValue, prefix = "", suffix = "", label, delay, inView }: AnimatedStatProps) => {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const duration = 2000;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * numericValue);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDone(true);
      }
    };
    setTimeout(() => requestAnimationFrame(step), delay * 1000);
  }, [inView, numericValue, delay]);

  const displayValue = done
    ? value
    : `${prefix}${numericValue >= 1000 ? Math.floor(count).toLocaleString() : numericValue >= 100 ? Math.floor(count) : count.toFixed(numericValue < 1 ? 2 : 0)}${suffix}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.85 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative flex flex-col items-center text-center group"
    >
      {/* Glow behind number */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.2, delay: delay + 0.2 }}
        className="absolute -top-4 w-[120px] h-[120px] bg-[radial-gradient(circle,hsl(220_50%_40%/0.08)_0%,transparent_70%)] pointer-events-none"
      />

      <motion.span
        className="text-[36px] sm:text-[44px] md:text-[56px] lg:text-[72px] font-black text-white tracking-[-0.04em] leading-none relative z-10"
        initial={{ filter: "blur(12px)", opacity: 0 }}
        animate={inView ? { filter: "blur(0px)", opacity: 1 } : {}}
        transition={{ duration: 1, delay: delay + 0.1 }}
      >
        {displayValue}
      </motion.span>

      {/* Animated underline */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: delay + 0.4 }}
        className="h-[2px] w-12 bg-gradient-to-r from-transparent via-[#a8c3f0]/50 to-transparent my-3 origin-center"
      />

      <motion.span
        className="text-[#71717a] text-xs sm:text-sm font-medium tracking-wide uppercase"
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: delay + 0.5 }}
      >
        {label}
      </motion.span>

      {/* Hover pulse ring */}
      <motion.div
        className="absolute -inset-4 rounded-2xl border border-white/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      />
    </motion.div>
  );
};

const stats = [
  { value: "$1B+", numericValue: 1, prefix: "$", suffix: "B+", label: "Transaction Capacity" },
  { value: "100%", numericValue: 100, prefix: "", suffix: "%", label: "Privacy by Choice" },
  { value: "<$0.01", numericValue: 0.01, prefix: "<$", suffix: "", label: "Transaction Fees" },
];

const StatsBar = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section className="relative bg-[#09090b] py-20 md:py-28 overflow-hidden" ref={ref}>
      {/* Top glow line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#a8c3f0]/30 to-transparent origin-center"
      />

      {/* Radial glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] bg-[radial-gradient(ellipse,hsl(220_50%_20%/0.1)_0%,transparent_60%)]" />
      </motion.div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#a8c3f0]/20"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-3 gap-10 md:gap-6">
          {stats.map((stat, i) => (
            <AnimatedStat
              key={i}
              value={stat.value}
              numericValue={stat.numericValue}
              prefix={stat.prefix}
              suffix={stat.suffix}
              label={stat.label}
              delay={i * 0.18}
              inView={inView}
            />
          ))}
        </div>
      </div>

      {/* Bottom glow line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent origin-center"
      />
    </section>
  );
};

export default StatsBar;
