
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PresentationControlsProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const PresentationControls = ({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
}: PresentationControlsProps) => {
  return (
    <div className="border-t flex items-center justify-between p-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentSlide === 0}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      <Button
        variant="outline"
        onClick={onNext}
        disabled={currentSlide === totalSlides - 1}
      >
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};
