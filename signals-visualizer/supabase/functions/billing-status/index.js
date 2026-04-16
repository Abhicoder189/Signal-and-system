import { requireUser, createServiceClient } from "../_shared/auth.js";
import { handleOptions, jsonResponse } from "../_shared/http.js";
import { getSubscriptionTableName, normalizeTierAndStatus } from "../_shared/subscription.js";

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) {
    return preflight;
  }

  try {
    const user = await requireUser(req);
    const supabase = createServiceClient();
    const table = getSubscriptionTableName();

    const { data, error } = await supabase
      .from(table)
      .select("plan_tier,status,current_period_end,provider,provider_subscription_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    const normalized = normalizeTierAndStatus(data);

    return jsonResponse({
      tier: normalized.tier,
      status: normalized.status,
      currentPeriodEnd: data?.current_period_end || null,
      provider: data?.provider || "razorpay",
      providerSubscriptionId: data?.provider_subscription_id || null
    });
  } catch (error) {
    return jsonResponse({ error: error.message || "Unable to read billing status." }, 400);
  }
});
