import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { appConfig } from "../config/appConfig";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center">
        <button
          onClick={onMenuToggle}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <Link
        to="/"
        aria-label="Go to dashboard"
        title="Go to dashboard"
        className="flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        <img
          src="/brand/svg/supertech-fabric-mark.svg"
          alt={appConfig.companyName}
          className="h-10 w-10"
        />
      </Link>
    </header>
  );
}