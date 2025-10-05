import React from 'react';
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const SatelliteView: React.FC = () => {
  const polygon = [
    [-0.23323535402385595, 35.69791987842068],
    [-0.2331025857793577, 35.69818944042999],
    [-0.23292422035257682, 35.69852069324001],
    [-0.23212761083534733, 35.698088857588615],
    [-0.23237571313009092, 35.69788366860258],
    [-0.23263186198279245, 35.69768384402737],
  ];

  const center: [number, number] = [-0.232681, 35.698053];

  return (
    <MapContainer center={center} zoom={17} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Polygon positions={polygon as [[number, number]]} />
    </MapContainer>
  );
};

export default SatelliteView;