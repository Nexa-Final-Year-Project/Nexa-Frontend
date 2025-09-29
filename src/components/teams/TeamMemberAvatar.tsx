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
  name: string;
  role: string;
  avatarUrl?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Avatar className="hover:scale-110 transition-transform">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </TooltipContent>
    </Tooltip>
  );
}
