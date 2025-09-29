import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  activeSection: string;
  projectName: string;
}

export const ProjectSettingsBreadcrumb = ({
  activeSection,
  projectName,
}: BreadcrumbProps) => {
  const sectionTitles: Record<string, string> = {
    general: "General Settings",
    team: "Team Management",
    permissions: "Permissions",
    danger: "Danger Zone",
  };

  return (
    <nav className="flex items-center text-sm text-muted-foreground mb-6">
      <span className="hover:text-foreground cursor-pointer">Projects</span>
      <ChevronRight className="w-4 h-4 mx-2" />
      <span className="hover:text-foreground cursor-pointer">
        {projectName}
      </span>
      <ChevronRight className="w-4 h-4 mx-2" />
      <span className="text-foreground font-medium">
        {sectionTitles[activeSection]}
      </span>
    </nav>
  );
};
