import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { isAuthConfigured, supabase } from "../lib/supabaseClient";

const BILLING_STATUS_FUNCTION = import.meta.env.VITE_BILLING_STATUS_FUNCTION || "billing-status";

const AuthContext = createContext(null);

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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [entitlementsLoading, setEntitlementsLoading] = useState(true);
  const [planTier, setPlanTier] = useState("free");
  const [subscriptionStatus, setSubscriptionStatus] = useState("inactive");

  const refreshEntitlements = useCallback(
    async (targetUser) => {
      const effectiveUser = targetUser ?? user;

      if (!isAuthConfigured || !supabase || !effectiveUser) {
        setPlanTier("free");
        setSubscriptionStatus("inactive");
        setEntitlementsLoading(false);
        return;
      }

      setEntitlementsLoading(true);

      const { data, error } = await supabase.functions.invoke(BILLING_STATUS_FUNCTION);

      if (error) {
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
    [user]
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
      setLoading(false);
      await refreshEntitlements(sessionUser);
    }

    bootstrapAuth();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
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
      return;
    }

    await supabase.auth.signOut();
  }

  const value = useMemo(
    () => ({
      authEnabled: isAuthConfigured,
      user,
      loading,
      planTier,
      subscriptionStatus,
      entitlementsLoading,
      isPro: planTier === "pro",
      refreshEntitlements,
      signIn,
      signUp,
      signOut
    }),
    [user, loading, planTier, subscriptionStatus, entitlementsLoading, refreshEntitlements]
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
