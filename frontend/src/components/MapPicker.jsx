import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

const LocationMarker = ({ setCoords }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      setPosition([lat, lng]);

      // IMPORTANT → Mongo needs [lng, lat]
      setCoords([lng, lat]);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const MapPicker = ({ setCoords }) => {
  return (
    <MapContainer
      center={[23.2599, 77.4126]} // Bhopal default
      zoom={13}
      style={{ height: "300px", borderRadius: "12px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker setCoords={setCoords} />
    </MapContainer>
  );
};

export default MapPicker;
