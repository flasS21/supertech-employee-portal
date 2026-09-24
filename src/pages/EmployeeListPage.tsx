import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Users, SearchX } from "lucide-react";
import { getEmployees, deleteEmployee } from "../services/employeeService";
import type { Employee } from "../models/employee";
import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeCard from "../components/EmployeeCard";
import ConfirmDialog from "../components/ConfirmDialog";

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>(() => getEmployees());
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const departments = [...new Set(employees.map((e) => e.department))].sort();

  const filtered = employees.filter((employee) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      employee.name.toLowerCase().includes(q) ||
      employee.employeeId.toLowerCase().includes(q) ||
      employee.email.toLowerCase().includes(q) ||
      employee.phone.toLowerCase().includes(q);
    const matchesDepartment = department === "" || employee.department === department;
    const matchesStatus = status === "" || employee.status === status;
    return matchesQuery && matchesDepartment && matchesStatus;
  });

  const hasFilters = query.trim() !== "" || department !== "" || status !== "";

  const clearFilters = () => {
    setQuery("");
    setDepartment("");
    setStatus("");
  };

  const confirmDelete = () => {
    if (!deleteTarget) {
      return;
    }
    deleteEmployee(deleteTarget.id);
    setEmployees((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        subtitle="Manage employee records for Supertech Fabric"
        actions={
          <Link
            to="/employees/new"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
          >
            <UserPlus className="h-4 w-4" />
            Add Employee
          </Link>
        }
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:max-w-xs">
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <FilterBar
          departments={departments}
          department={department}
          status={status}
          onDepartmentChange={setDepartment}
          onStatusChange={setStatus}
          onClear={clearFilters}
        />
      </div>

      <p className="text-sm text-slate-500" aria-live="polite">
        {filtered.length === employees.length
          ? `${employees.length} employee${employees.length === 1 ? "" : "s"}`
          : `${filtered.length} of ${employees.length} employees`}
      </p>

      {employees.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
          <Users className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-700">No employees yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Create your first employee record to get started.
          </p>
          <Link
            to="/employees/new"
            className="mt-4 inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
          >
            <UserPlus className="h-4 w-4" />
            Add Employee
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
          <SearchX className="mx-auto mb-3 h-10 w-10 text-slate-300" />
          <p className="text-sm font-medium text-slate-700">
            No matching employees
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Try adjusting your search or filters.
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <EmployeeTable
            employees={filtered}
            onEdit={(id) => navigate(`/employees/${id}/edit`)}
            onDelete={(id) => {
              const target = filtered.find((e) => e.id === id) ?? null;
              setDeleteTarget(target);
            }}
          />
          <div className="space-y-3 md:hidden">
            {filtered.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onEdit={(id) => navigate(`/employees/${id}/edit`)}
                onDelete={(id) => {
                  const target = filtered.find((e) => e.id === id) ?? null;
                  setDeleteTarget(target);
                }}
              />
            ))}
          </div>
        </>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete employee"
        message={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.name} (${deleteTarget.employeeId})? This action cannot be undone.`
            : ""
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}