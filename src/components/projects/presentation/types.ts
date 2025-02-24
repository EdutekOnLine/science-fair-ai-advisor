
import { Project } from "@/types/project";

export interface Slide {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface PresentationModeProps {
  project: Project | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  getStatusProgress: (status: Project['status']) => number;
}
