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
import axios from "axios";

const API_URL = "http://localhost:3001/api";

export default function ReportIssue() {
  const { addComplaint } = useComplaints();
  const { user, getToken } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    try {
      const token = getToken();
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("category", form.category.toLowerCase());
      formData.append("description", form.description);
      formData.append("location", JSON.stringify(form.location));
      
      if (form.image) {
        const response = await fetch(form.image);
        const blob = await response.blob();
        formData.append("image", blob, "image.jpg");
      }

      const res = await axios.post(`${API_URL}/report`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (res.data.success) {
        addComplaint({ ...form, reportedBy: user.username, id: res.data.data._id });
        toast.success("Complaint submitted successfully!");
        navigate("/my-complaints");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Failed to submit complaint");
    } finally {
      setLoading(false);
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

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
