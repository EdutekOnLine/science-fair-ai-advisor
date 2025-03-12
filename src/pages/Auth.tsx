
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResetPasswordFlow = () => {
      console.log("Checking reset password flow", {
        hash: location.hash,
        search: location.search
      });
      
      // Check if we have an access token in the hash
      if (location.hash && location.hash.includes('access_token')) {
        const hashParams = new URLSearchParams(location.hash.substring(1));
        
        // Check for error first
        if (hashParams.get('error') === 'access_denied' && 
            hashParams.get('error_code') === 'otp_expired') {
          setIsForgotPassword(true);
          toast({
            title: "Link Expired",
            description: "Your password reset link has expired. Please request a new one.",
            variant: "destructive",
          });
          return true;
        }
        
        // Check for recovery type in hash or reset=true in search
        if ((hashParams.get('type') === 'recovery' || 
             location.search.includes('reset=true')) && 
            hashParams.get('access_token')) {
          console.log("Valid password reset link detected");
          setIsResetPassword(true);
          toast({
            title: "Reset Password",
            description: "You can now set a new password for your account.",
          });
          return true;
        }
      }
      
      // Check for recovery in search params
      const query = new URLSearchParams(location.search);
      if (query.get("type") === "recovery" || query.get("reset") === "true") {
        console.log("Reset flag detected in URL parameters");
        setIsResetPassword(true);
        toast({
          title: "Reset Password",
          description: "You can now set a new password for your account.",
        });
        return true;
      }
      
      return false;
    };
    
    // Check for email verification confirmation
    const query = new URLSearchParams(location.search);
    if (query.get("verified") === "true") {
      toast({
        title: "Email Verified",
        description: "Your email has been verified. You can now sign in.",
      });
    }
    
    // Handle reset password flow
    handleResetPasswordFlow();
  }, [location, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isResetPassword) {
        console.log("Attempting to update password");
        
        // If there's an access token in the hash, use it
        if (location.hash && location.hash.includes('access_token')) {
          const hashParams = new URLSearchParams(location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          
          if (accessToken) {
            // Set the access token in supabase session
            const { error } = await supabase.auth.updateUser({
              password: newPassword,
            });
            
            if (error) throw error;
            
            toast({
              title: "Password Updated",
              description: "Your password has been successfully updated.",
            });
            
            // Navigate to login view
            setIsResetPassword(false);
          } else {
            throw new Error("No access token found in URL");
          }
        } else {
          // Normal password update flow
          const { error } = await supabase.auth.updateUser({
            password: newPassword,
          });
          
          if (error) throw error;
          
          toast({
            title: "Password Updated",
            description: "Your password has been successfully updated.",
          });
          
          setIsResetPassword(false);
        }
        
      } else if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth?reset=true`,
        });
        
        if (error) throw error;
        
        toast({
          title: "Password Reset Email Sent",
          description: "Check your email for a password reset link.",
        });
        
        setIsForgotPassword(false);
        
      } else if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth?verified=true`,
          },
        });
        
        if (error) throw error;
        
        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        });
        
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setIsSignUp(false);
    setIsResetPassword(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-success/10 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <img 
            src="/lovable-uploads/25afb913-1950-46e2-9249-b8577498a3cf.png"
            alt="Project Logo"
            className="h-12 w-auto mx-auto mb-6"
          />
          <h2 className="text-3xl font-bold">
            {isResetPassword 
              ? "Set new password"
              : isForgotPassword 
                ? "Reset your password" 
                : isSignUp 
                  ? "Create an account" 
                  : "Welcome back"}
          </h2>
          <p className="mt-2 text-foreground/70">
            {isResetPassword
              ? "Enter your new password below"
              : isForgotPassword
                ? "Enter your email to receive a password reset link"
                : isSignUp
                  ? "Sign up to start your science journey"
                  : "Sign in to continue your science journey"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-xl">
          {isSignUp && !isForgotPassword && !isResetPassword && (
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <Input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
          )}
          
          {!isResetPassword && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          )}
          
          {!isForgotPassword && !isResetPassword && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          )}
          
          {isResetPassword && (
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                New Password
              </label>
              <Input
                id="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading 
              ? "Loading..." 
              : isResetPassword
                ? "Update Password"
                : isForgotPassword 
                  ? "Send Reset Link"
                  : isSignUp 
                    ? "Sign Up" 
                    : "Sign In"}
          </Button>
        </form>

        <div className="text-center space-y-3">
          {!isResetPassword && (
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setIsForgotPassword(false);
              }}
              className="text-primary hover:underline"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          )}
          
          {!isSignUp && !isForgotPassword && !isResetPassword && (
            <div>
              <button
                type="button"
                onClick={handleToggleForgotPassword}
                className="text-primary hover:underline text-sm"
              >
                Forgot your password?
              </button>
            </div>
          )}
          
          {(isForgotPassword || isResetPassword) && (
            <div>
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setIsResetPassword(false);
                }}
                className="text-primary hover:underline text-sm"
              >
                Back to sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
