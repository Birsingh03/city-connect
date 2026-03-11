import { createContext, useContext, useState, useEffect } from "react";
import mockComplaints from "@/data/mockComplaints";

const ComplaintContext = createContext(null);

export function ComplaintProvider({ children }) {
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem("civicComplaints");
    return saved ? JSON.parse(saved) : mockComplaints;
  });

  useEffect(() => {
    localStorage.setItem("civicComplaints", JSON.stringify(complaints));
  }, [complaints]);

  const addComplaint = (complaint) => {
    const newComplaint = {
      ...complaint,
      id: Date.now().toString(),
      dateReported: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: "Pending",
      statusHistory: [
        { status: "Submitted", date: new Date().toISOString(), note: "Complaint submitted by citizen" },
      ],
    };
    setComplaints((prev) => [newComplaint, ...prev]);
    return newComplaint;
  };

  const updateStatus = (id, newStatus, note = "") => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: newStatus,
            lastUpdated: new Date().toISOString(),
            statusHistory: [
              ...c.statusHistory,
              { status: newStatus, date: new Date().toISOString(), note },
            ],
          };
        }
        return c;
      })
    );
  };

  const getComplaint = (id) => complaints.find((c) => c.id === id);

  const getUserComplaints = (username) => complaints.filter((c) => c.reportedBy === username);

  const getStats = () => ({
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "Pending").length,
    inProgress: complaints.filter((c) => c.status === "In Progress" || c.status === "Under Review").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
  });

  return (
    <ComplaintContext.Provider
      value={{ complaints, addComplaint, updateStatus, getComplaint, getUserComplaints, getStats }}
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
