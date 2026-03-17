import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "./StatusBadge";
import { MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function ComplaintCard({ complaint }) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
      onClick={() => navigate(`/complaints/${complaint.id}`)}
    >
      <div className="aspect-video w-full overflow-hidden bg-muted">
        {complaint.image ? (
          <img
            src={complaint.image}
            alt={complaint.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground line-clamp-2 text-sm">{complaint.title}</h3>
          <StatusBadge status={complaint.status} />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{complaint.location?.address || "Location not available"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{complaint.dateReported ? format(new Date(complaint.dateReported), "MMM d, yyyy") : "N/A"}</span>
          </div>
        </div>
        <div className="pt-1">
          <span className="inline-block rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {complaint.category}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
