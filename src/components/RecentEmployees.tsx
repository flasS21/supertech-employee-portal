import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import type { Employee } from "../models/employee";
import StatusBadge from "./StatusBadge";

interface RecentEmployeesProps {
  employees: Employee[];
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  return parsed.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function RecentEmployees({ employees }: RecentEmployeesProps) {
  const recent = [...employees]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Recent Employees
        </h2>
        {employees.length > 0 && (
          <Link
            to="/employees"
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all
          </Link>
        )}
      </div>

      {recent.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <Users className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-600">No employees yet</p>
          <p className="mt-1 text-sm text-slate-400">
            Add your first employee to see recent activity here.
          </p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-slate-100 sm:hidden">
            {recent.map((employee) => (
              <li key={employee.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-600">
                  {initials(employee.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {employee.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {employee.department} · {employee.designation}
                  </p>
                </div>
                <StatusBadge status={employee.status} />
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3 font-medium">Employee</th>
                  <th className="px-5 py-3 font-medium">Department</th>
                  <th className="px-5 py-3 font-medium">Designation</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recent.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-600">
                          {initials(employee.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-900">
                            {employee.name}
                          </p>
                          <p className="truncate text-xs text-slate-400">
                            {employee.employeeId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {employee.department}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {employee.designation}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={employee.status} />
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {formatDate(employee.joiningDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}