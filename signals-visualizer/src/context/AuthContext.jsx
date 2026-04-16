import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { isAuthConfigured, supabase } from "../lib/supabaseClient";

const BILLING_STATUS_FUNCTION = import.meta.env.VITE_BILLING_STATUS_FUNCTION || "billing-status";
const SIGN_OUT_TIMEOUT_MS = 1500;

const AuthContext = createContext(null);

function isUnauthorizedInvokeError(error) {
  if (!error) return false;

  const message = String(error.message || "").toLowerCase();
  if (message.includes("401") || message.includes("unauthorized")) {
    return true;
  }

  const status = error?.context?.status;
  return status === 401;
}

function parseBillingStatus(data, user) {
  const metadataPlan =
    user?.user_metadata?.plan || user?.app_metadata?.plan || user?.user_metadata?.tier;

  const tier = data?.tier || data?.plan || metadataPlan || "free";
  const status = data?.status || (tier === "pro" ? "active" : "inactive");
  const normalizedTier = String(tier).toLowerCase();
  const normalizedStatus = String(status).toLowerCase();
  const isPro =
    normalizedTier === "pro" || normalizedStatus === "active" || normalizedStatus === "trialing";

  return {
    tier: isPro ? "pro" : "free",
    status: normalizedStatus
  };
}

function isEmailConfirmed(user) {
  if (!user) return false;
  // Check if email is confirmed (user_metadata.email_verified or confirmed_at timestamp)
  return (
    user.email_confirmed_at !== null ||
    user.user_metadata?.email_verified === true ||
    user.confirmed_at !== null
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [entitlementsLoading, setEntitlementsLoading] = useState(true);
  const [planTier, setPlanTier] = useState("free");
  const [subscriptionStatus, setSubscriptionStatus] = useState("inactive");
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const signingOutRef = useRef(false);

  const resetLocalAuthState = useCallback(() => {
    setUser(null);
    setEmailConfirmed(false);
    setPlanTier("free");
    setSubscriptionStatus("inactive");
    setEntitlementsLoading(false);
    setLoading(false);
  }, []);

  const refreshEntitlements = useCallback(
    async (targetUser) => {
      const effectiveUser = targetUser ?? user;

      if (signingOutRef.current) {
        setEntitlementsLoading(false);
        return;
      }

      if (!isAuthConfigured || !supabase || !effectiveUser) {
        setPlanTier("free");
        setSubscriptionStatus("inactive");
        setEntitlementsLoading(false);
        return;
      }

      setEntitlementsLoading(true);

      const { data, error } = await supabase.functions.invoke(BILLING_STATUS_FUNCTION);

      if (error) {
        if (isUnauthorizedInvokeError(error)) {
          void supabase.auth.signOut({ scope: "local" });
          resetLocalAuthState();
          return;
        }

        const parsed = parseBillingStatus(null, effectiveUser);
        setPlanTier(parsed.tier);
        setSubscriptionStatus(parsed.status);
        setEntitlementsLoading(false);
        return;
      }

      const parsed = parseBillingStatus(data, effectiveUser);
      setPlanTier(parsed.tier);
      setSubscriptionStatus(parsed.status);
      setEntitlementsLoading(false);
    },
    [user, resetLocalAuthState]
  );

  useEffect(() => {
    let mounted = true;

    if (!isAuthConfigured || !supabase) {
      setLoading(false);
      setEntitlementsLoading(false);
      return undefined;
    }

    async function bootstrapAuth() {
      const { data } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser);
      setEmailConfirmed(isEmailConfirmed(sessionUser));
      setLoading(false);
      await refreshEntitlements(sessionUser);
    }

    bootstrapAuth();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      setEmailConfirmed(isEmailConfirmed(nextUser));
      setLoading(false);
      await refreshEntitlements(nextUser);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [refreshEntitlements]);

  async function signIn(email, password) {
    if (!isAuthConfigured || !supabase) {
      return { error: { message: "Supabase auth is not configured." } };
    }

    const result = await supabase.auth.signInWithPassword({ email, password });
    return { error: result.error ?? null };
  }

  async function signUp(email, password) {
    if (!isAuthConfigured || !supabase) {
      return { error: { message: "Supabase auth is not configured." } };
    }

    const result = await supabase.auth.signUp({ email, password });
    return { error: result.error ?? null, data: result.data ?? null };
  }

  async function signOut() {
    if (!isAuthConfigured || !supabase) {
      return { error: { message: "Supabase auth is not configured." } };
    }

    signingOutRef.current = true;
    resetLocalAuthState();

    const signOutPromise = supabase.auth.signOut({ scope: "local" });
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => resolve({ timedOut: true, error: null }), SIGN_OUT_TIMEOUT_MS);
    });

    let result;
    try {
      result = await Promise.race([
        signOutPromise
          .then(({ error }) => ({ timedOut: false, error }))
          .catch((error) => ({ timedOut: false, error })),
        timeoutPromise
      ]);
    } catch (error) {
      signingOutRef.current = false;
      return { error: { message: error?.message || "Unable to sign out." } };
    }

    if (result.timedOut) {
      // Keep trying to invalidate local auth in the background, but don't block UI.
      void signOutPromise.finally(() => {
        signingOutRef.current = false;
      });
      return { error: null };
    }

    signingOutRef.current = false;

    return { error: result.error };
  }

  async function resendConfirmationEmail(email) {
    if (!isAuthConfigured || !supabase) {
      return { error: { message: "Supabase auth is not configured." } };
    }

    const { error } = await supabase.auth.resend({
      type: "signup",
      email
    });

    return { error };
  }

  const value = useMemo(
    () => ({
      authEnabled: isAuthConfigured,
      user,
      loading,
      planTier,
      subscriptionStatus,
      entitlementsLoading,
      emailConfirmed,
      isPro: planTier === "pro",
      refreshEntitlements,
      signIn,
      signUp,
      signOut,
      resendConfirmationEmail
    }),
    [user, loading, planTier, subscriptionStatus, entitlementsLoading, emailConfirmed, refreshEntitlements]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
