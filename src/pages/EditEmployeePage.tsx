import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, User } from "lucide-react";
import { getEmployee, updateEmployee } from "../services/employeeService";
import EmployeeForm from "../components/EmployeeForm";
import PageHeader from "../components/PageHeader";
import type { EmployeeFormData } from "../validation/employeeValidation";

export default function EditEmployeePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const employee = getEmployee(id ?? "");
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = (data: EmployeeFormData) => {
    try {
      updateEmployee({
        ...employee,
        ...data,
        updatedAt: new Date().toISOString(),
      });
      navigate("/employees");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    }
  };

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
        title="Edit Employee"
        subtitle={`Update details for ${employee.name}`}
      />

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <EmployeeForm
        initialData={employee}
        mode="edit"
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
      />
    </div>
  );
}