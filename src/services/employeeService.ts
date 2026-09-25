import type { Employee } from "../models/employee";
import { employeeRecordSchema } from "../validation/employeeValidation";

const STORAGE_KEY = "supertech_employee_portal_v1";
const EMPLOYEE_ID_PREFIX = "EMP";
const EMPLOYEE_ID_PADDING = 4;

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

    if (!parsed.employees.every((record) => employeeRecordSchema.safeParse(record).success)) {
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

function assertUniqueFields(
  employees: Employee[],
  candidate: Employee,
  excludesId?: string,
): void {
  if (
    employees.some(
      (item) =>
        item.id !== excludesId && item.employeeId === candidate.employeeId,
    )
  ) {
    throw new Error("Employee ID already exists");
  }
  if (
    employees.some(
      (item) => item.id !== excludesId && item.email === candidate.email,
    )
  ) {
    throw new Error("An employee with this email already exists");
  }
  if (
    employees.some(
      (item) => item.id !== excludesId && item.phone === candidate.phone,
    )
  ) {
    throw new Error("An employee with this phone number already exists");
  }
}

export function addEmployee(employee: Employee): void {
  const employees = getEmployees();
  assertUniqueFields(employees, employee);
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

  assertUniqueFields(employees, updatedEmployee, updatedEmployee.id);

  const updatedEmployees = [...employees];
  updatedEmployees[index] = updatedEmployee;

  saveEmployees(updatedEmployees);
}

export function deleteEmployee(id: string): void {
  const employees = getEmployees();
  saveEmployees(employees.filter((employee) => employee.id !== id));
}

export function nextEmployeeId(): string {
  const pattern = new RegExp(`^${EMPLOYEE_ID_PREFIX}-(\\d+)$`, "i");
  const highest = getEmployees().reduce((max, employee) => {
    const match = employee.employeeId.match(pattern);
    if (!match) {
      return max;
    }
    const value = Number.parseInt(match[1], 10);
    return value > max ? value : max;
  }, 0);

  const next = highest + 1;
  return `${EMPLOYEE_ID_PREFIX}-${String(next).padStart(EMPLOYEE_ID_PADDING, "0")}`;
}
