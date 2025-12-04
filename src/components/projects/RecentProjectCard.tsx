import React from "react";
import { Card } from "../ui/card/Card";
import { CardHeader } from "../ui/card/CardHeader";
import { CardTitle } from "../ui/card/CardTitle";
import { Project, ProjectMember } from "@/types/project";
import { CardContent } from "../ui/card/CardContent";
import { TeamMemberAvatar } from "../teams/TeamMemberAvatar";
import { SquareArrowOutUpRight, Folder, Users, ArrowUpRight, Star } from "lucide-react";
import { usePathAppender } from "@/hooks/usePathAppender";
import { Button } from "../ui/button";
import { useStarredProjectsStore } from "@/store/starredProjects/starredProjectsStore";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const RecentProjectCard = ({
  project,
  members,
}: {
  project: Project;
  members: ProjectMember[];
}) => {
  const appendToPath = usePathAppender();
  const { isStarred, toggleStar } = useStarredProjectsStore();
  const starred = isStarred(project._id);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleViewAllProject = (id: string) => {
    appendToPath(`/p/${id}`);
  };

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleStar(project._id);
  };

  // Generate gradient based on project name hash
  const getProjectGradient = (name: string, dark: boolean) => {
    const gradients = dark ? [
      "from-neutral-700/30 to-neutral-800/20",
      "from-neutral-600/30 to-neutral-700/20",
      "from-neutral-700/35 to-neutral-800/25",
      "from-neutral-600/35 to-neutral-700/25",
      "from-neutral-700/40 to-neutral-800/30",
    ] : [
      "from-neutral-200/80 to-neutral-100/60",
      "from-neutral-300/60 to-neutral-200/40",
      "from-neutral-200/70 to-neutral-100/50",
      "from-neutral-300/50 to-neutral-200/30",
      "from-neutral-200/60 to-neutral-100/40",
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };

  const gradientClass = getProjectGradient(project.name, isDark);

  return (
    <Card className={`
      group relative overflow-hidden
      ${isDark 
        ? "bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1]" 
        : "bg-white border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 shadow-sm"
      }
      rounded-2xl p-0
      transition-all duration-300 ease-out cursor-pointer
    `}
    onClick={() => handleViewAllProject(project._id)}
    >
      {/* Top gradient accent bar */}
      <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${isDark ? "from-white/10 via-white/20 to-white/10" : "from-neutral-300 via-neutral-400 to-neutral-300"} opacity-60`} />
      
      {/* Card Content */}
      <div className="relative z-10 p-5">
        {/* Header with icon and actions */}
        <div className="flex items-start justify-between mb-4">
          <div className={`
            w-10 h-10 rounded-xl
            bg-gradient-to-br ${gradientClass}
            ${isDark ? "border border-white/[0.06]" : "border border-neutral-200"}
            flex items-center justify-center
          `}>
            <Folder className={isDark ? "w-5 h-5 text-white/60" : "w-5 h-5 text-neutral-500"} />
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Star Button */}
            <button
              onClick={handleStarClick}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
                starred 
                  ? "bg-amber-500/15 text-amber-500" 
                  : isDark 
                    ? "bg-transparent text-white/30 hover:text-amber-400 hover:bg-amber-500/10 opacity-0 group-hover:opacity-100"
                    : "bg-transparent text-neutral-300 hover:text-amber-500 hover:bg-amber-50 opacity-0 group-hover:opacity-100"
              )}
            >
              <Star className="w-4 h-4" fill={starred ? "currentColor" : "none"} />
            </button>
            
            {/* Open Button */}
            <button
              className={`
                w-8 h-8 rounded-lg
                flex items-center justify-center
                ${isDark 
                  ? "bg-transparent text-white/30 hover:text-white hover:bg-white/[0.06]" 
                  : "bg-transparent text-neutral-300 hover:text-neutral-700 hover:bg-neutral-100"
                }
                opacity-0 group-hover:opacity-100
                transition-all duration-200
              `}
              onClick={(e) => {
                e.stopPropagation();
                handleViewAllProject(project._id);
              }}
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <CardTitle className={`${isDark ? "text-white" : "text-neutral-900"} font-semibold text-base mb-2 line-clamp-1`}>
          {project.name}
        </CardTitle>
        
        {/* Description */}
        <p className={`${isDark ? "text-white/40" : "text-neutral-500"} text-sm line-clamp-2 mb-4 min-h-[2.5rem]`}>
          {project.description || "No description available"}
        </p>
        
        {/* Footer with members */}
        <div className={`flex items-center justify-between pt-3 border-t ${isDark ? "border-white/[0.06]" : "border-neutral-100"}`}>
          <div className="flex items-center gap-2">
            <Users className={isDark ? "w-3.5 h-3.5 text-white/30" : "w-3.5 h-3.5 text-neutral-400"} />
            <span className={`text-xs ${isDark ? "text-white/40" : "text-neutral-500"}`}>{members.length} members</span>
          </div>
          
          {/* Member avatars */}
          <div className="flex -space-x-2">
            {members.slice(0, 3).map((member) => (
              <TeamMemberAvatar
                key={member._id}
                name={member.name}
                role={member.role}
                avatarUrl={member.avatar || "https://via.placeholder.com/150"}
              />
            ))}
            {members.length > 3 && (
              <div className={`
                w-7 h-7 rounded-full
                ${isDark 
                  ? "bg-white/[0.08] border-2 border-[#0c0c10] text-white/60" 
                  : "bg-neutral-100 border-2 border-white text-neutral-500"
                }
                flex items-center justify-center
                text-[10px] font-medium
              `}>
                +{members.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RecentProjectCard;
