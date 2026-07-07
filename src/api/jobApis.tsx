import { axiosInstance } from "./axiosInstance";

// Create Job API
export const createJobApi = async (jobData: {
    title: string;
    description: string;
    cost: string;
    location: string | object;
    jobType?: string | object;
    urgency: string;
    scheduledDate: string;
    scheduledTime: string;
    responsePreference?: 'direct_contact' | 'show_interest';
    attachments?: string[];
    voiceNote?: string | null;
    distanceKm?: number | null;
    category?: string | null;
    postedOnBehalf?: boolean;
    externalContactName?: string;
    externalContactPhone?: string;
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
        if (
            jobData.distanceKm !== undefined &&
            jobData.distanceKm !== null &&
            !Number.isNaN(jobData.distanceKm)
        ) {
            formData.append("distanceKm", String(jobData.distanceKm));
        }
        if (jobData.category) {
            formData.append("category", jobData.category);
        }
        formData.append("postedOnBehalf", jobData.postedOnBehalf ? "true" : "false");
        if (jobData.postedOnBehalf) {
            if (jobData.externalContactName) {
                formData.append("externalContactName", jobData.externalContactName);
            }
            if (jobData.externalContactPhone) {
                formData.append("externalContactPhone", jobData.externalContactPhone);
            }
        }
        // Append up to 5 images
        if (jobData.attachments && Array.isArray(jobData.attachments)) {
            jobData.attachments.slice(0, 5).forEach((uri, index) => {
                const inferredName = uri.split("/").pop() || `attachment_${index + 1}.jpg`;
                const ext = inferredName.split(".").pop()?.toLowerCase();
                const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : ext === "heic" ? "image/heic" : "image/jpeg";
                formData.append("attachments", { uri, name: inferredName, type: mime } as unknown as Blob);
            });
        }
        // Append voice note if present
        if (jobData.voiceNote) {
            const voiceUri = jobData.voiceNote;
            const voiceName = voiceUri.split("/").pop() || "voice_note.m4a";
            const ext = voiceName.split(".").pop()?.toLowerCase();
            const voiceMime = ext === "mp3" ? "audio/mpeg" : ext === "wav" ? "audio/wav" : ext === "aac" ? "audio/aac" : "audio/m4a";
            formData.append("voiceNote", { uri: voiceUri, name: voiceName, type: voiceMime } as unknown as Blob);
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
    voiceNote?: string | null;
    removeVoiceNote?: boolean;
    distanceKm?: number | null;
    category?: string | null;
    postedOnBehalf?: boolean;
    externalContactName?: string;
    externalContactPhone?: string;
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
        if (
            jobData.distanceKm !== undefined &&
            jobData.distanceKm !== null &&
            !Number.isNaN(jobData.distanceKm)
        ) {
            formData.append("distanceKm", String(jobData.distanceKm));
        }
        if (jobData.category !== undefined) {
            // Empty string clears the category on the backend
            formData.append("category", jobData.category ?? "");
        }
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
        // New voice note file
        if (jobData.voiceNote) {
            const voiceUri = jobData.voiceNote;
            const voiceName = voiceUri.split("/").pop() || "voice_note.m4a";
            const ext = voiceName.split(".").pop()?.toLowerCase();
            const voiceMime = ext === "mp3" ? "audio/mpeg" : ext === "wav" ? "audio/wav" : ext === "aac" ? "audio/aac" : "audio/m4a";
            formData.append("voiceNote", { uri: voiceUri, name: voiceName, type: voiceMime } as unknown as Blob);
        }
        // Signal to remove existing voice note
        if (jobData.removeVoiceNote) {
            formData.append("removeVoiceNote", "true");
        }
        if (jobData.postedOnBehalf !== undefined) {
            formData.append("postedOnBehalf", jobData.postedOnBehalf ? "true" : "false");
            if (jobData.postedOnBehalf) {
                if (jobData.externalContactName !== undefined) {
                    formData.append("externalContactName", jobData.externalContactName);
                }
                if (jobData.externalContactPhone !== undefined) {
                    formData.append("externalContactPhone", jobData.externalContactPhone);
                }
            }
        }
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
export const getHotJobsApi = async (
    latitude: number,
    longitude: number,
    page: number = 1,
    limit: number = 10,
    sortOrder: string = 'desc',
    category?: string | null,
) => {
    try {
        const params: any = {
            latitude,
            longitude,
            page,
            limit,
            sortOrder
        };
        if (category) params.category = category;
        const res = await axiosInstance.get("/jobs/hot", { params });
        if (__DEV__) {
            console.log("[getHotJobsApi] response:", JSON.stringify({ status: res.data?.status, jobsCount: res.data?.data?.jobs?.length, latitude, longitude }));
        }
        return res.data;
    } catch (error: any) {
        if (__DEV__) {
            console.warn("[getHotJobsApi] error:", error.response?.status, error.response?.data, error.message);
        }
        throw new Error(error.response?.data?.message || "Failed to fetch hot jobs");
    }
};

// Search hot jobs API
export const searchHotJobsApi = async (
    latitude: number,
    longitude: number,
    search: string,
    page: number = 1,
    limit: number = 10,
    sortBy?: string,
    sortOrder: string = 'desc',
    category?: string | null,
) => {
    try {
        const params: any = {
            latitude,
            longitude,
            search,
            page,
            limit,
            sortOrder
        };
        if (sortBy) {
            params.sortBy = sortBy;
        }
        if (category) params.category = category;
        const res = await axiosInstance.get("/jobs/search/hot", {
            params
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to search hot jobs");
    }
};

// Search listed jobs API
export const searchListedJobsApi = async (
    latitude: number,
    longitude: number,
    search: string,
    page: number = 1,
    limit: number = 10,
    sortBy?: string,
    sortOrder: string = 'desc',
    category?: string | null,
) => {
    try {
        const params: any = {
            latitude,
            longitude,
            search,
            page,
            limit,
            sortOrder
        };
        if (sortBy) {
            params.sortBy = sortBy;
        }
        if (category) params.category = category;
        const res = await axiosInstance.get("/jobs/search/normal", {
            params
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to search listed jobs");
    }
};

// Get listed jobs API
export const getListedJobsApi = async (
    latitude: number,
    longitude: number,
    page: number = 1,
    limit: number = 10,
    sortOrder: string = 'desc',
    category?: string | null,
) => {
    try {
        const params: any = {
            latitude,
            longitude,
            page,
            limit,
            sortOrder
        };
        if (category) params.category = category;
        const res = await axiosInstance.get("/jobs/normal", { params });
        if (__DEV__) {
            console.log("[getListedJobsApi] response:", JSON.stringify({ status: res.data?.status, jobsCount: res.data?.data?.jobs?.length, latitude, longitude }));
        }
        return res.data;
    } catch (error: any) {
        if (__DEV__) {
            console.warn("[getListedJobsApi] error:", error.response?.status, error.response?.data, error.message);
        }
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

// Lookup a worker by their Worker ID string
export const lookupWorkerApi = async (workerId: string) => {
    try {
        const res = await axiosInstance.get(`/jobs/workers/lookup/${workerId}`);
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Worker not found");
    }
};

// Customer confirms worker and starts a job
export const startJobApi = async (jobId: string, workerId: string) => {
    try {
        const res = await axiosInstance.post(`/jobs/${jobId}/start`, { workerId });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to start job");
    }
};

// Worker enters Job PIN to mark job as completed
export const completeJobApi = async (jobId: string, jobPin: string) => {
    try {
        const res = await axiosInstance.post(`/jobs/${jobId}/complete`, { jobPin });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to complete job");
    }
};

// Customer submits a review after job is completed
export const submitReviewApi = async (jobId: string, rating: number, comment: string) => {
    try {
        const res = await axiosInstance.post(`/jobs/${jobId}/review`, { rating, comment });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to submit review");
    }
};

// Get paginated reviews for a worker
export const getWorkerReviewsApi = async (userId: string, page = 1, limit = 10) => {
    try {
        const res = await axiosInstance.get(`/jobs/workers/${userId}/reviews`, {
            params: { page, limit },
        });
        return res.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to fetch reviews");
    }
};
