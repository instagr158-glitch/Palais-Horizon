import type { Session } from "next-auth";

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

type SubShape = {
  subscriptionStatus?: string | null;
  currentPeriodEnd?: string | Date | null;
};

/**
 * Single source of truth for "can this account see member-only data".
 * Used in middleware, server components and route handlers (defence in depth).
 */
export function hasActiveSubscription(user: SubShape | null | undefined): boolean {
  if (!user) return false;
  if (!user.subscriptionStatus || !ACTIVE_STATUSES.has(user.subscriptionStatus)) {
    return false;
  }
  if (!user.currentPeriodEnd) return true; // trialing before first invoice
  const end =
    user.currentPeriodEnd instanceof Date
      ? user.currentPeriodEnd
      : new Date(user.currentPeriodEnd);
  // small grace window for webhook lag
  return end.getTime() + 24 * 60 * 60 * 1000 > Date.now();
}

export function sessionIsMember(session: Session | null): boolean {
  return hasActiveSubscription(session?.user);
}
