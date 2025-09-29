import { Avatar } from "@/components/ui/avatar/avatar";
import { User } from "@/types/auth";
import { ProjectMember } from "@/types/project";
import React from "react";
import DropdownSearchPanel from "../DropdownSearchPanel";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useTasks } from "@/hooks/tasks/useTasks";

const AssignTasksPanel = ({
  members,
  assignee,
  taskId,
}: {
  members: ProjectMember[];
  assignee?: User;
  taskId: string;
}) => {
  // fallback placeholder avatar
  const { assignTask } = useTasks();
  const placeholderImage = "/images/avatar-placeholder.png"; // or any placeholder image you have
  console.log("Members: ", members);
  console.log("Assignee", assignee);
  return (
    <DropdownSearchPanel
      trigger={
        <Avatar>
          <AvatarImage
            src={assignee?.avatar?.url}
            alt={assignee?.name || "Unassigned"}
          />
        </Avatar>
      }
      content={
        <div className=" max-h-60 overflow-y-auto">
          {members.map((member) => (
            <div
              key={member.memberId._id}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => assignTask(member.memberId._id, taskId)} // <-- move it here
            >
              <Avatar>
                <AvatarImage
                  src={member.memberId.avatar?.url || placeholderImage}
                  alt={member.memberId.name || "User"}
                  className="mr-2"
                />
              </Avatar>
              <span className="text-sm">{member.memberId.name}</span>
            </div>
          ))}
        </div>
      }
      contentClassName="p-0"
      position={{ side: "bottom", align: "center" }}
    />
  );
};

export default AssignTasksPanel;
