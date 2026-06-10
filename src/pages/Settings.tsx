import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Switch } from "@/components/ui/switch";
import { Bell, Shield, Palette, Globe, Terminal } from "lucide-react";

const sections = [
  { icon:Bell, id:"NOTIFICATIONS", title:"Notifications", desc:"Manage how you receive notifications",
    items:[{id:"mining-alerts",label:"Mining Alerts",sub:"Get notified about mining activities",def:false},{id:"transaction-alerts",label:"Transaction Alerts",sub:"Get notified about transactions",def:false},{id:"security-alerts",label:"Security Alerts",sub:"Important security notifications",def:true}] },
  { icon:Shield, id:"SECURITY", title:"Security", desc:"Manage your account security settings",
    items:[{id:"2fa",label:"Two-Factor Authentication",sub:"Add an extra layer of security",def:false},{id:"session",label:"Session Timeout",sub:"Auto-logout after 30 minutes of inactivity",def:true}] },
  { icon:Palette, id:"APPEARANCE", title:"Appearance", desc:"Customize your interface preferences",
    items:[{id:"dark",label:"Dark Mode",sub:"Use dark theme (recommended)",def:true},{id:"animations",label:"Animations",sub:"Enable interface animations",def:true}] },
  { icon:Globe, id:"NETWORK", title:"Network", desc:"Configure network and data settings",
    items:[{id:"testnet",label:"Show Testnet",sub:"Display testnet networks",def:false},{id:"analytics",label:"Usage Analytics",sub:"Help improve Arxon (anonymous)",def:true}] },
];

const Settings = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-[#09090b]">
      <div className="absolute inset-0 pointer-events-none opacity-[0.014]" style={{backgroundImage:"linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)",backgroundSize:"64px 64px"}}/>
      <AppSidebar />
      <main className="flex-1 relative z-10">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-white/[0.06] bg-[#09090b]/95 backdrop-blur px-6">
          <SidebarTrigger className="text-white/40 hover:text-white/70"/>
          <div className="h-4 w-px bg-white/[0.06]"/>
          <Terminal size={11} className="text-[#7c93c3]/40"/>
          <span className="font-mono text-[10px] text-white/25 tracking-widest">SYSTEM_SETTINGS</span>
        </header>
        <div className="p-6 space-y-4">
          <div className="max-w-2xl mx-auto space-y-4">
            {sections.map((sec,si)=>(
              <div key={si} className="relative bg-[#0a0a0d] border border-white/[0.06] rounded-xl overflow-hidden">
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#7c93c3]/20"/>
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.04]">
                  <div className="w-7 h-7 rounded-md bg-[#7c93c3]/8 border border-[#7c93c3]/12 flex items-center justify-center">
                    <sec.icon size={13} className="text-[#7c93c3]/60"/>
                  </div>
                  <div>
                    <div className="font-mono text-[8px] text-[#7c93c3]/35 tracking-widest">{sec.id}</div>
                    <div className="text-white/80 text-sm font-semibold leading-tight">{sec.title}</div>
                  </div>
                  <span className="ml-auto font-mono text-[8px] text-white/15">{sec.desc}</span>
                </div>
                <div className="p-4 space-y-1">
                  {sec.items.map((item,ii)=>(
                    <div key={ii} className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-white/[0.01] transition-colors">
                      <div>
                        <div className="text-white/70 text-sm font-medium">{item.label}</div>
                        <div className="font-mono text-[9px] text-white/25">{item.sub}</div>
                      </div>
                      <Switch id={item.id} defaultChecked={item.def} className="data-[state=checked]:bg-[#7c93c3]"/>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  </SidebarProvider>
);
export default Settings;
