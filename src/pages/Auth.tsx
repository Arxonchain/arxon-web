import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { authSchema } from "@/lib/validations";

// Rate limiting helper
const RATE_LIMIT_KEY = 'auth_attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

const checkRateLimit = (): { allowed: boolean; remainingTime?: number } => {
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  if (!stored) return { allowed: true };
  
  const { count, timestamp } = JSON.parse(stored);
  const now = Date.now();
  const timeSinceFirst = now - timestamp;
  
  if (timeSinceFirst > LOCKOUT_DURATION) {
    localStorage.removeItem(RATE_LIMIT_KEY);
    return { allowed: true };
  }
  
  if (count >= MAX_ATTEMPTS) {
    const remainingTime = Math.ceil((LOCKOUT_DURATION - timeSinceFirst) / 60000);
    return { allowed: false, remainingTime };
  }
  
  return { allowed: true };
};

const recordAttempt = () => {
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  const now = Date.now();
  
  if (!stored) {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: 1, timestamp: now }));
    return;
  }
  
  const { count, timestamp } = JSON.parse(stored);
  const timeSinceFirst = now - timestamp;
  
  if (timeSinceFirst > LOCKOUT_DURATION) {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: 1, timestamp: now }));
  } else {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ count: count + 1, timestamp }));
  }
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/waitlist-admin");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/waitlist-admin");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limit
    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
      toast({
        title: "Too Many Attempts",
        description: `Please try again in ${rateLimitCheck.remainingTime} minutes.`,
        variant: "destructive",
      });
      return;
    }
    
    // Validate with zod schema
    const validation = authSchema.safeParse({ email, password });
    
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast({
        title: "Validation Error",
        description: firstError.message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: validation.data.email,
          password: validation.data.password,
        });

        if (error) {
          recordAttempt();
          throw error;
        }

        // Clear rate limit on successful login
        localStorage.removeItem(RATE_LIMIT_KEY);

        toast({
          title: "Success",
          description: "Logged in successfully",
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email: validation.data.email,
          password: validation.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/waitlist-admin`,
          },
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Account created successfully. Please check your email to confirm.",
        });
      }
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Auth error:', error);
      }
      
      let errorMessage = error.message;
      
      // Provide user-friendly error messages
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.message.includes("User already registered")) {
        errorMessage = "An account with this email already exists. Please login instead.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your credentials to access your account"
              : "Sign up to manage the mining waitlist"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min 8 chars, uppercase, lowercase, number, special char"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? "Sign In" : "Sign Up"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
