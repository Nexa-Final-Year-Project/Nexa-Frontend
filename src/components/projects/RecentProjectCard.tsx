import React from "react";
import { Card } from "../ui/card/Card";
import { CardHeader } from "../ui/card/CardHeader";
import { CardTitle } from "../ui/card/CardTitle";
import { Project, ProjectMember } from "@/types/project";
import { CardContent } from "../ui/card/CardContent";
import { TeamMemberAvatar } from "../teams/TeamMemberAvatar";
import { SquareArrowOutUpRight } from "lucide-react";
import { usePathAppender } from "@/hooks/usePathAppender";
import { Button } from "../ui/button";

const RecentProjectCard = ({
  project,
  members,
}: {
  project: Project;
  members: ProjectMember[];
}) => {
  const appendToPath = usePathAppender();

  const handleViewAllProject = (id: string) => {
    appendToPath(`/p/${id}`);
  };
  return (
    <Card>
      <div className="flex justify-end">
        <Button onClick={() => handleViewAllProject(project._id)}>
          <SquareArrowOutUpRight className="w-4 h-4" />
        </Button>
      </div>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
      </CardHeader>
      <CardContent className=" text-muted-foreground">
        {project.description}
        <div className="flex -space-x-[0.8rem] items-end justify-end">
          {members.slice(0, 4).map((member) => (
            <TeamMemberAvatar
              key={member._id}
              name={member.name}
              role={member.role}
              avatarUrl={member.avatar || "https://via.placeholder.com/150"}
            />
          ))}
          <TeamMemberAvatar
            name="Sam"
            role="Backend"
            avatarUrl="https://randomuser.me/api/portraits/men/42.jpg"
          />
          <TeamMemberAvatar
            name="Taylor"
            role="PM"
            avatarUrl="https://randomuser.me/api/portraits/men/43.jpg"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentProjectCard;
