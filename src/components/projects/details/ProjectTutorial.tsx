
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
    
    // Robot/Arduino projects
    if (title.includes("robot") || title.includes("arduino") || title.includes("line following")) {
      return [
        "Connect the Arduino board to your computer via USB cable",
        "Install Arduino IDE software and necessary libraries",
        "Attach the motor driver shield to the Arduino board",
        "Connect two DC motors to the motor driver outputs (M1 and M2)",
        "Wire the ultrasonic sensor: VCC to 5V, GND to GND, Trig to pin 7, Echo to pin 8",
        "Connect infrared sensors underneath the chassis for line detection",
        "Mount the Arduino and breadboard securely on the robot chassis",
        "Attach wheels to the DC motors and ensure they rotate freely",
        "Connect the battery pack (4 AA batteries) to power the motors",
        "Upload the line-following code to the Arduino board",
        "Calibrate the infrared sensors by adjusting sensitivity potentiometers",
        "Test the robot on a simple black line track",
        "Fine-tune the code parameters for smooth line following"
      ];
    }
    
    // Plant growth experiments
    if (title.includes("plant") && (title.includes("growth") || title.includes("light"))) {
      return [
        "Prepare 3 identical pots with drainage holes",
        "Fill each pot with the same type and amount of potting soil",
        "Plant 3 identical seeds in each pot at 1cm depth",
        "Label the pots: 'Full Light', 'Partial Light', 'No Light'",
        "Place the 'Full Light' pot near a sunny window",
        "Put the 'Partial Light' pot in a location with indirect sunlight",
        "Place the 'No Light' pot in a dark closet or cover with a box",
        "Water each pot with exactly 50ml of water every other day",
        "Measure and record the soil temperature daily",
        "After germination, measure plant height every 2 days with a ruler",
        "Count and record the number of leaves on each plant",
        "Take photos of each plant from the same angle daily",
        "Record any color changes or unusual growth patterns",
        "Continue observations for 3-4 weeks to see significant differences"
      ];
    }
    
    // Volcano eruption experiments
    if (title.includes("volcano") || title.includes("eruption") || (title.includes("baking soda") && title.includes("vinegar"))) {
      return [
        "Shape modeling clay around a small plastic bottle to form a volcano cone",
        "Leave the bottle opening exposed at the top of the volcano",
        "Place the volcano model on a large tray to catch overflow",
        "Mix 3 tablespoons of baking soda with 5 drops of red food coloring",
        "Add the colored baking soda mixture to the bottle",
        "Squeeze in 1 teaspoon of liquid dish soap for extra foam",
        "Prepare 1/2 cup of white vinegar in a measuring cup",
        "Set up a camera to record the eruption from a safe distance",
        "Quickly pour all the vinegar into the bottle opening",
        "Step back immediately and observe the chemical reaction",
        "Measure the height of the 'lava' flow with a ruler",
        "Record the duration of the eruption with a stopwatch",
        "Clean the setup and repeat with different ratios to test variables",
        "Try adding different amounts of soap or food coloring for comparison"
      ];
    }
    
    // Density tower experiments
    if (title.includes("density") || title.includes("liquid") || title.includes("layer")) {
      return [
        "Gather liquids in order of density: honey, corn syrup, dish soap, water, vegetable oil",
        "Add food coloring: blue to water, yellow to oil, green to dish soap",
        "Use a tall, clear glass or plastic cylinder for best visibility",
        "Start with honey - pour 2 tablespoons slowly into the bottom",
        "Pour corn syrup very slowly over the back of a spoon to avoid mixing",
        "Add the colored dish soap by letting it drip down the container wall",
        "Pour the blue water gently over a spoon, aiming for the container side",
        "Finally, add the yellow oil by pouring it very slowly over a spoon",
        "Wait 5 minutes for the layers to settle and separate completely",
        "Observe the distinct layers and their boundaries",
        "Test by dropping small objects (grape, cork, paperclip) through the layers",
        "Record which layer each object stops in based on its density",
        "Take photographs showing the clear separation of all five layers",
        "Try mixing two layers gently with a straw and observe what happens"
      ];
    }
    
    // Magnet experiments
    if (title.includes("magnet") || title.includes("magnetic")) {
      return [
        "Collect test objects: iron nails, aluminum foil, plastic spoon, wooden stick, copper penny",
        "Gather different magnets: bar magnet, horseshoe magnet, round refrigerator magnets",
        "Create a data table with columns: Object, Material, Attracted (Y/N), Distance",
        "Test each object by slowly bringing the bar magnet closer until attraction occurs",
        "Measure and record the distance at which attraction begins",
        "Sort all objects into two groups: magnetic and non-magnetic",
        "Test magnetic strength by seeing how many paperclips each magnet can hold",
        "Place a piece of paper between the magnet and a paperclip - test if it still attracts",
        "Try cardboard, then glass, then plastic to see if magnetism works through materials",
        "Fill a bowl with water and test if magnetism works underwater",
        "Create a magnetic field visualization using iron filings on paper over the magnet",
        "Test if you can make a temporary magnet by stroking a nail with the permanent magnet",
        "Record all observations about magnetic field strength and material interactions"
      ];
    }
    
    // Crystal growing experiments
    if (title.includes("crystal") || title.includes("salt") || title.includes("sugar")) {
      return [
        "Heat 2 cups of water in a microwave-safe container for 2 minutes (ask adult for help)",
        "Slowly add salt or sugar while stirring until no more dissolves (supersaturated solution)",
        "Continue adding 2 more tablespoons even after it stops dissolving easily",
        "Let the solution cool to room temperature (about 30 minutes)",
        "Tie a piece of string to a pencil, leaving 4 inches of string hanging down",
        "Lower the string into the solution, ensuring it doesn't touch the bottom",
        "Rest the pencil across the rim of the container to suspend the string",
        "Cover the container with a cloth to prevent dust but allow evaporation",
        "Place in a quiet location where it won't be disturbed for several days",
        "Check daily and photograph any crystal formation on the string",
        "Measure the largest crystals with a ruler every few days",
        "Keep a daily log of crystal size, shape, and number",
        "Compare salt crystals (cubic) with sugar crystals (different shapes)",
        "After 1 week, carefully remove and examine crystals under a magnifying glass"
      ];
    }
    
    // Electronics/circuit experiments
    if (title.includes("circuit") || title.includes("led") || title.includes("battery")) {
      return [
        "Gather components: 9V battery, LED lights, resistors, copper wire, breadboard",
        "Strip 1cm of insulation from both ends of each wire piece",
        "Connect the positive (red) wire from battery to the positive rail of breadboard",
        "Connect the negative (black) wire from battery to the negative rail of breadboard",
        "Insert a 220-ohm resistor between the positive rail and row 1 of breadboard",
        "Place the LED with longer leg (positive) in row 1, shorter leg in row 5",
        "Connect row 5 to the negative rail using a jumper wire",
        "Test the circuit - the LED should light up when battery is connected",
        "Add a second LED in parallel by connecting it to the same rows",
        "Try connecting LEDs in series by connecting positive of one to negative of next",
        "Measure voltage across each component using a multimeter",
        "Record brightness differences between parallel and series connections",
        "Create a simple switch using aluminum foil and test circuit control"
      ];
    }
    
    // Default for unrecognized experiments
    return [
      "Set up a clean, organized workspace with all materials within reach",
      "Read through the complete procedure before starting any steps",
      "Prepare safety equipment (goggles, gloves) if working with chemicals",
      "Organize materials in the order they will be used in the procedure",
      "Set up data collection sheets or digital recording method",
      "Establish your control group or baseline measurements first",
      "Follow the specific procedure outlined in your project plan step-by-step",
      "Record observations and measurements at each step",
      "Take photographs to document the setup and any changes",
      "Repeat the procedure multiple times to ensure reliable results",
      "Clean up properly and safely dispose of any materials as needed"
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
