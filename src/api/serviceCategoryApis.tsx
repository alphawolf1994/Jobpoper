import { axiosInstance } from "./axiosInstance";

export interface ServiceCategoryDto {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    isActive?: boolean;
    sortOrder?: number;
}

// Get all active service categories
export const getServiceCategoriesApi = async () => {
    try {
        const res = await axiosInstance.get("/service-categories");
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch service categories");
    }
};

// Get a single service category by ID or slug
export const getServiceCategoryApi = async (idOrSlug: string) => {
    try {
        const res = await axiosInstance.get(`/service-categories/${idOrSlug}`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch service category");
    }
};
