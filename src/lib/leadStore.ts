// Shared lead state for the unified Gift Claim → Enrollment flow.
// Persists Name + Mobile (and the partial enrollments.id) in localStorage so
// returning users can skip Step 1 of the enrollment dialog.

const KEY = "binary:lead";
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
export const LEAD_EVENT = "binary:lead-updated";

export type Lead = {
  enrollmentId?: string | null;
  full_name: string;
  mobile_number: string;
  createdAt: string;
};

const isBrowser = () => typeof window !== "undefined";

export function getLead(): Lead | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Lead;
    if (!parsed?.full_name || !parsed?.mobile_number) return null;
    if (Date.now() - new Date(parsed.createdAt).getTime() > TTL_MS) {
      localStorage.removeItem(KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setLead(patch: Partial<Lead>) {
  if (!isBrowser()) return;
  const existing = getLead();
  const next: Lead = {
    full_name: patch.full_name ?? existing?.full_name ?? "",
    mobile_number: patch.mobile_number ?? existing?.mobile_number ?? "",
    enrollmentId: patch.enrollmentId ?? existing?.enrollmentId ?? null,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(LEAD_EVENT));
}

export function clearLead() {
  if (!isBrowser()) return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent(LEAD_EVENT));
}
