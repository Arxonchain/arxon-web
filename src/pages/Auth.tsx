import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, Terminal, Activity, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { authSchema } from "@/lib/validations";
import { motion, AnimatePresence } from "framer-motion";

const RATE_LIMIT_KEY = 'auth_attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;

const checkRateLimit = (): { allowed: boolean; remainingTime?: number } => {
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  if (!stored) return { allowed: true };
  const { count, timestamp } = JSON.parse(stored);
  const timeSinceFirst = Date.now() - timestamp;
  if (timeSinceFirst > LOCKOUT_DURATION) { localStorage.removeItem(RATE_LIMIT_KEY); return { allowed: true }; }
  if (count >= MAX_ATTEMPTS) return { allowed: false, remainingTime: Math.ceil((LOCKOUT_DURATION - timeSinceFirst) / 60000) };
  return { allowed: true };
};

const recordAttempt = () => {
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  const now = Date.now();
  if (!stored) { localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: 1, timestamp: now })); return; }
  const { count, timestamp } = JSON.parse(stored);
  if (Date.now() - timestamp > LOCKOUT_DURATION) localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: 1, timestamp: now }));
  else localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: count + 1, timestamp }));
};

const inputCls = "w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-4 py-3 text-white/85 text-sm font-mono placeholder:text-white/20 focus:outline-none focus:border-[#7c93c3]/35 focus:bg-[#7c93c3]/[0.02] transition-all pr-10";
const Corner = ({ pos }: { pos:"tl"|"tr"|"bl"|"br" }) => {
  const c={tl:"top-0 left-0 border-t border-l",tr:"top-0 right-0 border-t border-r",bl:"bottom-0 left-0 border-b border-l",br:"bottom-0 right-0 border-b border-r"}[pos];
  return <div className={`absolute ${c} w-4 h-4 border-[#7c93c3]/30`}/>;
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { if (session) navigate("/waitlist-admin"); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => { if (session) navigate("/waitlist-admin"); });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rl = checkRateLimit();
    if (!rl.allowed) { toast({ title:"Too many attempts", description:`Try again in ${rl.remainingTime} minutes.`, variant:"destructive" }); return; }
    try {
      authSchema.parse({ email, password });
      setLoading(true);
      recordAttempt();
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { toast({ title:"Error", description: error.message, variant:"destructive" }); }
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) toast({ title:"Error", description: error.message, variant:"destructive" });
        else toast({ title:"Check your email", description:"Confirmation link sent." });
      }
    } catch (err: any) {
      toast({ title:"Validation error", description: err.message, variant:"destructive" });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.018]" style={{backgroundImage:"linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)",backgroundSize:"64px 64px"}}/>
      <div className="absolute inset-0" style={{background:"radial-gradient(ellipse at center,rgba(124,147,195,0.04) 0%,transparent 65%)"}}/>
      <motion.div initial={{opacity:0,y:24,scale:0.97}} animate={{opacity:1,y:0,scale:1}} className="relative max-w-[420px] w-full">
        <div className="relative bg-[#0a0a0d] border border-white/[0.06] rounded-2xl overflow-hidden">
          <Corner pos="tl"/><Corner pos="tr"/><Corner pos="bl"/><Corner pos="br"/>
          <div className="flex items-center gap-2 px-6 py-3.5 border-b border-white/[0.05]">
            <Lock size={10} className="text-[#7c93c3]/40"/>
            <span className="font-mono text-[9px] text-white/20 tracking-widest">ADMIN_AUTH</span>
            <div className="flex-1"/>
            <div className="flex items-center gap-1.5">
              <Activity size={9} className="text-[#7c93c3]/40 animate-pulse"/>
              <span className="font-mono text-[8px] text-white/15">SECURE</span>
            </div>
          </div>
          <div className="p-8">
            <div className="w-12 h-12 rounded-xl bg-[#7c93c3]/8 border border-[#7c93c3]/15 flex items-center justify-center mb-5">
              <Lock size={20} className="text-[#7c93c3]"/>
            </div>
            <div className="font-mono text-[9px] text-[#7c93c3]/50 tracking-widest mb-2">{isLogin?"SIGN_IN":"REGISTER"}</div>
            <h1 className="text-xl font-bold text-white mb-5">Admin Access</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-mono text-[9px] text-white/30 block mb-1.5 tracking-widest">EMAIL_ADDRESS</label>
                <input className={inputCls} type="email" placeholder="admin@arxon.io" value={email} onChange={e=>setEmail(e.target.value)} required/>
              </div>
              <div>
                <label className="font-mono text-[9px] text-white/30 block mb-1.5 tracking-widest">PASSWORD</label>
                <div className="relative">
                  <input className={inputCls} type={showPw?"text":"password"} placeholder="••••••••••" value={password} onChange={e=>setPassword(e.target.value)} required/>
                  <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                    {showPw?<EyeOff size={14}/>:<Eye size={14}/>}
                  </button>
                </div>
              </div>
              <motion.button type="submit" disabled={loading}
                whileHover={{scale:1.01,boxShadow:"0 0 30px rgba(124,147,195,0.22)"}} whileTap={{scale:0.98}}
                className="w-full relative overflow-hidden flex items-center justify-center gap-2 py-3.5 rounded-xl font-mono text-sm font-bold text-[#09090b] disabled:opacity-40 mt-2"
                style={{background:"linear-gradient(135deg,#7c93c3,#a8b8d8)"}}>
                <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{x:["-200%","200%"]}} transition={{duration:2.5,repeat:Infinity,ease:"linear",repeatDelay:1}}/>
                <span className="relative z-10 flex items-center gap-2">
                  {loading?<><Activity size={13} className="animate-spin"/>AUTHENTICATING...</>:<>{isLogin?"SIGN IN":"REGISTER"}</>}
                </span>
              </motion.button>
            </form>
            <button onClick={()=>setIsLogin(!isLogin)} className="w-full text-center font-mono text-[10px] text-white/25 hover:text-white/50 transition-colors mt-4">
              {isLogin?"Don't have an account? Register →":"Have an account? Sign in →"}
            </button>
          </div>
        </div>
        <button onClick={()=>navigate("/")} className="flex items-center gap-2 font-mono text-[10px] text-white/20 hover:text-white/40 transition-colors mx-auto mt-4 w-fit">
          <ArrowLeft size={10}/> BACK TO HOME
        </button>
      </motion.div>
    </div>
  );
};
export default Auth;
