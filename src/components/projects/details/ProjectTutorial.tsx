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
  
  // Generate experiment-specific construction plan
  const generateExperimentPlan = () => {
    const title = project.title.toLowerCase();
    const description = project.description.toLowerCase();
    
    // Generate specific steps based on project content
    if (title.includes("plant") && (title.includes("growth") || title.includes("light"))) {
      return [
        "Gather identical seedlings or seeds of the same plant variety",
        "Prepare identical pots with the same type and amount of soil",
        "Set up different light conditions (bright light, dim light, no light)",
        "Label each pot clearly with the light condition it will receive",
        "Plant seeds at the same depth or place seedlings in each pot",
        "Position pots in their designated light environments",
        "Water each pot with the same amount of water daily",
        "Measure and record initial plant height (if using seedlings)",
        "Create a daily observation chart for growth measurements",
        "Take photos of each plant setup for documentation",
        "Measure plant height every 2-3 days at the same time",
        "Record any changes in color, leaf development, or health",
        "Continue observations for 2-3 weeks to see significant results"
      ];
    }
    
    if (title.includes("volcano") || title.includes("eruption") || (title.includes("baking soda") && title.includes("vinegar"))) {
      return [
        "Gather materials: baking soda, white vinegar, food coloring, dish soap, small plastic bottle",
        "Shape clay or playdough around the bottle to create a volcano structure",
        "Place the volcano model on a large tray to contain the 'eruption'",
        "Add 2-3 tablespoons of baking soda to the bottle",
        "Add 2-3 drops of red food coloring to the baking soda",
        "Add a small squeeze of dish soap for extra foam effect",
        "Prepare vinegar in a measuring cup (about 1/2 cup)",
        "Set up camera or phone to record the eruption",
        "Quickly pour vinegar into the bottle opening",
        "Step back and observe the chemical reaction",
        "Record the height and duration of the 'eruption'",
        "Clean up and repeat with different amounts to test variables",
        "Document which combination created the best eruption effect"
      ];
    }
    
    if (title.includes("density") || title.includes("oil") || title.includes("water") || title.includes("liquid")) {
      return [
        "Gather different liquids: water, vegetable oil, honey, dish soap, corn syrup",
        "Collect food coloring to make each liquid a different color",
        "Find a tall, clear container (glass jar or clear plastic tube)",
        "Add food coloring to water (blue), oil (yellow), dish soap (green)",
        "Start with the densest liquid - pour honey slowly into the bottom",
        "Slowly pour corn syrup over the back of a spoon to avoid mixing",
        "Add dish soap next, pouring very slowly down the side of the container",
        "Pour colored water gently over the spoon to create the next layer",
        "Finally, add colored oil as the top layer",
        "Observe how the liquids separate into distinct layers",
        "Take photos showing the different density layers",
        "Try dropping small objects to see which layer they stop in",
        "Document the order of liquids from most to least dense"
      ];
    }
    
    if (title.includes("magnet") || title.includes("magnetic")) {
      return [
        "Collect various small objects: paper clips, coins, keys, plastic items, wood pieces",
        "Gather different types of magnets: bar magnet, horseshoe magnet, round magnets",
        "Create a data chart with 'Object' and 'Magnetic/Not Magnetic' columns",
        "Test each object by bringing the magnet close to it",
        "Record whether each object is attracted to the magnet or not",
        "Sort objects into two groups: magnetic and non-magnetic materials",
        "Test the strength of attraction by seeing how close the magnet needs to be",
        "Try the magnet through different materials (paper, cardboard, glass)",
        "Test if the magnet works underwater by putting objects in a bowl of water",
        "See how many paper clips can hang in a chain from the magnet",
        "Document your findings about which materials are magnetic",
        "Take photos of your magnetic and non-magnetic object groups",
        "Draw conclusions about what types of materials magnets attract"
      ];
    }
    
    if (title.includes("crystal") || title.includes("salt") || title.includes("sugar")) {
      return [
        "Prepare hot water in a measuring cup (ask an adult for help)",
        "Add salt or sugar to the hot water and stir until no more dissolves",
        "Continue adding until you have a supersaturated solution",
        "Let the solution cool to room temperature",
        "Tie a string to a pencil and lower it into the solution",
        "Make sure the string doesn't touch the bottom of the container",
        "Place the container in a quiet location where it won't be disturbed",
        "Cover with a cloth to prevent dust but allow evaporation",
        "Check daily for crystal formation on the string",
        "Take photos every few days to document crystal growth",
        "Measure the size of the largest crystals as they grow",
        "Record how long it takes for visible crystals to form",
        "Compare crystal shapes and sizes after one week",
        "Document the difference between salt and sugar crystal formation"
      ];
    }
    
    // Default plan for projects that don't match specific patterns
    return [
      `Set up your workspace for the "${project.title}" experiment`,
      "Gather all materials listed in your project materials section",
      "Prepare your data collection method (notebook, chart, or digital recording)",
      "Create your control group or baseline measurement",
      "Set up your experimental conditions as described in your hypothesis",
      "Begin the experiment following your planned procedure",
      "Record initial observations and measurements",
      "Monitor and document changes at regular intervals",
      "Take photographs to document the process and results",
      "Collect data consistently throughout the experiment duration",
      "Analyze your results and compare them to your hypothesis",
      "Prepare your findings for presentation and conclusion"
    ];
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
                  <p className="text-sm text-muted-foreground">Step-by-step construction process for your specific experiment</p>
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
