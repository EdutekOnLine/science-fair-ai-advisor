
import { Project } from "@/types/project";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface PresentationModeProps {
  project: Project | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  getStatusProgress: (status: Project['status']) => number;
}

export const PresentationMode = ({
  project,
  isOpen,
  onOpenChange,
  getStatusProgress,
}: PresentationModeProps) => {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-8">
          <DialogHeader>
            <DialogTitle className="text-3xl">{project.title}</DialogTitle>
          </DialogHeader>

          <section className="space-y-4">
            <h3 className="text-2xl font-semibold">Introduction</h3>
            <p className="text-lg">{project.description}</p>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-semibold">Hypothesis</h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-lg">{project.hypothesis}</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-semibold">Materials</h3>
            <ul className="list-disc pl-6 space-y-2">
              {project.materials?.map((material, index) => (
                <li key={index} className="text-lg">{material}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-2xl font-semibold">Progress</h3>
            <div className="space-y-2">
              <Progress value={getStatusProgress(project.status)} className="h-3" />
              <p className="text-center text-muted-foreground capitalize">
                Current Status: {project.status.replace('_', ' ')}
              </p>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};
