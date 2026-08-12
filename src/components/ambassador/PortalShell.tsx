import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export function PortalShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#08080c]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(168,195,240,0.09), transparent 55%), radial-gradient(ellipse 40% 30% at 100% 20%, rgba(124,147,195,0.06), transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(168,195,240,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(168,195,240,0.7) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      <div className="relative z-10">
        <Navbar />
        <main className="px-4 pb-20 pt-28 md:px-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
