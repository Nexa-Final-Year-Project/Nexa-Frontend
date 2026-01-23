import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function TeamMemberAvatar({
  name,
  role,
  avatarUrl,
}: {
  name?: string;
  role?: string;
  avatarUrl?: string;
}) {
  const displayName = name?.trim() || "Unknown";
  const displayRole = role?.trim() || "Member";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <Tooltip>
      <TooltipTrigger>
        <Avatar className="hover:scale-110 transition-transform">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-medium">{displayName}</p>
        <p className="text-sm text-muted-foreground">{displayRole}</p>
      </TooltipContent>
    </Tooltip>
  );
}
