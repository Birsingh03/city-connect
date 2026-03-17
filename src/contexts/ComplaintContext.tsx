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
      setComplaints(res.data);
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

  const getComplaint = (id) => complaints.find((c) => c._id === id || c.id === id);

  const getUserComplaints = (userId) => complaints.filter((c) => c.reportedBy?._id === userId || c.reportedBy === userId);

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
