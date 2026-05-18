import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { z } from "zod";
import arxonLogoWide from "@/assets/arxon-logo-wide.svg";

const investorSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  x_username: z.string().trim().max(50).optional().or(z.literal("")),
  country: z.string().min(1, "Country is required"),
  company: z.string().trim().max(100).optional(),
  investment_range: z.string().min(1, "Please select an investment range"),
  investment_timeline: z.string().min(1, "Please select a timeline"),
  area_of_interest: z.string().min(1, "Please select an area of interest"),
  linkedin_profile: z.string().trim().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  additional_notes: z.string().trim().max(1000).optional(),
}).refine(
  (data) => (data.x_username && data.x_username.length > 0) || (data.linkedin_profile && data.linkedin_profile.length > 0),
  { message: "Please provide either your X username or LinkedIn profile", path: ["x_username"] }
);

type InvestorFormData = z.infer<typeof investorSchema>;

const steps = [
  { title: "What's your full name?", field: "full_name" as const, type: "text", placeholder: "John Doe" },
  { title: "What's your email address?", field: "email" as const, type: "email", placeholder: "john@example.com" },
  { title: "What's your X (Twitter) username?", field: "x_username" as const, type: "text", placeholder: "@username", subtitle: "Provide X username or LinkedIn (at least one required)" },
  {
    title: "What country are you from?", field: "country" as const, type: "select",
    options: ["United States", "United Kingdom", "Canada", "Germany", "France", "Australia", "Japan", "South Korea", "Singapore", "United Arab Emirates", "Switzerland", "Netherlands", "China", "India", "Brazil", "Nigeria", "South Africa", "Mexico", "Indonesia", "Other"],
  },
  { title: "Company or Individual (Optional)", field: "company" as const, type: "text", placeholder: "Acme Ventures" },
  {
    title: "Investment Range", field: "investment_range" as const, type: "select",
    options: ["$50K - $100K", "$100K - $250K", "$250K - $500K", "$500K - $1M", "$1M+"],
  },
  {
    title: "Investment Timeline", field: "investment_timeline" as const, type: "select",
    options: ["Immediate", "1-3 months", "3-6 months", "6-12 months", "Exploring options"],
  },
  {
    title: "Area of Interest", field: "area_of_interest" as const, type: "select",
    options: ["Technology", "Mining Operations", "Tokenomics", "Market Expansion", "Privacy Aligned On-chain Voting", "General investment"],
  },
  { title: "LinkedIn Profile", field: "linkedin_profile" as const, type: "url", placeholder: "https://linkedin.com/in/yourprofile", subtitle: "Provide LinkedIn or X username (at least one required)" },
  { title: "Additional Notes or Questions (Optional)", field: "additional_notes" as const, type: "textarea", placeholder: "Tell us more about your investment interests..." },
];

