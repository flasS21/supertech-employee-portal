import type { Employee } from "../models/employee";
import { employeeRecordSchema } from "../validation/employeeValidation";
import { getEmployees } from "../services/employeeService";

export interface EmployeeImportResult {
  employees: Employee[];
  errors: string[];
}

export function parseEmployeeImport(content: string): EmployeeImportResult {
  let raw: unknown;
  try {
    raw = JSON.parse(content);
  } catch {
    return {
      employees: [],
      errors: ["File does not contain valid JSON."],
    };
  }

  if (!Array.isArray(raw)) {
    return {
      employees: [],
      errors: ["Expected a JSON array of employee records."],
    };
  }

const employees: Employee[] = [];
  const errors: string[] = [];
  const seenEmployeeIds = new Set<string>();
  const seenIds = new Set<string>();
  const seenEmails = new Set<string>();
  const seenPhones = new Set<string>();

  raw.forEach((entry, index) => {
    const label = `Row ${index + 1}`;
    const result = employeeRecordSchema.safeParse(entry);
    if (!result.success) {
      const detail = result.error.issues[0]?.message ?? "invalid record";
      errors.push(`${label}: ${detail}`);
      return;
    }

    if (seenEmployeeIds.has(result.data.employeeId)) {
      errors.push(
        `${label}: duplicate Employee ID "${result.data.employeeId}" within file`,
      );
      return;
    }
    if (seenIds.has(result.data.id)) {
      errors.push(`${label}: duplicate record id "${result.data.id}" within file`);
      return;
    }
    if (seenEmails.has(result.data.email)) {
      errors.push(
        `${label}: duplicate email "${result.data.email}" within file`,
      );
      return;
    }
    if (seenPhones.has(result.data.phone)) {
      errors.push(
        `${label}: duplicate phone number "${result.data.phone}" within file`,
      );
      return;
    }

    seenEmployeeIds.add(result.data.employeeId);
    seenIds.add(result.data.id);
    seenEmails.add(result.data.email);
    seenPhones.add(result.data.phone);
    employees.push(result.data);
  });

  // Detect conflicts with data already saved in localStorage.
  const existing = getEmployees();
  for (const employee of employees) {
    if (existing.some((item) => item.employeeId === employee.employeeId)) {
      errors.push(
        `Employee ID "${employee.employeeId}" already exists in current data`,
      );
    }
    if (existing.some((item) => item.id === employee.id)) {
      errors.push(`Record id "${employee.id}" already exists in current data`);
    }
    if (existing.some((item) => item.email === employee.email)) {
      errors.push(`Email "${employee.email}" already exists in current data`);
    }
    if (existing.some((item) => item.phone === employee.phone)) {
      errors.push(
        `Phone number "${employee.phone}" already exists in current data`,
      );
    }
  }

  return { employees, errors };
}
