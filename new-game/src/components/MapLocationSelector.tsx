import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MapPin, Search, Check } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Create a custom red marker icon
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface LocationData {
  lat: number;
  lng: number;
  name: string;
  address?: string;
}

interface MapLocationSelectorProps {
  onComplete: (location: string, coordinates?: { lat: number; lng: number; address?: string }) => void;
}

// Component to handle map click events using a ref
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [onLocationSelect]);

  return null;
}

export function MapLocationSelector({ onComplete }: MapLocationSelectorProps) {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-1.2921, 36.8219]); // Default to Nairobi, Kenya
  const [mapZoom, setMapZoom] = useState(6);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const mapRef = useRef<L.Map>(null);

  // Geocoding function using Nominatim (OpenStreetMap)
  const searchLocation = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ke&addressdetails=1`
      );
      const data = await response.json();
      setSearchResults(data);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchLocation(searchQuery);
  };

  // Handle location selection from search results
  const handleSearchResultSelect = (result: any) => {
    const location: LocationData = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      name: result.display_name,
      address: result.display_name
    };
    setSelectedLocation(location);
    setMapCenter([location.lat, location.lng]);
    setMapZoom(12);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  // Handle map click
  const handleMapClick = (lat: number, lng: number) => {
    const location: LocationData = {
      lat,
      lng,
      name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      address: `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
    };
    setSelectedLocation(location);
  };

  // Handle continue button
  const handleContinue = () => {
    if (selectedLocation) {
      // Extract city name from the full address or use coordinates
      const cityName = selectedLocation.name.split(',')[0] || selectedLocation.name;
      const coordinates = {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        address: selectedLocation.address
      };
      onComplete(cityName, coordinates);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-200 via-green-100 to-yellow-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-6xl w-full h-full"
      >
        <Card className="p-6 bg-white/95 backdrop-blur-sm shadow-2xl border-0 h-full flex flex-col">
          <div className="text-center mb-6">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-5xl mb-3"
            >
              🗺️
            </motion.div>
            
            <h2 className="text-3xl mb-3 text-green-800">
              Choose Your Farming Location
            </h2>
            
            <p className="text-gray-700 mb-6 text-lg">
              Search for a location or click on the map to select your farming area
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-md mx-auto mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search for a location in Kenya..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full"
                />
              </div>
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      onClick={() => handleSearchResultSelect(result)}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-sm">{result.display_name}</div>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Map Container */}
          <div className="flex-1 min-h-0">
            <MapContainer
              ref={mapRef}
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%', borderRadius: '8px' }}
              whenReady={() => {
                // Add click event listener after map is ready
                if (mapRef.current) {
                  mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
                    handleMapClick(e.latlng.lat, e.latlng.lng);
                  });
                }
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {selectedLocation && (
                <Marker
                  position={[selectedLocation.lat, selectedLocation.lng]}
                  icon={redIcon}
                >
                  <Popup>
                    <div className="text-center">
                      <MapPin className="h-5 w-5 text-red-500 mx-auto mb-2" />
                      <div className="font-medium">Selected Location</div>
                      <div className="text-sm text-gray-600">{selectedLocation.address}</div>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>

          {/* Selected Location Info and Continue Button */}
          {selectedLocation && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <MapPin className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <div className="font-medium text-green-800">Location Selected</div>
                    <div className="text-sm text-green-600">{selectedLocation.address}</div>
                    <div className="text-xs text-gray-500">
                      Coordinates: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleContinue}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Instructions */}
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>💡 <strong>Tip:</strong> You can search for cities, towns, or specific addresses in Kenya, or simply click anywhere on the map to select a location.</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}