
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Brain, Atom } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

interface ProjectGeneratorProps {
  onProjectGenerated: () => void;
}

export const ProjectGenerator = ({ onProjectGenerated }: ProjectGeneratorProps) => {
  const [loading, setLoading] = useState(false);
  const [interests, setInterests] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
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

    if (!ageGroup) {
      toast({
        title: "Please select an age group",
        description: "We need to know your age group to suggest appropriate projects",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        "https://mbfuggowxmibivlyrhmc.functions.supabase.co/generate-project",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ interests, ageGroup }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate project");
      }
      
      const projectIdea = await response.json();
      const { data: user } = await supabase.auth.getUser();
      
      const { error } = await supabase.from("projects").insert({
        ...projectIdea,
        user_id: user.user?.id,
        status: 'draft' as const,
      });

      if (error) throw error;

      toast({
        title: "Project Generated!",
        description: "Your new project idea has been saved.",
      });

      onProjectGenerated();
      setInterests("");
      setAgeGroup("");
    } catch (error: any) {
      console.error("Error generating project:", error);
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 p-6 border-2 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-primary/20 shadow-lg"
    >
      <div className="flex items-center justify-center space-x-2 mb-6">
        <Brain className="w-8 h-8 text-primary animate-bounce" />
        <h2 className="text-2xl font-heading font-bold text-primary">Science Project Generator</h2>
        <Atom className="w-8 h-8 text-secondary animate-pulse" />
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="age-group" className="text-lg font-medium text-primary">
            What grade are you in? 🎓
          </label>
          <Select value={ageGroup} onValueChange={setAgeGroup}>
            <SelectTrigger id="age-group" className="bg-white/70 backdrop-blur-sm border-2">
              <SelectValue placeholder="Pick your grade level!" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="elementary">Elementary School (5-10) 🌟</SelectItem>
              <SelectItem value="middle">Middle School (11-13) 🚀</SelectItem>
              <SelectItem value="high">High School (14-18) 🔬</SelectItem>
              <SelectItem value="college">College (18+) 🎓</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="interests" className="text-lg font-medium text-primary">
            What amazing things interest you? ✨
          </label>
          <Textarea
            id="interests"
            placeholder="Plants? Space? Robots? Tell us what excites you!"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            className="min-h-[100px] bg-white/70 backdrop-blur-sm border-2 placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      <Button
        onClick={generateProject}
        disabled={loading}
        className="w-full text-lg font-medium bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300 transform hover:scale-105"
        size="lg"
      >
        {loading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
        )}
        {loading ? "Creating Your Adventure..." : "Generate Awesome Project!"}
      </Button>

      <p className="text-sm text-center text-muted-foreground mt-4">
        Get ready for an amazing scientific journey! 🚀
      </p>
    </motion.div>
  );
};
