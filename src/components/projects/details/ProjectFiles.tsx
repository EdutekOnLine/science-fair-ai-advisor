
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectFile } from "@/types/project";
import { FileText } from "lucide-react";
import { ProjectFileUpload } from "../ProjectFileUpload";

interface ProjectFilesProps {
  projectId: string;
  files: ProjectFile[];
  onFileUploaded: () => void;
}

export const ProjectFiles = ({ projectId, files, onFileUploaded }: ProjectFilesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Project Files
          <ProjectFileUpload
            projectId={projectId}
            onFileUploaded={onFileUploaded}
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
  );
};