export default function InvestorForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InvestorFormData>({
    full_name: "", email: "", x_username: "", country: "", company: "",
    investment_range: "", investment_timeline: "", area_of_interest: "",
    linkedin_profile: "", additional_notes: "",
  });

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    const currentValue = formData[currentStepData.field];
    const isXOrLinkedIn = currentStepData.field === "x_username" || currentStepData.field === "linkedin_profile";
    const isOptional = currentStepData.title.includes("Optional") || isXOrLinkedIn;
    if (!currentValue && !isOptional) {
      toast({ title: "Required Field", description: "Please fill in this field to continue.", variant: "destructive" });
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const validated = investorSchema.parse(formData);
      const { error } = await supabase.from("investor_submissions").insert([{
        full_name: validated.full_name, email: validated.email, x_username: validated.x_username,
        country: validated.country, company: validated.company || null,
        investment_range: validated.investment_range, investment_timeline: validated.investment_timeline,
        area_of_interest: validated.area_of_interest, linkedin_profile: validated.linkedin_profile || null,
        additional_notes: validated.additional_notes || null,
      }]);
      if (error) throw error;
      toast({ title: "Success!", description: "Your investor inquiry has been submitted. We'll be in touch soon." });
      navigate("/");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ title: "Validation Error", description: error.errors[0].message, variant: "destructive" });
      } else {
        toast({ title: "Error", description: "Failed to submit form. Please try again.", variant: "destructive" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_top,hsl(220_50%_25%/0.08)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_bottom,hsl(220_50%_30%/0.06)_0%,transparent_70%)]" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <img src={arxonLogoWide} alt="ARXON" className="h-8 object-contain" />
          </div>
          <button
            onClick={() => navigate("/partners")}
            className="flex items-center gap-2 text-[#a1a1aa] hover:text-white text-sm font-medium transition-all mb-6"
          >
            <ArrowLeft size={14} />
            Back
          </button>

          {/* Progress bar */}
          <div className="relative h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#7c93c3] to-[#9db3e3] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <p className="text-[#52525b] text-xs mt-2.5 font-light">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Form card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="rounded-2xl border border-white/[0.08] bg-[#0f0f13] p-8 md:p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-[#7c93c3]/10 rounded-tl-2xl" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-[#7c93c3]/10 rounded-br-2xl" />

          <h2 className="text-2xl md:text-3xl text-white font-bold tracking-[-0.02em] mb-2">
            {currentStepData.title}
          </h2>
          {(currentStepData as any).subtitle && (
            <p className="text-sm text-[#7c93c3] mb-6">{(currentStepData as any).subtitle}</p>
          )}
          {!(currentStepData as any).subtitle && <div className="mb-6" />}

          {currentStepData.type === "select" ? (
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }}>
              {currentStepData.options?.map((option) => (
                <motion.button
                  key={option}
                  onClick={() => {
                    setFormData({ ...formData, [currentStepData.field]: option });
                    setTimeout(() => handleNext(), 250);
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`w-full p-4 text-left rounded-xl border transition-all ${
                    formData[currentStepData.field] === option
                      ? "border-[#7c93c3]/50 bg-[#7c93c3]/10 text-white"
                      : "border-white/[0.06] bg-white/[0.02] text-[#a1a1aa] hover:border-white/[0.12] hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{option}</span>
                    {formData[currentStepData.field] === option && (
                      <CheckCircle2 className="h-4 w-4 text-[#7c93c3]" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          ) : currentStepData.type === "textarea" ? (
            <Textarea
              value={formData[currentStepData.field] as string}
              onChange={(e) => setFormData({ ...formData, [currentStepData.field]: e.target.value })}
              placeholder={currentStepData.placeholder}
              className="min-h-[140px] text-base bg-white/[0.03] border-white/[0.08] text-white placeholder:text-[#52525b] rounded-xl focus:border-[#7c93c3]/40 focus:ring-[#7c93c3]/20 resize-none"
              autoFocus
            />
          ) : (
            <Input
              type={currentStepData.type}
              value={formData[currentStepData.field] as string}
              onChange={(e) => setFormData({ ...formData, [currentStepData.field]: e.target.value })}
              placeholder={currentStepData.placeholder}
              className="text-base py-6 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-[#52525b] rounded-xl focus:border-[#7c93c3]/40 focus:ring-[#7c93c3]/20"
              autoFocus
              onKeyPress={(e) => { if (e.key === "Enter") handleNext(); }}
            />
          )}

          <div className="flex gap-3 mt-8">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={isSubmitting}
                className="flex items-center gap-2 text-[#a1a1aa] hover:text-white text-sm font-medium px-5 py-3 rounded-xl border border-white/[0.08] hover:border-white/[0.15] transition-all"
              >
                <ArrowLeft size={14} />
                Back
              </button>
            )}
            {currentStepData.type !== "select" && (
              <motion.button
                onClick={handleNext}
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-shimmer flex-1 flex items-center justify-center gap-2 bg-[#7c93c3] text-[#09090b] text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#8da3d3] transition-all disabled:opacity-50"
              >
                {currentStep === steps.length - 1 ? (
                  isSubmitting ? "Submitting..." : (
                    <>
                      <Sparkles size={14} />
                      Submit
                    </>
                  )
                ) : (
                  <>
                    Continue
                    <ArrowRight size={14} />
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
