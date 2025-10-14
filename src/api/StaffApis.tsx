import { axiosInstance } from "./axiosInstance";



// get school staff  api
export const getSchoolStaff = async () => {
    try {
        const res = await axiosInstance.get(`/staff`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}

// get school staff  api
export const createSchoolStaffApi = async (data:any) => {
    try {
        const res = await axiosInstance.post(`/staff/create`,data);
        return res.data;
    } catch (error: any) {
         throw new Error(error.response?.data?.message || "Failed to create staff");
    }
}










