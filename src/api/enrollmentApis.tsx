import { axiosInstance } from "./axiosInstance";


export const getEnrollments = async () => {
    try {
        const res = await axiosInstance.get("/enrollment");
        return res.data;
    } catch (error: any) {
        throw error;
    }
};

export const saveEnrollment = async (enrollmentData: any) => {
    try {
        const res = await axiosInstance.post("/enrollment/enroll", enrollmentData);
        return res.data;
    } catch (error: any) {
        throw error;
    }
};

export const checkEnrollment = async (schoolId: string) => {
    try {
        const res = await axiosInstance.post("/enrollment/check-enrollment", { schoolId });
        return res.data;
    } catch (error: any) {
        throw error;
    }
};

export const removeEnrollment = async (enrollmentId: string) => {
    try {
        const res = await axiosInstance.delete(`/enrollment/delete-enrollment/${enrollmentId}`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
};
