import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { waitlistSchema } from "@/lib/validations";
import arxonLogo from "@/assets/arxon-logo-wide.svg";
import miningIllustration from "@/assets/mining-illustration.jpg";
import { Loader2, ArrowLeft, CheckCircle2, Send, FaXTwitter as XIcon, Activity, Terminal } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Corner = ({ pos }: { pos:"tl"|"tr"|"bl"|"br" }) => {
  const c={tl:"top-0 left-0 border-t border-l",tr:"top-0 right-0 border-t border-r",bl:"bottom-0 left-0 border-b border-l",br:"bottom-0 right-0 border-b border-r"}[pos];
  return <div className={`absolute ${c} w-4 h-4 border-[#a8c3f0]/30`} />;
};
const inputCls = "w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-4 py-3 text-white/85 text-sm font-mono placeholder:text-white/60 focus:outline-none focus:border-[#a8c3f0]/35 focus:bg-[#a8c3f0]/[0.02] transition-all";

const Waitlist = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hasFollowed, setHasFollowed] = useState(false);
  const [showFollowPrompt, setShowFollowPrompt] = useState(false);
  const [form, setForm] = useState({ name:"", email:"" });

  const handleFollowClick = () => { window.open("https://x.com/ARXONarx","_blank"); setShowFollowPrompt(true); };
  const confirmFollow = () => { setHasFollowed(true); toast({title:"Thank you!",description:"You can now join the waitlist."}); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasFollowed) { toast({title:"Follow Required",description:"Please follow @ARXONarx on X first.",variant:"destructive"}); return; }
    try {
      const data = waitlistSchema.parse(form);
      setLoading(true);
      const { error } = await supabase.from("waitlist").insert([{name:data.name,email:data.email}]);
      if (error) { toast({title:"Error",description:error.message,variant:"destructive"}); return; }
      setSuccess(true);
    } catch (err: any) {
      toast({title:"Validation Error",description:err.message,variant:"destructive"});
    } finally { setLoading(false); }
  };

  if (success) return (
    <div className="min-h-screen bg-[#09090b] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.018]" style={{backgroundImage:"linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)",backgroundSize:"64px 64px"}} />
      <Navbar />
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
          className="relative max-w-[480px] w-full bg-[#0a0a0d] border border-[#a8c3f0]/20 rounded-2xl overflow-hidden p-10 text-center">
          <Corner pos="tl"/><Corner pos="tr"/><Corner pos="bl"/><Corner pos="br"/>
          <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:220}}
            className="w-14 h-14 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={26} className="text-emerald-400"/>
          </motion.div>
          <div className="font-mono text-[9px] text-emerald-400/60 tracking-widest mb-3">WAITLIST_JOINED</div>
          <h2 className="text-2xl font-bold text-white mb-3">You're on the list</h2>
          <p className="text-white/60 text-sm mb-8">You'll be notified as soon as ARX mining goes live. Stay close to our channels for updates.</p>
          <motion.button onClick={()=>navigate("/")} whileHover={{scale:1.02}} whileTap={{scale:0.97}}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-mono text-sm font-bold text-[#09090b]"
            style={{background:"linear-gradient(135deg,#a8c3f0,#a8b8d8)"}}>
            BACK TO HOME
          </motion.button>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.018]" style={{backgroundImage:"linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)",backgroundSize:"64px 64px"}} />
      <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse at 30% 50%,rgba(124,147,195,0.04) 0%,transparent 60%)"}} />
      <Navbar />
      <div className="relative z-10 pt-28 pb-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <motion.button onClick={()=>navigate(-1)} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
            className="flex items-center gap-2 font-mono text-xs text-[#a8c3f0]/60 hover:text-[#a8c3f0] mb-10 transition-colors">
            <ArrowLeft size={12}/>BACK
          </motion.button>

          <div className="grid md:grid-cols-[1fr_460px] gap-10 items-start">
            {/* Form */}
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-6 bg-[#a8c3f0]/40"/>
                <span className="font-mono text-[9px] text-[#a8c3f0]/50 tracking-widest">WAITLIST.register</span>
              </div>
              <img src={arxonLogo} alt="ARXON" className="h-7 mb-5 opacity-80"/>
              <h1 className="text-[clamp(28px,4vw,44px)] font-bold text-white mb-3">Join the Mining <span className="text-[#a8c3f0]">Waitlist</span></h1>
              <p className="text-white/60 text-sm mb-8 max-w-[400px]">Be among the first to start mining $ARX tokens. Enter your details to secure your spot.</p>

              <div className="relative bg-[#0a0a0d] border border-white/[0.10] rounded-2xl overflow-hidden">
                <Corner pos="tl"/><Corner pos="tr"/><Corner pos="bl"/><Corner pos="br"/>
                <div className="flex items-center gap-2 px-6 py-3.5 border-b border-white/[0.09]">
                  <Terminal size={10} className="text-[#a8c3f0]/40"/>
                  <span className="font-mono text-[9px] text-white/60">waitlist_registration.form</span>
                  <div className="flex-1"/>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a8c3f0] animate-pulse"/>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {/* Step 1: Follow */}
                  <div className={`relative rounded-xl p-4 border transition-all ${hasFollowed?"border-emerald-400/20 bg-emerald-400/[0.03]":"border-[#a8c3f0]/15 bg-[#a8c3f0]/[0.02]"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-mono text-[9px] text-white/65 mb-0.5 tracking-widest">STEP_01 / FOLLOW_REQUIRED</div>
                        <div className="text-white/70 text-sm font-semibold">Follow us on X</div>
                      </div>
                      {hasFollowed&&<CheckCircle2 size={18} className="text-emerald-400"/>}
                    </div>
                    <AnimatePresence>
                      {!hasFollowed?(
                        <div className="space-y-2">
                          <motion.button type="button" onClick={handleFollowClick} whileHover={{scale:1.01}} whileTap={{scale:0.98}}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-white/[0.08] text-white/60 font-mono text-xs hover:border-[#a8c3f0]/25 hover:text-white/80 transition-all">
                            <FaXTwitter className="w-3.5 h-3.5"/> FOLLOW @ARXONarx
                          </motion.button>
                          {showFollowPrompt&&(
                            <motion.button type="button" onClick={confirmFollow} initial={{opacity:0}} animate={{opacity:1}} whileHover={{scale:1.01}} whileTap={{scale:0.98}}
                              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-mono text-xs font-bold text-[#09090b]"
                              style={{background:"linear-gradient(135deg,#a8c3f0,#a8b8d8)"}}>
                              <CheckCircle2 size={12}/> I'VE FOLLOWED
                            </motion.button>
                          )}
                        </div>
                      ):(
                        <motion.p initial={{opacity:0}} animate={{opacity:1}} className="font-mono text-xs text-emerald-400/70">✓ Following confirmed</motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Step 2: Details */}
                  <div className="space-y-3">
                    <div className="font-mono text-[9px] text-white/65 tracking-widest">STEP_02 / YOUR_DETAILS</div>
                    <div>
                      <label className="font-mono text-[9px] text-white/50 block mb-1.5 tracking-widest">FULL_NAME</label>
                      <input className={inputCls} placeholder="Your full name" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} required disabled={!hasFollowed}/>
                    </div>
                    <div>
                      <label className="font-mono text-[9px] text-white/50 block mb-1.5 tracking-widest">EMAIL_ADDRESS</label>
                      <input className={inputCls} type="email" placeholder="your@email.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} required disabled={!hasFollowed}/>
                    </div>
                  </div>

                  <motion.button type="submit" disabled={loading||!hasFollowed}
                    whileHover={{scale:1.01,boxShadow:"0 0 30px rgba(124,147,195,0.22)"}} whileTap={{scale:0.98}}
                    className="w-full relative overflow-hidden flex items-center justify-center gap-2 py-3.5 rounded-xl font-mono text-sm font-bold text-[#09090b] disabled:opacity-40"
                    style={{background:"linear-gradient(135deg,#a8c3f0,#a8b8d8)"}}>
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{x:["-200%","200%"]}} transition={{duration:2.5,repeat:Infinity,ease:"linear",repeatDelay:1}}/>
                    <span className="relative z-10 flex items-center gap-2">
                      {loading?<><Activity size={13} className="animate-spin"/>JOINING...</>:<><Send size={13}/>JOIN WAITLIST</>}
                    </span>
                  </motion.button>
                  <p className="font-mono text-[9px] text-white/60 text-center">You'll be notified when ARX mining becomes available.</p>
                </form>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.15}} className="hidden md:block">
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.10]">
                <img src={miningIllustration} alt="Mining" className="w-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent"/>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="font-mono text-[9px] text-[#a8c3f0]/60 mb-1">MINING_STATUS</div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#a8c3f0] animate-pulse"/>
                    <span className="font-mono text-xs text-white/50">LAUNCHING JAN 2026</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Waitlist;
