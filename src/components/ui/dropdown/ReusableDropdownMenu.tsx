"use client";

import React, { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../dropdown-menu/dropdown-menu";

type Side = "top" | "right" | "bottom" | "left";
type Align = "center" | "start" | "end" | undefined;

interface DropdownItem {
  label: string;
  value: string;
  onClick: () => void;
  Icon?: ReactNode; // accepts JSX directly
}

interface ReusableDropdownMenuProps {
  trigger: ReactNode;
  items?: DropdownItem[]; // optional now
  customContent?: ReactNode; // <--- new prop
  iconPosition?: "left" | "right";
  className?: string;
  contentClassName?: string;
  itemClassName?: string;
  selectedItemClassName?: string;
  position?: { side?: Side; align?: Align };
  selectedValue?: string;
}

export function ReusableDropdownMenu({
  trigger,
  items,
  customContent,
  iconPosition = "left",
  className = "",
  contentClassName = "",
  itemClassName = "",
  selectedItemClassName = "",
  position,
  selectedValue,
}: ReusableDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className={` cursor-pointer ${className}`}>{trigger}</div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={`cursor-pointer ${contentClassName}`}
        side={position?.side ?? "top"}
        align={position?.align ?? "end"}
      >
        {/* If custom content provided, render that instead */}
        {customContent
          ? customContent
          : items?.map((item, idx) => (
              <DropdownMenuItem
                key={idx}
                onClick={item.onClick}
                className={`${itemClassName} ${
                  selectedValue === item.value ? selectedItemClassName : ""
                }`}
              >
                {iconPosition === "left" && item.Icon && (
                  <span className="mr-2">{item.Icon}</span>
                )}
                {item.label}
                {iconPosition === "right" && item.Icon && (
                  <span className="ml-2">{item.Icon}</span>
                )}
              </DropdownMenuItem>
            ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
