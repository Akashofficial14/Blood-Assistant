// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// import { useState } from "react";

// const LocationMarker = ({ setCoords }) => {
//   const [position, setPosition] = useState(null);

//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;

//       setPosition([lat, lng]);

//       // IMPORTANT → Mongo needs [lng, lat]
//       setCoords([lng, lat]);
//     },
//   });

//   return position ? <Marker position={position} /> : null;
// };

// const MapPicker = ({ setCoords }) => {
//   return (
//     <MapContainer
//       center={[23.2599, 77.4126]} // Bhopal default
//       zoom={13}
//       style={{ height: "300px", borderRadius: "12px" }}
//     >
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//       <LocationMarker setCoords={setCoords} />
//     </MapContainer>
//   );
// };

// export default MapPicker;

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useState, useEffect } from "react";

// 👇 Moves map when coords change
const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);
  return null;
};

const LocationMarker = ({ setCoords }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setCoords([lng, lat]); // Mongo format
    },
  });

  return position ? <Marker position={position} /> : null;
};

const MapPicker = ({ setCoords, selectedPosition }) => {
  return (
    <MapContainer
      center={selectedPosition || [23.2599, 77.4126]}
      zoom={13}
      style={{ height: "300px", borderRadius: "12px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* 👇 Auto move map */}
      {selectedPosition && <ChangeView center={selectedPosition} />}

      <LocationMarker setCoords={setCoords} />

      {/* 👇 Show marker if auto-detected */}
      {selectedPosition && <Marker position={selectedPosition} />}
    </MapContainer>
  );
};

export default MapPicker;
