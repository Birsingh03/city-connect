import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useComplaints } from "@/contexts/ComplaintContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StatusBadge from "@/components/StatusBadge";
import StatusTimeline from "@/components/StatusTimeline";
import ComplaintFilters from "@/components/ComplaintFilters";
import { statuses } from "@/data/mockComplaints";
import { format } from "date-fns";
import { toast } from "sonner";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const { complaints, updateStatus, getStats } = useComplaints();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [note, setNote] = useState("");

  if (!user || !isAdmin) return <Navigate to="/login" />;

  const stats = getStats();

  const filtered = complaints.filter((c) => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && c.status !== statusFilter) return false;
    if (categoryFilter && c.category !== categoryFilter) return false;
    return true;
  });

  const handleUpdate = (id) => {
    if (!newStatus) { toast.error("Select a status"); return; }
    updateStatus(id, newStatus, note || `Status updated to ${newStatus}`);
    toast.success("Status updated");
    setNewStatus("");
    setNote("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-2">Admin Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-6">Manage and update complaint statuses</p>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: stats.total, cls: "text-foreground" },
          { label: "Pending", value: stats.pending, cls: "text-amber-600" },
          { label: "In Progress", value: stats.inProgress, cls: "text-purple-600" },
          { label: "Resolved", value: stats.resolved, cls: "text-emerald-600" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-4 text-center">
              <p className={`text-2xl font-bold ${s.cls}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-6">
        <ComplaintFilters
          search={search} onSearchChange={setSearch}
          status={statusFilter} onStatusChange={setStatusFilter}
          category={categoryFilter} onCategoryChange={setCategoryFilter}
        />
      </div>

      <div className="space-y-3">
        {filtered.map((c) => (
          <Card key={c.id}>
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setExpanded(expanded === c.id ? null : c.id)}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {c.image && (
                  <img src={c.image} alt="" className="h-12 w-12 rounded object-cover shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.category} · {c.dateReported ? format(new Date(c.dateReported), "MMM d, yyyy") : "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={c.status} />
                {expanded === c.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
              </div>
            </div>

            {expanded === c.id && (
              <CardContent className="border-t border-border pt-4">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-sm text-foreground">{c.description}</p>
                    <p className="text-xs text-muted-foreground">📍 {c.location?.address || "Location not available"}</p>
                    <p className="text-xs text-muted-foreground">Reported by: {c.reportedBy?.username || c.reportedBy || "Unknown"}</p>
                    {c.image && (
                      <img src={c.image} alt={c.title} className="rounded-lg h-40 w-full object-cover" />
                    )}

                    {/* Update form */}
                    <div className="pt-3 border-t border-border space-y-3">
                      <p className="text-sm font-medium text-foreground">Update Status</p>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="">Select status...</option>
                        {statuses.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <Textarea
                        placeholder="Add a note..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={2}
                      />
                      <Button onClick={() => handleUpdate(c.id)} size="sm">Update Status</Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-3">Timeline</p>
                    <StatusTimeline history={c.statusHistory} />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
