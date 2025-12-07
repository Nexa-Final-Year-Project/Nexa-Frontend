import { MENU_ITEMS } from "@/lib/constants/menu/menuConstants";
import Link from "next/link";
import React from "react";
import { useTheme } from "next-themes";

interface MenuProps {
  mobile?: boolean;
  onItemClick?: () => void;
}

const Menu = ({ mobile = false, onItemClick }: MenuProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (mobile) {
    return (
      <ul className="flex flex-col space-y-2">
        {MENU_ITEMS.map((item) => (
          <li key={item.label}>
            <Link
              href={item.path}
              onClick={onItemClick}
              className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${
                isDark
                  ? "text-white/70 hover:text-white hover:bg-white/10"
                  : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="flex items-center space-x-6 xl:space-x-8">
      {MENU_ITEMS.map((item) => (
        <li key={item.label}>
          <Link
            href={item.path}
            className={`relative group transition-colors duration-200 text-sm font-medium ${
              isDark
                ? "text-white/70 hover:text-white"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            {item.label}
            <span
              className={`absolute left-0 -bottom-2 w-0 h-0.5 transition-all duration-300 group-hover:w-full rounded-full ${
                isDark ? "bg-white/40" : "bg-neutral-400"
              }`}
            ></span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Menu;
