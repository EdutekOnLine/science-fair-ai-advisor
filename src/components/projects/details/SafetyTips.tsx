
import { AlertTriangle } from "lucide-react";

interface SafetyTipsProps {
  category: string;
}

export const SafetyTips = ({ category }: SafetyTipsProps) => {
  const getSafetyTips = (category: string) => {
    const tips: Record<string, string[]> = {
      "Chemistry": [
        "Always wear safety goggles",
        "Use gloves when handling chemicals",
        "Work in a well-ventilated area",
        "Ask an adult for supervision"
      ],
      "Biology": [
        "Wash hands before and after",
        "Keep your workspace clean",
        "Use proper disposal methods",
        "Be gentle with living things"
      ],
      "Physics": [
        "Protect your eyes during light experiments",
        "Be careful with moving parts",
        "Keep water away from electronics",
        "Use tools properly"
      ]
    };
    return tips[category] || [
      "Always work with adult supervision",
      "Keep your workspace tidy",
      "Follow all safety instructions carefully",
      "Ask questions if you're unsure"
    ];
  };

  return (
    <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="h-5 w-5 text-orange-500" />
        <h3 className="font-semibold text-orange-700">Safety First!</h3>
      </div>
      <ul className="space-y-2">
        {getSafetyTips(category).map((tip, index) => (
          <li key={index} className="text-orange-600 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
};
