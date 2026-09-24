export const appConfig = {
  companyName: "Supertech Fabric",
  applicationName: "Employee Operations Portal",
  version: "0.1.0",

  contact: {
    phoneCountryCode: "+91",
    emailDomain: "supertechfabric.com",
  },

  departments: {
    Production: [
      "Machine Operator",
      "Fabric Cutter",
      "Sewing Operator",
      "Line Supervisor",
      "Production Planner",
      "Production Manager",
    ],
    Quality: ["Quality Inspector", "QC Technician", "Quality Manager"],
    Maintenance: ["Maintenance Technician", "Electrician", "Maintenance Engineer"],
    IT: [
      "Software Engineer",
      "Frontend Developer",
      "Backend Developer",
      "QA Tester",
      "DevOps Engineer",
      "IT Support Engineer",
    ],
    HR: ["HR Executive", "HR Manager", "Recruiter", "Payroll Specialist"],
    Finance: ["Accountant", "Finance Executive", "Finance Manager"],
    Procurement: ["Purchase Officer", "Procurement Executive", "Procurement Manager"],
    Sales: ["Sales Executive", "Sales Manager", "Account Manager"],
    Warehouse: ["Store Keeper", "Forklift Operator", "Inventory Controller", "Warehouse Manager"],
    Admin: ["Administrative Assistant", "Office Manager", "Executive Assistant"],
  },

  features: {
    dashboard: true,
    employees: true,
    attendance: false,
    documents: false,
    reports: false,
  },
} as const;