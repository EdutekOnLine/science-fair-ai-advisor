
import { Info, ClipboardList, FlaskConical, BarChart2, ArrowRight, List, Check, Book, FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const ProjectGuide = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const steps = [
    {
      title: "Plan Your Project",
      icon: <ClipboardList className="h-4 w-4" />,
      shortDescription: "Write your hypothesis and gather materials",
      detailedSteps: [
        "Define a clear, testable question for your project",
        "Research similar experiments and background information",
        "Write a hypothesis that predicts the outcome",
        "Create a list of all materials you'll need",
        "Plan your experiment procedure step by step",
        "Consider what variables to measure and how"
      ]
    },
    {
      title: "Conduct Your Experiment",
      icon: <FlaskConical className="h-4 w-4" />,
      shortDescription: "Follow your procedure and take notes",
      detailedSteps: [
        "Set up your experiment in a controlled environment",
        "Take 'before' photos or measurements as a starting point",
        "Follow your procedure exactly as planned",
        "Record all observations in detail, including unexpected results",
        "Document your process with photos or video if possible",
        "Repeat trials multiple times for more reliable results",
        "Keep track of any changes you make to your original plan"
      ]
    },
    {
      title: "Analyze Your Results",
      icon: <BarChart2 className="h-4 w-4" />,
      shortDescription: "Analyze results and draw conclusions",
      detailedSteps: [
        "Organize your data in tables or spreadsheets",
        "Create graphs or charts to visualize your results",
        "Look for patterns or trends in your data",
        "Compare your results with your original hypothesis",
        "Consider what might have affected your results",
        "Draw conclusions based on your evidence",
        "Think about how your project could be improved"
      ]
    },
    {
      title: "Present Your Findings",
      icon: <FileText className="h-4 w-4" />,
      shortDescription: "Create a compelling presentation",
      detailedSteps: [
        "Organize your display board with clear sections",
        "Include your question, hypothesis, procedure, and results",
        "Add eye-catching visuals like charts and photos",
        "Prepare a brief verbal explanation of your project",
        "Practice answering questions about your methods",
        "Be ready to explain why your project matters",
        "Include ideas for future research"
      ]
    }
  ];

  const toggleStep = (index: number) => {
    if (expandedStep === index) {
      setExpandedStep(null);
    } else {
      setExpandedStep(index);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-5 w-5 text-purple-500" />
          <h3 className="font-semibold text-purple-700">Project Guide</h3>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start gap-4 text-sm">
            {steps.slice(0, 3).map((step, index) => (
              <div key={index} className="flex-1 p-3 rounded bg-white border border-purple-200 w-full">
                <p className="font-medium text-purple-700 flex items-center gap-2">
                  {step.icon}
                  Step {index + 1}: {step.title}
                </p>
                <p className="text-purple-600">{step.shortDescription}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            Step-by-Step Project Guide
          </h3>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div 
                  className={`flex items-center justify-between p-4 cursor-pointer ${expandedStep === index ? 'bg-primary/10' : 'bg-background'}`}
                  onClick={() => toggleStep(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary">
                      {index + 1}
                    </div>
                    <h4 className="font-medium">{step.title}</h4>
                  </div>
                  <ArrowRight className={`h-5 w-5 transition-transform ${expandedStep === index ? 'rotate-90' : ''}`} />
                </div>
                
                {expandedStep === index && (
                  <div className="p-4 bg-muted/30 border-t">
                    <ol className="space-y-3 pl-4">
                      {step.detailedSteps.map((detailedStep, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                          <span>{detailedStep}</span>
                        </li>
                      ))}
                    </ol>
                    
                    <Button 
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedStep(index < steps.length - 1 ? index + 1 : null);
                      }}
                    >
                      {index < steps.length - 1 ? 'Next Step' : 'Close Guide'}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
