import { CheckCircle2, Circle, Clock, Eye, Wrench } from "lucide-react";
import { format } from "date-fns";

const statusIcons = {
  Submitted: Circle,
  "Under Review": Eye,
  "In Progress": Wrench,
  Resolved: CheckCircle2,
};

const statusLineColors = {
  Submitted: "border-slate-300",
  "Under Review": "border-blue-300",
  "In Progress": "border-purple-300",
  Resolved: "border-emerald-400",
};

const statusDotColors = {
  Submitted: "bg-slate-400",
  "Under Review": "bg-blue-500",
  "In Progress": "bg-purple-500",
  Resolved: "bg-emerald-500",
};

export default function StatusTimeline({ history }) {
  return (
    <div className="relative space-y-0">
      {history.map((entry, i) => {
        const Icon = statusIcons[entry.status] || Clock;
        const isLast = i === history.length - 1;
        return (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${statusDotColors[entry.status] || "bg-muted"} text-white`}
              >
                <Icon className="h-4 w-4" />
              </div>
              {!isLast && (
                <div className={`w-0.5 flex-1 min-h-[40px] border-l-2 ${statusLineColors[entry.status]}`} />
              )}
            </div>
            <div className={`pb-6 ${isLast ? "" : ""}`}>
              <p className="font-semibold text-sm text-foreground">{entry.status}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(entry.date), "MMM d, yyyy 'at' h:mm a")}
              </p>
              {entry.note && <p className="text-sm text-muted-foreground mt-1">{entry.note}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
