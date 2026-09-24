import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarDays,
  Mail,
  Pencil,
  Phone,
  User,
} from "lucide-react";
import { getEmployee } from "../services/employeeService";
import { formatDate } from "../utils/format";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";

const detailRows = [
  { key: "employeeId", label: "Employee ID", icon: User },
  { key: "email", label: "Email", icon: Mail },
  { key: "phone", label: "Phone", icon: Phone },
  { key: "department", label: "Department", icon: Building2 },
  { key: "designation", label: "Designation", icon: Briefcase },
  { key: "joiningDate", label: "Joining date", icon: CalendarDays },
] as const;

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const employee = getEmployee(id ?? "");

  if (!employee) {
    return (
      <div className="py-20 text-center">
        <User className="mx-auto mb-3 h-10 w-10 text-slate-300" />
        <h1 className="text-lg font-semibold text-slate-900">
          Employee not found
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          The requested employee record could not be found.
        </p>
        <Link
          to="/employees"
          className="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Back to Employees
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/employees"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Employees
      </Link>

      <PageHeader
        title={employee.name}
        subtitle={`${employee.employeeId} · ${employee.department}`}
        actions={
          <Link
            to={`/employees/${employee.id}/edit`}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        }
      />

      <div className="space-y-4">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Employee details
            </h2>
            <StatusBadge status={employee.status} />
          </div>
          <dl className="sm:px-5 sm:py-2">
            <div className="divide-y divide-slate-100 sm:grid sm:grid-cols-2 sm:divide-y-0 sm:gap-x-6">
              {detailRows.map(({ key, label, icon: Icon }) => (
                <div
                  key={key}
                  className="flex items-start gap-3 px-5 py-4 sm:border-b sm:border-slate-100 sm:px-0"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      {label}
                    </dt>
                    <dd className="mt-0.5 truncate text-sm font-medium text-slate-900">
                      {key === "joiningDate"
                        ? formatDate(employee.joiningDate)
                        : employee[key]}
                    </dd>
                  </div>
                </div>
              ))}
            </div>
          </dl>
        </div>

        <p className="px-1 text-xs text-slate-400">
          Record created {formatDate(employee.createdAt)} · Last updated{" "}
          {formatDate(employee.updatedAt)}
        </p>
      </div>
    </div>
  );
}