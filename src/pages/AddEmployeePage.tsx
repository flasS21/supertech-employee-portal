import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EmployeeForm from "../components/EmployeeForm";
import PageHeader from "../components/PageHeader";
import { addEmployee } from "../services/employeeService";
import type { Employee } from "../models/employee";
import type { EmployeeFormData } from "../validation/employeeValidation";

export default function AddEmployeePage() {
  const navigate = useNavigate();

  const handleSubmit = (data: EmployeeFormData) => {
    const now = new Date().toISOString();
    const employee: Employee = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    addEmployee(employee);
    navigate("/employees");
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

      <EmployeeForm submitLabel="Add Employee" onSubmit={handleSubmit} />
    </div>
  );
}