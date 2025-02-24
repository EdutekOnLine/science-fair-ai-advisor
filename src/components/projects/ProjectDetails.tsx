
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Presentation, AlertTriangle, Info, Lightbulb } from "lucide-react";
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

  const getSafetyTips = (category: string) => {
    const tips: Record<string, string[]> = {
      "Chemistry": [
        "Always wear safety goggles 🥽",
        "Use gloves when handling chemicals 🧤",
        "Work in a well-ventilated area 💨",
        "Ask an adult for supervision 👨‍👩‍👧‍👦"
      ],
      "Biology": [
        "Wash hands before and after 🧼",
        "Keep your workspace clean 🧹",
        "Use proper disposal methods ♻️",
        "Be gentle with living things 🌱"
      ],
      "Physics": [
        "Protect your eyes during light experiments 👀",
        "Be careful with moving parts ⚙️",
        "Keep water away from electronics ⚡",
        "Use tools properly 🔧"
      ]
    };
    return tips[category] || [
      "Always work with adult supervision 👨‍👩‍👧‍👦",
      "Keep your workspace tidy 🧹",
      "Follow all safety instructions carefully ✅",
      "Ask questions if you're unsure 🤔"
    ];
  };

  const getFunFacts = (category: string) => {
    const facts: Record<string, string[]> = {
      "Chemistry": [
        "Did you know? Diamonds and pencil lead are made of the same element - Carbon! 💎",
        "The only letter not in the periodic table is the letter 'J'! 📝"
      ],
      "Biology": [
        "Your body has enough DNA to stretch from the Earth to the Sun and back 600 times! 🧬",
        "A honeybee has to visit about 1,500 flowers to make one teaspoon of honey! 🐝"
      ],
      "Physics": [
        "Lightning strikes the Earth about 100 times every second! ⚡",
        "Sound travels about 4.3 times faster in water than in air! 🌊"
      ]
    };
    return facts[category] || [
      "Scientists estimate there are over 100 billion galaxies in the universe! 🌌",
      "The average human brain has about 100 billion neurons! 🧠"
    ];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{currentProject.title}</DialogTitle>
          <DialogDescription>{currentProject.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-8rem)] pr-4 -mr-4">
          {/* Safety Tips Section */}
          <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold text-orange-700">Safety First! 🛡️</h3>
            </div>
            <ul className="space-y-2">
              {getSafetyTips(currentProject.category).map((tip, index) => (
                <li key={index} className="text-orange-600 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Fun Facts Section */}
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-blue-700">Did You Know? 🤔</h3>
            </div>
            <ul className="space-y-2">
              {getFunFacts(currentProject.category).map((fact, index) => (
                <li key={index} className="text-blue-600 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  {fact}
                </li>
              ))}
            </ul>
          </div>

          {/* Visual Project Guide */}
          <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold text-purple-700">Project Guide 📚</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex-1 p-3 rounded bg-white border border-purple-200">
                  <p className="font-medium text-purple-700">Step 1: Plan 📝</p>
                  <p className="text-purple-600">Write your hypothesis and gather materials</p>
                </div>
                <div className="flex-1 p-3 rounded bg-white border border-purple-200">
                  <p className="font-medium text-purple-700">Step 2: Experiment 🔬</p>
                  <p className="text-purple-600">Follow your procedure and take notes</p>
                </div>
                <div className="flex-1 p-3 rounded bg-white border border-purple-200">
                  <p className="font-medium text-purple-700">Step 3: Learn 📊</p>
                  <p className="text-purple-600">Analyze results and draw conclusions</p>
                </div>
              </div>
            </div>
          </div>

          <ProjectAnalysis
            projectId={currentProject.id}
            title={currentProject.title}
            description={currentProject.description}
            hypothesis={currentProject.hypothesis}
            materials={currentProject.materials}
          />
          <ProjectHypothesis hypothesis={currentProject.hypothesis} />
          <ProjectMaterials materials={currentProject.materials} />
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
