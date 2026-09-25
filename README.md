# Employee Operations Portal — Supertech Fabric

A simple employee management dashboard for Supertech Fabric. It runs completely in the browser and saves all data in `localStorage` — no server or login needed.

## Features

- **Dashboard** — see the workforce at a glance: total / active / on-leave counts, department breakdown, and recent employees.
- **Employee management** — add, view, edit, delete, search (by name, ID, email, or phone), and filter (by department or status).
- **Mobile friendly** — sidebar on desktop, slide-out menu and card list on mobile.
- **Form checks** — every field is checked when you press *Save*, with a message shown under any field that's wrong.
- **Linking rules** — some fields are bound to each other: the designation list depends on the chosen department, emails must end in `@supertechfabric.com`, and phone numbers must use the `+91` prefix.
- **Settings** — app info, one-click demo data, clear all data, and export/import of records as a JSON file.

## Data validation and form rules

All checks run when you press **Save**. A field turns red and a short message appears under it if the value is wrong.

| Field | What you can enter | Notes |
|---|---|---|
| Employee ID | Starts with a **capital letter**, then only capital letters, numbers, or dashes. Max 20 characters. | Auto-generated as `EMP-####`; you cannot change it. Every ID must be unique. |
| Name | 2 to 100 characters. | Letters, spaces, hyphens, and apostrophes only. |
| Email | A normal email address. | Must end in `@supertechfabric.com`. |
| Phone | `+91` followed by 10 digits. | The first digit must be 6, 7, 8, or 9. |
| Department | One of the fixed list (Production, Quality, IT, HR, Finance, etc.). | Choosing a department resets the designation. |
| Designation | One of the fixed list for the chosen department. | You can only pick a designation that belongs to the selected department. |
| Joining date | A date. | Required. |
| Status | `Active`, `On Leave`, or `Inactive`. | Only these three values are allowed. |

The same rules are also applied when you **import a JSON file** from the Settings page, so bad records are rejected before they are added.

## Tech stack

| Layer | Choice |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Icons | lucide-react |
| Form checks | Zod v4 |

## Getting started

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build to dist/
npm run lint      # ESLint
npx tsc --noEmit  # type check
```

## Configuration

Business rules live in `src/config/appConfig.ts`:

- `contact` — the phone prefix (`+91`) and email domain (`supertechfabric.com`) used by the form and the field checks.
- `departments` — the list of departments, each with its own designations. The form and the checks read from this list.
- `features` — which parts of the app are turned on (shown on the Settings page).
- `version` — app version shown in the sidebar and Settings.

## Project structure

```
src/
├── components/   # Layout, header, nav, forms, tables, dialogs, cards
├── config/       # appConfig.ts (company, contact, departments, features)
├── data/         # demoEmployees.ts seed data
├── models/       # Employee type + EmployeeStatus
├── pages/        # Dashboard, Employees, Add/Edit/Detail, Settings, 404
├── services/     # employeeService.ts (localStorage CRUD, ID generation)
├── utils/        # format.ts, employeeImport.ts (JSON import)
└── validation/   # employeeValidation.ts (form and field rules)
```

## Data & persistence

Records are saved in `localStorage` under the key `supertech_employee_portal_v1`. If the saved data is ever broken or out of date, the app starts fresh. Use **Settings → Export / Import** to back up or move your data (for example, to another browser).

## Roadmap

Backlog items are tracked in `IMPLEMENTATION-PLAN.md` (see **BACKLOG**). Currently deferred:

- **B-1** — move all field rules (ID prefix/padding, phone length, status options) into a JSON config file so they can be edited without touching code.