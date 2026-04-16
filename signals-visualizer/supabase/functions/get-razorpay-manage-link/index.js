import { requireUser, createServiceClient } from "../_shared/auth.js";
import { getEnv } from "../_shared/env.js";
import { handleOptions, jsonResponse } from "../_shared/http.js";
import { getSubscriptionTableName } from "../_shared/subscription.js";

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) {
    return preflight;
  }

  try {
    const user = await requireUser(req);

    // Razorpay does not provide an end-user billing portal like Stripe.
    // Use a hosted manage page URL from your backend/app and pass user context.
    const configuredManageUrl = getEnv("RAZORPAY_MANAGE_URL", "");
    if (configuredManageUrl) {
      const url = `${configuredManageUrl}${configuredManageUrl.includes("?") ? "&" : "?"}user_id=${encodeURIComponent(user.id)}`;
      return jsonResponse({ url });
    }

    const supabase = createServiceClient();
    const table = getSubscriptionTableName();

    const { data, error } = await supabase
      .from(table)
      .select("last_manage_url")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (data?.last_manage_url) {
      return jsonResponse({ url: data.last_manage_url });
    }

    return jsonResponse(
      {
        error:
          "No Razorpay manage URL configured. Set RAZORPAY_MANAGE_URL in Supabase function secrets."
      },
      400
    );
  } catch (error) {
    return jsonResponse({ error: error.message || "Unable to fetch manage link." }, 400);
  }
});
