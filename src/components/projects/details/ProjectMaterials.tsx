
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectMaterialsProps {
  materials: string[] | null;
}

export const ProjectMaterials = ({ materials }: ProjectMaterialsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Materials Needed</CardTitle>
      </CardHeader>
      <CardContent>
        {materials && materials.length > 0 ? (
          <ul className="list-disc pl-4 space-y-1">
            {materials.map((material, index) => (
              <li key={index}>{material}</li>
            ))}
          </ul>
        ) : (
          <p>No materials listed</p>
        )}
      </CardContent>
    </Card>
  );
};
