import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Terminal } from "lucide-react";
import arxonLogo from "@/assets/arxon-logo-wide.svg";

const Profile = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-[#09090b]">
      <div className="absolute inset-0 pointer-events-none opacity-[0.014]" style={{backgroundImage:"linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)",backgroundSize:"64px 64px"}}/>
      <AppSidebar />
      <main className="flex-1 relative z-10">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-white/[0.10] bg-[#09090b]/95 backdrop-blur px-6">
          <SidebarTrigger className="text-white/60 hover:text-white/70"/>
          <div className="h-4 w-px bg-white/[0.06]"/>
          <Terminal size={11} className="text-[#a8c3f0]/40"/>
          <span className="font-mono text-[10px] text-white/65 tracking-widest">USER_PROFILE</span>
        </header>
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            <div className="relative bg-[#0a0a0d] border border-white/[0.10] rounded-2xl overflow-hidden p-8">
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#a8c3f0]/25"/>
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#a8c3f0]/25"/>
              <div className="flex flex-col items-center space-y-6">
                <Avatar className="w-24 h-24 border-2 border-[#a8c3f0]/20 rounded-2xl">
                  <AvatarImage src=""/>
                  <AvatarFallback className="bg-[#a8c3f0]/8 text-[#a8c3f0] rounded-2xl"><User className="w-10 h-10"/></AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <div className="font-mono text-[9px] text-white/60 mb-1 tracking-widest">NODE_IDENTITY</div>
                  <h2 className="text-2xl font-bold text-white mb-1">Username</h2>
                  <p className="font-mono text-xs text-white/65">Joined: Not set</p>
                </div>
                <div className="w-full space-y-3">
                  <div className="font-mono text-[9px] text-white/60 tracking-widest">ABOUT_ME</div>
                  <div className="min-h-[80px] p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center font-mono text-xs text-white/60">
                    Tell us about yourself...
                  </div>
                </div>
                <Button className="w-full max-w-xs font-mono text-sm text-[#09090b] font-bold rounded-xl" style={{background:"linear-gradient(135deg,#a8c3f0,#a8b8d8)"}}>
                  EDIT PROFILE
                </Button>
                <div className="w-full grid grid-cols-3 gap-4 pt-6 border-t border-white/[0.09]">
                  {["ARX MINED","REFERRALS","RANK"].map((label,i)=>(
                    <div key={i} className="text-center">
                      <div className="font-mono text-xl font-bold text-white mb-1">0</div>
                      <div className="font-mono text-[9px] text-white/60 tracking-wider">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </SidebarProvider>
);
export default Profile;
