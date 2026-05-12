import { useState, useCallback } from "react";

export const useGeolocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }
      setLoading(true);
      setError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoading(false);
          resolve({
            lat: position.coords.latitude, 
            lon: position.coords.longitude,
          });
        },
        (err) => {
          setLoading(false);
          const msg = err.code === 1
            ? "Location access denied"
            : "Could not determine your location";
          setError(msg);
          reject(new Error(msg));
        },
        { timeout: 10000, maximumAge: 300000 }
      );
    });
  }, []);

  return { getLocation, loading, error };
};
