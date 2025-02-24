
import { Info, ClipboardList, FlaskConical, BarChart2 } from "lucide-react";

export const ProjectGuide = () => {
  return (
    <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
      <div className="flex items-center gap-2 mb-3">
        <Info className="h-5 w-5 text-purple-500" />
        <h3 className="font-semibold text-purple-700">Project Guide</h3>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex-1 p-3 rounded bg-white border border-purple-200">
            <p className="font-medium text-purple-700 flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Step 1: Plan
            </p>
            <p className="text-purple-600">Write your hypothesis and gather materials</p>
          </div>
          <div className="flex-1 p-3 rounded bg-white border border-purple-200">
            <p className="font-medium text-purple-700 flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              Step 2: Experiment
            </p>
            <p className="text-purple-600">Follow your procedure and take notes</p>
          </div>
          <div className="flex-1 p-3 rounded bg-white border border-purple-200">
            <p className="font-medium text-purple-700 flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Step 3: Learn
            </p>
            <p className="text-purple-600">Analyze results and draw conclusions</p>
          </div>
        </div>
      </div>
    </div>
  );
};
