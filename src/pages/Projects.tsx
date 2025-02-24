
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Projects = () => {
  const [loading, setLoading] = useState(false);
  const [interests, setInterests] = useState("");
  const { toast } = useToast();

  const generateProject = async () => {
    if (!interests.trim()) {
      toast({
        title: "Please enter your interests",
        description: "We need to know your interests to generate project ideas",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // TODO: Integrate with AI API for project generation
      // For now, we'll use a mock response
      const mockProject = {
        title: "Effect of Music on Plant Growth",
        description: "Investigate how different genres of music affect plant growth and development",
        category: "Biology",
        hypothesis: "Plants exposed to classical music will grow faster than those exposed to other genres or silence",
        materials: ["Plants", "Speakers", "Music source", "Measuring tools", "Growth tracking sheets"],
      };

      const { data: user } = await supabase.auth.getUser();
      
      const { error } = await supabase.from("projects").insert({
        ...mockProject,
        user_id: user.user?.id,
      });

      if (error) throw error;

      toast({
        title: "Project Generated!",
        description: "Your new project idea has been saved.",
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <nav className="mb-8">
        <Button variant="ghost" onClick={() => window.history.back()}>
          ← Back
        </Button>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Generate Project Ideas</h1>
          <p className="text-muted-foreground">
            Tell us your interests and let AI help you discover exciting science fair project ideas!
          </p>
        </div>

        <div className="space-y-4 p-6 border rounded-lg bg-card">
          <div className="space-y-2">
            <label htmlFor="interests" className="text-sm font-medium">
              What are you interested in?
            </label>
            <Textarea
              id="interests"
              placeholder="E.g., Biology, renewable energy, robotics, environmental science..."
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button
            onClick={generateProject}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Project Idea
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Projects;
