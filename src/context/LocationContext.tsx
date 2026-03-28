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

const DEFAULT_LOCATION: LocationCoords = { latitude: 12.9716, longitude: 77.5946 };

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [radius, setRadius] = useState(10);
  const [locationName, setLocationName] = useState('Bangalore');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const coords = await getCurrentLocation();
      if (coords) {
        setLocation(coords);
        const name = await reverseGeocode(coords);
        setLocationName(name);
      } else {
        setErrorMsg('Using default location — Bangalore');
        setLocation(DEFAULT_LOCATION);
      }
      setLoading(false);
    })();
  }, []);

  const setManualLocation = (coords: LocationCoords, name: string) => {
    setLocation(coords);
    setLocationName(name);
    setErrorMsg(null);
  };

  const calcDistance = (lat: number, lng: number): number => {
    if (!location) return 0;
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
