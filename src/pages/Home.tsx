import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useComplaints } from "@/contexts/ComplaintContext";
import { AlertTriangle, CheckCircle2, Clock, FileText, MapPin, Plus } from "lucide-react";

export default function Home() {
  const { getStats } = useComplaints();
  const stats = getStats();

  const statCards = [
    { label: "Total Reports", value: stats.total, icon: FileText, color: "text-blue-600 bg-blue-50" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-600 bg-amber-50" },
    { label: "In Progress", value: stats.inProgress, icon: AlertTriangle, color: "text-purple-600 bg-purple-50" },
    { label: "Resolved", value: stats.resolved, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
            Report Civic Issues,<br />
            <span className="text-primary">Build a Better City</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Spot a pothole, broken streetlight, or garbage overflow? Report it in seconds and track its resolution. Your voice shapes your neighborhood.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/report">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <Plus className="h-5 w-5" /> Report an Issue
              </Button>
            </Link>
            <Link to="/complaints">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                <FileText className="h-5 w-5" /> Browse Complaints
              </Button>
            </Link>
            <Link to="/map">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                <MapPin className="h-5 w-5" /> View Map
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">City at a Glance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map((s) => (
              <Card key={s.label} className="text-center">
                <CardContent className="pt-6">
                  <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center ${s.color} mb-3`}>
                    <s.icon className="h-6 w-6" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{s.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Report", desc: "Snap a photo, pin the location, describe the issue" },
              { step: "2", title: "Track", desc: "Follow your complaint through every stage of resolution" },
              { step: "3", title: "Resolved", desc: "The city fixes the problem and you get notified" },
            ].map((item) => (
              <div key={item.step} className="space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
