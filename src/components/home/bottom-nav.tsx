import {
  CalendarDots,
  ChartLineUp,
  House,
  LockSimple,
  UserCircle,
} from "@phosphor-icons/react";

import type {
  NavigationIcon,
  NavigationItem,
} from "@/types/training";

const iconMap = {
  home: House,
  calendar: CalendarDots,
  progress: ChartLineUp,
  profile: UserCircle,
} satisfies Record<NavigationIcon, typeof House>;

interface BottomNavProps {
  items: NavigationItem[];
}

export function BottomNav({ items }: BottomNavProps) {
  return (
    <nav aria-label="Navegación principal" className="bottom-nav">
      <ul>
        {items.map((item) => {
          const Icon = iconMap[item.icon];

          return (
            <li key={item.id}>
              {item.available ? (
                <a aria-current="page" className="bottom-nav__item is-active" href={item.href}>
                  <Icon aria-hidden="true" size={25} weight="fill" />
                  <span>{item.label}</span>
                </a>
              ) : (
                <button
                  aria-label={`${item.label}. Disponible en próximos sprints`}
                  className="bottom-nav__item"
                  disabled
                  type="button"
                >
                  <span className="bottom-nav__icon-wrap">
                    <Icon aria-hidden="true" size={25} weight="regular" />
                    <LockSimple
                      aria-hidden="true"
                      className="bottom-nav__lock"
                      size={9}
                      weight="fill"
                    />
                  </span>
                  <span>{item.label}</span>
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
