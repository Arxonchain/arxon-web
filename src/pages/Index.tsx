import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import MiningWaitlist from "@/components/MiningWaitlist";
import AmbassadorCTA from "@/components/AmbassadorCTA";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";

const Index = () => (
  <div className="min-h-screen bg-[#09090b]">
    <PageMeta
      title="ARXON - Privacy Chain for the People"
      description="Privacy-first Layer-1 blockchain. Mine $ARX on web or Google Play. Fast, secure, private transactions at scale."
    />
    <Navbar />
    <Hero />
    <StatsBar />
    <MiningWaitlist />
    <AmbassadorCTA />
    <Footer />
  </div>
);
export default Index;
