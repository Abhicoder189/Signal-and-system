import { createServiceClient } from "../_shared/auth.js";
import { requireEnv, getEnv } from "../_shared/env.js";
import { handleOptions, jsonResponse } from "../_shared/http.js";
import { getSubscriptionTableName } from "../_shared/subscription.js";

function toHex(bytes) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function signHmacSha256(text, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(text));
  return toHex(new Uint8Array(signatureBuffer));
}

function getUserIdFromPayload(payload) {
  return (
    payload?.payload?.payment_link?.entity?.notes?.user_id ||
    payload?.payload?.payment?.entity?.notes?.user_id ||
    payload?.payload?.subscription?.entity?.notes?.user_id ||
    null
  );
}

function getPaymentLinkId(payload) {
  return payload?.payload?.payment_link?.entity?.id || null;
}

function deriveBillingUpdate(payload) {
  const event = String(payload?.event || "");
  const subscription = payload?.payload?.subscription?.entity;

  let planTier = "free";
  let status = "inactive";

  if (
    [
      "payment_link.paid",
      "payment.captured",
      "subscription.authenticated",
      "subscription.charged",
      "subscription.activated"
    ].includes(event)
  ) {
    planTier = "pro";
    status = "active";
  }

  if (["subscription.cancelled", "subscription.halted", "subscription.completed"].includes(event)) {
    planTier = "free";
    status = "inactive";
  }

  let currentPeriodEnd = null;
  if (subscription?.current_end) {
    currentPeriodEnd = new Date(subscription.current_end * 1000).toISOString();
  }

  return {
    event,
    planTier,
    status,
    providerSubscriptionId: subscription?.id || null,
    providerCustomerId: subscription?.customer_id || null,
    currentPeriodEnd
  };
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
    const bodyText = await req.text();
    const payload = JSON.parse(bodyText);

    const webhookSecret = requireEnv("RAZORPAY_WEBHOOK_SECRET");
    const receivedSignature = req.headers.get("x-razorpay-signature");

    if (!receivedSignature) {
      throw new Error("Missing x-razorpay-signature header.");
    }

    const computedSignature = await signHmacSha256(bodyText, webhookSecret);
    if (computedSignature !== receivedSignature) {
      throw new Error("Invalid Razorpay webhook signature.");
    }

    const billing = deriveBillingUpdate(payload);
    const supabase = createServiceClient();
    const table = getSubscriptionTableName();
    const manageUrl = getEnv("RAZORPAY_MANAGE_URL", null);
    const paymentLinkId = getPaymentLinkId(payload);

    let userId = getUserIdFromPayload(payload);
    if (!userId && paymentLinkId) {
      const { data: matchedRow, error: lookupError } = await supabase
        .from(table)
        .select("user_id")
        .eq("checkout_link_id", paymentLinkId)
        .maybeSingle();

      if (lookupError) {
        throw lookupError;
      }

      userId = matchedRow?.user_id || null;
    }

    if (!userId) {
      return jsonResponse({ ok: true, skipped: true, reason: "No user mapping found for Razorpay webhook." });
    }

    const { error } = await supabase.from(table).upsert(
      {
        user_id: userId,
        provider: "razorpay",
        plan_tier: billing.planTier,
        status: billing.status,
        provider_subscription_id: billing.providerSubscriptionId,
        provider_customer_id: billing.providerCustomerId,
        current_period_end: billing.currentPeriodEnd,
        last_manage_url: manageUrl,
        checkout_link_id: paymentLinkId,
        last_webhook_event: billing.event,
        last_webhook_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { onConflict: "user_id" }
    );

    if (error) {
      throw error;
    }

    return jsonResponse({ ok: true, event: billing.event, userId, paymentLinkId });
  } catch (error) {
    return jsonResponse({ error: error.message || "Webhook handling failed." }, 400);
  }
});
