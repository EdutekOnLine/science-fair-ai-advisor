
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, FlaskConical } from "lucide-react";

interface ProjectExperimentPlannerProps {
  projectId: string;
  title: string;
  description: string;
  hypothesis: string | null;
  materials: string[];
}

export const ProjectExperimentPlanner = ({ 
  projectId, 
  title, 
  description,
  hypothesis,
  materials 
}: ProjectExperimentPlannerProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);
  const { toast } = useToast();

  const generatePlan = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('experiment-planner', {
        body: {
          projectTitle: title,
          projectDescription: description,
          hypothesis,
          materials
        }
      });

      if (error) throw error;

      setPlan(data.plan);
      toast({
        title: "Experiment Plan Generated",
        description: "Your experiment plan is ready.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to generate experiment plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Experiment Planner</CardTitle>
          <Button
            onClick={generatePlan}
            disabled={isGenerating}
            variant="outline"
            className="gap-2"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FlaskConical className="h-4 w-4" />
            )}
            Generate Plan
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {plan && (
          <div className="bg-muted p-4 rounded-lg space-y-4">
            <h4 className="font-semibold">Experiment Plan</h4>
            <div className="whitespace-pre-wrap">{plan}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
