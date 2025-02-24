
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProjectFile } from "@/types/project";
import { UploadCloud, FileType, Loader2 } from "lucide-react";

interface ProjectFilesProps {
  projectId: string;
  files: ProjectFile[];
  onFileUploaded: () => void;
}

export const ProjectFiles = ({ projectId, files, onFileUploaded }: ProjectFilesProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('project-files')
        .upload(fileName, file);

      if (storageError) throw storageError;

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('project-files')
        .getPublicUrl(fileName);

      // Save file metadata to database
      const { error: dbError } = await supabase
        .from('project_files')
        .insert({
          project_id: projectId,
          file_name: file.name,
          file_type: file.type,
          file_url: publicUrlData.publicUrl
        });

      if (dbError) throw dbError;

      toast({
        title: "File uploaded successfully",
        description: "Your file has been added to the project."
      });

      onFileUploaded();
    } catch (error) {
      toast({
        title: "Error uploading file",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Files</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-6">
          <label className="cursor-pointer text-center">
            <Input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <div className="space-y-2">
              <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground" />
              <div className="text-sm">
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </div>
                ) : (
                  "Click to upload or drag and drop"
                )}
              </div>
            </div>
          </label>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-2 rounded border"
              >
                <div className="flex items-center gap-2">
                  <FileType className="h-4 w-4" />
                  <span>{file.file_name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(file.file_url, '_blank')}
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
