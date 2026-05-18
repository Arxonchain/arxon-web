import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import arxonLogo from "@/assets/arxon-icon.svg";

const BRAND_BLUE = "#7D93C4";
const BRAND_BLUE_HSL = "hsl(220, 40%, 63%)";
const BRAND_DARK = "hsl(220, 40%, 20%)";
const BRAND_GLOW = "hsl(220, 40%, 75%)";

// Human silhouette SVG path (head + shoulders)
const HUMAN_PATH = "M0,-8 C0,-12 4,-14 4,-14 C4,-14 4,-10 0,-8 Z M0,-8 C0,-12 -4,-14 -4,-14 C-4,-14 -4,-10 0,-8 Z M0,-7 A4,4 0 1,1 0.01,-7 Z M-7,6 Q-7,0 -3,-4 L0,-5 L3,-4 Q7,0 7,6 L7,8 L-7,8 Z";

const EarthPrivacyVisual = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotation = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const pulseOpacity = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0.3, 0.8, 1, 0.5]);
  const orbitRotation = useTransform(scrollYProgress, [0, 1], [0, -180]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
        });
      }
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  const people = [
    { angle: 0, delay: 0 },
    { angle: 60, delay: 0.4 },
    { angle: 120, delay: 0.8 },
    { angle: 180, delay: 1.2 },
    { angle: 240, delay: 1.6 },
    { angle: 300, delay: 2.0 },
  ];

  const cx = 250;
  const cy = 250;
  const earthR = 80;
  const orbitR = 185;

  return (
    <div
      ref={containerRef}
      className="relative w-full flex items-center justify-center"
      style={{ perspective: "800px" }}
    >
      <motion.div
        style={{
          rotateX: mousePos.y * 0.3,
          rotateY: mousePos.x * 0.3,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        <svg
          viewBox="0 0 500 500"
          className="w-[340px] h-[340px] md:w-[460px] md:h-[460px]"
          fill="none"
        >
          <defs>
            {/* Advanced glow filters */}
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feComposite in="blur" in2="blur" operator="over" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="nodeGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Radial gradient for earth */}
            <radialGradient id="earthGlow2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={BRAND_BLUE} stopOpacity="0.25" />
              <stop offset="60%" stopColor={BRAND_BLUE} stopOpacity="0.08" />
              <stop offset="100%" stopColor={BRAND_BLUE} stopOpacity="0" />
            </radialGradient>

            {/* Line gradient with animation */}
            <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={BRAND_BLUE} stopOpacity="0.9">
                <animate attributeName="stopOpacity" values="0.9;0.4;0.9" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor={BRAND_GLOW} stopOpacity="0.2">
                <animate attributeName="stopOpacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" />
              </stop>
            </linearGradient>

            {/* Particle gradient */}
            <radialGradient id="particleGrad">
              <stop offset="0%" stopColor={BRAND_GLOW} stopOpacity="1" />
              <stop offset="100%" stopColor={BRAND_BLUE} stopOpacity="0" />
            </radialGradient>

            {/* Node gradient */}
            <radialGradient id="nodeGrad" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="hsl(220, 20%, 18%)" />
              <stop offset="100%" stopColor="hsl(220, 20%, 6%)" />
            </radialGradient>
          </defs>

          {/* Ambient outer glow */}
          <circle cx={cx} cy={cy} r={orbitR + 30} fill="url(#earthGlow2)">
            <animate attributeName="r" values={`${orbitR + 25};${orbitR + 40};${orbitR + 25}`} dur="4s" repeatCount="indefinite" />
          </circle>

          {/* Multiple orbit rings for depth */}
          {[0.85, 1, 1.12].map((scale, i) => (
            <motion.circle
              key={`orbit-${i}`}
              cx={cx}
              cy={cy}
              r={orbitR * scale}
              stroke={BRAND_BLUE}
              strokeWidth={i === 1 ? "0.8" : "0.3"}
              fill="none"
              strokeDasharray={i === 1 ? "6 12" : "2 16"}
              opacity={i === 1 ? 0.5 : 0.15}
              style={{ rotate: orbitRotation, transformOrigin: `${cx}px ${cy}px` }}
            />
          ))}

          {/* Floating ambient particles */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30) * Math.PI / 180;
            const r = orbitR * (0.5 + Math.random() * 0.7);
            const px = cx + r * Math.cos(angle);
            const py = cy + r * Math.sin(angle);
            return (
              <circle key={`ambient-${i}`} cx={px} cy={py} r="1.5" fill={BRAND_BLUE} opacity="0.3">
                <animate attributeName="opacity" values="0.1;0.5;0.1" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
                <animate attributeName="r" values="1;2.5;1" dur={`${4 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
            );
          })}

          {/* Connection lines + energy pulses */}
          {people.map((p, i) => {
            const rad = (p.angle * Math.PI) / 180;
            const px = cx + orbitR * Math.cos(rad);
            const py = cy + orbitR * Math.sin(rad);
            const midX = cx + (orbitR * 0.5) * Math.cos(rad);
            const midY = cy + (orbitR * 0.5) * Math.sin(rad);
            // Curved path via control point
            const cpX = midX + 20 * Math.cos(rad + Math.PI / 2);
            const cpY = midY + 20 * Math.sin(rad + Math.PI / 2);
            const curvePath = `M${cx},${cy} Q${cpX},${cpY} ${px},${py}`;

            return (
              <g key={i}>
                {/* Curved connection line */}
                <path
                  d={curvePath}
                  stroke={BRAND_BLUE}
                  strokeWidth="0.6"
                  fill="none"
                  opacity="0.3"
                  strokeDasharray="3 6"
                >
                  <animate attributeName="stroke-dashoffset" values="0;18" dur="2s" repeatCount="indefinite" />
                </path>

                {/* Primary energy pulse - outgoing */}
                <circle r="4" fill={BRAND_BLUE} filter="url(#softGlow)">
                  <animateMotion
                    dur={`${2.2 + i * 0.3}s`}
                    repeatCount="indefinite"
                    path={curvePath}
                  />
                  <animate attributeName="r" values="2;5;2" dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;1;1;0" dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite" />
                </circle>

                {/* Secondary trail pulse */}
                <circle r="2" fill={BRAND_GLOW} opacity="0.6">
                  <animateMotion
                    dur={`${2.2 + i * 0.3}s`}
                    repeatCount="indefinite"
                    path={curvePath}
                    begin={`${0.3}s`}
                  />
                  <animate attributeName="opacity" values="0;0.6;0.6;0" dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite" begin={`${0.3}s`} />
                </circle>

                {/* Return pulse */}
                <circle r="3" fill={BRAND_GLOW} filter="url(#softGlow)">
                  <animateMotion
                    dur={`${3 + i * 0.25}s`}
                    repeatCount="indefinite"
                    path={`M${px},${py} Q${cpX},${cpY} ${cx},${cy}`}
                  />
                  <animate attributeName="opacity" values="0;0.8;0.8;0" dur={`${3 + i * 0.25}s`} repeatCount="indefinite" />
                  <animate attributeName="r" values="2;4;2" dur={`${3 + i * 0.25}s`} repeatCount="indefinite" />
                </circle>

                {/* Data spark at midpoint */}
                <circle cx={midX} cy={midY} r="1.5" fill={BRAND_GLOW}>
                  <animate attributeName="opacity" values="0;1;0" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
                  <animate attributeName="r" values="0;3;0" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
                </circle>
              </g>
            );
          })}

          {/* Earth - stroked globe */}
          <motion.g style={{ rotate: rotation, transformOrigin: `${cx}px ${cy}px` }}>
            <circle cx={cx} cy={cy} r={earthR} stroke={BRAND_BLUE} strokeWidth="1.2" fill="none" opacity="0.6" />
            <ellipse cx={cx} cy={cy} rx={earthR * 0.65} ry={earthR} stroke={BRAND_DARK} strokeWidth="0.6" fill="none" opacity="0.5" />
            <ellipse cx={cx} cy={cy} rx={earthR * 0.3} ry={earthR} stroke={BRAND_DARK} strokeWidth="0.4" fill="none" opacity="0.3" />
            <ellipse cx={cx} cy={cy} rx={earthR} ry={earthR * 0.4} stroke={BRAND_DARK} strokeWidth="0.6" fill="none" opacity="0.5" />
            <ellipse cx={cx} cy={cy} rx={earthR} ry={earthR * 0.7} stroke={BRAND_DARK} strokeWidth="0.4" fill="none" opacity="0.3" />
            <line x1={cx - earthR} y1={cy} x2={cx + earthR} y2={cy} stroke={BRAND_DARK} strokeWidth="0.4" opacity="0.4" />
            <line x1={cx} y1={cy - earthR} x2={cx} y2={cy + earthR} stroke={BRAND_DARK} strokeWidth="0.4" opacity="0.4" />
          </motion.g>

          {/* Inner earth pulse */}
          <motion.circle cx={cx} cy={cy} r={earthR - 8} fill="hsl(220, 40%, 12%)" fillOpacity="0.5" style={{ opacity: pulseOpacity }} />

          {/* Earth core energy rings */}
          {[30, 50, 65].map((r, i) => (
            <circle key={`core-${i}`} cx={cx} cy={cy} r={r} fill="none" stroke={BRAND_BLUE} strokeWidth="0.3" opacity="0.15">
              <animate attributeName="r" values={`${r};${r + 8};${r}`} dur={`${2 + i}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.15;0.3;0.15" dur={`${2 + i}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* People nodes with human silhouettes + question marks */}
          {people.map((p, i) => {
            const rad = (p.angle * Math.PI) / 180;
            const px = cx + orbitR * Math.cos(rad);
            const py = cy + orbitR * Math.sin(rad);
            return (
              <g key={`person-${i}`}>
                {/* Outer pulsing ring */}
                <circle cx={px} cy={py} r="22" fill="none" stroke={BRAND_BLUE} strokeWidth="0.4" opacity="0.3">
                  <animate attributeName="r" values="22;30;22" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0;0.3" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
                </circle>

                {/* Second pulse ring - staggered */}
                <circle cx={px} cy={py} r="22" fill="none" stroke={BRAND_GLOW} strokeWidth="0.3" opacity="0.2">
                  <animate attributeName="r" values="22;34;22" dur={`${3 + i * 0.3}s`} repeatCount="indefinite" begin={`${0.5}s`} />
                  <animate attributeName="opacity" values="0.2;0;0.2" dur={`${3 + i * 0.3}s`} repeatCount="indefinite" begin={`${0.5}s`} />
                </circle>

                {/* Node background */}
                <circle cx={px} cy={py} r="20" fill="url(#nodeGrad)" stroke={BRAND_BLUE} strokeWidth="0.8" filter="url(#nodeGlow)" />

                {/* Human silhouette */}
                <g transform={`translate(${px}, ${py - 2})`}>
                  {/* Head */}
                  <circle cx="0" cy="-5" r="4.5" fill="none" stroke={BRAND_BLUE} strokeWidth="1" opacity="0.9" />
                  {/* Body */}
                  <path d="M-6,8 Q-6,2 -2,-2 L0,-3 L2,-2 Q6,2 6,8" fill="none" stroke={BRAND_BLUE} strokeWidth="0.8" opacity="0.7" />
                  {/* Question mark */}
                  <text x="8" y="-6" fontSize="10" fontWeight="bold" fill={BRAND_GLOW} opacity="0.9" fontFamily="serif">?</text>
                </g>

                {/* Data reception indicator */}
                <circle cx={px} cy={py} r="2" fill={BRAND_BLUE} opacity="0.6">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
                  <animate attributeName="r" values="1;3;1" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
                </circle>
              </g>
            );
          })}

          {/* Scanning ring that sweeps around */}
          <circle cx={cx} cy={cy} r={orbitR} fill="none" stroke={BRAND_BLUE} strokeWidth="2" strokeDasharray="30 540" opacity="0.3">
            <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.1;0.5;0.1" dur="8s" repeatCount="indefinite" />
          </circle>
        </svg>
      </motion.div>

      {/* Arxon logo centered on earth */}
      <motion.div
        className="absolute"
        style={{ width: "100px", height: "100px" }}
      >
        <div className="relative w-full h-full rounded-full flex items-center justify-center" style={{ background: 'radial-gradient(circle, hsl(220 40% 14%) 0%, hsl(220 40% 8%) 100%)', boxShadow: `0 0 30px ${BRAND_BLUE}66, 0 0 60px ${BRAND_BLUE}26` }}>
          <img
            src={arxonLogo}
            alt="Arxon"
            style={{ width: "58%", height: "58%", objectFit: "contain" }}
          />
          {/* Multi-layer breathing glow */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                `0 0 20px ${BRAND_BLUE}33, 0 0 40px ${BRAND_BLUE}11`,
                `0 0 40px ${BRAND_BLUE}80, 0 0 80px ${BRAND_BLUE}33`,
                `0 0 20px ${BRAND_BLUE}33, 0 0 40px ${BRAND_BLUE}11`,
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -inset-2 rounded-full border"
            style={{ borderColor: `${BRAND_BLUE}22` }}
            animate={{
              borderColor: [`${BRAND_BLUE}11`, `${BRAND_BLUE}44`, `${BRAND_BLUE}11`],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default EarthPrivacyVisual;
