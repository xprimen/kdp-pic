// const useCurrentLocation = (): {
import { ErrorLocation, Location } from "@/types";
import { useState, useEffect } from "react";

const useCurrentLocation = (): {
  location: Location;
  error: ErrorLocation | null;
} => {
  const [location, setLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });
  const [error, setError] = useState<ErrorLocation | null>(null);

  const handleSuccess = (position: GeolocationPosition) => {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  };

  const handleError = (error: GeolocationPositionError) => {
    setError({ message: error.message });
  };

  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      setError({ message: "Geolocation is not supported by your browser" });
      return;
    }

    geo.getCurrentPosition(handleSuccess, handleError);
  }, []);

  return { location, error };
};

export default useCurrentLocation;
