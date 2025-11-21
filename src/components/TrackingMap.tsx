import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

interface TrackingHistory {
  location: string;
  status: string;
  event_date: string;
}

interface TrackingMapProps {
  history: TrackingHistory[];
  origin: string;
  destination: string;
}

const cityCoordinates: Record<string, [number, number]> = {
  'Guangzhou': [23.1291, 113.2644],
  'Frankfurt': [50.1109, 8.6821],
  'Lalling': [48.9044, 13.0825],
  'China': [35.8617, 104.1954],
  'Germany': [51.1657, 10.4515],
};

const getCoordinatesFromLocation = (location: string): [number, number] | null => {
  for (const [city, coords] of Object.entries(cityCoordinates)) {
    if (location.includes(city)) {
      return coords;
    }
  }
  return null;
};

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
};

export function TrackingMap({ history, origin, destination }: TrackingMapProps) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  const routePoints: Array<{ coords: [number, number]; location: string; status: string; date: string }> = [];
  
  history.forEach((event) => {
    const coords = getCoordinatesFromLocation(event.location);
    if (coords) {
      routePoints.push({
        coords,
        location: event.location,
        status: event.status,
        date: new Date(event.event_date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
      });
    }
  });

  if (routePoints.length === 0) {
    return (
      <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No location data available</p>
      </div>
    );
  }

  const coordinates = routePoints.map(p => p.coords);
  const center: [number, number] = [
    coordinates.reduce((sum, coord) => sum + coord[0], 0) / coordinates.length,
    coordinates.reduce((sum, coord) => sum + coord[1], 0) / coordinates.length,
  ];

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border shadow-sm">
      <MapContainer
        center={center}
        zoom={3}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Polyline 
          positions={coordinates} 
          color="#3b82f6"
          weight={3}
          opacity={0.7}
          dashArray="10, 10"
        />

        {routePoints.map((point, index) => {
          const isFirst = index === 0;
          const isLast = index === routePoints.length - 1;
          const color = isLast ? '#22c55e' : isFirst ? '#ef4444' : '#3b82f6';
          
          return (
            <Marker 
              key={index} 
              position={point.coords}
              icon={createCustomIcon(color)}
            >
              <Popup>
                <div className="p-2">
                  <p className="font-semibold text-sm">{point.status}</p>
                  <p className="text-xs text-muted-foreground">{point.location}</p>
                  <p className="text-xs text-muted-foreground mt-1">{point.date}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
