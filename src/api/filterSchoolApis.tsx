import { axiosInstance } from "./axiosInstance";


export const getFilteredSchools = async (filters: Record<string, string>) => {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const res = await axiosInstance.get(`/school/filter?${queryParams}`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
};

export const getLocationSuggestions = async (query: string) => {
    try {
        const res = await axiosInstance.get(`/school/suggestions/location?query=${query}`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
};

export const getSchoolNameSuggestions = async (query: string) => {
    try {
        const res = await axiosInstance.get(`/school/suggestions/school-name?query=${query}`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
};
