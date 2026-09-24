import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import EmployeeForm from "../components/EmployeeForm";
import PageHeader from "../components/PageHeader";
import { addEmployee } from "../services/employeeService";
import type { Employee } from "../models/employee";
import type { EmployeeFormData } from "../validation/employeeValidation";

export default function AddEmployeePage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (data: EmployeeFormData) => {
    const now = new Date().toISOString();
    const employee: Employee = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    try {
      addEmployee(employee);
      navigate("/employees");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save employee");
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

      <PageHeader title="Add Employee" subtitle="Create a new employee record" />

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <EmployeeForm submitLabel="Add Employee" onSubmit={handleSubmit} />
    </div>
  );
}