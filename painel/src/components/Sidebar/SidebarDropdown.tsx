import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

interface SidebarDropdownProps {
  items: any[]; // Deve refletir o tipo real dos seus itens
}

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({ items }) => {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);


  return (
    <ul className="mt-2 flex flex-col gap-1.5 pl-5">
      {items.map((childItem, index) => {
        // Verifica se o subitem possui uma propriedade 'role' e se o role do usuário está incluído
        if (childItem.role && (!user || !childItem.role.includes(user.role))) {
          return null; // Não renderiza este subitem
        }

        return (
          <li key={index}>
            <Link
              href={childItem.route}
              className={`
                ${pathname === childItem.route
                  ? "bg-primary/[.07] text-primary dark:bg-white/10 dark:text-white"
                  : "text-dark-4 hover:bg-gray-2 hover:text-dark dark:text-gray-5 dark:hover:bg-white/10 dark:hover:text-white"}
                group relative flex items-center gap-3 rounded-[7px] px-3.5 py-2 font-medium duration-300 ease-in-out
              `}
            >
              {childItem.label}
              {childItem.pro && (
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md bg-primary px-1.5 py-px text-[10px] font-medium leading-[17px] text-white">
                  Pro
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarDropdown;
