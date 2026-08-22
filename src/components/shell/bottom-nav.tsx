"use client";

import {
  CalendarDots,
  ChartLineUp,
  House,
  UserCircle,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { href: "/", icon: House, label: "Hoy" },
  { href: "/semana", icon: CalendarDots, label: "Semana" },
  { href: "/progreso", icon: ChartLineUp, label: "Progreso" },
  { href: "/perfil", icon: UserCircle, label: "Perfil" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegación principal" className="bottom-nav">
      <ul>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`bottom-nav__item${isActive ? " is-active" : ""}`}
                href={item.href}
              >
                <Icon
                  aria-hidden="true"
                  size={25}
                  weight={isActive ? "fill" : "regular"}
                />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
