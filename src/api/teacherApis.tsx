import { axiosInstance } from "./axiosInstance";


// get school teahers  api
export const getSchoolTeachers = async () => {
    try {
        const res = await axiosInstance.get(`/teacher`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}
// get teacher by id
export const getTeacherById = async (id: string) => {
    try {
        
        const res = await axiosInstance.get(`/teacher/${id}`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}
// get school teaher details  api
export const getTeacherDetails = async () => {
    try {
        const res = await axiosInstance.get(`/teacher/details`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}
// update teacher by id
export const updateTeacherById = async (id: string,data:string) => {
    try {
        
        const res = await axiosInstance.put(`/teacher/update/:${id}`,data);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}
// get students of the class
export const getStudentsOfClass = async (id: string) => {
    try {
        
        const res = await axiosInstance.get(`/class/students/${id}`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}
// get  teaher timetable  api
export const getTeacherTimetable = async () => {
    try {
        const res = await axiosInstance.get(`/teacher/timetable`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}








