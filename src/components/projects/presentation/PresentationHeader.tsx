
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface PresentationHeaderProps {
  currentSlide: number;
  totalSlides: number;
  onExport: () => void;
}

export const PresentationHeader = ({
  currentSlide,
  totalSlides,
  onExport,
}: PresentationHeaderProps) => {
  return (
    <div className="absolute top-4 right-4 flex items-center gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onExport}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Export PDF
      </Button>
      <span className="text-sm text-muted-foreground">
        {currentSlide + 1} / {totalSlides}
      </span>
    </div>
  );
};
