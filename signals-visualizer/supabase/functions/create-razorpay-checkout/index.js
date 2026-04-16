import { requireUser, createServiceClient } from "../_shared/auth.js";
import { getEnv } from "../_shared/env.js";
import { handleOptions, jsonResponse } from "../_shared/http.js";
import { razorpayRequest } from "../_shared/razorpay.js";
import { getSubscriptionTableName } from "../_shared/subscription.js";

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) {
    return preflight;
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  try {
    const user = await requireUser(req);
    const supabase = createServiceClient();
    const table = getSubscriptionTableName();

    const amount = Number(getEnv("RAZORPAY_PRO_PRICE_PAISE", "19900"));
    const currency = getEnv("RAZORPAY_CURRENCY", "INR");
    const appBaseUrl = getEnv("APP_BASE_URL", "http://localhost:5173");
    const callbackUrl = getEnv("RAZORPAY_SUCCESS_REDIRECT", `${appBaseUrl}/billing`);

    const description = getEnv("RAZORPAY_PRODUCT_DESCRIPTION", "Signals Visualizer Pro");

    const payload = {
      amount,
      currency,
      description,
      customer: {
        name: user.user_metadata?.full_name || user.email || "Signals Visualizer User",
        email: user.email
      },
      notify: {
        email: true,
        sms: false
      },
      callback_url: callbackUrl,
      callback_method: "get",
      notes: {
        user_id: user.id,
        plan_tier: "pro"
      }
    };

    const link = await razorpayRequest("/v1/payment_links", payload);
    const paymentUrl = link.short_url || link.payment_url || link.url;

    if (!paymentUrl) {
      throw new Error("Razorpay did not return a payment url.");
    }

    const { error: upsertError } = await supabase.from(table).upsert(
      {
        user_id: user.id,
        provider: "razorpay",
        plan_tier: "free",
        status: "pending",
        checkout_link_id: link.id || null,
        updated_at: new Date().toISOString()
      },
      { onConflict: "user_id" }
    );

    if (upsertError) {
      throw upsertError;
    }

    return jsonResponse({
      url: paymentUrl,
      provider: "razorpay",
      checkoutLinkId: link.id || null
    });
  } catch (error) {
    return jsonResponse({ error: error.message || "Unable to create Razorpay checkout." }, 400);
  }
});
