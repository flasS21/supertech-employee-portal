import type { LucideIcon } from "lucide-react";
import { Building2, UserCheck, UserMinus, UserX, Users } from "lucide-react";
import type { Employee } from "../models/employee";

const STATUS_ROWS: {
  status: Employee["status"];
  icon: LucideIcon;
  barClass: string;
}[] = [
  { status: "Active", icon: UserCheck, barClass: "bg-emerald-500" },
  { status: "On Leave", icon: UserMinus, barClass: "bg-amber-500" },
  { status: "Inactive", icon: UserX, barClass: "bg-slate-400" },
];

interface WorkforceSummaryProps {
  employees: Employee[];
}

export default function WorkforceSummary({ employees }: WorkforceSummaryProps) {
  const total = employees.length;

  const statusCounts: Record<Employee["status"], number> = {
    Active: 0,
    "On Leave": 0,
    Inactive: 0,
  };
  const departmentCounts = new Map<string, number>();

  for (const employee of employees) {
    statusCounts[employee.status] += 1;
    departmentCounts.set(
      employee.department,
      (departmentCounts.get(employee.department) ?? 0) + 1,
    );
  }

  const departments = [...departmentCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const maxDept = departments.length ? departments[0][1] : 0;
  const pct = (count: number) => (total ? Math.round((count / total) * 100) : 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Workforce Summary
        </h2>
      </div>

      {!total ? (
        <div className="px-5 py-12 text-center">
          <Users className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-600">
            No workforce data yet
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Employee statistics will appear here once employees are added.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 p-5 sm:grid-cols-2">
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
              By Status
            </h3>
            <ul className="space-y-4">
              {STATUS_ROWS.map(({ status, icon: Icon, barClass }) => {
                const count = statusCounts[status];
                return (
                  <li key={status}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-medium text-slate-600">
                        <Icon className="h-4 w-4 text-slate-400" />
                        {status}
                      </span>
                      <span className="text-slate-500">
                        {count} · {pct(count)}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${barClass}`}
                        style={{ width: `${pct(count)}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <Building2 className="h-4 w-4" />
              By Department
            </h3>
            <ul className="space-y-3">
              {departments.map(([name, count]) => (
                <li
                  key={name}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="min-w-0 truncate text-slate-600">{name}</span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 sm:block">
                      <span
                        className="block h-full rounded-full bg-brand-500"
                        style={{
                          width: `${maxDept ? Math.round((count / maxDept) * 100) : 0}%`,
                        }}
                      />
                    </span>
                    <span className="font-medium tabular-nums text-slate-900">
                      {count}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}