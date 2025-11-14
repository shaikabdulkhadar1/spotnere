import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  country: string | null;
  city: string | null;
  state: string | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    country: null,
    city: null,
    state: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        loading: false,
      }));
      return;
    }

    const getLocationDetailsFromCoordinates = async (
      lat: number,
      lng: number
    ) => {
      try {
        // Using a reverse geocoding service to get location details from coordinates
        // Using OpenStreetMap Nominatim API (free, no API key required)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
          {
            headers: {
              "User-Agent": "Spotnere App", // Required by Nominatim
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to reverse geocode");
        }

        const data = await response.json();
        const address = data.address || {};

        console.log("🌍 Full reverse geocoding response:", data);
        console.log("🏠 Address object:", address);

        let country = address.country || null;
        const city =
          address.city ||
          address.town ||
          address.village ||
          address.municipality ||
          null;
        const state =
          address.state || address.region || address.province || null;

        console.log("📍 Extracted location values:", {
          country: address.country,
          city:
            address.city ||
            address.town ||
            address.village ||
            address.municipality,
          state: address.state || address.region || address.province,
          allAddressFields: Object.keys(address),
        });

        // Normalize country name (handle common variations)
        if (country) {
          const countryMap: Record<string, string> = {
            "United States": "USA",
            "United States of America": "USA",
            "United Kingdom": "UK",
            "Great Britain": "UK",
          };
          country = countryMap[country] || country;
        }

        console.log("✅ Final geolocation values:", {
          latitude: lat,
          longitude: lng,
          country,
          city,
          state,
        });

        setState((prev) => ({
          ...prev,
          country,
          city,
          state,
          loading: false,
        }));
      } catch (error) {
        console.error(
          "Error getting location details from coordinates:",
          error
        );
        setState((prev) => ({
          ...prev,
          error: "Failed to determine location details",
          loading: false,
        }));
      }
    };

    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      console.log("📍 Geolocation coordinates:", { latitude, longitude });

      setState((prev) => ({
        ...prev,
        latitude,
        longitude,
        error: null,
      }));

      // Get location details (country, city, state) from coordinates
      getLocationDetailsFromCoordinates(latitude, longitude);
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
      console.error("❌ Geolocation error:", {
        code: error.code,
        message: errorMessage,
        error,
      });
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
    };

    // Request location with high accuracy
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  }, []);

  return state;
};
