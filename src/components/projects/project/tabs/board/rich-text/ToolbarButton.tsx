import React from "react";

type ToolbarButtonProps = {
  icon: React.ComponentType<{ size?: number }>;
  isActive: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function ToolbarButton({
  icon: Icon,
  isActive,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-1 rounded hover:bg-gray-100 ${
        isActive ? "bg-gray-200" : ""
      }`}
      type="button"
    >
      <Icon size={16} />
    </button>
  );
}
