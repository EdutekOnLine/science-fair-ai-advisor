
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LineChart } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ProjectDataAnalysisProps {
  projectId: string;
  title: string;
  experimentResults: Record<string, number> | null;
}

export const ProjectDataAnalysis = ({
  projectId,
  title,
  experimentResults,
}: ProjectDataAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{
    insights: string;
    recommendations: string;
  } | null>(null);
  const { toast } = useToast();

  const generateAnalysis = async () => {
    if (!experimentResults) {
      toast({
        title: "No data available",
        description: "Please add experiment results before analyzing.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('data-analyzer', {
        body: {
          projectTitle: title,
          experimentResults,
        }
      });

      if (error) throw error;

      setAnalysis(data);
      toast({
        title: "Analysis Complete",
        description: "Your experiment data has been analyzed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to analyze data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const chartData = experimentResults
    ? Object.entries(experimentResults).map(([key, value]) => ({
        name: key,
        value: value,
      }))
    : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Data Analysis</CardTitle>
          <Button
            onClick={generateAnalysis}
            disabled={isAnalyzing || !experimentResults}
            variant="outline"
            className="gap-2"
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LineChart className="h-4 w-4" />
            )}
            Analyze Data
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {experimentResults && (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {analysis && (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Key Insights</h4>
              <div className="whitespace-pre-wrap">{analysis.insights}</div>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Recommendations</h4>
              <div className="whitespace-pre-wrap">{analysis.recommendations}</div>
            </div>
          </div>
        )}

        {!experimentResults && (
          <div className="text-center text-muted-foreground py-8">
            No experiment results available for analysis. Add some results to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
