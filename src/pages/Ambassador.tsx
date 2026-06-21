import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle, Users, FileText, Radio, Wallet } from "lucide-react";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import Footer from "@/components/Footer";

const criteria = [
  {
    icon: <Users size={22} />,
    title: "Community Size",
    description: "A minimum of 100 people in your community or following to qualify as an Arxon Ambassador.",
  },
  {
    icon: <FileText size={22} />,
    title: "Content Commitment",
    description: "Minimum 8 posts + 2 spaces required. Once selected, maintain at least 3 posts per week, every week.",
  },
  {
    icon: <Radio size={22} />,
    title: "Weekly Activity",
    description: "Stay consistently active — 3 posts per week minimum is required throughout your ambassador term.",
  },
  {
    icon: <Wallet size={22} />,
    title: "Arxon Account",
    description: "You must have an active Arxon account before applying. No exceptions.",
  },
];

const Ambassador = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09090b]">
      <Navbar />
      <BackButton />

      <motion.div
        initial={{ opacity: 0, y: 60, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
      >
        {/* ── Hero ── */}
        <section className="relative bg-[#09090b] pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

          {/* Animated background glows */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,hsl(220_50%_40%/0.15)_0%,transparent_60%)]"
            />
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[#7c93c3]/30"
                style={{ left: `${10 + i * 16}%`, top: `${20 + (i % 3) * 22}%` }}
                animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
              />
            ))}
          </div>

          <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[#7c93c3] text-sm md:text-base font-light mb-4 tracking-widest uppercase"
            >
              Ambassador Program
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Represent{" "}
              <span className="text-[#7c93c3]">Arxon</span>
              <br />
              to the World
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="text-[#71717a] text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
            >
              Join a global network of voices shaping the future of private, fast, and secure transactions.
              Spread the word. Build the community. Earn your place.
            </motion.p>

            <motion.button
              onClick={() => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" })}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: 1.04, boxShadow: "0 0 60px rgba(124,147,195,0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="group relative inline-flex items-center gap-3 bg-[#7c93c3] hover:bg-[#8da3d3] text-[#09090b] text-lg font-bold px-12 py-5 rounded-2xl transition-all shadow-[0_0_40px_rgba(124,147,195,0.25)]"
            >
              <motion.span
                className="absolute inset-0 rounded-2xl border-2 border-[#7c93c3]/30"
                animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              Apply Now
              <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </motion.button>
          </div>
        </section>

        {/* ── Criteria ── */}
        <section className="relative bg-[#09090b] py-20 md:py-28">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          <div className="max-w-[1200px] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <p className="text-[#52525b] text-sm uppercase tracking-widest mb-3">Requirements</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Do you qualify?
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {criteria.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 hover:border-[#7c93c3]/30 hover:bg-white/[0.05] transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#7c93c3]/10 border border-[#7c93c3]/20 flex items-center justify-center text-[#7c93c3]">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                      <p className="text-[#71717a] text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Apply Form ── */}
        <section id="apply" className="relative bg-[#09090b] py-20 md:py-28">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

          <div className="max-w-[600px] mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10"
            >
              <p className="text-[#52525b] text-sm uppercase tracking-widest mb-3">Application</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Apply to become an Ambassador
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 space-y-5"
            >
              {/* Full Name */}
              <div>
                <label className="block text-[#a1a1aa] text-sm mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-[#52525b] text-sm focus:outline-none focus:border-[#7c93c3]/50 transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#a1a1aa] text-sm mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-[#52525b] text-sm focus:outline-none focus:border-[#7c93c3]/50 transition-colors"
                />
              </div>

              {/* Arxon Username */}
              <div>
                <label className="block text-[#a1a1aa] text-sm mb-2">Arxon Username</label>
                <input
                  type="text"
                  placeholder="Your Arxon account username"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-[#52525b] text-sm focus:outline-none focus:border-[#7c93c3]/50 transition-colors"
                />
              </div>

              {/* Social / Community Link */}
              <div>
                <label className="block text-[#a1a1aa] text-sm mb-2">Community / Social Link</label>
                <input
                  type="url"
                  placeholder="Twitter, Telegram, Discord, etc."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-[#52525b] text-sm focus:outline-none focus:border-[#7c93c3]/50 transition-colors"
                />
              </div>

              {/* Community Size */}
              <div>
                <label className="block text-[#a1a1aa] text-sm mb-2">Community / Follower Count</label>
                <input
                  type="number"
                  placeholder="e.g. 2500"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-[#52525b] text-sm focus:outline-none focus:border-[#7c93c3]/50 transition-colors"
                />
              </div>

              {/* Why */}
              <div>
                <label className="block text-[#a1a1aa] text-sm mb-2">Why do you want to be an Arxon Ambassador?</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about yourself and why you'd be a great fit..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-[#52525b] text-sm focus:outline-none focus:border-[#7c93c3]/50 transition-colors resize-none"
                />
              </div>

              {/* Checklist confirmation */}
              <div className="space-y-3 pt-2">
                {[
                  "I have a minimum of 100 people in my community",
                  "I commit to 8 posts + 2 spaces minimum",
                  "I will post at least 3 times per week if selected",
                  "I have an active Arxon account",
                ].map((item, i) => (
                  <label key={i} className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="mt-0.5 accent-[#7c93c3] w-4 h-4 flex-shrink-0"
                    />
                    <span className="text-[#71717a] text-sm group-hover:text-[#a1a1aa] transition-colors">{item}</span>
                  </label>
                ))}
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(124,147,195,0.3)" }}
                whileTap={{ scale: 0.97 }}
                className="w-full group relative inline-flex items-center justify-center gap-3 bg-[#7c93c3] hover:bg-[#8da3d3] text-[#09090b] font-bold py-4 rounded-xl transition-all mt-2"
              >
                Submit Application
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>

              <p className="text-[#3f3f46] text-xs text-center pt-1">
                Our team reviews all applications. You'll hear back within 5–7 business days.
              </p>
            </motion.div>
          </div>
        </section>

      </motion.div>
      <Footer />
    </div>
  );
};

export default Ambassador;
