import { cn } from "@/lib/utils";

const statusColors = {
  Pending: "bg-amber-100 text-amber-800 border-amber-200",
  "Under Review": "bg-blue-100 text-blue-800 border-blue-200",
  "In Progress": "bg-purple-100 text-purple-800 border-purple-200",
  Resolved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Submitted: "bg-slate-100 text-slate-800 border-slate-200",
};

export default function StatusBadge({ status, className = "" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        statusColors[status] || "bg-muted text-muted-foreground",
        className
      )}
    >
      {status}
    </span>
  );
}
