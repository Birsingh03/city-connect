import { useAuth } from "@/contexts/AuthContext";
import { useComplaints } from "@/contexts/ComplaintContext";
import { Link, Navigate } from "react-router-dom";
import ComplaintCard from "@/components/ComplaintCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function MyComplaints() {
  const { user } = useAuth();
  const { getUserComplaints } = useComplaints();

  if (!user) return <Navigate to="/login" />;

  const myComplaints = getUserComplaints(user.username);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Complaints</h1>
          <p className="text-sm text-muted-foreground mt-1">Track the status of your reported issues</p>
        </div>
        <Link to="/report">
          <Button className="gap-2"><Plus className="h-4 w-4" /> New Report</Button>
        </Link>
      </div>

      {myComplaints.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">You haven't reported any issues yet.</p>
          <Link to="/report"><Button>Report Your First Issue</Button></Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myComplaints.map((c) => (
            <ComplaintCard key={c.id} complaint={c} />
          ))}
        </div>
      )}
    </div>
  );
}
