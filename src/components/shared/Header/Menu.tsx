import { MENU_ITEMS } from "@/lib/constants/menu/menuConstants";
import Link from "next/link";
import React from "react";

const Menu = () => {
  return (
    <ul className="flex items-center space-x-4">
      {MENU_ITEMS.map((item) => (
        <li key={item.label}>
          <Link href={item.path} className="relative group text-white">
            {item.label}
            <span className="absolute left-0 -bottom-2 w-0 h-1 bg-stone-cable transition-all duration-300 group-hover:w-full rounded-full"></span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Menu;
