import * as Location from 'expo-location';
import { LocationCoords } from '../types';

export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

export async function getCurrentLocation(): Promise<LocationCoords | null> {
  try {
    const granted = await requestLocationPermission();
    if (!granted) return null;
    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
  } catch {
    return null;
  }
}

export async function reverseGeocode(coords: LocationCoords): Promise<string> {
  try {
    const [address] = await Location.reverseGeocodeAsync(coords);
    if (!address) return 'Your Location';
    return (
      [address.district, address.city, address.region]
        .filter(Boolean)
        .join(', ') || 'Your Location'
    );
  } catch {
    return 'Your Location';
  }
}
