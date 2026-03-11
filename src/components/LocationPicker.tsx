import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function LocationPicker({ value, onChange }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView(
      [value?.lat || 40.7128, value?.lng || -74.006],
      13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    if (value?.lat && value?.lng) {
      markerRef.current = L.marker([value.lat, value.lng]).addTo(map);
    }

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng]).addTo(map);
      }
      onChange({ lat: lat.toFixed(6), lng: lng.toFixed(6), address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div>
      <div ref={mapRef} className="h-64 w-full rounded-lg border border-border z-0" />
      {value?.lat && (
        <p className="text-xs text-muted-foreground mt-2">
          📍 {value.address || `${value.lat}, ${value.lng}`}
        </p>
      )}
    </div>
  );
}
