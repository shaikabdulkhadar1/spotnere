import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  // Determine initial mode from URL parameter
  const initialMode = searchParams.get("mode") === "signup" ? false : true;
  const [isLoginMode, setIsLoginMode] = useState(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update mode when URL parameter changes
  useEffect(() => {
    const mode = searchParams.get("mode");
    setIsLoginMode(mode !== "signup");
  }, [searchParams]);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sign up form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement actual login logic
    setTimeout(() => {
      toast({
        title: "Login successful!",
        description: "Welcome back to Spotnere.",
      });
      setIsSubmitting(false);
      // TODO: Update auth state and redirect
      navigate("/");
    }, 1000);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupPassword !== signupConfirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // TODO: Implement actual signup logic
    setTimeout(() => {
      toast({
        title: "Account created!",
        description: "Welcome to Spotnere. Please log in.",
      });
      setIsSubmitting(false);
      setIsLoginMode(true);
      // Reset form
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
      setSignupConfirmPassword("");
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-32 pb-12 px-4">
        <div className={`container mx-auto transition-all duration-300 ${isLoginMode ? "max-w-2xl" : "max-w-4xl"}`}>
          <div className="text-center mb-12 animate-fade-up">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-foreground">
              {isLoginMode ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {isLoginMode
                ? "Sign in to your account to continue exploring amazing places"
                : "Join Spotnere to discover and book the best places around you"}
            </p>
          </div>

          <GlassCard hover={false} className="animate-fade-up">
            {/* Toggle between Login and Sign Up */}
            <div className="flex gap-2 mb-8 p-1 bg-muted/40 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setIsLoginMode(true);
                  navigate("/login?mode=login", { replace: true });
                }}
                className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  isLoginMode
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLoginMode(false);
                  navigate("/login?mode=signup", { replace: true });
                }}
                className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  !isLoginMode
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Login Form */}
            {isLoginMode ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-border"
                    />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full hover-lift"
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? "Logging in..." : "Log In"}
                </Button>
              </form>
            ) : (
              /* Sign Up Form - 2 column layout */
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative mt-1.5">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  By signing up, you agree to our Terms of Service and Privacy
                  Policy.
                </div>

                <Button
                  type="submit"
                  className="w-full hover-lift"
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            )}
          </GlassCard>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
