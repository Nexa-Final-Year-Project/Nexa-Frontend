import { TaskPriority } from "@/types/task";
import { ReusableDropdownMenu } from "../ui/dropdown/ReusableDropdownMenu";
import { useState } from "react";

interface PriorityBadgeProps {
  priority: TaskPriority;
  onPriorityChange?: (priority: TaskPriority) => void;
  badgeClassName?: string;
  dropdownItemClassName?: string;
  selectedDropdownItemClassName?: string;
}

const PriorityBadge = ({
  priority,
  onPriorityChange,
  badgeClassName = "",
  dropdownItemClassName = "",
  selectedDropdownItemClassName = "font-semibold bg-gray-100 dark:bg-gray-700",
}: PriorityBadgeProps) => {
  const [selectedPriority, setSelectedPriority] =
    useState<TaskPriority>(priority);

  const handlePriorityChange = (newPriority: TaskPriority) => {
    setSelectedPriority(newPriority);
    onPriorityChange?.(newPriority);
  };

  const getBadgeColor = () => {
    switch (selectedPriority) {
      case "High":
        return "bg-red-700 text-white text-xs";
      case "Medium":
        return "bg-yellow-600 text-white text-xs";
      case "Low":
        return "bg-green-700 text-white text-xs";
      default:
        return "bg-gray-700 text-white text-xs";
    }
  };

  const PRIORITIES: TaskPriority[] = ["Low", "Medium", "High"];

  return (
    <ReusableDropdownMenu
      trigger={
        <span
          className={`px-2 py-1 rounded ${getBadgeColor()} ${badgeClassName}`}
        >
          {selectedPriority.charAt(0).toUpperCase() + selectedPriority.slice(1)}
        </span>
      }
      items={PRIORITIES?.map((priority) => ({
        label: priority,
        value: priority,
        onClick: () => handlePriorityChange(priority),
      }))}
      position={{
        side: "top",
        align: "start",
      }}
      itemClassName={`px-3 py-2 text-sm ${dropdownItemClassName}`}
      selectedItemClassName={selectedDropdownItemClassName}
      selectedValue={selectedPriority}
      className="cursor-pointer"
    />
  );
};

export default PriorityBadge;
