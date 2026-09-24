import { useRef, useState } from "react";
import {
  Check,
  Database,
  Download,
  FileJson,
  Info,
  RotateCcw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { appConfig } from "../config/appConfig";
import { getEmployees, saveEmployees } from "../services/employeeService";
import { parseEmployeeImport } from "../utils/employeeImport";
import demoEmployees from "../data/demoEmployees";
import PageHeader from "../components/PageHeader";
import ConfirmDialog from "../components/ConfirmDialog";

const FEATURE_LABELS: Record<keyof typeof appConfig.features, string> = {
  dashboard: "Dashboard",
  employees: "Employee Management",
  attendance: "Attendance",
  documents: "Documents",
  reports: "Reports",
};

type ActionResult = {
  kind: "success" | "error";
  message: string;
} | null;

export default function SettingsPage() {
  const [employeeCount, setEmployeeCount] = useState(() => getEmployees().length);
  const [result, setResult] = useState<ActionResult>(null);
  const [pendingReset, setPendingReset] = useState(false);
  const [pendingClear, setPendingClear] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showResult = (kind: "success" | "error", message: string) => {
    setResult({ kind, message });
  };

  const refreshCount = () => {
    setEmployeeCount(getEmployees().length);
  };

  const handleLoadDemo = () => {
    saveEmployees(demoEmployees);
    refreshCount();
    setPendingReset(false);
    showResult(
      "success",
      `Loaded ${demoEmployees.length} demo employees.`,
    );
  };

  const handleClearAll = () => {
    saveEmployees([]);
    refreshCount();
    setPendingClear(false);
    showResult("success", "All employee data cleared.");
  };

  const handleExport = () => {
    const employees = getEmployees();
    const blob = new Blob([JSON.stringify(employees, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `supertech-employees-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);

    showResult(
      employees.length
        ? "success"
        : "error",
      employees.length
        ? `Exported ${employees.length} employee${employees.length === 1 ? "" : "s"}.`
        : "No employees to export.",
    );
  };

  const handleImportFile = (file: File | undefined) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === "string" ? reader.result : "";
      const { employees, errors } = parseEmployeeImport(content);

      if (errors.length > 0) {
        showResult(
          "error",
          `Import cancelled. ${errors.length} issue${errors.length === 1 ? "" : "s"} found:\n${errors.slice(0, 5).join("\n")}`,
        );
        return;
      }

      saveEmployees(employees);
      refreshCount();
      showResult("success", `Imported ${employees.length} employee${employees.length === 1 ? "" : "s"}.`);
    };
    reader.onerror = () => {
      showResult("error", "Could not read the selected file.");
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const featureEntries = (Object.keys(appConfig.features) as Array<
    keyof typeof appConfig.features
  >).map((key) => ({ key, label: FEATURE_LABELS[key], enabled: appConfig.features[key] }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Application information and data management"
      />

      {result && (
        <div
          role="status"
          className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${
            result.kind === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {result.kind === "success" ? (
            <Check className="mt-0.5 h-4 w-4 shrink-0" />
          ) : (
            <X className="mt-0.5 h-4 w-4 shrink-0" />
          )}
          <div className="whitespace-pre-line">{result.message}</div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
            <Info className="h-4 w-4 text-brand-600" />
            <h2 className="text-sm font-semibold text-slate-900">
              About this app
            </h2>
          </div>
          <dl className="divide-y divide-slate-100 px-5">
            <div className="flex items-center justify-between py-3">
              <dt className="text-sm text-slate-500">Company</dt>
              <dd className="text-sm font-medium text-slate-900">
                {appConfig.companyName}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-sm text-slate-500">Application</dt>
              <dd className="text-sm font-medium text-slate-900">
                {appConfig.applicationName}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-sm text-slate-500">Version</dt>
              <dd className="text-sm font-medium text-slate-900">
                {appConfig.version}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
            <Database className="h-4 w-4 text-brand-600" />
            <h2 className="text-sm font-semibold text-slate-900">
              Feature availability
            </h2>
          </div>
          <ul className="divide-y divide-slate-100 px-5">
            {featureEntries.map(({ key, label, enabled }) => (
              <li key={key} className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-600">{label}</span>
                {enabled ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                    <Check className="h-3 w-3" />
                    Available
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                    Coming soon
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">Data</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {employeeCount} employee{employeeCount === 1 ? "" : "s"} stored in
            this browser.
          </p>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
              <RotateCcw className="h-4 w-4 text-brand-600" />
              Demo data
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Replace current data with {demoEmployees.length} sample employees.
            </p>
            <button
              onClick={() => setPendingReset(true)}
              className="mt-3 inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              Load demo data
            </button>
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
              <FileJson className="h-4 w-4 text-brand-600" />
              Export / Import
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Download all data as JSON, or load data from a JSON file.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={handleExport}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Upload className="h-4 w-4" />
                Import
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(event) => handleImportFile(event.target.files?.[0])}
              />
            </div>
          </div>

          <div className="rounded-lg border border-red-200 bg-red-50/50 p-4 sm:col-span-2">
            <div className="flex items-center gap-2 text-sm font-medium text-red-700">
              <Trash2 className="h-4 w-4" />
              Danger zone
            </div>
            <p className="mt-1 text-sm text-red-600/80">
              Remove every employee record stored in this browser. This cannot be
              undone.
            </p>
            <button
              onClick={() => setPendingClear(true)}
              className="mt-3 inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Clear all data
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={pendingReset}
        title="Load demo data"
        message={`This will replace all ${employeeCount} current employee record${employeeCount === 1 ? "" : "s"} with ${demoEmployees.length} demo employees. Continue?`}
        confirmLabel="Load Demo"
        onConfirm={handleLoadDemo}
        onCancel={() => setPendingReset(false)}
      />

      <ConfirmDialog
        open={pendingClear}
        title="Clear all data"
        message={`Are you sure you want to delete all ${employeeCount} employee record${employeeCount === 1 ? "" : "s"}? This action cannot be undone.`}
        confirmLabel="Clear All"
        onConfirm={handleClearAll}
        onCancel={() => setPendingClear(false)}
      />
    </div>
  );
}