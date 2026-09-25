import { useState } from "react";
import { Link } from "react-router-dom";
import { appConfig } from "../config/appConfig";
import type { EmployeeStatus } from "../models/employee";
import {
  employeeSchema,
  type EmployeeFormData,
} from "../validation/employeeValidation";
import { nextEmployeeId } from "../services/employeeService";

const STATUS_OPTIONS: EmployeeStatus[] = ["Active", "On Leave", "Inactive"];

const { phoneCountryCode, emailDomain } = appConfig.contact;
const DEPARTMENT_OPTIONS = Object.keys(appConfig.departments);

const baseInputClass =
  "mt-1 h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";
const normalStateClass =
  "border-slate-300 focus:border-brand-600 focus:ring-brand-600/20";
const errorStateClass =
  "border-red-300 focus:border-red-500 focus:ring-red-500/20";

function inputClass(hasError: boolean): string {
  return `${baseInputClass} ${hasError ? errorStateClass : normalStateClass}`;
}

function compositeInputClass(hasError: boolean): string {
  return `h-10 min-w-0 flex-1 rounded-l-lg border border-r-0 bg-white pl-3 pr-1 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${
    hasError ? errorStateClass : normalStateClass
  }`;
}

interface EmployeeFormProps {
  initialData?: EmployeeFormData;
  onSubmit: (data: EmployeeFormData) => void;
  submitLabel?: string;
  mode?: "create" | "edit";
}

type FieldErrors = Partial<Record<keyof EmployeeFormData, string>>;

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
  const [errors, setErrors] = useState<FieldErrors>({});

  const designations = department ? getDesignations(department) : [];

  const clearError = (field: keyof EmployeeFormData) => {
    setErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handlePhoneChange = (value: string) => {
    setPhoneDigits(value.replace(/\D/g, "").slice(0, 10));
    clearError("phone");
  };

  const handleDepartmentChange = (value: string) => {
    setDepartment(value);
    setDesignation("");
    clearError("department");
    clearError("designation");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data: EmployeeFormData = {
      employeeId: employeeId.trim(),
      name: name.trim(),
      email: `${emailUsername.trim()}@${emailDomain}`,
      phone: `${phoneCountryCode}${phoneDigits}`,
      department,
      designation,
      joiningDate,
      status,
    };

    const result = employeeSchema.safeParse(data);
    if (!result.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof EmployeeFormData | undefined;
        if (field && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    onSubmit(result.data);
  };

  const errorText = (field: keyof EmployeeFormData) =>
    errors[field] ? (
      <p id={`${field}-error`} className="mt-1 text-xs text-red-600">
        {errors[field]}
      </p>
    ) : null;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
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
            readOnly
            aria-invalid={Boolean(errors.employeeId)}
            aria-describedby={errors.employeeId ? "employeeId-error" : undefined}
            className={inputClass(Boolean(errors.employeeId))}
          />
          {errorText("employeeId")}
        </div>

        <div>
          <label htmlFor="name" className="text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            id="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              clearError("name");
            }}
            placeholder="e.g. Anjali Sharma"
            autoComplete="off"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={inputClass(Boolean(errors.name))}
          />
          {errorText("name")}
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email
          </label>
          <div className={isEdit ? "" : "mt-1 flex"}>
            {isEdit ? (
              <input
                id="email"
                value={`${emailUsername}@${emailDomain}`}
                disabled
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={inputClass(Boolean(errors.email))}
              />
            ) : (
              <>
                <input
                  id="email"
                  value={emailUsername}
                  onChange={(event) => {
                    setEmailUsername(event.target.value);
                    clearError("email");
                  }}
                  placeholder="username"
                  autoComplete="off"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={compositeInputClass(Boolean(errors.email))}
                />
                <span
                  aria-hidden="true"
                  className={`flex h-10 shrink-0 items-center rounded-r-lg border border-l-0 bg-slate-50 pl-0.5 pr-3 text-sm text-slate-500 ${
                    errors.email ? "border-red-300" : "border-slate-300"
                  }`}
                >
                  @{emailDomain}
                </span>
              </>
            )}
          </div>
          {errorText("email")}
        </div>

        <div>
          <label htmlFor="phone" className="text-sm font-medium text-slate-700">
            Phone
          </label>
          <div className="mt-1 flex">
            <span
              aria-hidden="true"
              className={`flex h-10 shrink-0 items-center rounded-l-lg border border-r-0 bg-slate-50 px-3 text-sm text-slate-500 ${
                errors.phone ? "border-red-300" : "border-slate-300"
              }`}
            >
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
              maxLength={10}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={`h-10 min-w-0 flex-1 rounded-r-lg border-l-0 border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                errors.phone ? errorStateClass : normalStateClass
              }`}
            />
          </div>
          {errorText("phone")}
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
            aria-invalid={Boolean(errors.department)}
            aria-describedby={errors.department ? "department-error" : undefined}
            className={inputClass(Boolean(errors.department))}
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
          {errorText("department")}
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
            onChange={(event) => {
              setDesignation(event.target.value);
              clearError("designation");
            }}
            disabled={!department}
            aria-invalid={Boolean(errors.designation)}
            aria-describedby={
              errors.designation ? "designation-error" : undefined
            }
            className={inputClass(Boolean(errors.designation))}
          >
            <option value="" disabled>
              {department ? "Select designation" : "Select a department first"}
            </option>
            {designations.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errorText("designation")}
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
            onChange={(event) => {
              setJoiningDate(event.target.value);
              clearError("joiningDate");
            }}
            aria-invalid={Boolean(errors.joiningDate)}
            aria-describedby={
              errors.joiningDate ? "joiningDate-error" : undefined
            }
            className={inputClass(Boolean(errors.joiningDate))}
          />
          {errorText("joiningDate")}
        </div>

        <div>
          <label htmlFor="status" className="text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as EmployeeStatus);
              clearError("status");
            }}
            aria-invalid={Boolean(errors.status)}
            aria-describedby={errors.status ? "status-error" : undefined}
            className={inputClass(Boolean(errors.status))}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errorText("status")}
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