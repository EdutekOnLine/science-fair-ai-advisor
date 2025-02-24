import { Project } from "@/types/project";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Eye, 
  ArrowLeft, 
  ArrowRight, 
  Trash2, 
  Star, 
  Trophy, 
  Rocket,
  Leaf,
  FlaskConical,
  PartyPopper
} from "lucide-react";

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
  const getProjectPoints = (status: Project['status']) => {
    switch (status) {
      case 'completed': return 100;
      case 'in_progress': return 50;
      case 'draft': return 10;
      default: return 0;
    }
  };

  const getTotalPoints = () => {
    return projects.reduce((acc, project) => acc + getProjectPoints(project.status), 0);
  };

  const getScientistLevel = (points: number) => {
    if (points >= 500) return { title: "Master Scientist", stars: 5 };
    if (points >= 300) return { title: "Expert Explorer", stars: 4 };
    if (points >= 200) return { title: "Science Adventurer", stars: 3 };
    if (points >= 100) return { title: "Curious Mind", stars: 2 };
    return { title: "Beginner Scientist", stars: 1 };
  };

  const totalPoints = getTotalPoints();
  const level = getScientistLevel(totalPoints);

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl bg-gradient-to-r from-secondary/10 to-primary/10 border-2 border-primary/20"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-heading font-bold text-primary">Your Science Journey</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span className="font-bold text-lg">{totalPoints} Points</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mb-4">
          <span className="font-medium text-primary">{level.title}</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < level.stars ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 border-2 rounded-xl bg-gradient-to-br from-white to-primary/5 border-primary/20 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-4 flex-1">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-primary">{project.title}</h3>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {project.category}
                    </span>
                    <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium capitalize">
                      {project.status.replace('_', ' ')}
                    </span>
                    <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
                      +{getProjectPoints(project.status)} points
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Progress value={getStatusProgress(project.status)} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Leaf className="h-4 w-4" />
                      Draft
                    </span>
                    <span className="flex items-center gap-1">
                      <FlaskConical className="h-4 w-4" />
                      In Progress
                    </span>
                    <span className="flex items-center gap-1">
                      <PartyPopper className="h-4 w-4" />
                      Completed
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewDetails(project)}
                  className="hover:bg-primary/10 hover:text-primary"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onUpdateStatus(project, 'prev')}
                  disabled={project.status === 'draft'}
                  className="hover:bg-primary/10 hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onUpdateStatus(project, 'next')}
                  disabled={project.status === 'completed'}
                  className="hover:bg-primary/10 hover:text-primary"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(project.id)}
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
        {projects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground py-8 bg-card rounded-lg flex items-center justify-center gap-2"
          >
            <Rocket className="h-5 w-5" />
            Ready to start your scientific adventure? Generate your first project idea above!
          </motion.div>
        )}
      </div>
    </div>
  );
};
