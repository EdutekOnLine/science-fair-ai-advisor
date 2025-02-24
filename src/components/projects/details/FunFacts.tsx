
import { Lightbulb } from "lucide-react";

interface FunFactsProps {
  category: string;
}

export const FunFacts = ({ category }: FunFactsProps) => {
  const getFunFacts = (category: string) => {
    const facts: Record<string, string[]> = {
      "Chemistry": [
        "Did you know? Diamonds and pencil lead are made of the same element - Carbon!",
        "The only letter not in the periodic table is the letter 'J'!"
      ],
      "Biology": [
        "Your body has enough DNA to stretch from the Earth to the Sun and back 600 times!",
        "A honeybee has to visit about 1,500 flowers to make one teaspoon of honey!"
      ],
      "Physics": [
        "Lightning strikes the Earth about 100 times every second!",
        "Sound travels about 4.3 times faster in water than in air!"
      ]
    };
    return facts[category] || [
      "Scientists estimate there are over 100 billion galaxies in the universe!",
      "The average human brain has about 100 billion neurons!"
    ];
  };

  return (
    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-5 w-5 text-blue-500" />
        <h3 className="font-semibold text-blue-700">Did You Know?</h3>
      </div>
      <ul className="space-y-2">
        {getFunFacts(category).map((fact, index) => (
          <li key={index} className="text-blue-600 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            {fact}
          </li>
        ))}
      </ul>
    </div>
  );
};
