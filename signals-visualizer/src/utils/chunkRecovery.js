const CHUNK_RELOAD_KEY = "sv:chunk-reload";

export function isChunkLoadError(input) {
  const message = String(input?.message || input || "");

  return (
    message.includes("Failed to fetch dynamically imported module") ||
    message.includes("Importing a module script failed") ||
    message.includes("Loading chunk") ||
    message.includes("ChunkLoadError")
  );
}

export function maybeRecoverFromChunkError() {
  if (typeof window === "undefined") {
    return false;
  }

  const hasRefreshed = sessionStorage.getItem(CHUNK_RELOAD_KEY) === "1";
  if (hasRefreshed) {
    sessionStorage.setItem(CHUNK_RELOAD_KEY, "0");
    return false;
  }

  sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
  window.location.reload();
  return true;
}

export function clearChunkRecoveryFlag() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(CHUNK_RELOAD_KEY, "0");
  }
}

export function installChunkRecoveryHandlers() {
  if (typeof window === "undefined") {
    return;
  }

  window.addEventListener("error", (event) => {
    if (isChunkLoadError(event?.error || event?.message)) {
      maybeRecoverFromChunkError();
    }
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event?.reason;
    if (isChunkLoadError(reason)) {
      maybeRecoverFromChunkError();
    }
  });
}
