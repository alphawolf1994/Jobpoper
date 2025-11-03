import { axiosInstance } from "./axiosInstance";

// Types matching the API documentation
export interface LocationPayload {
  name: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
  addressDetails?: string;
  createdAt?: number;
}

export interface Location {
  id: string;
  name: string;
  fullAddress: string;
  latitude: number;
  longitude: number;
  addressDetails?: string;
  createdAt: number;
}

export interface SaveLocationResponse {
  status: string;
  message: string;
  data: {
    location: Location;
  };
}

export interface GetLocationsResponse {
  status: string;
  message: string;
  data: {
    locations: Location[];
  };
}

export interface DeleteLocationResponse {
  status: string;
  message: string;
  data: {
    id: string;
  };
}

// Save a new location
export const saveLocationApi = async (locationData: LocationPayload) => {
  try {
    const payload = {
      name: locationData.name,
      fullAddress: locationData.fullAddress,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      addressDetails: locationData.addressDetails || "",
      createdAt: locationData.createdAt || Date.now(),
    };

    const res = await axiosInstance.post<SaveLocationResponse>("/locations", payload);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to save location");
  }
};

// Get all locations for the authenticated user
export const getLocationsApi = async () => {
  try {
    const res = await axiosInstance.get<GetLocationsResponse>("/locations");
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch locations");
  }
};

// Delete a location by ID
export const deleteLocationApi = async (locationId: string) => {
  try {
    const res = await axiosInstance.delete<DeleteLocationResponse>(`/locations/${locationId}`);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete location");
  }
};

