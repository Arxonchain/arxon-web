import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import MiningWaitlist from "@/components/MiningWaitlist";
// AMBASSADOR PROGRAM — hidden from public (re-enable when ready)
// import AmbassadorCTA from "@/components/AmbassadorCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <Navbar />
      <Hero />
      <StatsBar />
      <MiningWaitlist />
      {/* AMBASSADOR PROGRAM — hidden from public (re-enable when ready) */}
      {/* <AmbassadorCTA /> */}
      <Footer />
    </div>
  );
};

export default Index;
