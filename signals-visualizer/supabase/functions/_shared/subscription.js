import { getEnv } from "./env.js";

export function getSubscriptionTableName() {
  return getEnv("BILLING_SUBSCRIPTIONS_TABLE", "user_subscriptions");
}

export function normalizeTierAndStatus(row) {
  const rowTier = String(row?.plan_tier || "free").toLowerCase();
  const rowStatus = String(row?.status || "inactive").toLowerCase();
  const isPro = rowTier === "pro" || ["active", "trialing", "paid"].includes(rowStatus);

  return {
    tier: isPro ? "pro" : "free",
    status: isPro ? (rowStatus === "inactive" ? "active" : rowStatus) : "inactive"
  };
}
