import { useState } from "react";
import { Link } from "react-router-dom";
import { appConfig } from "../config/appConfig";
import type { EmployeeStatus } from "../models/employee";
import type { EmployeeFormData } from "../validation/employeeValidation";
import { nextEmployeeId } from "../services/employeeService";

const STATUS_OPTIONS: EmployeeStatus[] = ["Active", "On Leave", "Inactive"];

const { phoneCountryCode, emailDomain } = appConfig.contact;
const DEPARTMENT_OPTIONS = Object.keys(appConfig.departments);

const inputClass =
  "mt-1 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

interface EmployeeFormProps {
  initialData?: EmployeeFormData;
  onSubmit: (data: EmployeeFormData) => void;
  submitLabel?: string;
  mode?: "create" | "edit";
}

function getDesignations(department: string): readonly string[] {
  const key = department as keyof typeof appConfig.departments;
  return appConfig.departments[key] ?? [];
}

export default function EmployeeForm({
  initialData,
  onSubmit,
  submitLabel = "Save",
  mode = "create",
}: EmployeeFormProps) {
  const isEdit = mode === "edit";

  const initialDigits = initialData
    ? initialData.phone.replace(phoneCountryCode, "").replace(/\D/g, "").slice(0, 10)
    : "";
  const initialUsername = initialData
    ? initialData.email.split("@")[0] ?? ""
    : "";

  const [employeeId, setEmployeeId] = useState(
    () => initialData?.employeeId ?? nextEmployeeId(),
  );
  const [name, setName] = useState(initialData?.name ?? "");
  const [emailUsername, setEmailUsername] = useState(initialUsername);
  const [phoneDigits, setPhoneDigits] = useState(initialDigits);
  const [department, setDepartment] = useState(initialData?.department ?? "");
  const [designation, setDesignation] = useState(initialData?.designation ?? "");
  const [joiningDate, setJoiningDate] = useState(initialData?.joiningDate ?? "");
  const [status, setStatus] = useState<EmployeeStatus>(
    initialData?.status ?? "Active",
  );

  const designations = department ? getDesignations(department) : [];

  const handlePhoneChange = (value: string) => {
    setPhoneDigits(value.replace(/\D/g, "").slice(0, 10));
  };

  const handleDepartmentChange = (value: string) => {
    setDepartment(value);
    setDesignation("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      employeeId: employeeId.trim(),
      name: name.trim(),
      email: `${emailUsername.trim()}@${emailDomain}`,
      phone: `${phoneCountryCode}${phoneDigits}`,
      department,
      designation,
      joiningDate,
      status,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="employeeId"
            className="text-sm font-medium text-slate-700"
          >
            Employee ID
          </label>
          <input
            id="employeeId"
            value={employeeId}
            onChange={(event) => setEmployeeId(event.target.value)}
            placeholder="e.g. EMP-0001"
            autoComplete="off"
            required
            readOnly
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="name" className="text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Anjali Sharma"
            autoComplete="off"
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <div className="mt-1 flex">
            <input
              id="email"
              value={emailUsername}
              onChange={(event) => setEmailUsername(event.target.value)}
              placeholder="username"
              autoComplete="off"
              required
              disabled={isEdit}
              pattern="[A-Za-z0-9._%+-]+"
              title={`Enter just the username; the @${emailDomain} domain is added automatically`}
              className="h-10 w-full min-w-0 flex-1 rounded-l-lg border border-r-0 border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            />
            <span
              id="email-domain-suffix"
              className="flex h-10 shrink-0 items-center rounded-r-lg border border-slate-300 bg-slate-50 px-3 text-sm text-slate-500"
            >
              @{emailDomain}
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="text-sm font-medium text-slate-700">
            Phone
          </label>
          <div className="mt-1 flex">
            <span className="flex h-10 shrink-0 items-center rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 px-3 text-sm text-slate-500">
              {phoneCountryCode}
            </span>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              value={phoneDigits}
              onChange={(event) => handlePhoneChange(event.target.value)}
              placeholder="10-digit mobile number"
              autoComplete="off"
              required
              pattern="[6-9][0-9]{9}"
              maxLength={10}
              title={`10-digit mobile number starting with 6-9 (${phoneCountryCode} added automatically)`}
              className="h-10 w-full min-w-0 flex-1 rounded-r-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="department"
            className="text-sm font-medium text-slate-700"
          >
            Department
          </label>
          <select
            id="department"
            value={department}
            onChange={(event) => handleDepartmentChange(event.target.value)}
            required
            className={inputClass}
          >
            <option value="" disabled>
              Select department
            </option>
            {DEPARTMENT_OPTIONS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="designation"
            className="text-sm font-medium text-slate-700"
          >
            Designation
          </label>
          <select
            id="designation"
            value={designation}
            onChange={(event) => setDesignation(event.target.value)}
            required
            disabled={!department}
            className={`${inputClass} disabled:cursor-not-allowed`}
          >
            <option value="" disabled>
              {department ? "Select designation" : "Select a department first"}
            </option>
            {designations.map((designation) => (
              <option key={designation} value={designation}>
                {designation}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="joiningDate"
            className="text-sm font-medium text-slate-700"
          >
            Joining date
          </label>
          <input
            id="joiningDate"
            type="date"
            value={joiningDate}
            onChange={(event) => setJoiningDate(event.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="status" className="text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value as EmployeeStatus)}
            className={inputClass}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
        <Link
          to="/employees"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}