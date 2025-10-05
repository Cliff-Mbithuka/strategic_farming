
import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';

// Define the type for the Earth Engine object
declare global {
  interface Window {
    ee: any;
    google: any;
  }
}

const GEEAuth = ({ onAuthenticated, clientId }: { onAuthenticated: (ee: any) => void, clientId: string }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://code.earthengine.google.com/api_js.js';
    script.async = true;
    script.onload = () => {
      window.ee.initialize(null, null, () => {
        window.ee.data.authenticateViaOauth(
          clientId,
          () => {
            setIsAuthenticated(true);
            onAuthenticated(window.ee);
          },
          (error: any) => {
            setAuthError(error);
          },
          null,
          () => {
            window.ee.data.authenticateViaOauth(
              clientId,
              () => {
                setIsAuthenticated(true);
                onAuthenticated(window.ee);
              },
              (error: any) => {
                setAuthError(error);
              }
            );
          }
        );
      }, (error: any) => {
        setAuthError(error);
      });
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [clientId, onAuthenticated]);

  if (authError) {
    return <div>Error authenticating with Earth Engine: {authError.message || 'Unknown error'}</div>;
  }

  if (!isAuthenticated) {
    return <div>Authenticating with Google Earth Engine...</div>;
  }

  return null;
};

const GEEMap = ({ ee, googleMapsApiKey }: { ee: any, googleMapsApiKey: string }) => {
  const [mapInstance, setMapInstance] = useState<any>(null);

  useEffect(() => {
    if (!ee || !mapInstance) return;

    const addGEELayer = async () => {
      try {
        const image = ee.Image('LANDSAT/LC08/C01/T1_SR/LC08_044034_20200318')
          .select(['B4', 'B3', 'B2'])
          .unitScale(0, 10000);

        const mapId = await new Promise((resolve, reject) => {
          ee.data.getMapId(
            { 'image': image, 'visParams': { min: 0, max: 0.3 } },
            (id: any) => resolve(id),
            (error: any) => reject(error)
          );
        });

        const geeMapType = new window.google.maps.ImageMapType({
          getTileUrl: function (tile: any, zoom: number) {
            const url = mapId.tile_fetcher.url;
            return `${url}/${zoom}/${tile.x}/${tile.y}`;
          },
          tileSize: new window.google.maps.Size(256, 256),
          name: 'GEE Layer',
        });

        mapInstance.overlayMapTypes.push(geeMapType);

        image.geometry().bounds().getInfo((bounds: any) => {
          const [west, south, east, north] = bounds.coordinates[0][0].concat(bounds.coordinates[0][2]);
          const centerLat = (south + north) / 2;
          const centerLng = (west + east) / 2;
          mapInstance.setCenter({ lat: centerLat, lng: centerLng });
          mapInstance.setZoom(10);
        });

      } catch (error) {
        console.error('Error adding GEE layer:', error);
      }
    };

    addGEELayer();

  }, [ee, mapInstance]);

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <APIProvider apiKey={googleMapsApiKey}>
        <Map
          defaultCenter={{ lat: 37.422, lng: -122.084 }}
          defaultZoom={10}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
          onLoad={(map: any) => setMapInstance(map)}
        />
      </APIProvider>
    </div>
  );
};


const SatelliteView = () => {
  const [ee, setEe] = useState<any>(null);

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const geeOauthClientId = import.meta.env.VITE_GEE_OAUTH_CLIENT_ID;

  if (!googleMapsApiKey || !geeOauthClientId) {
    return <div>Missing Google Maps API Key or GEE OAuth Client ID in .env file.</div>;
  }

  return (
    <div>
      {!ee ? (
        <GEEAuth onAuthenticated={setEe} clientId={geeOauthClientId} />
      ) : (
        <GEEMap ee={ee} googleMapsApiKey={googleMapsApiKey} />
      )}
    </div>
  );
};

export default SatelliteView;
