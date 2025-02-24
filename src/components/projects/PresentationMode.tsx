
import { useState, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import html2pdf from "html2pdf.js";
import { useToast } from "@/hooks/use-toast";
import ReactDOMServer from "react-dom/server";
import { PresentationHeader } from "./presentation/PresentationHeader";
import { PresentationControls } from "./presentation/PresentationControls";
import { SlideContent } from "./presentation/SlideContent";
import { useSlides } from "./presentation/useSlides";
import { PresentationModeProps } from "./presentation/types";

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

  const slides = useSlides(project, getStatusProgress);

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

    try {
      toast({
        title: "Preparing PDF",
        description: "Please wait while we generate your presentation..."
      });

      const tempContainer = document.createElement('div');
      tempContainer.style.width = '100%';
      tempContainer.style.padding = '20px';

      for (const slide of slides) {
        const slideDiv = document.createElement('div');
        slideDiv.style.pageBreakAfter = 'always';
        slideDiv.style.padding = '20px';
        slideDiv.style.minHeight = '90vh';
        slideDiv.style.display = 'flex';
        slideDiv.style.alignItems = 'center';
        slideDiv.style.justifyContent = 'center';

        const temp = document.createElement('div');
        temp.innerHTML = ReactDOMServer.renderToStaticMarkup(slide.content);
        slideDiv.appendChild(temp);
        
        tempContainer.appendChild(slideDiv);
      }

      const opt = {
        margin: 10,
        filename: `${project.title.toLowerCase().replace(/\s+/g, '-')}-presentation.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
      };

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
          <PresentationHeader
            currentSlide={currentSlideIndex}
            totalSlides={slides.length}
            onExport={exportToPDF}
          />

          <div className="flex-1 overflow-x-hidden px-4 py-8" ref={contentRef}>
            <AnimatePresence mode="wait">
              <SlideContent slide={slides[currentSlideIndex]} />
            </AnimatePresence>
          </div>

          <PresentationControls
            currentSlide={currentSlideIndex}
            totalSlides={slides.length}
            onPrevious={previousSlide}
            onNext={nextSlide}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
