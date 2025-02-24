
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectMaterialsProps {
  materials: string[];
}

export const ProjectMaterials = ({ materials }: ProjectMaterialsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Materials Needed</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-4 space-y-1">
          {materials?.map((material, index) => (
            <li key={index}>{material}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
