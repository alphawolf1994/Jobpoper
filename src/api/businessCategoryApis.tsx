import { axiosInstance } from "./axiosInstance";

export interface BusinessCategoryDto {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    isActive?: boolean;
    sortOrder?: number;
}

// Get all active business categories
export const getBusinessCategoriesApi = async () => {
    try {
        const res = await axiosInstance.get("/business-categories");
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch business categories");
    }
};

// Get a single business category by ID or slug
export const getBusinessCategoryApi = async (idOrSlug: string) => {
    try {
        const res = await axiosInstance.get(`/business-categories/${idOrSlug}`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch business category");
    }
};
