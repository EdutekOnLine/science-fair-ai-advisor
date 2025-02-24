
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Project, DataPoint } from "@/types/project";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ExperimentResultsProps {
  project: Project;
  onUpdate: () => void;
}

export const ExperimentResults = ({ project, onUpdate }: ExperimentResultsProps) => {
  const [newMetric, setNewMetric] = useState("");
  const [newValue, setNewValue] = useState("");
  const { toast } = useToast();

  const addDataPoint = async () => {
    if (!newMetric.trim() || !newValue.trim()) return;

    const { error } = await supabase
      .from("project_data_points")
      .insert({
        project_id: project.id,
        metric_name: newMetric.trim(),
        value: parseFloat(newValue)
      });

    if (error) {
      toast({
        title: "Error adding data point",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Data point added",
      description: "Your experiment result has been recorded."
    });

    setNewMetric("");
    setNewValue("");
    onUpdate();
  };

  const getChartData = () => {
    if (!project.experiment_results) return [];
    
    const metrics = Object.keys(project.experiment_results);
    return metrics.map(metric => ({
      name: metric,
      value: project.experiment_results![metric]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experiment Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Metric Name</label>
            <Input
              placeholder="e.g., Temperature"
              value={newMetric}
              onChange={(e) => setNewMetric(e.target.value)}
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Value</label>
            <Input
              type="number"
              placeholder="e.g., 25.5"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
          </div>
          <Button onClick={addDataPoint} disabled={!newMetric || !newValue}>
            Add Data Point
          </Button>
        </div>

        {getChartData().length > 0 && (
          <div className="w-full h-[300px] mt-4">
            <LineChart
              width={600}
              height={300}
              data={getChartData()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
