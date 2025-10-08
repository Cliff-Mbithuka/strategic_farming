import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Marker } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const SatelliteView: React.FC = () => {
  const [view, setView] = useState<'satellite' | 'terrain'>('satellite');

  const tileLayers = {
    satellite: {
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP'
    },
    terrain: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    }
  };

  const polygon = [
    [-0.23323535402385595, 35.69791987842068],
    [-0.2331025857793577, 35.69818944042999],
    [-0.23292422035257682, 35.69852069324001],
    [-0.23212761083534733, 35.698088857588615],
    [-0.23237571313009092, 35.69788366860258],
    [-0.23263186198279245, 35.69768384402737],
  ];

  const center: [number, number] = [-0.232681, 35.698053];

  const iconA = divIcon({
    html: '<style>.animate-ping { animation: ping 2s cubic-bezier(0,0,0.2,1) infinite; } @keyframes ping { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.4); opacity: 0; } }</style><div style="background-color: rgba(34,197,94,0.8); backdrop-filter: blur(4px); color: white; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; position: relative;">A<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 50%; border: 2px solid #4ade80; animation: ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div></div>',
    className: '',
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });

  const iconB = divIcon({
    html: '<style>.animate-ping { animation: ping 2s cubic-bezier(0,0,0.2,1) infinite; } @keyframes ping { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.4); opacity: 0; } }</style><div style="background-color: rgba(34,197,94,0.8); backdrop-filter: blur(4px); color: white; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; position: relative;">B<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 50%; border: 2px solid #4ade80; animation: ping 2s cubic-bezier(0,0,0.2,1) infinite; animation-delay: 0.5s;"></div></div>',
    className: '',
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });

  const iconC = divIcon({
    html: '<style>.animate-ping { animation: ping 2s cubic-bezier(0,0,0.2,1) infinite; } @keyframes ping { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.4); opacity: 0; } }</style><div style="background-color: rgba(234,179,8,0.8); backdrop-filter: blur(4px); color: white; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; position: relative;">C<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 50%; border: 2px solid #fde047; animation: ping 2s cubic-bezier(0,0,0.2,1) infinite; animation-delay: 1s;"></div></div>',
    className: '',
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });

  const iconD = divIcon({
    html: '<div style="background-color: rgba(107,114,128,0.8); backdrop-filter: blur(4px); color: white; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">D</div>',
    className: '',
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1000,
        display: 'flex',
        gap: '10px',
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}>
        <button
          onClick={() => setView('satellite')}
          style={{
            background: view === 'satellite' ? '#4ade80' : '#ccc',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Satellite
        </button>
        <button
          onClick={() => setView('terrain')}
          style={{
            background: view === 'terrain' ? '#4ade80' : '#ccc',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Terrain
        </button>
      </div>
      <MapContainer center={center} zoom={17} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url={tileLayers[view].url}
          attribution={tileLayers[view].attribution}
        />
        <Polygon positions={polygon as [[number, number]]} />
        <Marker position={polygon[0] as [number, number]} icon={iconA} />
        <Marker position={polygon[1] as [number, number]} icon={iconB} />
        <Marker position={polygon[2] as [number, number]} icon={iconC} />
        <Marker position={polygon[3] as [number, number]} icon={iconD} />
      </MapContainer>
    </div>
  );
};

export default SatelliteView;
