import { useParams, Link } from "react-router-dom";
import { useComplaints } from "@/contexts/ComplaintContext";
import StatusBadge from "@/components/StatusBadge";
import StatusTimeline from "@/components/StatusTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Tag } from "lucide-react";
import { format } from "date-fns";

export default function ComplaintDetails() {
  const { id } = useParams();
  const { getComplaint } = useComplaints();
  const complaint = getComplaint(id);

  if (!complaint) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-foreground">Complaint not found</h2>
        <Link to="/complaints"><Button className="mt-4">Back to Complaints</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/complaints" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Complaints
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="text-xl">{complaint.title}</CardTitle>
                <StatusBadge status={complaint.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {complaint.image && (
                <div className="rounded-lg overflow-hidden border border-border">
                  <img src={complaint.image} alt={complaint.title} className="w-full h-64 object-cover" />
                </div>
              )}
              <p className="text-sm text-foreground leading-relaxed">{complaint.description}</p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{complaint.location.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>{format(new Date(complaint.dateReported), "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Tag className="h-4 w-4 shrink-0" />
                  <span>{complaint.category}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusTimeline history={complaint.statusHistory} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
