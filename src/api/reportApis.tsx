import { axiosInstance } from "./axiosInstance";

// File a report (against a worker / on a job). Images are optional local URIs.
export const createReportApi = async (data: {
  jobId?: string | null;
  reportedUser?: string | null;
  reason?: string;
  description?: string;
  images?: string[]; // local URIs
}) => {
  try {
    const formData = new FormData();
    if (data.jobId) formData.append("jobId", data.jobId);
    if (data.reportedUser) formData.append("reportedUser", data.reportedUser);
    if (data.reason !== undefined) formData.append("reason", data.reason);
    if (data.description !== undefined) formData.append("description", data.description);

    (data.images || []).forEach((uri) => {
      const inferredName = uri.split("/").pop() || "report.jpg";
      const ext = inferredName.split(".").pop()?.toLowerCase();
      const mime =
        ext === "png"
          ? "image/png"
          : ext === "webp"
          ? "image/webp"
          : ext === "heic"
          ? "image/heic"
          : "image/jpeg";
      formData.append("images", { uri, name: inferredName, type: mime } as unknown as Blob);
    });

    const res = await axiosInstance.post("/reports", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to submit report");
  }
};

// The current user's own reports (with status).
export const getMyReportsApi = async (page = 1, limit = 20) => {
  try {
    const res = await axiosInstance.get("/reports/me", { params: { page, limit } });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to load your reports");
  }
};
