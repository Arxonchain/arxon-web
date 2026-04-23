import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Send, CheckCircle2, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AmbassadorApply = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    x_handle: "",
    arxon_account_id: "",
    follower_count: "",
    post_link_1: "",
    post_link_2: "",
    post_link_3: "",
    post_link_4: "",
    post_link_5: "",
    motivation: "",
    estimated_new_users: "",
    previous_experience: "",
  });

  const updateField = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.x_handle || !form.arxon_account_id || !form.motivation) {
      toast.error("Please fill in all required fields");
      return;
    }

    const postLinks = [form.post_link_1, form.post_link_2, form.post_link_3, form.post_link_4, form.post_link_5].filter(Boolean);
    if (postLinks.length < 3) {
      toast.error("Please provide at least 3 recent post links");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("ambassador_applications").insert({
        full_name: form.full_name.trim(),
        x_handle: form.x_handle.trim(),
        arxon_account_id: form.arxon_account_id.trim(),
        follower_count: parseInt(form.follower_count) || 0,
        recent_post_links: postLinks,
        motivation: form.motivation.trim(),
        estimated_new_users: parseInt(form.estimated_new_users) || 0,
        previous_experience: form.previous_experience.trim() || null,
      });

      if (error) {
        if (error.code === "23505") {
          toast.error("An application with this Arxon Account ID already exists");
        } else {
          toast.error("Failed to submit application. Please try again.");
        }
        return;
      }

      setSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#52525b] focus:outline-none focus:border-[#7c93c3]/40 transition-colors";

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#09090b] relative overflow-hidden">
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#7c93c3]/[0.04] blur-[120px]" />
          <div className="absolute top-[60%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#5a7bbf]/[0.03] blur-[100px]" />
        </div>
        <div className="relative z-10">
          <Navbar />
          <div className="pt-28 pb-20 px-6">
            <div className="max-w-[600px] mx-auto text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="mb-6">
                <CheckCircle2 size={64} className="text-green-400 mx-auto" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-3">Application Submitted!</h2>
              <p className="text-[#a1a1aa] text-sm mb-6">
                Your ambassador application has been received. You can now access your personal portal 
                using your Arxon Account ID to submit your content links during the 30-day challenge.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  onClick={() => navigate("/ambassadors/portal")}
                  whileHover={{ scale: 1.03 }}
                  className="bg-[#7c93c3] text-white font-bold px-6 py-3 rounded-xl text-sm"
                >
                  Go to My Portal
                </motion.button>
                <motion.button
                  onClick={() => navigate("/ambassadors")}
                  whileHover={{ scale: 1.03 }}
                  className="border border-white/10 text-white/80 font-semibold px-6 py-3 rounded-xl text-sm"
                >
                  Back to Program
                </motion.button>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#7c93c3]/[0.04] blur-[120px]" />
        <div className="absolute top-[60%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#5a7bbf]/[0.03] blur-[100px]" />
        <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] rounded-full bg-[#7c93c3]/[0.025] blur-[80px]" />
      </div>
      <div className="relative z-10">
        <Navbar />
        <div className="pt-28 pb-20 px-6">
          <div className="max-w-[700px] mx-auto">
            <motion.button
              onClick={() => navigate("/ambassadors")}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-[#7c93c3] text-sm font-semibold mb-8 hover:gap-3 transition-all"
            >
              <ArrowLeft size={16} /> Back to Ambassador Program
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#7c93c3]/20 bg-[#7c93c3]/5 text-[#7c93c3] text-xs font-semibold mb-4"
              >
                <Sparkles size={12} /> Ambassador Application
              </motion.div>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">
                Apply <span className="text-[#7c93c3]">Now</span>
              </h1>
              <p className="text-[#a1a1aa] text-sm">
                Fill out the form below to start your ambassador journey
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-white/70 text-xs font-medium mb-1.5 block">Full Name *</label>
                  <input className={inputClass} placeholder="Your full name" value={form.full_name} onChange={e => updateField("full_name", e.target.value)} />
                </div>
                <div>
                  <label className="text-white/70 text-xs font-medium mb-1.5 block">X (Twitter) Handle *</label>
                  <input className={inputClass} placeholder="@yourhandle" value={form.x_handle} onChange={e => updateField("x_handle", e.target.value)} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-white/70 text-xs font-medium mb-1.5 block">Arxon Account ID *</label>
                  <input className={inputClass} placeholder="Your Arxon app account ID" value={form.arxon_account_id} onChange={e => updateField("arxon_account_id", e.target.value)} />
                </div>
                <div>
                  <label className="text-white/70 text-xs font-medium mb-1.5 block">Follower Count</label>
                  <input className={inputClass} type="number" placeholder="e.g. 5000" value={form.follower_count} onChange={e => updateField("follower_count", e.target.value)} />
                </div>
              </div>

              <div>
                <label className="text-white/70 text-xs font-medium mb-1.5 block">Links to 3-5 Recent Crypto/Web3 Posts *</label>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(n => (
                    <input
                      key={n}
                      className={inputClass}
                      placeholder={`Post link ${n}${n <= 3 ? " (required)" : " (optional)"}`}
                      value={(form as any)[`post_link_${n}`]}
                      onChange={e => updateField(`post_link_${n}`, e.target.value)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-white/70 text-xs font-medium mb-1.5 block">Why do you want to become an Arxon Ambassador? *</label>
                <textarea className={`${inputClass} min-h-[100px]`} placeholder="Tell us your motivation..." value={form.motivation} onChange={e => updateField("motivation", e.target.value)} />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-white/70 text-xs font-medium mb-1.5 block">Estimated New Users You Can Bring</label>
                  <input className={inputClass} type="number" placeholder="e.g. 200" value={form.estimated_new_users} onChange={e => updateField("estimated_new_users", e.target.value)} />
                </div>
                <div>
                  <label className="text-white/70 text-xs font-medium mb-1.5 block">Previous Ambassador Experience</label>
                  <input className={inputClass} placeholder="Optional" value={form.previous_experience} onChange={e => updateField("previous_experience", e.target.value)} />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(124,147,195,0.35)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full relative overflow-hidden bg-[#7c93c3] text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-200%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  {loading ? "Submitting..." : <>Submit Application <Send size={14} /></>}
                </span>
              </motion.button>
            </motion.form>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AmbassadorApply;
