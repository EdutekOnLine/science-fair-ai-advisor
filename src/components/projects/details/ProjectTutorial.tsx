
import { useState } from "react";
import { Book, ArrowRight, Check, ChevronDown, ChevronUp, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Project } from "@/types/project";

interface ProjectTutorialProps {
  project: Project;
}

export const ProjectTutorial = ({ project }: ProjectTutorialProps) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [showPlan, setShowPlan] = useState(false);
  
  // Generate experiment construction plan
  const generateExperimentPlan = () => {
    const basePlan = [
      "Review your hypothesis and ensure you understand what you're testing",
      "Gather all materials listed for your project",
      "Choose a suitable workspace with adequate lighting and ventilation",
      "Set up your control group (if applicable) - this will not receive the treatment",
      "Prepare your experimental group(s) - these will receive the treatment you're testing",
      "Create a data collection sheet or use a notebook to record observations",
      "Take 'before' photos or measurements to document initial conditions",
      "Follow the experimental procedure step by step",
      "Record data at consistent time intervals as planned",
      "Take 'after' photos or measurements to document results",
      "Repeat the experiment multiple times if possible for reliability",
      "Analyze your data and compare results to your hypothesis"
    ];

    // Customize plan based on project category
    if (project.category.toLowerCase().includes("biology")) {
      return [
        "Review your hypothesis about the biological process you're studying",
        "Gather all biological materials and prepare proper containers",
        "Set up a controlled environment (consistent temperature, light, etc.)",
        "Prepare your control group - organisms that won't receive treatment",
        "Prepare your experimental group(s) - organisms that will receive treatment",
        "Create a daily observation schedule and data recording system",
        "Document initial conditions (size, color, behavior, etc.)",
        "Apply your experimental treatment according to your procedure",
        "Monitor and record biological changes daily",
        "Measure growth, behavior changes, or other relevant metrics",
        "Take photos to document visual changes over time",
        "Continue observations for the planned duration",
        "Analyze patterns in biological responses and compare to hypothesis"
      ];
    }

    if (project.category.toLowerCase().includes("chemistry")) {
      return [
        "Review your hypothesis about the chemical reaction you're testing",
        "Gather all chemicals and safety equipment (goggles, gloves)",
        "Set up your workspace with proper ventilation and safety measures",
        "Prepare measuring tools (beakers, graduated cylinders, scales)",
        "Set up your control - the reaction without the variable you're testing",
        "Prepare your experimental setup with the variable you're testing",
        "Create a data sheet to record temperature, color changes, gas formation",
        "Document initial conditions and take 'before' photos",
        "Carefully add chemicals in the correct order and amounts",
        "Observe and record immediate reactions (bubbling, color change, heat)",
        "Monitor the reaction progress over time",
        "Measure final products and document end results",
        "Safely dispose of all chemicals according to guidelines",
        "Analyze reaction data and compare to your predicted outcome"
      ];
    }

    if (project.category.toLowerCase().includes("physics")) {
      return [
        "Review your hypothesis about the physical phenomenon you're testing",
        "Gather all equipment and measuring instruments",
        "Set up a stable, level workspace free from vibrations",
        "Calibrate any measuring devices (rulers, timers, scales)",
        "Create your control setup - the standard condition for comparison",
        "Build your experimental apparatus according to your design",
        "Create a data collection system for measurements",
        "Test your setup with a trial run to ensure everything works",
        "Take baseline measurements without the variable you're testing",
        "Apply your experimental variable (force, heat, light, etc.)",
        "Record measurements at consistent intervals",
        "Repeat trials multiple times for accuracy",
        "Calculate averages and analyze patterns in your data"
      ];
    }

    return basePlan;
  };

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
  const experimentPlan = generateExperimentPlan();

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
          Follow these detailed steps to complete your project successfully. Start with the experiment construction plan, then follow the detailed tutorial steps.
        </p>

        {/* Experiment Construction Plan Section */}
        <div className="mb-6">
          <div 
            className={`border rounded-lg overflow-hidden cursor-pointer ${showPlan ? 'bg-primary/10' : 'bg-background'}`}
            onClick={() => setShowPlan(!showPlan)}
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <ClipboardList className="h-5 w-5 text-primary" />
                <div>
                  <h4 className="font-medium">Experiment Construction Plan</h4>
                  <p className="text-sm text-muted-foreground">Step-by-step construction process for your experiment</p>
                </div>
              </div>
              {showPlan ? 
                <ChevronUp className="h-5 w-5" /> : 
                <ChevronDown className="h-5 w-5" />
              }
            </div>
            
            {showPlan && (
              <div className="p-4 bg-muted/30 border-t">
                <ol className="space-y-3 pl-4">
                  {experimentPlan.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPlan(false);
                    }}
                  >
                    Close Plan
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Tutorial Steps */}
        <div className="space-y-3">
          <h4 className="font-medium text-muted-foreground mb-3">Detailed Tutorial Steps</h4>
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
