import { axiosInstance } from "./axiosInstance";



// get payment methods  api
export const getPaymentMethodsApi = async () => {
    try {
        const res = await axiosInstance.get(`/payment-method/`);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}



// delete payment method api
export const deletePaymentMethodApi = async (id:string) => {
    try {
        const res = await axiosInstance.delete(`/payment-method/delete/${id}`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to delete payment method");
    }
}  
// add payment method api
export const addPaymentMethodApi = async (data:any) => {
    try {
        const res = await axiosInstance.post(`/payment-method/create`, data);
        return res.data;
    } catch (error: any) {
        throw error;
    }
}        











