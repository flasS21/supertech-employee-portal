# Employee Operations Portal — Supertech Fabric

A responsive employee management dashboard for Supertech Fabric, built as a client-side React prototype that persists data in the browser's `localStorage`. No backend or authentication is required.

## Features

- **Dashboard** — workforce overview: total/active/on-leave counts, department breakdown, recent employees.
- **Employee management** — full CRUD with live search (name / ID / email / phone) and department + status filters.
- **Responsive UI** — sidebar navigation on desktop, slide-out drawer + card list on mobile; touch-first actions.
- **Validation** — Zod-powered field-level validation with inline error messages; duplicate Employee ID rejection.
- **Fixed business rules** — Indian mobile numbers (`+91` prefix, 10 digits starting 6–9), `@supertechfabric.com` email addresses, config-driven department/designation dropdowns with cascading rules, auto-generated read-only `EMP-####` IDs.
- **Settings** — app info, feature availability, one-click demo data, clear-all, and JSON export/import (validated on import).

## Tech stack

| Layer | Choice |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) |
| Routing | React Router v7 |
| Icons | lucide-react |
| Validation | Zod v4 |

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

- `contact.phoneCountryCode` and `contact.emailDomain` — drive phone/email validation and the form prefix/suffix.
- `departments` — a map of department → designations used by the cascading dropdowns and enforced by the validation schema.
- `features` — feature flags shown on the Settings page.
- `version` — app version displayed in the sidebar and Settings.

## Project structure

```
src/
├── components/   # Layout, header, nav, forms, tables, dialogs, cards
├── config/       # appConfig.ts (company, contact, departments, features)
├── data/         # demoEmployees.ts seed data
├── models/       # Employee type + EmployeeStatus
├── pages/        # Dashboard, Employees, Add/Edit/Detail, Settings, 404
├── services/     # employeeService.ts (localStorage CRUD, ID generation)
├── utils/        # format.ts, employeeImport.ts (JSON import/validation)
└── validation/   # employeeValidation.ts (Zod schemas)
```

## Data & persistence

Records are stored under the `supertech_employee_portal_v1` key in `localStorage`. Storage is schema-versioned; malformed or invalid records are reset gracefully on load. Use **Settings → Export/Import** to back up or transfer data (e.g., across browsers).

## Roadmap

Backlog items are tracked in `IMPLEMENTATION-PLAN.md` (see **BACKLOG**). Currently deferred:

- **B-1** — externalize all field rules (ID prefix/padding, phone length, status options) into a JSON config for non-technical editing.