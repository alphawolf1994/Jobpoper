import { Job } from "../interface/interfaces";

type JobSeekerSource = Partial<Job> | null | undefined;

const isTruthyOnBehalfFlag = (value: unknown): boolean =>
  value === true || value === "true" || value === 1 || value === "1";

/** True when this job was posted for someone who is not the app user. */
export const isJobPostedOnBehalf = (job?: JobSeekerSource): boolean => {
  if (!job) return false;
  const seekerName = job.externalContact?.name?.trim();
  return !!(seekerName || isTruthyOnBehalfFlag(job.postedOnBehalf));
};

/** Task seeker name for list cards, details, and "Posted by" rows. */
export const getJobSeekerDisplayName = (job?: JobSeekerSource): string => {
  const seekerName = job?.externalContact?.name?.trim();
  if (seekerName) return seekerName;
  return (
    job?.postedBy?.profile?.fullName ||
    "Unknown"
  );
};

export const getJobSeekerInitials = (job?: JobSeekerSource): string => {
  const name = getJobSeekerDisplayName(job);
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return initials || "U";
};
