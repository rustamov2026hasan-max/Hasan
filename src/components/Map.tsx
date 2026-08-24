"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { MOCK_ANIMALS } from '@/data/mock';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Activity, Battery, Thermometer } from 'lucide-react';

// Custom literal icons based on AgTech Master Prompt (Cow Emoji instead of abstract dots)
const createIcon = (color: string) => {
  return new L.DivIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 8px; border: 2px solid #F4F4F4; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 16px;">🐄</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

const iconNormal = createIcon('#259150'); // Forest Green
const iconWarning = createIcon('#eab308');
const iconCritical = createIcon('#ef4444');
const iconOffline = createIcon('#94a3b8');

export default function Map() {
  const [mounted, setMounted] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    // Fix leaflet marker icon issue in Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const fetchLocations = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/map/locations");
        if (res.ok) setLocations(await res.json());
      } catch (err) {
        // Fallback or ignore
      }
    };
    
    fetchLocations();
    const interval = setInterval(fetchLocations, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full bg-muted animate-pulse rounded-xl flex items-center justify-center text-muted-foreground">Xarita yuklanmoqda...</div>;
  }

  // Base coordinates around a typical farm in Samarkand (where backend simulates)
  const center: [number, number] = [39.654, 66.958];

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden shadow-sm border border-border">
      <MapContainer 
        center={center} 
        zoom={15} 
        scrollWheelZoom={true} 
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Geofence Visualization */}
        <Circle 
          center={center} 
          radius={500} 
          pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.1, dashArray: '5, 10' }} 
        />

        {locations.map(animal => {
          let icon = animal.status === 'warning' ? iconWarning : iconNormal;

          return (
            <div key={animal.id}>
              <Marker 
                position={[animal.lat, animal.lng]} 
                icon={icon}
              >
                <Popup className="custom-popup">
                  <div className="p-1 min-w-[200px]">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
                      <h3 className="font-bold text-base">ID: {animal.id.substring(0,8)}</h3>
                      <Badge variant={animal.status === 'warning' ? "destructive" : "success"}>
                        {animal.status === 'warning' ? 'Xavf' : 'Online'}
                      </Badge>
                    </div>

                    <Button className="w-full text-xs touch-target bg-brand-600 hover:bg-brand-700 text-white mt-2" variant="default">
                      To'liq ma'lumot
                    </Button>
                  </div>
                </Popup>
              </Marker>
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
}
