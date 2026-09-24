import { z } from "zod";

export const employeeSchema = z.object({
  employeeId: z
    .string()
    .trim()
    .min(1, "Employee ID is required")
    .max(20, "Employee ID must be 20 characters or less"),

  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be 100 characters or less"),

  email: z.string().trim().email("Enter a valid email address"),

  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),

  department: z.string().trim().min(1, "Department is required"),

  designation: z.string().trim().min(1, "Designation is required"),

  joiningDate: z.string().min(1, "Joining date is required"),

  status: z.enum(["Active", "On Leave", "Inactive"]),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
