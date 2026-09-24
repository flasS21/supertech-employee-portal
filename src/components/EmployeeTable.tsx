import { Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Employee } from "../models/employee";
import { initials } from "../utils/format";
import StatusBadge from "./StatusBadge";

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function EmployeeTable({
  employees,
  onEdit,
  onDelete,
}: EmployeeTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
            <th className="px-5 py-3 font-medium">Employee</th>
            <th className="px-5 py-3 font-medium">Department</th>
            <th className="px-5 py-3 font-medium">Designation</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-slate-50">
              <td className="px-5 py-3">
                <Link to={`/employees/${employee.id}`} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-600">
                    {initials(employee.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900 hover:text-brand-600">
                      {employee.name}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {employee.employeeId}
                    </p>
                  </div>
                </Link>
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
              <td className="px-5 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    to={`/employees/${employee.id}`}
                    aria-label={`View ${employee.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => onEdit(employee.id)}
                    aria-label={`Edit ${employee.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(employee.id)}
                    aria-label={`Delete ${employee.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}