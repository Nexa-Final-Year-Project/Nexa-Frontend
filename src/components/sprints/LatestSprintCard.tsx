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
import { useTheme } from "next-themes";

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
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Card className={`border-2 ${isDark ? "border-blue-500/50 bg-neutral-900/40" : "border-blue-200 bg-neutral-50"}`}>
      <CardHeader>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-start gap-4">
          <div className="flex-1 min-w-0">
            <Badge variant="secondary" className="mb-2">
              Latest Sprint
            </Badge>
            <CardTitle className={`text-2xl font-bold uppercase font-mono truncate ${isDark ? "text-white" : "text-neutral-900"}`}>
              {sprint.name || sprint.sprintName}
            </CardTitle>
            <p className={`text-sm mt-2 line-clamp-2 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              {sprint.goals?.join(", ") || "No goals specified"}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0 w-full lg:w-auto">
            <Button
              variant="outline"
              size="sm"
              className={`flex-1 lg:flex-none cursor-pointer ${isDark ? "border-white/[0.1] hover:bg-white/[0.05]" : "border-neutral-300 hover:bg-neutral-100"}`}
              onClick={onConfigure}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`flex-1 lg:flex-none cursor-pointer ${isDark ? "border-red-500/30 hover:bg-red-500/10" : "border-red-300 hover:bg-red-50"}`}
              onClick={onDelete}
            >
              <Trash className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Calendar className={`h-5 w-5 flex-shrink-0 ${isDark ? "text-neutral-500" : "text-neutral-400"}`} />
            <span className={`text-sm ${isDark ? "text-neutral-400" : "text-neutral-700"}`}>
              {format(parseISO(sprint.startDate), "MMM d")} —{" "}
              {format(parseISO(sprint.endDate), "MMM d")}
            </span>
          </div>

          <div>
            <div className={`flex justify-between text-sm mb-2 ${isDark ? "text-neutral-400" : "text-neutral-700"}`}>
              <span>Progress</span>
              <span className="font-semibold">{calculateProgress(sprint._id)}%</span>
            </div>
            <Progress value={calculateProgress(sprint._id)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
