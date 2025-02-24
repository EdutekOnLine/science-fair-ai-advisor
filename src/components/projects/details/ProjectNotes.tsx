
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles } from "lucide-react";

interface ProjectNotesProps {
  projectId: string;
  notes: string[];
}

export const ProjectNotes = ({ projectId, notes }: ProjectNotesProps) => {
  const [newNote, setNewNote] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const { toast } = useToast();

  const addNote = async () => {
    if (!newNote.trim()) return;

    const updatedNotes = [...notes, newNote.trim()];

    const { error } = await supabase
      .from("projects")
      .update({ observation_notes: updatedNotes })
      .eq("id", projectId);

    if (error) {
      toast({
        title: "Error adding note",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Note added",
      description: "Your observation has been recorded."
    });

    setNewNote("");
  };

  const analyzeNotes = async () => {
    if (notes.length === 0) {
      toast({
        title: "No notes to analyze",
        description: "Add some observation notes first.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data: projectData } = await supabase
        .from("projects")
        .select("title")
        .eq("id", projectId)
        .single();

      const { data, error } = await supabase.functions.invoke('analyze-notes', {
        body: {
          notes,
          projectTitle: projectData?.title || "Unknown Project"
        }
      });

      if (error) throw error;

      setAnalysis(data.analysis);
      toast({
        title: "Analysis Complete",
        description: "AI has analyzed your observation notes.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Lab Notes</CardTitle>
          <Button
            onClick={analyzeNotes}
            disabled={isAnalyzing || notes.length === 0}
            variant="outline"
            className="gap-2"
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Analyze Notes
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Record your observations..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <Button onClick={addNote} disabled={!newNote.trim()}>
            Add Note
          </Button>
        </div>

        {analysis && (
          <div className="bg-muted p-4 rounded-lg space-y-2 mt-4">
            <h4 className="font-semibold">AI Analysis</h4>
            <p className="whitespace-pre-wrap">{analysis}</p>
          </div>
        )}

        {notes.length > 0 && (
          <div className="space-y-2">
            {notes.map((note, index) => (
              <div
                key={index}
                className="p-3 rounded bg-muted"
              >
                {note}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
