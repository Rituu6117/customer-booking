import { GPSLocation } from '../types';

export interface LocationFetchResult {
  success: boolean;
  location?: GPSLocation;
  error?: string;
}

/**
 * Prompts user for browser Geolocation permission and returns GPS coordinates with Google Maps link.
 */
export async function getCurrentGPSLocation(): Promise<LocationFetchResult> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        success: false,
        error: 'Geolocation is not supported by your web browser.',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy);

        // Standard Google Maps link
        const googleMapsUrl = `https://maps.google.com/?q=${lat},${lng}`;

        resolve({
          success: true,
          location: {
            latitude: lat,
            longitude: lng,
            accuracy,
            googleMapsUrl,
            fetchedAt: new Date().toISOString(),
          },
        });
      },
      (error) => {
        let errorMessage = 'Failed to fetch GPS location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access was denied. Please allow location access in browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please check your GPS signal.';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get your location timed out. Please try again.';
            break;
        }
        resolve({
          success: false,
          error: errorMessage,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  });
}
