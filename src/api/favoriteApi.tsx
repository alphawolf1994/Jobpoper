import { axiosInstance } from "./axiosInstance";


export const getFavorites = async () => {
    try {
        const res = await axiosInstance.get("/favorite");
        return res.data;
    } catch (error: any) {
        throw error;
    }
};

export const addToFavorites = async (schoolId: any) => {
    try {
        const res = await axiosInstance.post("/favorite/add", { schoolId });
        return res.data;
    } catch (error: any) {
        throw error;
    }
};

export const removeFromFavorites = async (schoolId: string) => {
    try {
        const res = await axiosInstance.delete(`/favorite/delete/${schoolId}`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
};
