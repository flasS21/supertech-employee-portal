import { useMemo } from "react";
import { Building2, CalendarClock, UserCheck, Users } from "lucide-react";
import { getEmployees } from "../services/employeeService";
import StatCard from "../components/StatCard";
import WorkforceSummary from "../components/WorkforceSummary";
import RecentEmployees from "../components/RecentEmployees";

export default function DashboardPage() {
  const employees = useMemo(() => getEmployees(), []);

  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((employee) => employee.status === "Active").length;
    const onLeave = employees.filter((employee) => employee.status === "On Leave").length;
    const departments = new Set(employees.map((employee) => employee.department)).size;
    return { total, active, onLeave, departments };
  }, [employees]);

  const pctOf = (count: number) =>
    stats.total ? Math.round((count / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Workforce overview for Supertech Fabric
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Employees"
          value={stats.total}
          icon={Users}
          tone="brand"
          helper="All employees"
        />
        <StatCard
          label="Active"
          value={stats.active}
          icon={UserCheck}
          tone="green"
          helper={`${pctOf(stats.active)}% of workforce`}
        />
        <StatCard
          label="On Leave"
          value={stats.onLeave}
          icon={CalendarClock}
          tone="amber"
          helper={`${pctOf(stats.onLeave)}% of workforce`}
        />
        <StatCard
          label="Departments"
          value={stats.departments}
          icon={Building2}
          tone="slate"
          helper="Distinct departments"
        />
      </section>

      <WorkforceSummary employees={employees} />

      <RecentEmployees employees={employees} />
    </div>
  );
}