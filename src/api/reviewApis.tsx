import { axiosInstance } from "./axiosInstance";


export const getSchoolReviews = async (schoolId: string) => {
    try {
        const res = await axiosInstance.get(`/review/${schoolId}`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
};

export const saveReview = async (reviewData: any) => {
    try {
        const res = await axiosInstance.post(`/review`, reviewData);
        return res.data;
    } catch (error: any) {
        throw error;
    }
};

export const updateReview = async (reviewId: string, updatedData: any) => {
    try {
        const res = await axiosInstance.put(`/review/user/${reviewId}`, updatedData);
        return res.data;
    } catch (error: any) {
        throw error;
    }
};

export const deleteReview = async (reviewId: string) => {
    try {
        const res = await axiosInstance.delete(`/review/delete/${reviewId}`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
};

export const likeDislikeReview = async (reviewId: string, action: string) => {
    try {
        const res = await axiosInstance.post(`/review/like-dislike`, { reviewId, action });
        return res.data;
    } catch (error: any) {
        throw error;
    }
};
