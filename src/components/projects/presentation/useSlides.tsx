
import React from 'react';
import { Project } from "@/types/project";
import { Progress } from "@/components/ui/progress";
import { Slide } from "./types";

export const useSlides = (project: Project, getStatusProgress: (status: Project['status']) => number): Slide[] => {
  return [
    {
      id: 'title',
      title: project.title,
      content: (
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">{project.title}</h1>
          <p className="text-xl text-muted-foreground">{project.description}</p>
        </div>
      ),
    },
    {
      id: 'hypothesis',
      title: 'Hypothesis',
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Research Hypothesis</h2>
          <div className="bg-muted p-6 rounded-lg">
            <p className="text-lg">{project.hypothesis}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'materials',
      title: 'Materials',
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Required Materials</h2>
          <ul className="list-disc pl-6 space-y-2">
            {project.materials?.map((material, index) => (
              <li key={index} className="text-lg">{material}</li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      id: 'observations',
      title: 'Observations',
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Lab Notes</h2>
          <div className="space-y-4">
            {project.observation_notes?.map((note, index) => (
              <div key={index} className="bg-muted p-4 rounded-lg">
                <p className="text-lg">{note}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'progress',
      title: 'Project Progress',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Current Progress</h2>
          <div className="space-y-4">
            <Progress value={getStatusProgress(project.status)} className="h-4" />
            <p className="text-center text-lg text-muted-foreground capitalize">
              Project Status: {project.status.replace('_', ' ')}
            </p>
          </div>
        </div>
      ),
    },
  ];
};
