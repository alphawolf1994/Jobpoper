// Helpers for rendering a job's `category` field across different render
// sites. The backend may return `category` as either a populated object
// (`{ _id, name, slug, icon }`), a raw ObjectId string, or null/undefined.
// Frontend code should always go through these helpers so behavior stays
// consistent and we never accidentally render an ObjectId hex string.

import { ServiceCategory } from "../interface/interfaces";

type AdminCategory = {
  id?: string;
  _id?: string;
  name?: string;
  slug?: string;
  icon?: string;
};

type RawCategory =
  | ServiceCategory
  | AdminCategory
  | string
  | null
  | undefined;

interface JobLike {
  category?: RawCategory;
}

/**
 * Returns a human-readable category name for a job, or `null` when no
 * category is set (or the value is an unresolved ObjectId string).
 */
export const getJobCategoryName = (job?: JobLike | null): string | null => {
  if (!job) return null;
  const cat = job.category as RawCategory;
  if (!cat) return null;
  if (typeof cat === "string") {
    // Raw ObjectId hex — caller should treat as "no resolvable name".
    return null;
  }
  if (typeof cat === "object" && typeof cat.name === "string" && cat.name.trim()) {
    return cat.name.trim();
  }
  return null;
};
