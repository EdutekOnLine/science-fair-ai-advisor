
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, X } from "lucide-react";

interface ProjectExperimentResultsProps {
  projectId: string;
  experimentResults: Record<string, number> | null;
  onResultsUpdated: () => void;
}

export const ProjectExperimentResults = ({
  projectId,
  experimentResults,
  onResultsUpdated,
}: ProjectExperimentResultsProps) => {
  const [newResultName, setNewResultName] = useState("");
  const [newResultValue, setNewResultValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAddResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResultName || !newResultValue) return;

    setIsSubmitting(true);
    const numericValue = parseFloat(newResultValue);
    
    if (isNaN(numericValue)) {
      toast({
        title: "Invalid value",
        description: "Please enter a valid number for the measurement.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const updatedResults = {
      ...(experimentResults || {}),
      [newResultName]: numericValue,
    };

    try {
      const { error } = await supabase
        .from("projects")
        .update({ experiment_results: updatedResults })
        .eq("id", projectId);

      if (error) throw error;

      toast({
        title: "Result added",
        description: "Your experiment result has been recorded.",
      });
      
      setNewResultName("");
      setNewResultValue("");
      onResultsUpdated();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the result. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResult = async (resultName: string) => {
    if (!experimentResults) return;

    const updatedResults = { ...experimentResults };
    delete updatedResults[resultName];

    try {
      const { error } = await supabase
        .from("projects")
        .update({ experiment_results: updatedResults })
        .eq("id", projectId);

      if (error) throw error;

      toast({
        title: "Result deleted",
        description: "The experiment result has been removed.",
      });
      
      onResultsUpdated();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the result. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experiment Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleAddResult} className="flex gap-4">
          <Input
            placeholder="Measurement name"
            value={newResultName}
            onChange={(e) => setNewResultName(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Value"
            type="number"
            step="any"
            value={newResultValue}
            onChange={(e) => setNewResultValue(e.target.value)}
            className="w-32"
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            <span className="ml-2">Add Result</span>
          </Button>
        </form>

        {experimentResults && Object.keys(experimentResults).length > 0 ? (
          <div className="space-y-2">
            {Object.entries(experimentResults).map(([name, value]) => (
              <div
                key={name}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div>
                  <span className="font-medium">{name}:</span>{" "}
                  <span>{value}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteResult(name)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No experiment results recorded yet. Add your first measurement above.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
