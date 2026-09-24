import type { Employee } from "../models/employee";

const STORAGE_KEY = "supertech_employee_portal_v1";

interface EmployeeStorage {
  schemaVersion: 1;
  employees: Employee[];
}

const emptyStorage: EmployeeStorage = {
  schemaVersion: 1,
  employees: [],
};

function readStorage(): EmployeeStorage {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return emptyStorage;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("schemaVersion" in parsed) ||
      !("employees" in parsed) ||
      !Array.isArray(parsed.employees)
    ) {
      return emptyStorage;
    }

    return parsed as EmployeeStorage;
  } catch {
    return emptyStorage;
  }
}

function writeStorage(data: EmployeeStorage): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getEmployees(): Employee[] {
  return readStorage().employees;
}

export function getEmployee(id: string): Employee | undefined {
  return getEmployees().find((employee) => employee.id === id);
}

export function saveEmployees(employees: Employee[]): void {
  writeStorage({
    schemaVersion: 1,
    employees,
  });
}

export function addEmployee(employee: Employee): void {
  const employees = getEmployees();

  if (employees.some((item) => item.employeeId === employee.employeeId)) {
    throw new Error("Employee ID already exists");
  }

  saveEmployees([...employees, employee]);
}

export function updateEmployee(updatedEmployee: Employee): void {
  const employees = getEmployees();

  const index = employees.findIndex(
    (employee) => employee.id === updatedEmployee.id,
  );

  if (index === -1) {
    throw new Error("Employee not found");
  }

  const duplicateId = employees.some(
    (employee) =>
      employee.employeeId === updatedEmployee.employeeId &&
      employee.id !== updatedEmployee.id,
  );

  if (duplicateId) {
    throw new Error("Employee ID already exists");
  }

  const updatedEmployees = [...employees];
  updatedEmployees[index] = updatedEmployee;

  saveEmployees(updatedEmployees);
}

export function deleteEmployee(id: string): void {
  const employees = getEmployees();
  saveEmployees(employees.filter((employee) => employee.id !== id));
}
