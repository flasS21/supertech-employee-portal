import { Users } from "lucide-react";

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-slate-400" />
        <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
      </div>
      <p className="text-slate-500">Employee management will go here.</p>
    </div>
  );
}
