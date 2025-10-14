import { axiosInstance } from "./axiosInstance";



// get school department  api
export const getSchoolDepartment = async () => {
    try {
        const res = await axiosInstance.get(`/department`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}
// create school department  api
export const createSchoolDepartmentApi = async (data:any) => {
    try {
        const res = await axiosInstance.post(`/department/create`,data);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}










