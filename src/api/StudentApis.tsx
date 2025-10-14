import { axiosInstance } from "./axiosInstance";


// get school students  api
export const getSchoolStudents = async () => {
    try {
        const res = await axiosInstance.get(`/student`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}

// get student by id
export const getStudentById = async (id: string) => {
    try {
        
        const res = await axiosInstance.get(`/student/${id}`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}

// get student by id
export const getStudentFeeRecord = async (id: string) => {
    try {
        
        const res = await axiosInstance.get(`/student-fee-record/${id}`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}








