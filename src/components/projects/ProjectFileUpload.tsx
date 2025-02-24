
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProjectFileUploadProps {
  projectId: string;
  onFileUploaded: () => void;
}

export const ProjectFileUpload = ({ projectId, onFileUploaded }: ProjectFileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);

      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${projectId}/${Math.random()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('project-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-files')
        .getPublicUrl(filePath);

      // Save file reference in database
      const { error: dbError } = await supabase.from('project_files').insert({
        project_id: projectId,
        file_name: file.name,
        file_url: publicUrl,
        file_type: file.type
      });

      if (dbError) throw dbError;

      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully.",
      });

      onFileUploaded();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={uploadFile}
        disabled={uploading}
      />
      <label htmlFor="file-upload">
        <Button
          variant="outline"
          className="cursor-pointer"
          disabled={uploading}
          asChild
        >
          <span>
            {uploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Upload File
          </span>
        </Button>
      </label>
    </div>
  );
};
