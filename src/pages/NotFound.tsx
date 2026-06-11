import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Terminal, ArrowLeft, AlertCircle } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{backgroundImage:"linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)",backgroundSize:"64px 64px"}} />
      <div className="absolute inset-0" style={{background:"radial-gradient(ellipse at center,rgba(124,147,195,0.04) 0%,transparent 65%)"}}/>
      <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} className="text-center max-w-[480px] w-full">
        <div className="relative bg-[#0a0a0d] border border-[#a8c3f0]/20 rounded-2xl overflow-hidden p-10">
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#a8c3f0]/30"/>
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#a8c3f0]/30"/>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#a8c3f0]/30"/>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#a8c3f0]/30"/>
          <div className="w-14 h-14 rounded-xl bg-red-400/8 border border-red-400/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={24} className="text-red-400/70"/>
          </div>
          <div className="font-mono text-[9px] text-red-400/50 tracking-widest mb-3">ERROR_404 / ROUTE_NOT_FOUND</div>
          <h1 className="text-4xl font-bold text-white mb-3">404</h1>
          <p className="text-white/60 text-sm mb-8">The requested route does not exist in this protocol.</p>
          <motion.button onClick={()=>navigate("/")} whileHover={{scale:1.02}} whileTap={{scale:0.97}}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-mono text-sm font-bold text-[#09090b]"
            style={{background:"linear-gradient(135deg,#a8c3f0,#a8b8d8)"}}>
            <ArrowLeft size={13}/> RETURN TO HOME
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
export default NotFound;
