import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertTriangle className="mb-4 h-12 w-12 text-amber-400" />
      <h1 className="mb-2 text-3xl font-bold text-slate-900">404</h1>
      <p className="mb-6 text-slate-500">Page not found</p>
      <Link
        to="/"
        className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
