
import { useState, useEffect } from "react";
import { Project, ProjectFile } from "@/types/project";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Presentation, FileText } from "lucide-react";
import { ProjectFileUpload } from "./ProjectFileUpload";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProjectDetailsProps {
  project: Project | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPresentationMode: () => void;
}

export const ProjectDetails = ({
  project,
  isOpen,
  onOpenChange,
  onPresentationMode,
}: ProjectDetailsProps) => {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [newNote, setNewNote] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (project?.id) {
      fetchFiles();
    }
  }, [project?.id]);

  const fetchFiles = async () => {
    if (!project?.id) return;

    const { data, error } = await supabase
      .from("project_files")
      .select("*")
      .eq("project_id", project.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching files",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setFiles(data);
  };

  const addNote = async () => {
    if (!project?.id || !newNote.trim()) return;

    const notes = project.observation_notes || [];
    const updatedNotes = [...notes, newNote.trim()];

    const { error } = await supabase
      .from("projects")
      .update({ observation_notes: updatedNotes })
      .eq("id", project.id);

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

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
          <DialogDescription>{project.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hypothesis</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{project.hypothesis}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Materials Needed</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-4 space-y-1">
                {project.materials?.map((material, index) => (
                  <li key={index}>{material}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Project Files
                <ProjectFileUpload
                  projectId={project.id}
                  onFileUploaded={fetchFiles}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {files.length > 0 ? (
                <ul className="space-y-2">
                  {files.map((file) => (
                    <li key={file.id} className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <a
                        href={file.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {file.file_name}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No files uploaded yet
                </p>
              )}
            </CardContent>
          </Card>

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
              
              {project.observation_notes?.length ? (
                <ul className="space-y-2">
                  {project.observation_notes.map((note, index) => (
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

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onPresentationMode}
            >
              <Presentation className="h-4 w-4 mr-2" />
              Present Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
