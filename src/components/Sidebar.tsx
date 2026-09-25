import { LayoutDashboard, Users, Settings } from "lucide-react";
import { Link } from "react-router-dom";
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
      <div className="flex h-16 items-center border-b border-slate-200 px-5">
        <Link
          to="/"
          onClick={onNavigate}
          aria-label="Go to dashboard"
          className="block"
        >
          <img
            src="/brand/svg/supertech-fabric-wordmark.svg"
            alt={appConfig.companyName}
            className="h-12 w-auto"
          />
        </Link>
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
