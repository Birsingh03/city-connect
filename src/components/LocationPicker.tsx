import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";

export default function LocationPicker({ value, onChange }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [loadingLoc, setLoadingLoc] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          const location = {
            lat: latitude.toFixed(6),
            lng: longitude.toFixed(6),
            address: data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          };
          
          if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
          } else {
            markerRef.current = L.marker([latitude, longitude]).addTo(mapInstanceRef.current);
          }
          
          mapInstanceRef.current.setView([latitude, longitude], 15);
          onChange(location);
        } catch (error) {
          const location = {
            lat: latitude.toFixed(6),
            lng: longitude.toFixed(6),
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          };
          
          if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude]);
          } else {
            markerRef.current = L.marker([latitude, longitude]).addTo(mapInstanceRef.current);
          }
          
          mapInstanceRef.current.setView([latitude, longitude], 15);
          onChange(location);
        }
        setLoadingLoc(false);
      },
      (error) => {
        alert("Unable to get your location. Please enable location access.");
        setLoadingLoc(false);
      }
    );
  };

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView(
      [value?.lat || 31.1471, value?.lng || 75.3412],
      7,
    );

    const punjabBounds = L.latLngBounds(
      [29.5, 73.5],
      [32.7, 76.9],
    );

    map.setMaxBounds(punjabBounds);
    map.options.maxBoundsViscosity = 1.0;
    map.setMinZoom(7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
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
      onChange({
        lat: lat.toFixed(6),
        lng: lng.toFixed(6),
        address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div>
      <div className="flex justify-end mb-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={loadingLoc}
        >
          {loadingLoc ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4 mr-2" />
          )}
          Use Current Location
        </Button>
      </div>
      <div
        ref={mapRef}
        className="h-64 w-full rounded-lg border border-border z-0"
      />
      {value?.lat && (
        <p className="text-xs text-muted-foreground mt-2">
          📍 {value.address || `${value.lat}, ${value.lng}`}
        </p>
      )}
    </div>
  );
}
