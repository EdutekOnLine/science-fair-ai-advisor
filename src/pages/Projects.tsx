import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProjectGenerator } from "@/components/projects/ProjectGenerator";
import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { PresentationMode } from "@/components/projects/PresentationMode";
import { Project } from "@/types/project";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { LogOut, Upload } from "lucide-react";

const Projects = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const { toast } = useToast();

  const {
    data: projects,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        toast({
          title: "Error fetching projects",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data as Project[];
    },
  });

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <nav className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          {/* Logo upload button */}
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => document.getElementById('logo-upload')?.click()}
            className="relative overflow-hidden"
          >
            <Upload className="h-4 w-4" />
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `logo-${Date.now()}.${fileExt}`;
                    const { error: uploadError } = await supabase.storage
                      .from('logos')
                      .upload(fileName, file);

                    if (uploadError) throw uploadError;

                    toast({
                      title: "Logo uploaded successfully",
                      description: "Your logo has been uploaded and will be displayed in the navigation.",
                    });
                  } catch (error: any) {
                    toast({
                      title: "Error uploading logo",
                      description: error.message,
                      variant: "destructive",
                    });
                  }
                }
              }}
            />
          </Button>
          <h1 className="text-2xl font-bold">My Science Projects</h1>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </nav>

      {project ? (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ProjectDetails
            project={project}
            onClose={() => setProject(null)}
            onUpdate={refetch}
            onPresentationMode={() => setIsPresentationMode(true)}
          />
        </motion.div>
      ) : isPresentationMode ? (
        <PresentationMode onClose={() => setIsPresentationMode(false)} />
      ) : (
        <>
          <ProjectGenerator
            onProjectGenerated={(newProject: Project) => {
              setProject(newProject);
              refetch();
            }}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
          />
          <ProjectList
            projects={projects}
            isLoading={isLoading}
            onSelectProject={(project: Project) => setProject(project)}
          />
        </>
      )}
    </div>
  );
};

export default Projects;
