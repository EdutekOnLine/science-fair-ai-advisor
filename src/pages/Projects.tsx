
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/types/project";
import { ProjectGenerator } from "@/components/projects/ProjectGenerator";
import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { PresentationMode } from "@/components/projects/PresentationMode";

const statusOrder: Project['status'][] = ['draft', 'in_progress', 'completed'];

const Projects = () => {
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
      status: (project.status || 'draft') as Project['status'],
      experiment_results: project.experiment_results as Record<string, number> | null,
      materials: project.materials as string[] || [],
      observation_notes: project.observation_notes as string[] | null,
      description: project.description || "",
      hypothesis: project.hypothesis || null,
      presentation_template: project.presentation_template as string | null
    }));

    setProjects(typedProjects);
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
      <nav className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <img 
            src="/lovable-uploads/25afb913-1950-46e2-9249-b8577498a3cf.png"
            alt="Project Logo"
            className="h-12 w-auto"
          />
          <Button variant="ghost" onClick={() => window.history.back()}>
            ← Back
          </Button>
        </div>
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

        <ProjectGenerator onProjectGenerated={fetchProjects} />

        <ProjectList
          projects={projects}
          onViewDetails={(project) => {
            setSelectedProject(project);
            setIsDetailsOpen(true);
          }}
          onUpdateStatus={updateProjectStatus}
          onDelete={deleteProject}
          getStatusProgress={getStatusProgress}
        />

        <ProjectDetails
          project={selectedProject}
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          onPresentationMode={() => {
            setIsPresentationMode(true);
            setIsDetailsOpen(false);
          }}
        />

        <PresentationMode
          project={selectedProject}
          isOpen={isPresentationMode}
          onOpenChange={setIsPresentationMode}
          getStatusProgress={getStatusProgress}
        />
      </motion.div>
    </div>
  );
};

export default Projects;
