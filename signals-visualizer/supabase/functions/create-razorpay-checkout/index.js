import { requireUser, createServiceClient } from "../_shared/auth.js";
import { getEnv } from "../_shared/env.js";
import { handleOptions, jsonResponse } from "../_shared/http.js";
import { razorpayRequest } from "../_shared/razorpay.js";
import { getSubscriptionTableName } from "../_shared/subscription.js";

function toPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(String(value ?? fallback), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return Number.parseInt(String(fallback), 10);
  }
  return parsed;
}

function isHttpUrl(value) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function resolveCallbackUrl(req) {
  const configuredRedirect = getEnv("RAZORPAY_SUCCESS_REDIRECT", "");
  if (isHttpUrl(configuredRedirect)) {
    return configuredRedirect;
  }

  const appBaseUrl = getEnv("APP_BASE_URL", "");
  if (isHttpUrl(appBaseUrl)) {
    const base = appBaseUrl.replace(/\/$/, "");
    return `${base}/billing`;
  }

  const originHeader = req.headers.get("origin") || "";
  if (isHttpUrl(originHeader)) {
    const base = originHeader.replace(/\/$/, "");
    return `${base}/billing`;
  }

  return null;
}

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

    const amount = toPositiveInteger(getEnv("RAZORPAY_PRO_PRICE_PAISE", "19900"), 19900);
    const currency = String(getEnv("RAZORPAY_CURRENCY", "INR")).toUpperCase();
    const callbackUrl = resolveCallbackUrl(req);

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
      notes: {
        user_id: user.id,
        plan_tier: "pro"
      }
    };

    if (callbackUrl) {
      payload.callback_url = callbackUrl;
      payload.callback_method = "get";
    }

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
