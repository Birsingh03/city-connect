import { useState, useMemo } from "react";
import { useComplaints } from "@/contexts/ComplaintContext";
import ComplaintCard from "@/components/ComplaintCard";
import ComplaintFilters from "@/components/ComplaintFilters";

export default function ComplaintList() {
  const { complaints } = useComplaints();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (status && c.status !== status) return false;
      if (category && c.category !== category) return false;
      return true;
    });
  }, [complaints, search, status, category]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">All Complaints</h1>
        <p className="text-sm text-muted-foreground mt-1">Browse and filter reported civic issues</p>
      </div>

      <div className="mb-6">
        <ComplaintFilters
          search={search} onSearchChange={setSearch}
          status={status} onStatusChange={setStatus}
          category={category} onCategoryChange={setCategory}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No complaints found matching your filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <ComplaintCard key={c.id} complaint={c} />
          ))}
        </div>
      )}
    </div>
  );
}
