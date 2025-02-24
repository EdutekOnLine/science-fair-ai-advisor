
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProjectGeneratorProps {
  onProjectGenerated: () => void;
}

export const ProjectGenerator = ({ onProjectGenerated }: ProjectGeneratorProps) => {
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
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        "https://mbfuggowxmibivlyrhmc.functions.supabase.co/generate-project",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": process.env.VITE_SUPABASE_ANON_KEY as string,
            "Authorization": `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ interests }),
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
  );
};
