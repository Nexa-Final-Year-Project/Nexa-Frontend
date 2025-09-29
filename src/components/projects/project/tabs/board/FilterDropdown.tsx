// components/MultiSelectDropdown.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface MultiSelectDropdownProps {
  label: string;
  options: { id: string; name: string }[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  options,
  selectedIds,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div ref={ref} className="relative w-48">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm shadow-sm hover:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{label}</span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg"
        >
          {options.map(({ id, name }) => (
            <li
              key={id}
              role="option"
              aria-selected={selectedIds.includes(id)}
              className={`flex cursor-pointer select-none items-center gap-2 px-3 py-2 text-sm ${
                selectedIds.includes(id)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => toggleSelection(id)}
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(id)}
                onChange={() => toggleSelection(id)}
                className="cursor-pointer"
              />
              <span>{name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
