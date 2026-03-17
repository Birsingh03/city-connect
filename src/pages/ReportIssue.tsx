import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useComplaints } from "@/contexts/ComplaintContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUpload from "@/components/ImageUpload";
import LocationPicker from "@/components/LocationPicker";
import { categories } from "@/data/mockComplaints";
import { toast } from "sonner";
import axios from "axios"

export default function ReportIssue() {
  const { addComplaint } = useComplaints();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Potholes",
    image: "",
    location: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to report an issue");
      navigate("/login");
      return;
    }
    if (!form.title || !form.description || !form.location) {
      toast.error("Please fill in all required fields and select a location");
      return;
    }
    addComplaint({ ...form, reportedBy: user.username });
    toast.success("Complaint submitted successfully!");
    navigate("/my-complaints");


  // changes made in this branch
    try {
      const response = await axios.post(
        "https://api.example.com/users",
        form
      );

      console.log("Success:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Report a Civic Issue</CardTitle>
          <p className="text-sm text-muted-foreground">Help improve your city by reporting problems in your area.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title *</label>
              <Input
                placeholder="e.g., Large pothole on Main Street"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description *</label>
              <Textarea
                placeholder="Describe the issue in detail..."
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Upload Image</label>
              <ImageUpload value={form.image} onChange={(img) => setForm({ ...form, image: img })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Location * (click on map)</label>
              <LocationPicker value={form.location} onChange={(loc) => setForm({ ...form, location: loc })} />
            </div>

            <Button type="submit" className="w-full" size="lg" onClick={ReportIssue}>
              Submit Report
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
