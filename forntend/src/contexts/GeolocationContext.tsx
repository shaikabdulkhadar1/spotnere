import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface GeolocationData {
  latitude: number | null;
  longitude: number | null;
  country: string | null;
  city: string | null;
  state: string | null;
  error: string | null;
  loading: boolean;
}

interface GeolocationContextType extends GeolocationData {
  refetch: () => void;
}

const GeolocationContext = createContext<GeolocationContextType | undefined>(
  undefined
);

export const useGeolocationContext = () => {
  const context = useContext(GeolocationContext);
  if (context === undefined) {
    throw new Error(
      "useGeolocationContext must be used within a GeolocationProvider"
    );
  }
  return context;
};

// Export as useGeolocation for backward compatibility and cleaner API
export const useGeolocation = useGeolocationContext;

interface GeolocationProviderProps {
  children: ReactNode;
}

export const GeolocationProvider: React.FC<GeolocationProviderProps> = ({
  children,
}) => {
  const [geolocation, setGeolocation] = useState<GeolocationData>({
    latitude: null,
    longitude: null,
    country: null,
    city: null,
    state: null,
    error: null,
    loading: true,
  });

  const fetchLocation = () => {
    // Reset to loading state
    setGeolocation((prev) => ({ ...prev, loading: true, error: null }));

    if (!navigator.geolocation) {
      setGeolocation({
        latitude: null,
        longitude: null,
        country: null,
        city: null,
        state: null,
        error: "Geolocation is not supported by your browser",
        loading: false,
      });
      return;
    }

    const getLocationDetails = async (lat: number, lng: number) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
          {
            headers: {
              "User-Agent": "Spotnere App",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to reverse geocode");
        }

        const data = await response.json();
        const address = data.address || {};

        // Extract location details - return actual values without mapping
        const country = address.country || null;
        const city =
          address.city ||
          address.town ||
          address.village ||
          address.municipality ||
          null;
        const state =
          address.state || address.region || address.province || null;

        const locationData = {
          latitude: lat,
          longitude: lng,
          country,
          city,
          state,
          error: null,
          loading: false,
        };

        console.log("📍 Location object (Context):", locationData);
        setGeolocation(locationData);
      } catch (error) {
        setGeolocation((prev) => ({
          ...prev,
          error: "Failed to determine location details",
          loading: false,
        }));
      }
    };

    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      getLocationDetails(latitude, longitude);
    };

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = "Failed to get location";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location access denied by user";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information unavailable";
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out";
          break;
      }
      setGeolocation({
        latitude: null,
        longitude: null,
        country: null,
        city: null,
        state: null,
        error: errorMessage,
        loading: false,
      });
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  };

  // Fetch location once when provider mounts
  useEffect(() => {
    fetchLocation();
  }, []);

  // Log location object whenever it changes
  useEffect(() => {
    if (!geolocation.loading) {
      console.log("📍 Location object (Context):", geolocation);
    }
  }, [geolocation]);

  const value: GeolocationContextType = {
    ...geolocation,
    refetch: fetchLocation,
  };

  return (
    <GeolocationContext.Provider value={value}>
      {children}
    </GeolocationContext.Provider>
  );
};

