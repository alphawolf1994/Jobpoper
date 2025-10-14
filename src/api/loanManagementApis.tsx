import { axiosInstance } from "./axiosInstance";


// get loanoption 
export const getLoanOptions = async (
    productName?: string,
    requestedAmount?: number,
    interestRate?: number
) => {
    try {
        const params: Record<string, string | number> = {};
        if (productName) params.productName = productName;
        if (requestedAmount !== undefined) params.requestedAmount = requestedAmount;
        if (interestRate !== undefined) params.interestRate = interestRate;

        const searchParams = new URLSearchParams(params as any).toString();
        const url = `/loan-mangement/loan-product/seeker${searchParams ? `?${searchParams}` : ""}`;
console.log("url", url);
        const res = await axiosInstance.get(url);
        return res.data;
    } catch (error: any) {
        throw error;
    }
};

// create loan request
export const createLoanRequestApi = async (data:any) => {
    try {
        
        const res = await axiosInstance.post(`/loan-mangement/loan-application/create`,data);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}

// get  loan applications  api
export const getMyLoanApplicationsApi = async () => {
    try {
        const res = await axiosInstance.get(`loan-mangement/loan-application/me`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}






