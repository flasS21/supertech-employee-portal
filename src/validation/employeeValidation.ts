import { z } from "zod";
import { appConfig } from "../config/appConfig";

const { phoneCountryCode, emailDomain } = appConfig.contact;

// Escape any regex-special characters in the configured values.
// phoneCountryCode is "+91"; emailDomain is "supertechfabric.com".
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const phonePattern = new RegExp(
  `^${escapeRegex(phoneCountryCode)}[6-9]\\d{9}$`,
);

const emailDomainPattern = new RegExp(
  `@${escapeRegex(emailDomain)}$`,
  "i",
);

export const employeeSchema = z
  .object({
    employeeId: z
      .string()
      .trim()
      .min(1, "Employee ID is required")
      .max(20, "Employee ID must be 20 characters or less")
      .regex(
        /^[A-Z][A-Z0-9-]*$/,
        "Employee ID must start with a letter and use only capital letters, numbers, and dashes",
      ),

    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be 100 characters or less"),

    email: z
      .string()
      .trim()
      .email("Enter a valid email address")
      .regex(emailDomainPattern, `Email must use the ${emailDomain} domain`),

    phone: z
      .string()
      .trim()
      .regex(
        phonePattern,
        `Enter a valid 10-digit mobile number with ${phoneCountryCode} prefix`,
      ),

    department: z.string().trim().min(1, "Department is required"),

    designation: z.string().trim().min(1, "Designation is required"),

    joiningDate: z.string().min(1, "Joining date is required"),

    status: z.enum(["Active", "On Leave", "Inactive"]),
  })
  .superRefine((data, context) => {
    const department = data.department as keyof typeof appConfig.departments;
    if (!(data.department in appConfig.departments)) {
      context.addIssue({
        code: "custom",
        path: ["department"],
        message: "Select a valid department",
      });
      return;
    }
    const designations = appConfig.departments[department] as readonly string[];
    if (!designations.includes(data.designation)) {
      context.addIssue({
        code: "custom",
        path: ["designation"],
        message: "Select a designation from the selected department",
      });
    }
  });

export type EmployeeFormData = z.infer<typeof employeeSchema>;

export const employeeRecordSchema = employeeSchema.extend({
  id: z.string().min(1, "id is required"),
  createdAt: z.string().min(1, "createdAt is required"),
  updatedAt: z.string().min(1, "updatedAt is required"),
});