// const useCurrentLocation = (): {
import { toast } from "@/components/ui/use-toast";
import { ErrorLocation, Location } from "@/types";
import { useState, useEffect, useCallback } from "react";

const useCurrentLocation = (): {
  location: Location;
  error: ErrorLocation | null;
} => {
  const [location, setLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });
  const [error, setError] = useState<ErrorLocation | null>(null);

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    console.log("Error GEOLOCATION :", error);
    toast({
      title: "Warning",
      variant: "destructive",
      description: "Aktifkan GPS/Lokasi untuk mengakses Peta",
      className: "z-50",
    });
    setError({ message: error.message });
  }, []);

  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      setError({ message: "Geolocation is not supported by your browser" });
      return;
    }

    geo.getCurrentPosition(handleSuccess, handleError);
  }, [handleSuccess, handleError]);

  return { location, error };
};

export default useCurrentLocation;
