import type { ReactNode } from "react";

import { BottomNav } from "./bottom-nav";

interface AppShellProps {
  children: ReactNode;
  hideNavigation?: boolean;
}

export function AppShell({ children, hideNavigation = false }: AppShellProps) {
  return (
    <div
      className={`app-shell${hideNavigation ? " app-shell--without-navigation" : ""}`}
    >
      <div className="app-shell__content">{children}</div>
      {hideNavigation ? null : <BottomNav />}
    </div>
  );
}
