
export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  hypothesis: string;
  materials: string[];
  status: 'draft' | 'in_progress' | 'completed';
  created_at: string;
}
