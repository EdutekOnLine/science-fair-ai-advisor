
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
            "apikey": process.env.VITE_SUPABASE_ANON_KEY as string,
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
    <div className="space-y-4 p-6 border rounded-lg bg-card">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="age-group" className="text-sm font-medium">
            Select your age group
          </label>
          <Select value={ageGroup} onValueChange={setAgeGroup}>
            <SelectTrigger id="age-group">
              <SelectValue placeholder="Select your age group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="elementary">Elementary School (5-10)</SelectItem>
              <SelectItem value="middle">Middle School (11-13)</SelectItem>
              <SelectItem value="high">High School (14-18)</SelectItem>
              <SelectItem value="college">College (18+)</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
