
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Loader2, 
  Sparkles, 
  ChevronRight, 
  Trash2, 
  Eye,
  ArrowRight,
  ArrowLeft,
  Presentation,
  ChartBar
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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

const statusOrder: Project['status'][] = ['draft', 'in_progress', 'completed'];

const Projects = () => {
  const [loading, setLoading] = useState(false);
  const [interests, setInterests] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
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

      fetchProjects();
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

  const updateProjectStatus = async (project: Project, direction: 'next' | 'prev') => {
    const currentIndex = statusOrder.indexOf(project.status);
    const newIndex = direction === 'next' 
      ? Math.min(currentIndex + 1, statusOrder.length - 1)
      : Math.max(currentIndex - 1, 0);
    
    const newStatus = statusOrder[newIndex];
    
    if (newStatus === project.status) return;

    const { error } = await supabase
      .from("projects")
      .update({ status: newStatus })
      .match({ id: project.id });

    if (error) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Status Updated",
      description: `Project status changed to ${newStatus.replace('_', ' ')}`
    });

    fetchProjects();
  };

  const getStatusProgress = (status: Project['status']) => {
    const statusIndex = statusOrder.indexOf(status);
    return ((statusIndex + 1) / statusOrder.length) * 100;
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
                  <div className="space-y-4 flex-1">
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
                    
                    <div className="space-y-2">
                      <Progress value={getStatusProgress(project.status)} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Draft</span>
                        <span>In Progress</span>
                        <span>Completed</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedProject(project);
                        setIsDetailsOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateProjectStatus(project, 'prev')}
                      disabled={project.status === 'draft'}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateProjectStatus(project, 'next')}
                      disabled={project.status === 'completed'}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
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

      {/* Project Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProject.title}</DialogTitle>
                <DialogDescription>
                  {selectedProject.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hypothesis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{selectedProject.hypothesis}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Materials Needed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-4 space-y-1">
                      {selectedProject.materials?.map((material, index) => (
                        <li key={index}>{material}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsPresentationMode(true);
                      setIsDetailsOpen(false);
                    }}
                  >
                    <Presentation className="h-4 w-4 mr-2" />
                    Present Project
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Presentation Mode Dialog */}
      <Dialog open={isPresentationMode} onOpenChange={setIsPresentationMode}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <div className="space-y-8">
              <DialogHeader>
                <DialogTitle className="text-3xl">{selectedProject.title}</DialogTitle>
              </DialogHeader>

              <section className="space-y-4">
                <h3 className="text-2xl font-semibold">Introduction</h3>
                <p className="text-lg">{selectedProject.description}</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-2xl font-semibold">Hypothesis</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-lg">{selectedProject.hypothesis}</p>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-2xl font-semibold">Materials</h3>
                <ul className="list-disc pl-6 space-y-2">
                  {selectedProject.materials?.map((material, index) => (
                    <li key={index} className="text-lg">{material}</li>
                  ))}
                </ul>
              </section>

              <section className="space-y-4">
                <h3 className="text-2xl font-semibold">Progress</h3>
                <div className="space-y-2">
                  <Progress value={getStatusProgress(selectedProject.status)} className="h-3" />
                  <p className="text-center text-muted-foreground capitalize">
                    Current Status: {selectedProject.status.replace('_', ' ')}
                  </p>
                </div>
              </section>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
