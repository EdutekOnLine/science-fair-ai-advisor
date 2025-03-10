
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
import { ProjectTutorial } from "./details/ProjectTutorial";
import { ProjectFiles } from "./details/ProjectFiles";
import { ProjectNotes } from "./details/ProjectNotes";
import { ProjectAnalysis } from "./details/ProjectAnalysis";
import { ProjectDataAnalysis } from "./details/ProjectDataAnalysis";
import { ProjectExperimentResults } from "./details/ProjectExperimentResults";
import { SafetyTips } from "./details/SafetyTips";
import { FunFacts } from "./details/FunFacts";
import { ProjectGuide } from "./details/ProjectGuide";
import html2pdf from 'html2pdf.js';

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

    const validatedData = {
      ...data,
      status: validateStatus(data.status)
    } as Project;

    setCurrentProject(validatedData);
  };

  const validateStatus = (status: string): Project['status'] => {
    const validStatuses: Project['status'][] = ['draft', 'in_progress', 'completed'];
    return validStatuses.includes(status as Project['status']) 
      ? status as Project['status']
      : 'draft';
  };

  const exportProject = async () => {
    if (!currentProject) return;

    try {
      toast({
        title: "Preparing PDF",
        description: "Please wait while we generate your project PDF..."
      });

      const content = document.createElement('div');
      content.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="font-size: 24px; margin-bottom: 10px;">${currentProject.title}</h1>
          <p style="color: #666; margin-bottom: 20px;">${currentProject.description}</p>
          
          <h2 style="font-size: 20px; margin-top: 30px;">Hypothesis</h2>
          <p style="margin-bottom: 20px;">${currentProject.hypothesis}</p>
          
          <h2 style="font-size: 20px; margin-top: 30px;">Materials Needed</h2>
          <ul style="margin-bottom: 20px;">
            ${currentProject.materials.map(material => `<li>${material}</li>`).join('')}
          </ul>
          
          <h2 style="font-size: 20px; margin-top: 30px;">Observation Notes</h2>
          <ul style="margin-bottom: 20px;">
            ${(currentProject.observation_notes || []).map(note => `<li>${note}</li>`).join('')}
          </ul>
          
          ${currentProject.experiment_results ? `
            <h2 style="font-size: 20px; margin-top: 30px;">Experiment Results</h2>
            <div style="margin-bottom: 20px;">
              <pre>${JSON.stringify(currentProject.experiment_results, null, 2)}</pre>
            </div>
          ` : ''}
          
          <div style="margin-top: 40px; color: #666; font-size: 12px;">
            Generated on ${new Date().toLocaleDateString()}
          </div>
        </div>
      `;

      const opt = {
        margin: 10,
        filename: `${currentProject.title.toLowerCase().replace(/\s+/g, "-")}-project.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(content).save();

      toast({
        title: "PDF exported successfully",
        description: "Your project has been exported as a PDF file."
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive"
      });
    }
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
          <SafetyTips category={currentProject.category} />
          <FunFacts category={currentProject.category} />
          <ProjectGuide />

          <ProjectAnalysis
            projectId={currentProject.id}
            title={currentProject.title}
            description={currentProject.description}
            hypothesis={currentProject.hypothesis}
            materials={currentProject.materials}
          />
          <ProjectHypothesis hypothesis={currentProject.hypothesis} />
          <ProjectMaterials materials={currentProject.materials} />
          <ProjectTutorial project={currentProject} />
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
              Export PDF
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
