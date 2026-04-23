import { useState, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { DollarSign, Users, TrendingUp, Zap, ArrowRight, Mail, ChevronLeft, ChevronRight, Rocket } from "lucide-react";
import { FaXTwitter, FaDiscord, FaMedium } from "react-icons/fa6";
import move1 from "@/assets/move-1.png";
import move2 from "@/assets/move-2.png";
import move3 from "@/assets/move-3.png";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Investors = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const faqRef = useRef(null);
  const faqInView = useInView(faqRef, { once: true, margin: "-80px" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentPair, setCurrentPair] = useState(0);

  const highlights = [
    { icon: DollarSign, title: "$1B+ Market Opportunity", description: "Addressing payments, voting, and supply chain across global markets." },
    { icon: Users, title: "Massive TAM", description: "Small businesses to Fortune 500, local to national governments, millions of voters." },
    { icon: TrendingUp, title: "First-Mover Advantage", description: "Addressing payments, voting, and supply chain across global markets." },
    { icon: Zap, title: "Multiple Revenue Streams", description: "Transaction fees, token creation fees, enterprise licensing, government contracts." },
  ];

  const totalPairs = Math.ceil(highlights.length / 2);

  const goTo = useCallback((pair: number) => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector(`[data-index="${pair * 2}"]`) as HTMLElement;
    if (card) {
      scrollRef.current.scrollTo({ left: card.offsetLeft - 12, behavior: "smooth" });
      setCurrentPair(pair);
    }
  }, []);

  const faqs = [
    { question: "What is Arxon?", answer: "Arxon is a privacy-focused blockchain built on its own Network, designed to address payments, voting, and supply chain management across global markets while maintaining complete privacy and security." },
    { question: "When does mining start?", answer: "Mining starts in JAN 2026. Users will mine ARX-P (points) offchain to earn real ARX tokens. ARX-P is a point system that allows users to accumulate rewards, which can then be converted to ARX, the actual onchain token. Mining can be done directly from your web browser." },
    { question: "What is the $ARX token used for?", answer: "$ARX is the native token of the Arxon network, used for transactions, governance, and accessing features within the ecosystem. It powers payments, voting, and supply chain applications." },
    { question: "How does privacy work?", answer: "Arxon is built on Arxon chain, which provides native privacy features. All transactions and data are encrypted by choice, ensuring complete confidentiality based on user's consent while maintaining the security benefits of blockchain technology." },
    { question: "When is the private voting dApp coming?", answer: "The private voting dApp is currently in development and will be released following the mining phase. Stay tuned to our community channels for updates on the launch timeline." },
    { question: "Is Arxon open source?", answer: "Yes, Arxon is committed to transparency and will be open source. The codebase will be available for community review and contribution as we progress through development." },
    { question: "Can I invest in the seed round?", answer: "Yes, we're raising $30M to $300M in our pre-seed round with a 4-year vesting schedule. Email us at arxonchain@yahoo.com or apply directly through our investor form.", hasLink: true },
    { question: "How do I stay updated?", answer: "Join our community on Discord, follow us on X (Twitter), and join our Telegram channel. You can also join the waitlist to receive direct updates about mining and major announcements." },
  ];

  return (
    <>
      {/* Invest section */}
      <section id="invest" className="relative bg-[#09090b] py-24 md:py-32" ref={ref}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-[44px] leading-[1.1] tracking-[-0.03em] text-white font-extralight">
              Join the privacy{" "}
              <span className="text-[#7c93c3] font-bold">revolution</span>
            </h2>
            <p className="mt-5 text-[#71717a] text-base max-w-[520px] mx-auto font-light">
              Arxon is driving the future of private transactions across industries.
              Be part of building the privacy infrastructure the world needs.
            </p>
          </motion.div>

          {/* Desktop: 4-column grid */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04] rounded-xl overflow-hidden border border-white/[0.06] mb-16">
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-[#09090b] p-7 hover:bg-[#0f0f13] transition-colors duration-300 group"
              >
                <h.icon
                  size={18}
                  strokeWidth={1.5}
                  className="text-[#52525b] group-hover:text-[#7c93c3] transition-colors mb-5"
                />
                <h4 className="text-white text-[14px] font-bold mb-2">{h.title}</h4>
                <p className="text-[#52525b] text-[12px] leading-relaxed font-light">{h.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Mobile: 2 cards per view carousel */}
          <div className="md:hidden mb-16">
            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-1 pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {highlights.map((h, i) => (
                <motion.div
                  key={i}
                  data-index={i}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex-shrink-0 w-[calc(50%-6px)] snap-start bg-[#0f0f13] border border-white/[0.06] rounded-xl p-5 group"
                >
                  <h.icon
                    size={18}
                    strokeWidth={1.5}
                    className="text-[#52525b] group-hover:text-[#7c93c3] transition-colors mb-4"
                  />
                  <h4 className="text-white text-[13px] font-bold mb-2">{h.title}</h4>
                  <p className="text-[#52525b] text-[11px] leading-relaxed font-light">{h.description}</p>
                </motion.div>
              ))}
            </div>
            {/* Arrows + Dots */}
            <div className="flex items-center justify-center gap-4 mt-3">
              <button
                onClick={() => goTo(Math.max(0, currentPair - 1))}
                disabled={currentPair === 0}
                className="w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center text-[#a1a1aa] disabled:opacity-30 hover:border-white/20 transition-all"
              >
                <ChevronLeft size={14} />
              </button>
              <div className="flex gap-1.5">
                {Array.from({ length: totalPairs }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i === currentPair ? "bg-[#7c93c3] w-4" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => goTo(Math.min(totalPairs - 1, currentPair + 1))}
                disabled={currentPair === totalPairs - 1}
                className="w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center text-[#a1a1aa] disabled:opacity-30 hover:border-white/20 transition-all"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* CTA - Enhanced Investment Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#0f0f13] to-[#0a0a0e] p-10 md:p-14 text-center max-w-[750px] mx-auto relative overflow-hidden group"
          >
            {/* Animated background glow */}
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(220_50%_30%/0.1)_0%,transparent_70%)]"
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t border-l border-[#7c93c3]/20 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b border-r border-[#7c93c3]/20 rounded-br-2xl" />

            {/* Floating particles */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[#7c93c3]/20"
                style={{ left: `${20 + i * 20}%`, top: `${15 + (i % 2) * 60}%` }}
                animate={{ y: [0, -15, 0], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              />
            ))}

            <div className="relative z-10">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Rocket size={36} strokeWidth={1.2} className="text-[#7c93c3] mx-auto mb-6" />
              </motion.div>
              <h3 className="text-white text-2xl md:text-3xl font-bold tracking-[-0.02em] mb-3">
                Invest in the Future of Privacy
              </h3>
              <p className="text-[#71717a] text-sm md:text-base leading-relaxed mb-4 max-w-lg mx-auto font-light">
                Whether you're looking to partner with us, fund the building phase, or pre-seed any phase of the project, we want to hear from you.
              </p>
              <p className="text-[#7c93c3]/80 text-xs md:text-sm leading-relaxed mb-8 max-w-md mx-auto font-light italic">
                "Building privacy infrastructure for the world. Reach out to us and apply, let's shape the future together."
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.button
                  onClick={() => (window.location.href = "/investor-form")}
                  whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(124,147,195,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-shimmer group bg-[#7c93c3] text-[#09090b] text-sm font-bold px-8 py-3.5 rounded-xl hover:bg-[#8da3d3] transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(124,147,195,0.15)]"
                >
                  Investors Form
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </motion.button>
                <a
                  href="mailto:arxonchain@yahoo.com"
                  className="text-[#71717a] hover:text-white text-sm flex items-center gap-2 transition-colors font-medium"
                >
                  <Mail size={14} />
                  arxonchain@yahoo.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Community */}
      <section className="relative bg-[#09090b] py-20">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="rounded-xl border border-white/[0.06] bg-[#0f0f13] overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-10 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/[0.06] group">
                <div className="flex items-center gap-3">
                  <img src={move1} alt="Arxon" className="w-12 h-12 rounded-xl group-hover:rotate-6 transition-transform duration-500 border border-white/[0.06]" />
                  <img src={move2} alt="Privacy" className="w-10 h-10 rounded-lg rotate-12 group-hover:rotate-0 transition-transform duration-500 border border-white/[0.06]" />
                  <img src={move3} alt="Security" className="w-10 h-10 rounded-lg -rotate-12 group-hover:rotate-6 transition-transform duration-500 border border-white/[0.06]" />
                </div>
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <h3 className="text-white text-xl md:text-2xl font-bold tracking-[-0.02em] mb-5">
                  Join the Arxon community
                </h3>
                <div className="flex gap-2">
                  {[
                    { href: "https://discord.gg/mGWg3mnkvZ", icon: FaDiscord },
                    { href: "https://x.com/ARXONarx", icon: FaXTwitter },
                    { href: "https://medium.com/@arxondigest", icon: FaMedium },
                  ].map(({ href, icon: Icon }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:border-[#7c93c3]/30 hover:bg-white/[0.06] transition-all"
                    >
                      <Icon className="w-4 h-4 text-[#52525b] hover:text-white transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative bg-[#09090b] py-24 md:py-32" ref={faqRef}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="max-w-[680px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-[44px] leading-[1.1] tracking-[-0.03em] text-white font-extralight">
              Frequently asked{" "}
              <span className="text-[#7c93c3] font-bold">questions</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <Accordion type="single" collapsible>
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border-b border-white/[0.06] py-1"
                >
                  <AccordionTrigger className="text-white hover:no-underline text-left text-[14px] md:text-[15px] font-bold py-4 hover:text-white/80 transition-colors [&[data-state=open]>svg]:rotate-180">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#52525b] text-[13px] leading-relaxed pb-4 font-light">
                    {faq.question === "Can I invest in the seed round?" ? (
                      <div>
                        <p>Yes! Reach out to us to learn more:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Email us at <a href="mailto:arxonchain@yahoo.com" className="text-[#7c93c3] hover:underline">arxonchain@yahoo.com</a></li>
                          <li><a href="/investor-form" className="text-[#7c93c3] hover:underline">Fill out the Investors Form</a></li>
                        </ul>
                      </div>
                    ) : (
                      faq.answer
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative bg-[#09090b] py-24 md:py-32">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_bottom,hsl(220_50%_25%/0.1)_0%,transparent_70%)]" />

        <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-[56px] leading-[1.1] tracking-[-0.04em] text-white font-extralight mb-8"
          >
            Privacy reimagined.
            <br />
            <span className="text-[#7c93c3] font-bold">Available today.</span>
          </motion.h2>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://arxonchain.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white text-[#09090b] text-sm font-bold px-7 py-3 rounded-lg hover:bg-white/95 transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(124,147,195,0.15)]"
            >
              Start Mining
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="mailto:arxonchain@yahoo.com"
              className="text-[#a1a1aa] hover:text-white text-sm transition-colors font-medium border border-white/[0.08] px-6 py-3 rounded-lg hover:border-white/[0.15]"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Investors;
