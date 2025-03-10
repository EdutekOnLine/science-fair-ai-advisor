
import { useState } from "react";
import { Book, ArrowRight, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/types/project";

interface ProjectTutorialProps {
  project: Project;
}

export const ProjectTutorial = ({ project }: ProjectTutorialProps) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(0);
  
  // Generate steps based on project category and title
  const generateSteps = () => {
    // Default steps that apply to most projects
    const defaultSteps = [
      {
        title: "Set Up Your Workspace",
        description: "Prepare a clean area to work on your project",
        detailedSteps: [
          "Find a flat, stable surface with plenty of room to work",
          "Gather all your materials and tools in one place",
          "Put down protective covering if needed (newspaper, plastic sheet)",
          "Make sure you have good lighting",
          "Have a notebook ready to write down observations"
        ]
      },
      {
        title: "Prepare Your Materials",
        description: "Get your materials ready for the experiment",
        detailedSteps: [
          "Carefully read through all instructions before starting",
          "Measure and prepare any substances you'll be using",
          "Label containers clearly if needed",
          "Put on any required safety equipment (gloves, goggles)",
          "Take 'before' photos if you want to document your process"
        ]
      },
      {
        title: `Set Up Your ${project.category} Experiment`,
        description: "Arrange your materials according to your plan",
        detailedSteps: [
          "Set up your experiment exactly as described in your plan",
          "Create your control group if applicable",
          "Make sure all variables except the one you're testing remain constant",
          "Double-check your setup against your hypothesis",
          "Take photos of your initial setup for documentation"
        ]
      },
      {
        title: "Conduct Your Experiment",
        description: "Follow your procedure carefully",
        detailedSteps: [
          "Follow each step in your planned procedure",
          "Record observations as you go - what do you see happening?",
          "Take measurements at consistent intervals",
          "Note any unexpected results or surprises",
          "Repeat trials multiple times if possible for more reliable results"
        ]
      },
      {
        title: "Record Your Data",
        description: "Document all your results",
        detailedSteps: [
          "Create tables for your numerical data",
          "Write detailed descriptions of what you observed",
          "Take 'after' photos to document results",
          "Be honest about all results, even if they weren't what you expected",
          "Look for patterns or trends in your data"
        ]
      },
      {
        title: "Analyze Your Results",
        description: "Make sense of what happened",
        detailedSteps: [
          "Compare your results to your original hypothesis",
          "Calculate averages or other statistics if relevant",
          "Create graphs or charts to visualize your data",
          "Think about possible sources of error",
          "Draw conclusions based on your evidence"
        ]
      },
      {
        title: "Present Your Findings",
        description: "Share what you learned",
        detailedSteps: [
          "Create a display board with clear sections",
          "Include your question, hypothesis, procedure, and results",
          "Add photos, graphs, and other visuals",
          "Prepare a short verbal explanation of your project",
          "Practice answering questions about your methods and conclusions"
        ]
      }
    ];

    // For specific categories, we could add more specialized steps
    if (project.category.toLowerCase().includes("biology")) {
      defaultSteps.splice(3, 0, {
        title: "Observe Biological Changes",
        description: "Monitor living organisms or biological processes",
        detailedSteps: [
          "Observe and document changes at regular intervals",
          "Take careful measurements of growth or other biological processes",
          "Note environmental conditions that might affect your specimens",
          "Keep living specimens in appropriate conditions",
          "Be patient - biological processes often take time"
        ]
      });
    }
    
    if (project.category.toLowerCase().includes("chemistry")) {
      defaultSteps.splice(3, 0, {
        title: "Perform Chemical Reactions",
        description: "Safely conduct chemical procedures",
        detailedSteps: [
          "Double-check safety precautions before mixing any chemicals",
          "Add chemicals in the correct order and amounts",
          "Note color changes, temperature changes, or gas formation",
          "Allow sufficient time for reactions to complete",
          "Dispose of all chemicals properly according to safety guidelines"
        ]
      });
    }

    return defaultSteps;
  };

  const steps = generateSteps();

  const toggleStep = (index: number) => {
    if (expandedStep === index) {
      setExpandedStep(null);
    } else {
      setExpandedStep(index);
    }
  };

  const navigateToNextStep = (currentIndex: number) => {
    if (currentIndex < steps.length - 1) {
      setExpandedStep(currentIndex + 1);
    } else {
      setExpandedStep(null);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Book className="h-5 w-5 text-primary" />
          Step-by-Step Tutorial for "{project.title}"
        </h3>

        <p className="text-muted-foreground mb-6">
          Follow these detailed steps to complete your project successfully. Click on each step to see detailed instructions.
        </p>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="border rounded-lg overflow-hidden bg-card">
              <div 
                className={`flex items-center justify-between p-4 cursor-pointer ${expandedStep === index ? 'bg-primary/10' : 'bg-background'}`}
                onClick={() => toggleStep(index)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {expandedStep === index ? 
                  <ChevronUp className="h-5 w-5" /> : 
                  <ChevronDown className="h-5 w-5" />
                }
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
                  
                  <div className="flex justify-between mt-4">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStep(index);
                      }}
                    >
                      Close
                    </Button>
                    
                    <Button 
                      variant="default"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToNextStep(index);
                      }}
                    >
                      {index < steps.length - 1 ? (
                        <>
                          Next Step <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        'Finish'
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
