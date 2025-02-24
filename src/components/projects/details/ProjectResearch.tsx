
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search } from "lucide-react";

interface ProjectResearchProps {
  projectId: string;
  title: string;
  description: string;
}

export const ProjectResearch = ({ projectId, title, description }: ProjectResearchProps) => {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const { toast } = useToast();

  const askQuestion = async () => {
    if (!question.trim()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('research-assistant', {
        body: {
          question,
          projectTitle: title,
          projectDescription: description
        }
      });

      if (error) throw error;

      setAnswer(data.answer);
      toast({
        title: "Research Assistant Response",
        description: "Your question has been answered.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to process your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Research Assistant</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Ask a scientific question about your project..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Button 
            onClick={askQuestion} 
            disabled={!question.trim() || isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Ask Question
          </Button>
        </div>

        {answer && (
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h4 className="font-semibold">Answer:</h4>
            <p className="whitespace-pre-wrap">{answer}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
