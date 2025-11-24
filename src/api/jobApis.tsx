import { axiosInstance } from "./axiosInstance";

// Create Job API
export const createJobApi = async (jobData: {
    title: string;
    description: string;
    cost: string;
    // location and jobType can be strings or objects now
    location: string | object;
    jobType?: string | object;
    urgency: string;
    scheduledDate: string;
    scheduledTime: string;
    responsePreference?: 'direct_contact' | 'show_interest';
    attachments?: string[];
}) => {
    try {
        // Build multipart form data
        const formData = new FormData();
        formData.append("title", jobData.title);
        formData.append("description", jobData.description);
        formData.append("cost", jobData.cost);
        // jobType and location may be objects (e.g. { source, destination } or saved location objects)
        // Stringify objects so backend can parse them; leave strings as-is.
        if (jobData.jobType !== undefined) {
            formData.append(
                "jobType",
                typeof jobData.jobType === 'string' ? jobData.jobType : JSON.stringify(jobData.jobType)
            );
        }

        formData.append(
            "location",
            typeof jobData.location === 'string' ? jobData.location : JSON.stringify(jobData.location)
        );
        formData.append("urgency", jobData.urgency);
        formData.append("scheduledDate", jobData.scheduledDate);
        formData.append("scheduledTime", jobData.scheduledTime);
        if (jobData.responsePreference) {
            formData.append("responsePreference", jobData.responsePreference);
        }
console.log("Job Data Attachments:", formData);
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
        const res = await axiosInstance.get(`/jobs/${jobId}`);
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
    location?: string | object;
    jobType?: string | object;
    urgency?: string;
    scheduledDate?: string;
    scheduledTime?: string;
    responsePreference?: 'direct_contact' | 'show_interest';
    attachments?: string[];
    existingAttachments?: string[];
}) => {
    try {
        // Build multipart form data
        const formData = new FormData();
        if (jobData.title) formData.append("title", jobData.title);
        if (jobData.description) formData.append("description", jobData.description);
        if (jobData.cost) formData.append("cost", jobData.cost);
        if (jobData.jobType !== undefined) {
            formData.append(
                "jobType",
                typeof jobData.jobType === 'string' ? jobData.jobType : JSON.stringify(jobData.jobType)
            );
        }
        if (jobData.location !== undefined) {
            formData.append(
                "location",
                typeof jobData.location === 'string' ? jobData.location : JSON.stringify(jobData.location)
            );
        }
        if (jobData.urgency) formData.append("urgency", jobData.urgency);
        if (jobData.scheduledDate) formData.append("scheduledDate", jobData.scheduledDate);
        if (jobData.scheduledTime) formData.append("scheduledTime", jobData.scheduledTime);
        if (jobData.responsePreference) formData.append("responsePreference", jobData.responsePreference);
        // Existing attachments as JSON string
        if (jobData.existingAttachments) {
            formData.append("existingAttachments", JSON.stringify(jobData.existingAttachments));
        }
        // New attachments as files
        if (jobData.attachments && Array.isArray(jobData.attachments)) {
            jobData.attachments.slice(0, 5).forEach((uri, index) => {
                const inferredName = uri.split("/").pop() || `attachment_${index + 1}.jpg`;
                const ext = inferredName.split(".").pop()?.toLowerCase();
                const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : ext === "heic" ? "image/heic" : "image/jpeg";
                formData.append("attachments", { uri, name: inferredName, type: mime } as unknown as Blob);
            });
        }
        console.log("Update Job Data Attachments:", formData);
        console.log("Update Job jobId:", jobId);
        const res = await axiosInstance.put(`/jobs/${jobId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    } catch (error: any) {
        console.log("Error in updateJobApi:", error);
        throw new Error(error.response?.data?.message || "Failed to update job");
    }
};

// Delete Job API
export const deleteJobApi = async (jobId: string) => {
    try {
        const res = await axiosInstance.delete(`/jobs/${jobId}`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to delete job");
    }
};

// Show interest in a job API
export const showInterestOnJobApi = async (jobId: string) => {
    try {
        const res = await axiosInstance.post(`/jobs/${jobId}/interest`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to record interest");
    }
};

// Get user's jobs API
export const getUserJobsApi = async () => {
    try {
        const res = await axiosInstance.get("/jobs/my-jobs");
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

// Get my interested jobs API
export const getMyInterestedJobsApi = async (page: number = 1, limit: number = 10, sortBy?: string, sortOrder?: string) => {
    try {
        const params: any = {
            page,
            limit
        };
        if (sortBy) params.sortBy = sortBy;
        if (sortOrder) params.sortOrder = sortOrder;
        
        const res = await axiosInstance.get("/jobs/my-interests", {
            params
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch interested jobs");
    }
};

// Update job status API
export const updateJobStatusApi = async (jobId: string, status: string) => {
    try {
        const res = await axiosInstance.put(`/jobs/${jobId}/status`, {
            status
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to update job status");
    }
};

// Expire old jobs API (cleanup endpoint)
export const expireOldJobsApi = async () => {
    try {
        const res = await axiosInstance.post("/jobs/expire-old");
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to expire old jobs");
    }
};
