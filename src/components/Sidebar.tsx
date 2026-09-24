import { LayoutDashboard, Users, Settings } from "lucide-react";
import { appConfig } from "../config/appConfig";
import NavItem from "./NavItem";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/employees", label: "Employees", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
          ST
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">
            {appConfig.companyName}
          </p>
          <p className="truncate text-xs text-slate-500">
            {appConfig.applicationName}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} onClick={onNavigate} />
        ))}
      </nav>

      <div className="border-t border-slate-200 px-5 py-3">
        <p className="text-xs text-slate-400">v{appConfig.version}</p>
      </div>
    </aside>
  );
}
