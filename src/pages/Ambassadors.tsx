import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Trophy, Users, Sparkles, ArrowRight, Star, 
  Globe, Video, Hash, MessageSquare, Award, ChevronDown, 
  Rocket, Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import trophyImg from "@/assets/trophy-3d.png";
import diamondImg from "@/assets/diamond-3d.png";
import moneybagImg from "@/assets/moneybag-3d.png";

/* ─── Hero ─── */
const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b] via-[#0c0c10] to-[#09090b]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,hsl(220_50%_20%/0.2)_0%,transparent_60%)]" />
        
        {/* Floating 3D elements in background */}
        <motion.img
          src={trophyImg}
          alt=""
          className="absolute top-[15%] right-[5%] w-32 md:w-48 opacity-[0.08] pointer-events-none"
          animate={{ y: [-15, 15, -15], rotate: [-3, 3, -3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src={diamondImg}
          alt=""
          className="absolute bottom-[20%] left-[3%] w-24 md:w-36 opacity-[0.06] pointer-events-none"
          animate={{ y: [10, -10, 10], rotate: [5, -5, 5] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src={moneybagImg}
          alt=""
          className="absolute top-[60%] right-[10%] w-20 md:w-28 opacity-[0.05] pointer-events-none"
          animate={{ y: [-8, 12, -8] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Animated particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#7c93c3]/30"
            style={{ left: `${8 + i * 8}%`, top: `${15 + (i % 4) * 20}%` }}
            animate={{ 
              y: [-20, 20, -20], 
              opacity: [0.1, 0.5, 0.1],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
          />
        ))}

        {/* Light beams */}
        <motion.div
          className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-[#7c93c3]/10 to-transparent"
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-0 right-1/3 w-[1px] h-full bg-gradient-to-b from-transparent via-[#7c93c3]/[0.07] to-transparent"
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
      </div>

      <div className="relative z-10 max-w-[1000px] mx-auto px-6 pt-28 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#7c93c3]/20 bg-[#7c93c3]/5 text-[#7c93c3] text-xs font-semibold mb-6"
        >
          <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <Sparkles size={12} />
          </motion.span>
          Limited Spots Available
        </motion.div>

        {/* 3D Images Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="flex items-center justify-center gap-4 md:gap-6 mb-8"
        >
          <motion.img
            src={moneybagImg}
            alt="Rewards"
            className="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-[0_0_20px_rgba(124,147,195,0.3)]"
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img
            src={trophyImg}
            alt="Trophy"
            className="w-24 h-24 md:w-36 md:h-36 object-contain drop-shadow-[0_0_30px_rgba(124,147,195,0.4)]"
            animate={{ y: [-8, 8, -8], scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img
            src={diamondImg}
            alt="Diamond"
            className="w-16 h-16 md:w-24 md:h-24 object-contain drop-shadow-[0_0_20px_rgba(124,147,195,0.3)]"
            animate={{ y: [5, -5, 5], rotate: [-3, 3, -3] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
        >
          Arxon Ambassador Program
          <br />
          <span className="bg-gradient-to-r from-[#7c93c3] to-[#a8b8d8] bg-clip-text text-transparent">
            $100,000 Rewards Campaign
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-[#a1a1aa] text-base md:text-lg max-w-[700px] mx-auto mb-8 leading-relaxed"
        >
          Join the movement. Prove yourself in 30 days. Get rewarded at TGE. 
          Help expand Arxon's reach across the globe and earn your place as an official Arxon Ambassador.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            onClick={() => navigate("/ambassadors/apply")}
            whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(124,147,195,0.4)" }}
            whileTap={{ scale: 0.96 }}
            className="relative overflow-hidden bg-[#7c93c3] text-white font-bold px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm group"
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
              animate={{ x: ["-200%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
            />
            {/* Pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-[#7c93c3]"
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Rocket size={16} />
              </motion.span>
              Apply Now
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowRight size={16} />
              </motion.span>
            </span>
          </motion.button>
          <motion.button
            onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="border border-white/10 text-white/80 font-semibold px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-white/5 transition-colors"
          >
            Learn More <ChevronDown size={16} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

/* ─── Benefits ─── */
const benefits = [
  { icon: Trophy, title: "$100,000 ARX Reward Pool", desc: "Top performers share the reward pool at TGE, vested over 12 months for long-term alignment.", img: moneybagImg },
  { icon: Award, title: "Official Ambassador Badge", desc: "Earn your official Arxon Ambassador title with early access to new features and updates.", img: diamondImg },
  { icon: Globe, title: "Partnership Opportunities", desc: "Unlock future collaborations, exclusive events, and direct access to the Arxon core team.", img: trophyImg },
];

const BenefitsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-[1000px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-2xl md:text-3xl font-bold text-white text-center mb-12"
        >
          What You'll <span className="text-[#7c93c3]">Earn</span>
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -5, borderColor: "rgba(124,147,195,0.4)" }}
              className="relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 overflow-hidden group transition-all"
            >
              {/* Glow on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#7c93c3]/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              {/* Floating image accent */}
              <motion.img
                src={b.img}
                alt=""
                className="absolute -right-4 -bottom-4 w-20 h-20 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 rounded-xl bg-[#7c93c3]/10 flex items-center justify-center mb-4 group-hover:bg-[#7c93c3]/20 transition-colors"
                >
                  <b.icon size={22} className="text-[#7c93c3]" />
                </motion.div>
                <h3 className="text-white font-semibold text-lg mb-2">{b.title}</h3>
                <p className="text-[#a1a1aa] text-sm leading-relaxed">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── How It Works ─── */
const steps = [
  { num: "01", title: "Create Your Arxon Mining Account", desc: "Sign up at arxonchain.xyz and create your mining account to get started." },
  { num: "02", title: "Apply for the Program", desc: "Fill out the application form with your details and crypto content experience." },
  { num: "03", title: "Complete the 30-Day Challenge", desc: "Post quality content, host Spaces, bring referrals, and use #ArxonAmbassador." },
  { num: "04", title: "Submit Your Best Work", desc: "Submit up to 8 of your best work via your personal portal." },
  { num: "05", title: "Get Selected and Rewarded", desc: "Top performers become official Arxon Ambassadors and share the $100K pool." },
];

const requirements = [
  { icon: MessageSquare, text: "Post minimum 8 quality tweets/threads about Arxon (more gives you an edge)" },
  { icon: Users, text: "Host or co-host at least 2 Twitter Spaces about Arxon and tag @ARXONarx" },
  { icon: Globe, text: "Bring in at least 100 new verified users via your referral link" },
  { icon: Hash, text: "Use hashtag #ArxonAmbassador and tag @ARXONarx in all content" },
  { icon: Video, text: "Bonus: Create 1-2 videos talking about Arxon for a huge advantage" },
];

const HowItWorksSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <section id="how-it-works" ref={ref} className="py-20 px-6 bg-white/[0.01]">
      <div className="max-w-[1000px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-2xl md:text-3xl font-bold text-white text-center mb-4"
        >
          How It <span className="text-[#7c93c3]">Works</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-[#a1a1aa] text-center mb-12 text-sm"
        >
          Complete the 30-day challenge and prove you have what it takes
        </motion.p>

        {/* Steps */}
        <div className="space-y-4 mb-16">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              whileHover={{ x: 5, borderColor: "rgba(124,147,195,0.3)" }}
              className="flex items-start gap-4 bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 transition-all group"
            >
              <motion.span
                className="text-[#7c93c3] font-bold text-lg shrink-0 w-8"
                whileHover={{ scale: 1.2 }}
              >
                {s.num}
              </motion.span>
              <div>
                <h3 className="text-white font-semibold mb-1 group-hover:text-[#7c93c3] transition-colors">{s.title}</h3>
                <p className="text-[#a1a1aa] text-sm">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Requirements */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-xl font-bold text-white mb-6 text-center"
        >
          30-Day Challenge Requirements
        </motion.h3>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8"
        >
          <ul className="space-y-4">
            {requirements.map((r, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-start gap-3 group"
              >
                <motion.span
                  className="mt-1 w-2 h-2 rounded-full bg-[#7c93c3] shrink-0"
                  whileHover={{ scale: 1.5 }}
                />
                <p className="text-[#a1a1aa] text-sm leading-relaxed group-hover:text-white/70 transition-colors">{r.text}</p>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-[#7c93c3]/5 border border-[#7c93c3]/15 rounded-xl p-5"
        >
          <div className="flex items-start gap-3">
            <Clock size={18} className="text-[#7c93c3] mt-0.5 shrink-0" />
            <div>
              <p className="text-white text-sm font-semibold mb-1">Important Note</p>
              <p className="text-[#a1a1aa] text-xs leading-relaxed">
                Rewards are paid at TGE and vested over 12 months. Selected Ambassadors are expected to continue promotion until TGE. 
                We prioritize quality and real engagement over follower count.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ─── CTA Section ─── */
const CTASection = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-[800px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="bg-gradient-to-br from-[#7c93c3]/[0.08] to-transparent border border-[#7c93c3]/20 rounded-2xl p-10 md:p-14 relative overflow-hidden"
        >
          {/* Ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(124,147,195,0.1)_0%,transparent_60%)]" />
          
          <div className="relative z-10">
            <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              <motion.img src={moneybagImg} alt="" className="w-12 h-12 object-contain" animate={{ y: [-3, 3, -3] }} transition={{ duration: 2, repeat: Infinity }} />
              <motion.img src={trophyImg} alt="" className="w-16 h-16 object-contain" animate={{ y: [3, -3, 3] }} transition={{ duration: 2.5, repeat: Infinity }} />
              <motion.img src={diamondImg} alt="" className="w-12 h-12 object-contain" animate={{ y: [-3, 3, -3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
            </motion.div>

            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Become an Ambassador?</h2>
            <p className="text-[#a1a1aa] text-sm mb-8 max-w-[500px] mx-auto">
              Join the 30-day challenge, prove yourself, and earn your share of the $100,000 ARX reward pool at TGE.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                onClick={() => navigate("/ambassadors/apply")}
                whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(124,147,195,0.4)" }}
                whileTap={{ scale: 0.96 }}
                className="relative overflow-hidden bg-[#7c93c3] text-white font-bold px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  <Rocket size={16} /> Apply Now <ArrowRight size={16} />
                </span>
              </motion.button>
              <motion.button
                onClick={() => navigate("/ambassadors/portal")}
                whileHover={{ scale: 1.03 }}
                className="border border-white/10 text-white/80 font-semibold px-8 py-3.5 rounded-xl text-sm hover:bg-white/5 transition-colors"
              >
                Access Portal
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ─── Main Page ─── */
const Ambassadors = () => {
  return (
    <div className="min-h-screen bg-[#09090b] relative overflow-hidden">
      {/* Glowing ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <motion.div
          className="absolute top-[10%] left-[-10%] w-[700px] h-[700px] rounded-full bg-[#7c93c3]/[0.04] blur-[120px]"
          animate={{ x: [-20, 20, -20], y: [-10, 10, -10] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[50%] right-[-15%] w-[600px] h-[600px] rounded-full bg-[#5a7bbf]/[0.03] blur-[100px]"
          animate={{ x: [20, -20, 20], y: [10, -10, 10] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[5%] left-[25%] w-[500px] h-[500px] rounded-full bg-[#7c93c3]/[0.025] blur-[80px]"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Floating 3D accents */}
        <motion.img
          src={diamondImg}
          alt=""
          className="absolute top-[35%] left-[5%] w-16 opacity-[0.03]"
          animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.img
          src={trophyImg}
          alt=""
          className="absolute top-[65%] right-[8%] w-20 opacity-[0.03]"
          animate={{ y: [15, -15, 15] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <BenefitsSection />
        <HowItWorksSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
};

export default Ambassadors;
