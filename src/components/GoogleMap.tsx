
import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  onLocationChange?: (lat: number, lng: number) => void;
  height?: string;
  zoom?: number;
  editable?: boolean;
}

const GoogleMap = ({ 
  latitude, 
  longitude, 
  onLocationChange, 
  height = "300px", 
  zoom = 15,
  editable = false 
}: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Replace with your actual API key
        version: "weekly",
      });

      try {
        const { Map } = await loader.importLibrary("maps") as google.maps.MapsLibrary;
        const { Marker } = await loader.importLibrary("marker") as google.maps.MarkerLibrary;

        if (mapRef.current) {
          const mapInstance = new Map(mapRef.current, {
            center: { lat: latitude, lng: longitude },
            zoom: zoom,
          });

          const markerInstance = new Marker({
            position: { lat: latitude, lng: longitude },
            map: mapInstance,
            draggable: editable,
          });

          if (editable && onLocationChange) {
            markerInstance.addListener("dragend", () => {
              const position = markerInstance.getPosition();
              if (position) {
                onLocationChange(position.lat(), position.lng());
              }
            });

            mapInstance.addListener("click", (event: google.maps.MapMouseEvent) => {
              if (event.latLng) {
                const lat = event.latLng.lat();
                const lng = event.latLng.lng();
                markerInstance.setPosition({ lat, lng });
                onLocationChange(lat, lng);
              }
            });
          }

          setMap(mapInstance);
          setMarker(markerInstance);
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (map && marker) {
      const newPosition = { lat: latitude, lng: longitude };
      marker.setPosition(newPosition);
      map.setCenter(newPosition);
    }
  }, [latitude, longitude, map, marker]);

  return (
    <div 
      ref={mapRef} 
      style={{ width: "100%", height }}
      className="rounded-lg border border-gray-300"
    />
  );
};

export default GoogleMap;
