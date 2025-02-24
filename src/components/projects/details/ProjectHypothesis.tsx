
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectHypothesisProps {
  hypothesis: string;
}

export const ProjectHypothesis = ({ hypothesis }: ProjectHypothesisProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hypothesis</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{hypothesis}</p>
      </CardContent>
    </Card>
  );
};
