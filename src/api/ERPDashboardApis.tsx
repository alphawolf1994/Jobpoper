import { erpAxiosInstance } from "./axiosInstance";




// create school department  api
export const getReportCell = async (data:any) => {
    try {
        console.log("data =>", data);
        const res = await erpAxiosInstance.post(`/report/call`,data);
        console.log("res =>", res.data)
        return res.data;
    } catch (error: any) {
          throw new Error(error.response?.data?.message || "Failed to get report cell");
    }
}
// get report cell detail api
export const getReportCellDetail = async (data:any) => {
    try {
        const res = await erpAxiosInstance.post(`/report/call`,data);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}

// get special payment api
export const getSpecialPaymentApi = async () => {
    try {
        const res = await erpAxiosInstance.get(`/accountpayable/get/dashboard/pending-list/pending/SPECIAL_PAYMENT?_=TESTUSER001`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}
// get slary payment api
export const getSalaryPaymentApi = async () => {
    try {
        const res = await erpAxiosInstance.get(`/accountpayable/get/dashboard/pending-list/pending/HRMS_CLAIM?_=TESTUSER001`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}
// get loan payment api
export const getLoanPaymentApi = async () => {
    try {
        const res = await erpAxiosInstance.get(`/accountpayable/get/dashboard/pending-list/pending/STAFF_PAYMENT?_=TESTUSER001`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}
// get other payment api
export const getOtherPaymentApi = async () => {
    try {
        const res = await erpAxiosInstance.get(`/accountpayable/get/dashboard/pending-list/pending/OTHERS?_=TESTUSER001`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}

// get new request api
export const getNewRequesttApi = async () => {
    try {
        const res = await erpAxiosInstance.get(`/accountpayable/get/dashboard/new?_=TESTUSER001`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}
// get pending request api
export const getPendingRequestApi = async () => {
    try {
        const res = await erpAxiosInstance.get(`/accountpayable/get/dashboard/pending?_=TESTUSER001`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}  
// get approved request api
export const getApprovedRequestApi = async () => {
    try {
        const res = await erpAxiosInstance.get(`/accountpayable/get/dashboard/approved?_=TESTUSER001`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}
// get rejected request api
export const getRejectedRequestApi = async () => {
    try {
        const res = await erpAxiosInstance.get(`/accountpayable/get/dashboard/rejected?_=TESTUSER001`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
} 
// get summary counts api
export const getSummaryCountApi = async () => {
    try {
        const res = await erpAxiosInstance.get(`/budgetplanning/get/dashboard/summary/counts`);
       
        return res.data;
    } catch (error: any) {
        throw error;
    }
}    










