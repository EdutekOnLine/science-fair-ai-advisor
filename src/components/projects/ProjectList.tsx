
import { Project } from "@/types/project";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Eye, ArrowLeft, ArrowRight, Trash2 } from "lucide-react";

interface ProjectListProps {
  projects: Project[];
  onViewDetails: (project: Project) => void;
  onUpdateStatus: (project: Project, direction: 'next' | 'prev') => void;
  onDelete: (id: string) => void;
  getStatusProgress: (status: Project['status']) => number;
}

export const ProjectList = ({
  projects,
  onViewDetails,
  onUpdateStatus,
  onDelete,
  getStatusProgress,
}: ProjectListProps) => {
  return (
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
                  onClick={() => onViewDetails(project)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onUpdateStatus(project, 'prev')}
                  disabled={project.status === 'draft'}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onUpdateStatus(project, 'next')}
                  disabled={project.status === 'completed'}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(project.id)}
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
  );
};
