import React, { ReactNode } from "react";
import { ReusableDropdownMenu } from "@/components/ui/dropdown/ReusableDropdownMenu";

interface DropdownSearchPanelProps {
  trigger: ReactNode;
  content: ReactNode;
  className?: string;
  contentClassName?: string;
  position?: {
    side?: "top" | "right" | "bottom" | "left";
    align?: "center" | "start" | "end";
  };
}

const DropdownSearchPanel: React.FC<DropdownSearchPanelProps> = ({
  trigger,
  content,
  className,
  contentClassName,
  position,
}) => {
  return (
    <ReusableDropdownMenu
      trigger={trigger}
      customContent={content}
      className={className}
      contentClassName={contentClassName}
      position={position}
    />
  );
};

export default DropdownSearchPanel;
