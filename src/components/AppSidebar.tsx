import { useState, useEffect } from "react";
import { Home, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { verifyApprovedAdminAccess } from "@/lib/adminAccess";
import arxonIcon from "@/assets/arxon-logo-wide.svg";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const baseItems = [
  { title: "Home", url: "/", icon: Home },
];

const adminItems = [
  { title: "Admin", url: "/admin", icon: Users },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [items, setItems] = useState(baseItems);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setItems(baseItems);
      return;
    }

    const access = await verifyApprovedAdminAccess(session.user.id);

    if (access.allowed) {
      setIsAdmin(true);
      setItems([...baseItems, ...adminItems]);
    } else {
      setItems(baseItems);
    }
  };

  return (
    <Sidebar className="border-r border-primary/20 bg-gradient-to-b from-background via-background/95 to-card/50">
      <SidebarContent className="pt-6">
        <div 
          className="px-4 mb-8 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/')}
        >
          <img 
            src={arxonIcon} 
            alt="ARXON" 
            className="w-10 h-10 flex-shrink-0"
          />
          {open && (
            <span className="text-2xl font-bold" style={{ color: "#C4CDCC" }}>
              Arxon
            </span>
          )}
        </div>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                     <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ease-in-out ${
                          isActive
                            ? "bg-primary/20 text-primary font-medium border border-primary/30"
                            : "text-white hover:bg-primary/10 hover:text-primary hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="pb-6">
        <div className="px-4">
          <img 
            src={arxonIcon} 
            alt="ARXON" 
            className={`transition-all duration-300 ${open ? 'w-16' : 'w-8'} mx-auto opacity-30`}
          />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
