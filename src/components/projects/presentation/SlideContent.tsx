
import { motion } from "framer-motion";
import { Slide } from "./types";

interface SlideContentProps {
  slide: Slide;
}

export const SlideContent = ({ slide }: SlideContentProps) => {
  return (
    <motion.div
      key={slide.id}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="h-full flex items-center justify-center"
    >
      <div className="max-h-[calc(90vh-12rem)] overflow-y-auto pr-4 -mr-4">
        {slide.content}
      </div>
    </motion.div>
  );
};
