import {
  Briefcase,
  Building2,
  Eye,
  Mail,
  Pencil,
  Phone,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { Employee } from "../models/employee";
import { initials } from "../utils/format";
import StatusBadge from "./StatusBadge";

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function EmployeeCard({
  employee,
  onEdit,
  onDelete,
}: EmployeeCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-600">
          {initials(employee.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Link to={`/employees/${employee.id}`} className="min-w-0">
              <p className="truncate font-medium text-slate-900 hover:text-brand-600">
                {employee.name}
              </p>
              <p className="truncate text-xs text-slate-400">
                {employee.employeeId}
              </p>
            </Link>
            <StatusBadge status={employee.status} />
          </div>
        </div>
      </div>

      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="text-slate-600">{employee.department}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="text-slate-600">{employee.designation}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="truncate text-slate-600">{employee.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="text-slate-600">{employee.phone}</span>
        </div>
      </dl>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
        <Link
          to={`/employees/${employee.id}`}
          className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Eye className="h-4 w-4 shrink-0" />
          View
        </Link>
        <button
          onClick={() => onEdit(employee.id)}
          className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Pencil className="h-4 w-4 shrink-0" />
          Edit
        </button>
        <button
          onClick={() => onDelete(employee.id)}
          className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-red-200 px-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 shrink-0" />
          Delete
        </button>
      </div>
    </div>
  );
}