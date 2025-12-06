import { MENU_ITEMS } from "@/lib/constants/menu/menuConstants";
import Link from "next/link";
import React from "react";
import { useTheme } from "next-themes";

const Menu = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <ul className="flex items-center space-x-4">
      {MENU_ITEMS.map((item) => (
        <li key={item.label}>
          <Link
            href={item.path}
            className={`relative group transition-colors duration-200 ${
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
