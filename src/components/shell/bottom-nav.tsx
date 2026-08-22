"use client";

import { Barbell } from "@phosphor-icons/react/Barbell";
import { CalendarDots } from "@phosphor-icons/react/CalendarDots";
import { ChartLineUp } from "@phosphor-icons/react/ChartLineUp";
import { House } from "@phosphor-icons/react/House";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { href: "/", icon: House, label: "Hoy" },
  { href: "/semana", icon: CalendarDots, label: "Semana" },
  { href: "/ejercicios", icon: Barbell, label: "Ejercicios" },
  { href: "/progreso", icon: ChartLineUp, label: "Progreso" },
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
