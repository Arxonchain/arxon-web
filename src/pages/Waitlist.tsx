import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { waitlistSchema } from "@/lib/validations";
import arxonLogo from "@/assets/arxon-logo-main.png";
import miningIllustration from "@/assets/mining-illustration.jpg";

const Waitlist = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hasFollowed, setHasFollowed] = useState(false);
  const [showFollowPrompt, setShowFollowPrompt] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFollowClick = () => {
    window.open("https://x.com/ARXONarx", "_blank");
    setShowFollowPrompt(true);
  };

  const confirmFollow = () => {
    setHasFollowed(true);
    toast({
      title: "Thank you!",
      description: "You can now join the waitlist.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasFollowed) {
      toast({
        title: "Follow Required",
        description: "Please follow @ARXONarx on X to join the waitlist.",
        variant: "destructive",
      });
      return;
    }

    try {
      const validatedData = waitlistSchema.parse(formData);
      setLoading(true);

      const { error } = await supabase
        .from('waitlist')
        .insert([{
          name: validatedData.name,
          email: validatedData.email
        }]);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already registered",
            description: "This email is already on the waitlist.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        setSuccess(true);
        toast({
          title: "Success!",
          description: "You've been added to the mining waitlist.",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="h-20 w-20 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">You're on the list!</h1>
            <p className="text-white/70">
              We'll notify you when ARX mining becomes available.
            </p>
          </div>
          <Button onClick={() => navigate("/")} size="lg">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left side - Form */}
            <div className="space-y-6">
              <div className="space-y-2">
                <img 
                  src={arxonLogo} 
                  alt="ARXon" 
                  className="h-12 mb-6"
                />
                <h1 className="text-4xl font-bold text-white">Join the Mining Waitlist</h1>
                <p className="text-white/70 text-lg">
                  Be among the first to start mining $ARX tokens. Enter your details below to secure your spot.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Twitter Follow Section */}
                <div className="space-y-3 p-4 border border-primary/20 rounded-lg bg-primary/5">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-white font-semibold">Step 1: Follow us on X</Label>
                      <p className="text-sm text-white/60">Follow @ARXONarx to join the waitlist</p>
                    </div>
                    {hasFollowed ? (
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    ) : null}
                  </div>
                  
                  {!hasFollowed ? (
                    <div className="space-y-2">
                      <Button
                        type="button"
                        onClick={handleFollowClick}
                        variant="outline"
                        size="lg"
                        className="w-full"
                      >
                        Follow @ARXONarx on X
                      </Button>
                      
                      {showFollowPrompt && (
                        <Button
                          type="button"
                          onClick={confirmFollow}
                          size="lg"
                          className="w-full"
                        >
                          I've followed the account
                        </Button>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-primary font-medium">✓ Thank you for following!</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={loading || !hasFollowed}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={loading || !hasFollowed}
                    className="h-12"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading || !hasFollowed}
                  size="lg"
                  className="w-full"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Join Waitlist
                </Button>
              </form>

              <p className="text-sm text-white/60">
                By joining the waitlist, you'll be notified as soon as ARX mining becomes available.
              </p>
            </div>

            {/* Right side - Illustration */}
            <div className="hidden md:block">
              <img 
                src={miningIllustration} 
                alt="Mining Illustration" 
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Waitlist;
