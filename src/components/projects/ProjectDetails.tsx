
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Presentation } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Project, ProjectFile } from "@/types/project";
import { ProjectHypothesis } from "./details/ProjectHypothesis";
import { ProjectMaterials } from "./details/ProjectMaterials";
import { ProjectFiles } from "./details/ProjectFiles";
import { ProjectNotes } from "./details/ProjectNotes";
import { ProjectAnalysis } from "./details/ProjectAnalysis";
import { ProjectResearch } from "./details/ProjectResearch";
import { ProjectExperimentPlanner } from "./details/ProjectExperimentPlanner";
import { ProjectDataAnalysis } from "./details/ProjectDataAnalysis";
import { ProjectExperimentResults } from "./details/ProjectExperimentResults";

interface ProjectDetailsProps {
  project: Project | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPresentationMode: () => void;
}

export const ProjectDetails = ({
  project,
  isOpen,
  onOpenChange,
  onPresentationMode,
}: ProjectDetailsProps) => {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setCurrentProject(project);
  }, [project]);

  useEffect(() => {
    if (currentProject?.id) {
      fetchFiles();
    }
  }, [currentProject?.id]);

  const fetchFiles = async () => {
    if (!currentProject?.id) return;

    const { data, error } = await supabase
      .from("project_files")
      .select("*")
      .eq("project_id", currentProject.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching files",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    setFiles(data);
  };

  const refreshProject = async () => {
    if (!currentProject?.id) return;

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", currentProject.id)
      .single();

    if (error) {
      toast({
        title: "Error refreshing project",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    // Validate the status before setting it
    const validatedData = {
      ...data,
      status: validateStatus(data.status)
    } as Project;

    setCurrentProject(validatedData);
  };

  // Helper function to validate status
  const validateStatus = (status: string): Project['status'] => {
    const validStatuses: Project['status'][] = ['draft', 'in_progress', 'completed'];
    return validStatuses.includes(status as Project['status']) 
      ? status as Project['status']
      : 'draft'; // Default to 'draft' if invalid status
  };

  const exportProject = () => {
    if (!currentProject) return;

    const projectData = {
      ...currentProject,
      files: files,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentProject.title.toLowerCase().replace(/\s+/g, "-")}-export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Project exported",
      description: "Your project data has been exported successfully."
    });
  };

  if (!currentProject) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{currentProject.title}</DialogTitle>
          <DialogDescription>{currentProject.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-8rem)] pr-4 -mr-4">
          <ProjectAnalysis
            projectId={currentProject.id}
            title={currentProject.title}
            description={currentProject.description}
            hypothesis={currentProject.hypothesis}
            materials={currentProject.materials}
          />
          <ProjectHypothesis hypothesis={currentProject.hypothesis} />
          <ProjectMaterials materials={currentProject.materials} />
          <ProjectExperimentPlanner
            projectId={currentProject.id}
            title={currentProject.title}
            description={currentProject.description}
            hypothesis={currentProject.hypothesis}
            materials={currentProject.materials}
          />
          <ProjectResearch
            projectId={currentProject.id}
            title={currentProject.title}
            description={currentProject.description}
          />
          <ProjectFiles
            projectId={currentProject.id}
            files={files}
            onFileUploaded={fetchFiles}
          />
          <ProjectNotes
            projectId={currentProject.id}
            notes={currentProject.observation_notes || []}
          />
          <ProjectDataAnalysis
            projectId={currentProject.id}
            title={currentProject.title}
            experimentResults={currentProject.experiment_results}
          />
          <ProjectExperimentResults
            projectId={currentProject.id}
            experimentResults={currentProject.experiment_results}
            onResultsUpdated={refreshProject}
          />

          <div className="flex justify-end gap-2 sticky bottom-0 bg-background py-4 border-t">
            <Button variant="outline" onClick={exportProject}>
              <Download className="h-4 w-4 mr-2" />
              Export Project
            </Button>
            <Button variant="outline" onClick={onPresentationMode}>
              <Presentation className="h-4 w-4 mr-2" />
              Present Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
