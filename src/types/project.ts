
export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  hypothesis: string;
  materials: string[];
  status: 'draft' | 'in_progress' | 'completed';
  created_at: string;
  observation_notes?: string[];
  experiment_results?: Record<string, any>;
  presentation_template?: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  created_at: string;
}

export interface DataPoint {
  id: string;
  project_id: string;
  metric_name: string;
  value: number;
  recorded_at: string;
}
