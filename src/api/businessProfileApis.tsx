import { axiosInstance } from "./axiosInstance";

export interface CreateBusinessProfilePayload {
    businessName: string;
    category: string; // category _id
    address: string;
    phoneNumber: string; // E.164 formatted
    latitude?: number | null;
    longitude?: number | null;
    /**
     * Local file URIs (from expo-image-picker). The first entry is treated
     * as the primary image unless `primaryIndex` is provided.
     */
    images: string[];
    primaryIndex?: number;
}

const inferImagePart = (uri: string, index: number) => {
    const inferredName = uri.split("/").pop() || `business_image_${index + 1}.jpg`;
    const ext = inferredName.split(".").pop()?.toLowerCase();
    const mime =
        ext === "png"
            ? "image/png"
            : ext === "webp"
            ? "image/webp"
            : ext === "heic"
            ? "image/heic"
            : "image/jpeg";
    return { uri, name: inferredName, type: mime };
};

// Create a new business profile (multipart, with up to 5 images).
export const createBusinessProfileApi = async (
    data: CreateBusinessProfilePayload
) => {
    try {
        if (!data.images || data.images.length < 1) {
            throw new Error("At least 1 image is required");
        }
        if (data.images.length > 5) {
            throw new Error("Cannot upload more than 5 images");
        }

        const formData = new FormData();
        formData.append("businessName", data.businessName);
        formData.append("category", data.category);
        formData.append("address", data.address);
        formData.append("phoneNumber", data.phoneNumber);

        if (data.latitude != null && !Number.isNaN(data.latitude)) {
            formData.append("latitude", String(data.latitude));
        }
        if (data.longitude != null && !Number.isNaN(data.longitude)) {
            formData.append("longitude", String(data.longitude));
        }

        const primaryIdx = Math.max(0, Math.min(data.primaryIndex ?? 0, data.images.length - 1));
        formData.append("primaryIndex", String(primaryIdx));

        data.images.slice(0, 5).forEach((uri, index) => {
            formData.append("images", inferImagePart(uri, index) as unknown as Blob);
        });

        const res = await axiosInstance.post("/business-profiles", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    } catch (error: any) {
        throw new Error(
            error?.response?.data?.message ||
                error?.message ||
                "Failed to create business profile"
        );
    }
};

/**
 * Fetch a paginated list of *approved* business profiles for the
 * Business tab. Defaults match the screen's UX: 10 items per page.
 *
 * Server response shape:
 *   { status: "success", data: { profiles: [...], pagination: { ... } } }
 */
export interface ListApprovedBusinessProfilesParams {
    page?: number;
    limit?: number;
    latitude: number;
    longitude: number;
    location?: string;
    search?: string;
    category?: string | null;
}

export const listApprovedBusinessProfilesApi = async ({
    page = 1,
    limit = 10,
    latitude,
    longitude,
    location,
    search,
    category,
}: ListApprovedBusinessProfilesParams) => {
    try {
        const safePage = Math.max(1, Math.floor(page));
        const safeLimit = Math.max(1, Math.min(50, Math.floor(limit)));
        const res = await axiosInstance.get("/business-profiles", {
            params: {
                page: safePage,
                limit: safeLimit,
                latitude,
                longitude,
                location: location?.trim() || undefined,
                search: search?.trim() || undefined,
                category: category || undefined,
            },
        });
        return res.data;
    } catch (error: any) {
        throw new Error(
            error?.response?.data?.message ||
                "Failed to fetch business profiles"
        );
    }
};

// Fetch the authenticated user's business profiles
export const getMyBusinessProfilesApi = async () => {
    try {
        const res = await axiosInstance.get("/business-profiles/me");
        return res.data;
    } catch (error: any) {
        throw new Error(
            error?.response?.data?.message ||
                "Failed to fetch business profiles"
        );
    }
};

/**
 * Payload for updating an existing business profile.
 *
 * Field semantics:
 *   - All text fields are optional on update — anything omitted is left
 *     as-is on the backend.
 *   - `images` is treated as a full replacement: provide URIs only when
 *     the user actually picked new ones. Mixing local URIs with already-
 *     hosted https URLs is not supported; if the user re-orders or removes
 *     existing images they must re-pick the full set.
 *   - On any successful update, the backend resets status back to
 *     "pending" so admins re-review the new content.
 */
export interface UpdateBusinessProfilePayload {
    businessName?: string;
    category?: string;
    address?: string;
    phoneNumber?: string;
    latitude?: number | null;
    longitude?: number | null;
    images?: string[]; // new local URIs only; omit to keep existing images
    primaryIndex?: number;
}

// Update an existing business profile (edit + resubmit).
// On success the backend flips status back to "pending".
export const updateBusinessProfileApi = async (
    profileId: string,
    data: UpdateBusinessProfilePayload
) => {
    try {
        const formData = new FormData();
        if (data.businessName != null)
            formData.append("businessName", data.businessName);
        if (data.category != null) formData.append("category", data.category);
        if (data.address != null) formData.append("address", data.address);
        if (data.phoneNumber != null)
            formData.append("phoneNumber", data.phoneNumber);

        if (data.latitude != null && !Number.isNaN(data.latitude)) {
            formData.append("latitude", String(data.latitude));
        }
        if (data.longitude != null && !Number.isNaN(data.longitude)) {
            formData.append("longitude", String(data.longitude));
        }

        // Only send images if the user actually picked new ones — a missing
        // images field tells the backend to keep the existing set.
        if (data.images && data.images.length > 0) {
            if (data.images.length > 5) {
                throw new Error("Cannot upload more than 5 images");
            }
            const primaryIdx = Math.max(
                0,
                Math.min(data.primaryIndex ?? 0, data.images.length - 1)
            );
            formData.append("primaryIndex", String(primaryIdx));
            data.images.slice(0, 5).forEach((uri, index) => {
                formData.append(
                    "images",
                    inferImagePart(uri, index) as unknown as Blob
                );
            });
        }

        const res = await axiosInstance.put(
            `/business-profiles/${profileId}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return res.data;
    } catch (error: any) {
        throw new Error(
            error?.response?.data?.message ||
                error?.message ||
                "Failed to update business profile"
        );
    }
};

// Delete an approved/rejected business profile. Pending profiles are locked
// until admin review completes.
export const deleteBusinessProfileApi = async (profileId: string) => {
    try {
        const res = await axiosInstance.delete(`/business-profiles/${profileId}`);
        return res.data;
    } catch (error: any) {
        throw new Error(
            error?.response?.data?.message ||
                error?.message ||
                "Failed to delete business profile"
        );
    }
};
