
import { motion } from "framer-motion";
import { Microscope, Brain, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <Brain className="w-8 h-8 text-primary" />,
    title: "AI Project Advisor",
    description: "Get personalized project ideas based on your interests"
  },
  {
    icon: <Microscope className="w-8 h-8 text-secondary" />,
    title: "Research Assistant",
    description: "Access smart research tools and experiment guides"
  },
  {
    icon: <GraduationCap className="w-8 h-8 text-success" />,
    title: "Presentation Coach",
    description: "Get feedback to make your project shine"
  }
];

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img 
            src="/lovable-uploads/25afb913-1950-46e2-9249-b8577498a3cf.png"
            alt="Project Logo"
            className="h-12 w-auto"
          />
          <h1 className="text-xl font-bold">Science Fair AI</h1>
        </div>
        <div className="space-x-4">
          <Button variant="outline" onClick={() => navigate("/projects")}>
            My Projects
          </Button>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
              Science Fair AI Advisor
            </h1>
            <p className="text-xl mb-8 text-foreground/80">
              Your AI-powered companion for creating amazing science fair projects
            </p>
            <Button
              size="lg"
              className="animated-button text-white px-8 py-6 text-lg rounded-full"
              onClick={() => navigate("/projects")}
            >
              <span className="relative z-10">Get Started</span>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-foreground/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 to-success/10 py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Science Journey?
            </h2>
            <p className="text-xl mb-8 text-foreground/80 max-w-2xl mx-auto">
              Join thousands of young scientists creating amazing projects with AI guidance
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="animated-button px-8 py-6 text-lg rounded-full"
              onClick={() => navigate("/projects")}
            >
              <span className="relative z-10 text-white">Launch Your Project</span>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
