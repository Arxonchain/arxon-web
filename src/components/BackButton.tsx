import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // Simple mapping: page 3 goes to page 2, page 2 goes to page 1
    if (location.pathname === "/partners") {
      navigate("/learn-more");
    } else if (location.pathname === "/learn-more") {
      navigate("/");
    } else if (location.pathname === "/faq") {
      navigate("/");
    } else {
      navigate("/");
    }
  };

  return (
    <button
      onClick={handleBack}
      className="fixed top-20 left-6 z-40 flex items-center gap-2 text-[#a1a1aa] hover:text-white text-sm font-medium transition-all bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] px-3.5 py-2 rounded-lg backdrop-blur-sm"
    >
      <ArrowLeft size={14} />
      Back
    </button>
  );
};

export default BackButton;
