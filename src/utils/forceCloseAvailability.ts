export const FORCE_CLOSE_WAIT_MS = 24 * 60 * 60 * 1000;

export type ForceCloseAvailability = {
  canClose: boolean;
  remainingMs: number;
  label: string;
};

export function formatRemainingWait(remainingMs: number): string {
  const totalMinutes = Math.max(1, Math.ceil(remainingMs / (60 * 1000)));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  return parts.join(" ") || "1m";
}

export function getForceCloseAvailability(
  startedAt: string | Date | null | undefined,
  nowMs: number = Date.now()
): ForceCloseAvailability {
  const startMs = startedAt ? new Date(startedAt).getTime() : NaN;
  if (!Number.isFinite(startMs)) {
    return {
      canClose: false,
      remainingMs: FORCE_CLOSE_WAIT_MS,
      label: "Available after the task has been in progress for 24 hours",
    };
  }

  const remainingMs = Math.max(0, startMs + FORCE_CLOSE_WAIT_MS - nowMs);
  if (remainingMs <= 0) {
    return { canClose: true, remainingMs: 0, label: "" };
  }

  return {
    canClose: false,
    remainingMs,
    label: `Available in: ${formatRemainingWait(remainingMs)}`,
  };
}
