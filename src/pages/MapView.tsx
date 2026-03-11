import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useComplaints } from "@/contexts/ComplaintContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const statusColors = {
  Pending: "#f59e0b",
  "Under Review": "#3b82f6",
  "In Progress": "#8b5cf6",
  Resolved: "#10b981",
};

export default function MapView() {
  const { complaints } = useComplaints();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([40.7128, -74.006], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    complaints.forEach((c) => {
      const color = statusColors[c.status] || "#6b7280";
      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([c.location.lat, c.location.lng], { icon }).addTo(map);

      const popupContent = `
        <div style="min-width:200px;">
          ${c.image ? `<img src="${c.image}" style="width:100%;height:100px;object-fit:cover;border-radius:6px;margin-bottom:8px;" />` : ""}
          <strong style="font-size:14px;">${c.title}</strong>
          <div style="margin-top:4px;font-size:12px;color:#666;">
            <span style="display:inline-block;padding:2px 8px;border-radius:12px;background:${color}20;color:${color};font-weight:600;font-size:11px;">${c.status}</span>
          </div>
          <div style="margin-top:6px;font-size:12px;color:#888;">${c.location.address}</div>
          <button onclick="window.__navigateComplaint('${c.id}')" style="margin-top:8px;width:100%;padding:6px;background:hsl(222.2,47.4%,11.2%);color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px;">View Details</button>
        </div>
      `;
      marker.bindPopup(popupContent);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [complaints]);

  useEffect(() => {
    window.__navigateComplaint = (id) => navigate(`/complaints/${id}`);
    return () => { delete window.__navigateComplaint; };
  }, [navigate]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="px-4 py-3 border-b border-border bg-background">
        <h1 className="text-lg font-bold text-foreground">Map View</h1>
        <div className="flex gap-3 mt-2 flex-wrap">
          {Object.entries(statusColors).map(([status, color]) => (
            <div key={status} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div style={{ background: color }} className="h-3 w-3 rounded-full" />
              {status}
            </div>
          ))}
        </div>
      </div>
      <div ref={mapRef} className="flex-1 z-0" />
    </div>
  );
}
