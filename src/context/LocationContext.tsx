import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LocationCoords } from '../types';
import { getCurrentLocation, reverseGeocode } from '../lib/location';
import { getDistance } from '../lib/distance';

interface LocationContextType {
  location: LocationCoords | null;
  radius: number;
  setRadius: (r: number) => void;
  locationName: string;
  setManualLocation: (coords: LocationCoords, name: string) => void;
  loading: boolean;
  errorMsg: string | null;
  calcDistance: (lat: number, lng: number) => number;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// ✅ Always start with Bangalore so mock vendors are always visible
const DEFAULT_LOCATION: LocationCoords = { latitude: 12.9716, longitude: 77.5946 };

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  // ✅ Initialize with DEFAULT_LOCATION immediately — never null on first render
  const [location, setLocation] = useState<LocationCoords>(DEFAULT_LOCATION);
  const [radius, setRadius] = useState(25); // ✅ Wider default radius for demo
  const [locationName, setLocationName] = useState('Bangalore, India');
  const [loading, setLoading] = useState(false); // ✅ No blocking load spinner
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Try to get real GPS in background — but don't block UI
    (async () => {
      try {
        const coords = await getCurrentLocation();
        if (coords) {
          // Only use real GPS if it's near Bangalore (for demo purposes)
          // Otherwise keep mock location so vendors still show
          const distFromBangalore = getDistance(
            coords.latitude, coords.longitude,
            DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude
          );
          if (distFromBangalore < 50) {
            setLocation(coords);
            const name = await reverseGeocode(coords);
            setLocationName(name);
          }
          // If far away (e.g. running from Netherlands), stay on Bangalore
        }
      } catch {
        // Silently keep default location
      }
    })();
  }, []);

  const setManualLocation = (coords: LocationCoords, name: string) => {
    setLocation(coords);
    setLocationName(name);
    setErrorMsg(null);
  };

  const calcDistance = (lat: number, lng: number): number => {
    return getDistance(location.latitude, location.longitude, lat, lng);
  };

  return (
    <LocationContext.Provider
      value={{ location, radius, setRadius, locationName, setManualLocation, loading, errorMsg, calcDistance }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used inside LocationProvider');
  return ctx;
};