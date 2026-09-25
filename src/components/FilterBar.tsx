import { FilterX } from "lucide-react";
import type { EmployeeStatus } from "../models/employee";

const STATUS_OPTIONS: EmployeeStatus[] = ["Active", "On Leave", "Inactive"];

const selectClass =
  "h-10 w-full cursor-pointer appearance-none rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 transition-colors hover:border-brand-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 sm:w-auto";

interface FilterBarProps {
  departments: string[];
  department: string;
  status: string;
  onDepartmentChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClear: () => void;
}

export default function FilterBar({
  departments,
  department,
  status,
  onDepartmentChange,
  onStatusChange,
  onClear,
}: FilterBarProps) {
  const hasFilters = department !== "" || status !== "";

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <select
        value={department}
        onChange={(event) => onDepartmentChange(event.target.value)}
        aria-label="Filter by department"
        className={selectClass}
      >
        <option value="">All departments</option>
        {departments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        aria-label="Filter by status"
        className={selectClass}
      >
        <option value="">All statuses</option>
        {STATUS_OPTIONS.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button
          onClick={onClear}
          className="inline-flex h-10 items-center justify-center gap-1.5 self-start rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
          <FilterX className="h-4 w-4" />
          Clear filters
        </button>
      )}
    </div>
  );
}