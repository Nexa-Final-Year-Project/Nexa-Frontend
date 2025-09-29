import { Calendar, Settings, Trash } from "lucide-react";
import { Badge } from "../ui/badge/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card/Card";
import { CardHeader } from "../ui/card/CardHeader";
import { CardTitle } from "../ui/card/CardTitle";
import { Sprint as SprintType } from "@/types/sprint";
import { Progress } from "../ui/progress";
import { CardContent } from "../ui/card/CardContent";
import { format, parseISO } from "date-fns";

export const LatestSprintCard = ({
  sprint,
  onConfigure,
  onDelete,
  calculateProgress,
}: {
  sprint: SprintType;
  onConfigure: () => void;
  onDelete: () => void;
  calculateProgress: (id: string) => number;
}) => (
  <Card className="border-primary">
    <CardHeader>
      <div className="flex justify-between items-center">
        <div>
          <Badge variant="secondary" className="mb-2">
            Latest Sprint
          </Badge>
          <CardTitle>{sprint.name}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {sprint.goals?.join(", ") || "No goals specified"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="lg" onClick={onConfigure}>
            <Settings className="h-5 w-5 mr-2" />
            Configure
          </Button>
          <Button variant="outline" size="lg" onClick={onDelete}>
            <Trash className=" text-red-500" size={28} />
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span>
            {format(parseISO(sprint.startDate), "MMM d")} -{" "}
            {format(parseISO(sprint.endDate), "MMM d")}
          </span>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{calculateProgress(sprint._id)}%</span>
          </div>
          <Progress value={calculateProgress(sprint._id)} />
        </div>
      </div>
    </CardContent>
  </Card>
);
