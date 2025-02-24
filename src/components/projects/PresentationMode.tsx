import { Project } from "@/types/project";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2pdf from "html2pdf.js";
import { useToast } from "@/hooks/use-toast";
import ReactDOMServer from "react-dom/server";

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
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  const exportToPDF = async () => {
    if (!contentRef.current) return;

    // Save current slide index
    const currentIndex = currentSlideIndex;

    try {
      toast({
        title: "Preparing PDF",
        description: "Please wait while we generate your presentation..."
      });

      // Create a temporary container for all slides
      const tempContainer = document.createElement('div');
      tempContainer.style.width = '100%';
      tempContainer.style.padding = '20px';

      // Add all slides to the container
      for (const slide of slides) {
        const slideDiv = document.createElement('div');
        slideDiv.style.pageBreakAfter = 'always';
        slideDiv.style.padding = '20px';
        slideDiv.style.minHeight = '90vh';
        slideDiv.style.display = 'flex';
        slideDiv.style.alignItems = 'center';
        slideDiv.style.justifyContent = 'center';

        // Create a temporary element to render the React content
        const temp = document.createElement('div');
        // @ts-ignore - We know this is safe as we're controlling the content
        temp.innerHTML = ReactDOMServer.renderToStaticMarkup(slide.content);
        slideDiv.appendChild(temp);
        
        tempContainer.appendChild(slideDiv);
      }

      // Configure PDF options
      const opt = {
        margin: 10,
        filename: `${project.title.toLowerCase().replace(/\s+/g, '-')}-presentation.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
      };

      // Generate PDF
      await html2pdf().set(opt).from(tempContainer).save();

      toast({
        title: "PDF exported successfully",
        description: "Your presentation has been downloaded."
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden sm:max-h-[80vh]">
        <div className="relative h-full flex flex-col">
          <div className="absolute top-4 right-4 flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToPDF}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentSlideIndex + 1} / {slides.length}
            </span>
          </div>

          <div className="flex-1 overflow-hidden px-4 py-8" ref={contentRef}>
            <AnimatePresence mode="wait">
              <motion.div
                key={slides[currentSlideIndex].id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
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
