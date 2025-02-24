
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProjectNotesProps {
  projectId: string;
  notes: string[];
}

export const ProjectNotes = ({ projectId, notes }: ProjectNotesProps) => {
  const [newNote, setNewNote] = useState("");
  const { toast } = useToast();

  const addNote = async () => {
    if (!projectId || !newNote.trim()) return;

    const updatedNotes = [...notes, newNote.trim()];

    const { error } = await supabase
      .from("projects")
      .update({ observation_notes: updatedNotes })
      .eq("id", projectId);

    if (error) {
      toast({
        title: "Error adding note",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Note added",
      description: "Your observation has been saved.",
    });

    setNewNote("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lab Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Add a new observation..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <Button onClick={addNote} disabled={!newNote.trim()}>
            Add Note
          </Button>
        </div>
        
        {notes?.length ? (
          <ul className="space-y-2">
            {notes.map((note, index) => (
              <li key={index} className="bg-muted p-2 rounded">
                {note}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">
            No observations recorded yet
          </p>
        )}
      </CardContent>
    </Card>
  );
};
