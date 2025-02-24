import { useState, useEffect } from "react";
import { Project, ProjectFile } from "@/types/project";
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
import { ProjectHypothesis } from "./details/ProjectHypothesis";
import { ProjectMaterials } from "./details/ProjectMaterials";
import { ProjectFiles } from "./details/ProjectFiles";
import { ProjectNotes } from "./details/ProjectNotes";
import { ExperimentResults } from "./ExperimentResults";

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
  const { toast } = useToast();

  useEffect(() => {
    if (project?.id) {
      fetchFiles();
    }
  }, [project?.id]);

  const fetchFiles = async () => {
    if (!project?.id) return;

    const { data, error } = await supabase
      .from("project_files")
      .select("*")
      .eq("project_id", project.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching files",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setFiles(data);
  };

  const exportProject = () => {
    if (!project) return;

    const projectData = {
      ...project,
      files: files,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.title.toLowerCase().replace(/\s+/g, "-")}-export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Project exported",
      description: "Your project data has been exported successfully.",
    });
  };

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
          <DialogDescription>{project.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <ProjectHypothesis hypothesis={project.hypothesis} />
          <ProjectMaterials materials={project.materials} />
          <ExperimentResults project={project} onUpdate={fetchFiles} />
          <ProjectFiles 
            projectId={project.id} 
            files={files} 
            onFileUploaded={fetchFiles} 
          />
          <ProjectNotes 
            projectId={project.id} 
            notes={project.observation_notes || []} 
          />

          <div className="flex justify-end gap-2">
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
