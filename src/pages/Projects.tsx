
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Sparkles, ChevronRight, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  hypothesis: string;
  materials: string[];
  status: 'draft' | 'in_progress' | 'completed';
  created_at: string;
}

const Projects = () => {
  const [loading, setLoading] = useState(false);
  const [interests, setInterests] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching projects",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Cast the status to the correct type and map the data
    const typedProjects = (data || []).map(project => ({
      ...project,
      status: (project.status || 'draft') as 'draft' | 'in_progress' | 'completed'
    }));

    setProjects(typedProjects);
  };

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
      const response = await fetch(
        "https://mbfuggowxmibivlyrhmc.functions.supabase.co/generate-project",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ interests }),
        }
      );

      if (!response.ok) throw new Error("Failed to generate project");
      
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

      fetchProjects();
      setInterests("");
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

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from("projects").delete().match({ id });

    if (error) {
      toast({
        title: "Error deleting project",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Project deleted",
      description: "The project has been removed from your list.",
    });

    fetchProjects();
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
        className="max-w-4xl mx-auto space-y-8"
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

        {/* Projects List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Projects</h2>
          <div className="grid gap-4">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-muted-foreground mb-4">{project.description}</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                        {project.category}
                      </span>
                      <span className="px-2 py-1 bg-secondary/10 text-secondary rounded text-sm capitalize">
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteProject(project.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
            {projects.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No projects yet. Generate your first project idea above!
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Projects;
