import { useState, useCallback } from 'react';
import { MatchingService } from '../services/api';

const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const fetchAndSyncLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setIsLoadingLocation(false);
      return false;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          
          try {
            // Sync with backend
            await MatchingService.updateLocation(latitude, longitude);
            setIsLoadingLocation(false);
            resolve(true);
          } catch (error) {
            console.error("Failed to sync location with backend", error);
            setLocationError("Failed to update location on the server.");
            setIsLoadingLocation(false);
            resolve(false);
          }
        },
        (error) => {
          console.error("Error fetching location", error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("Location permission denied. Please enable it in your browser settings to find nearby matches.");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setLocationError("The request to get user location timed out.");
              break;
            default:
              setLocationError("An unknown error occurred while fetching location.");
              break;
          }
          setIsLoadingLocation(false);
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }, []);

  return { location, locationError, isLoadingLocation, fetchAndSyncLocation };
};

export default useGeolocation;
