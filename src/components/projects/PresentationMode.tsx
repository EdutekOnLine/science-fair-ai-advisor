
import { Project } from "@/types/project";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PresentationModeProps {
  project: Project | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  getStatusProgress: (status: Project['status']) => number;
}

interface Slide {
  id: string;
  title: string;
  content: React.ReactNode;
}

export const PresentationMode = ({
  project,
  isOpen,
  onOpenChange,
  getStatusProgress,
}: PresentationModeProps) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  if (!project) return null;

  const slides: Slide[] = [
    {
      id: 'title',
      title: project.title,
      content: (
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">{project.title}</h1>
          <p className="text-xl text-muted-foreground">{project.description}</p>
        </div>
      ),
    },
    {
      id: 'hypothesis',
      title: 'Hypothesis',
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Research Hypothesis</h2>
          <div className="bg-muted p-6 rounded-lg">
            <p className="text-lg">{project.hypothesis}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'materials',
      title: 'Materials',
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Required Materials</h2>
          <ul className="list-disc pl-6 space-y-2">
            {project.materials?.map((material, index) => (
              <li key={index} className="text-lg">{material}</li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      id: 'observations',
      title: 'Observations',
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Lab Notes</h2>
          <div className="space-y-4">
            {project.observation_notes?.map((note, index) => (
              <div key={index} className="bg-muted p-4 rounded-lg">
                <p className="text-lg">{note}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'progress',
      title: 'Project Progress',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Current Progress</h2>
          <div className="space-y-4">
            <Progress value={getStatusProgress(project.status)} className="h-4" />
            <p className="text-center text-lg text-muted-foreground capitalize">
              Project Status: {project.status.replace('_', ' ')}
            </p>
          </div>
        </div>
      ),
    },
  ];

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => 
      prev < slides.length - 1 ? prev + 1 : prev
    );
  };

  const previousSlide = () => {
    setCurrentSlideIndex((prev) => 
      prev > 0 ? prev - 1 : prev
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden sm:max-h-[80vh]">
        <div className="relative h-full flex flex-col">
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="text-sm text-muted-foreground">
              {currentSlideIndex + 1} / {slides.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={slides[currentSlideIndex].id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full flex items-center justify-center"
              >
                {slides[currentSlideIndex].content}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="border-t flex items-center justify-between p-4">
            <Button
              variant="outline"
              onClick={previousSlide}
              disabled={currentSlideIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={nextSlide}
              disabled={currentSlideIndex === slides.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
