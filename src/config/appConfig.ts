export const appConfig = {
  companyName: "Supertech Fabric",
  applicationName: "Employee Operations Portal",
  version: "0.1.0",

  features: {
    dashboard: true,
    employees: true,
    attendance: false,
    documents: false,
    reports: false,
  },
} as const;
