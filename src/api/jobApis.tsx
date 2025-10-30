import { axiosInstance } from "./axiosInstance";

// Create Job API
export const createJobApi = async (jobData: {
    title: string;
    description: string;
    cost: string;
    location: string;
    urgency: string;
    scheduledDate: string;
    scheduledTime: string;
    attachments?: string[];
}) => {
    try {
        // Build multipart form data
        const formData = new FormData();
        formData.append("title", jobData.title);
        formData.append("description", jobData.description);
        formData.append("cost", jobData.cost);
        formData.append("location", jobData.location);
        formData.append("urgency", jobData.urgency);
        formData.append("scheduledDate", jobData.scheduledDate);
        formData.append("scheduledTime", jobData.scheduledTime);

        // Append up to 5 images using the same field name: attachments
        if (jobData.attachments && Array.isArray(jobData.attachments)) {
            jobData.attachments.slice(0, 5).forEach((uri, index) => {
                const inferredName = uri.split("/").pop() || `attachment_${index + 1}.jpg`;
                const ext = inferredName.split(".").pop()?.toLowerCase();
                const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : ext === "heic" ? "image/heic" : "image/jpeg";
                formData.append("attachments", { uri, name: inferredName, type: mime } as unknown as Blob);
            });
        }

        const res = await axiosInstance.post("/jobs", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to create job");
    }
};

// Get all jobs API
export const getAllJobsApi = async () => {
    try {
        const res = await axiosInstance.get("/jobs");
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch jobs");
    }
};

// Get job by ID API
export const getJobByIdApi = async (jobId: string) => {
    try {
        const res = await axiosInstance.get(`/api/jobs/${jobId}`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch job");
    }
};

// Update Job API
export const updateJobApi = async (jobId: string, jobData: {
    title?: string;
    description?: string;
    cost?: string;
    location?: string;
    urgency?: string;
    scheduledDate?: string;
    scheduledTime?: string;
    attachments?: string[];
}) => {
    try {
        const res = await axiosInstance.put(`/api/jobs/${jobId}`, jobData);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to update job");
    }
};

// Delete Job API
export const deleteJobApi = async (jobId: string) => {
    try {
        const res = await axiosInstance.delete(`/api/jobs/${jobId}`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to delete job");
    }
};

// Get user's jobs API
export const getUserJobsApi = async () => {
    try {
        const res = await axiosInstance.get("/api/jobs/my-jobs");
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch user jobs");
    }
};

// Get hot jobs API
export const getHotJobsApi = async (location: string, page: number = 1, limit: number = 10, sortOrder: string = 'desc') => {
    try {
        const res = await axiosInstance.get("/jobs/hot", {
            params: {
                location,
                page,
                limit,
                sortOrder
            }
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch hot jobs");
    }
};

// Get listed jobs API
export const getListedJobsApi = async (location: string, page: number = 1, limit: number = 10, sortOrder: string = 'desc') => {
    try {
        const res = await axiosInstance.get("/jobs/normal", {
            params: {
                location,
                page,
                limit,
                sortOrder
            }
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch listed jobs");
    }
};
