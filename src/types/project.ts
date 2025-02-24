
export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  hypothesis: string;
  materials: string[];
  status: 'draft' | 'in_progress' | 'completed';
  created_at: string;
  observation_notes: string[] | null;
  experiment_results: Record<string, number> | null;
  presentation_template: string | null;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  file_name: string;
  file_type: string;
  file_url: string;
  created_at: string;
}

export interface DataPoint {
  id: string;
  project_id: string;
  metric_name: string;
  value: number;
  recorded_at: string;
}
