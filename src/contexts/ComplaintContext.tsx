import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from 'axios';

const ComplaintContext = createContext(null);

const API_URL = "http://localhost:3001/api";

export function ComplaintProvider({ children }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/complaints`);
      const mapped = res.data.map((c) => ({
        ...c,
        id: c._id,
        image: c.imageUrl,
        category: c.category || "Uncategorized",
        location: {
          lat: c.location?.lat,
          lng: c.location?.lng,
          address: c.location?.lat ? `${c.location.lat}, ${c.location.lng}` : "Location not available"
        },
        dateReported: c.createdAt,
        reportedBy: c.reportedBy,
        reportedByUsername: c.reportedBy?.username || c.reportedBy,
        statusHistory: c.statusHistory || [
          { status: "Submitted", date: c.createdAt, note: "Complaint submitted" },
          ...(c.status && c.status !== "Submitted" ? [{ status: c.status, date: c.updatedAt, note: `Status updated to ${c.status}` }] : [])
        ]
      }));
      setComplaints(mapped);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const addComplaint = (complaint) => {
    const newComplaint = {
      ...complaint,
      dateReported: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: "Pending",
      reportedByUsername: complaint.reportedBy,
    };
    setComplaints((prev) => [newComplaint, ...prev]);
    return newComplaint;
  };

  const updateStatus = async (id, newStatus, note = "") => {
    try {
      const token = localStorage.getItem("civicToken");
      const res = await axios.put(
        `${API_URL}/complaints/${id}`,
        { status: newStatus, note },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      
      setComplaints((prev) =>
        prev.map((c) => {
          if (c._id === id || c.id === id) {
            return { ...c, status: newStatus, lastUpdated: new Date().toISOString() };
          }
          return c;
        })
      );
      return res.data;
    } catch (error) {
      console.error("Error updating status:", error);
      throw error;
    }
  };

  const getComplaint = async (id) => {
    const local = complaints.find((c) => c._id === id || c.id === id);
    if (local) return local;
    
    try {
      const res = await axios.get(`${API_URL}/complaints/${id}`);
      const complaint = res.data;
      const statusHistory = complaint.statusHistory || [
        { status: "Submitted", date: complaint.createdAt, note: "Complaint submitted" },
        ...(complaint.status && complaint.status !== "Submitted" ? [{ status: complaint.status, date: complaint.updatedAt, note: `Status updated to ${complaint.status}` }] : [])
      ];
      return {
        ...complaint,
        id: complaint._id,
        image: complaint.imageUrl,
        location: {
          lat: complaint.location?.lat,
          lng: complaint.location?.lng,
          address: complaint.location?.lat ? `${complaint.location.lat}, ${complaint.location.lng}` : "Location not available"
        },
        dateReported: complaint.createdAt,
        reportedBy: complaint.reportedBy,
        reportedByUsername: complaint.reportedBy?.username || complaint.reportedBy,
        statusHistory
      };
    } catch (error) {
      console.error("Error fetching complaint:", error);
      return null;
    }
  };

  const getUserComplaints = useCallback((userId) => {
    return complaints.filter((c) => 
      c.reportedBy?._id === userId || 
      c.reportedBy === userId ||
      c.reportedByUsername === userId ||
      String(c.reportedBy?._id) === userId ||
      String(c.reportedBy) === userId
    );
  }, [complaints]);

  const getStats = () => ({
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "Pending").length,
    inProgress: complaints.filter((c) => c.status === "In Progress" || c.status === "Under Review").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
  });

  return (
    <ComplaintContext.Provider
      value={{ complaints, loading, addComplaint, updateStatus, getComplaint, getUserComplaints, getStats, refetch: fetchComplaints }}
    >
      {children}
    </ComplaintContext.Provider>
  );
}

export function useComplaints() {
  const ctx = useContext(ComplaintContext);
  if (!ctx) throw new Error("useComplaints must be used within ComplaintProvider");
  return ctx;
}
