import { axiosInstance } from "./axiosInstance";


export const getAllSchools = async ({ page, limit }: { page: number; limit: number }) => {
    try {
        const res = await axiosInstance.get(`/school?page=${page}&limit=${limit}`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}

export const getSchool = async (id: string) => {
    try {
        
        const res = await axiosInstance.get(`/school/${id}`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}
// get Fee summary api
export const getSchoolFeeSummary = async () => {
    try {
        
        const res = await axiosInstance.get(`/school/fee-summary`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}
// get school Fee stats api
export const getSchoolFeeSats = async () => {
    try {
        
        const res = await axiosInstance.get(`/school/stats`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}
// get school location stats api
export const getSchoolLocation = async () => {
    try {
        
        const res = await axiosInstance.get(`/school-location`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}
// get school class rooms  api
export const getSchoolClassRooms = async (id: string) => {
    try {
        
        const res = await axiosInstance.get(`/classroom/all/${id}`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}
// get school Subjects  api
export const getSchoolSubjects = async (id: string) => {
    try {
        
        const res = await axiosInstance.get(`/subject/all/${id}`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}

// get school classes  api
export const getSchoolClasses = async () => {
    try {
        
        const res = await axiosInstance.get(`/class`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}

// get school invite-proposal  api
export const getSchoolInviteProposals = async () => {
    try {
        
        const res = await axiosInstance.get(`/invite-proposal`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}
// get school fee master  api
export const getSchoolFeeMaster = async () => {
    try {
        
        const res = await axiosInstance.get(`/fee-master`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}

// get school fee assign  api
export const getSchoolAssignFee = async () => {
    try {
        const res = await axiosInstance.get(`/fee-assign`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}

// get school hostel  api
export const getSchoolHostel = async () => {
    try {
        const res = await axiosInstance.get(`/hostel`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}

// get school transport pickup points  api
export const getSchoolTransportPickupPoints = async () => {
    try {
        const res = await axiosInstance.get(`/pickup-point`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}

// get school transport routes  api
export const getSchoolTransportRoutes = async () => {
    try {
        const res = await axiosInstance.get(`/transport-route`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}
// get school transport-vehicle  api
export const getSchoolTransportVehicle = async () => {
    try {
        const res = await axiosInstance.get(`/transport-vehicle`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}
// get school vehicle-driver  api
export const getSchoolTransportVehicleDriver = async () => {
    try {
        const res = await axiosInstance.get(`/vehicle-driver`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}

// get school transport-assignment  api
export const getSchoolTransportAssignment = async () => {
    try {
        const res = await axiosInstance.get(`/transport-assignment`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}





// get school parent  api
export const getSchoolParents = async () => {
    try {
        const res = await axiosInstance.get(`/school/parents`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}

// get school fee details of class api
export const getFeeDetailApi = async (className: string,sectionName:string) => {
    try {
        
        const res = await axiosInstance.get(`school/students?className=${className}&sectionName=${sectionName}`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}

// update school details 
export const updateSchoolDetails = async (id: string,data:any) => {
    try {
        
        const res = await axiosInstance.put(`/school/update/${id}`,data);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}

// get school time table api
export const getTimeTableApi = async (classId: string,sectionId:string) => {
    try {
        
        const res = await axiosInstance.get(`/time-table/?class=${classId}&section=${sectionId}`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}

// get school enrollments  api
export const getAllEnrollments = async () => {
    try {
        
        const res = await axiosInstance.get(`/enrollment/all`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}

// get school subadmins  api
export const getSubAdminsApi = async () => {
    try {
        const res = await axiosInstance.get(`/sub-admin/`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}
