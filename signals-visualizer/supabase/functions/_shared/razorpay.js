import { requireEnv } from "./env.js";

export function razorpayAuthHeader() {
  const keyId = requireEnv("RAZORPAY_KEY_ID");
  const keySecret = requireEnv("RAZORPAY_KEY_SECRET");
  const credentials = btoa(`${keyId}:${keySecret}`);
  return `Basic ${credentials}`;
}

export async function razorpayRequest(path, payload) {
  const response = await fetch(`https://api.razorpay.com${path}`, {
    method: "POST",
    headers: {
      Authorization: razorpayAuthHeader(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body?.error?.description || body?.error?.reason || "Razorpay request failed.";
    throw new Error(message);
  }

  return body;
}
