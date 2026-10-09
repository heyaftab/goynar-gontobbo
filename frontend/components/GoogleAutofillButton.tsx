"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

interface CredentialResponse {
  credential: string;
}

interface GoogleIdentityApi {
  initialize: (options: { client_id: string; callback: (response: CredentialResponse) => void }) => void;
  renderButton: (element: HTMLElement, options: { type: "standard"; theme: "outline"; size: "large"; text: "continue_with"; shape: "rectangular"; width: number }) => void;
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleIdentityApi } };
  }
}

export function GoogleAutofillButton({ purpose = "autofill", onAutofill, onError }: {
  purpose?: "autofill" | "login";
  onAutofill: (profile: { name: string; email: string }) => void;
  onError: (message: string) => void;
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scriptFailed, setScriptFailed] = useState(false);
  useEffect(() => {
    const buttonContainer = document.getElementById("google-autofill-button");
    const googleId = window.google?.accounts.id;
    if (!clientId || !scriptLoaded || !buttonContainer || !googleId) return;

    googleId.initialize({
      client_id: clientId,
      callback: async ({ credential }) => {
        setLoading(true);
        try {
          const response = await fetch(purpose === "login" ? "/api/auth/session" : "/api/auth/google-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential }),
          });
          const result = await response.json() as { name?: string; email?: string; message?: string };
          if (!response.ok || !result.name || !result.email) {
            throw new Error(result.message || "We couldn't verify this Google account.");
          }
          onAutofill({ name: result.name, email: result.email });
        } catch (error) {
          onError(error instanceof Error ? error.message : "Google autofill failed. Please enter your details manually.");
        } finally {
          setLoading(false);
        }
      },
    });
    buttonContainer.replaceChildren();
    googleId.renderButton(buttonContainer, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      width: Math.min(420, Math.floor(buttonContainer.getBoundingClientRect().width)),
    });
  }, [clientId, onAutofill, onError, purpose, scriptLoaded]);

  if (!clientId) {
    return <p className="rounded-lg border border-border bg-cream px-4 py-3 text-center text-xs leading-5 text-muted">Google autofill can be enabled by setting <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> in the frontend and <code>GOOGLE_CLIENT_ID</code> on the server.</p>;
  }

  return (
    <div>
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={() => setScriptLoaded(true)} onError={() => setScriptFailed(true)} />
      {scriptFailed ? <p role="status" className="text-center text-sm text-muted">Google could not load. You can still enter your details below.</p> : <div id="google-autofill-button" className="flex min-h-10 justify-center" />}
      {loading && <p role="status" className="mt-2 text-center text-xs text-muted">Verifying your Google account…</p>}
    </div>
  );
}
