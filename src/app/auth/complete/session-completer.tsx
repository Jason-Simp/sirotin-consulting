"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type CompletionState = "working" | "failed";

export function SessionCompleter() {
  const [state, setState] = useState<CompletionState>("working");

  useEffect(() => {
    let active = true;

    async function complete() {
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      const requestedNext = new URLSearchParams(window.location.search).get("next");
      const next = requestedNext === "/portal" ? requestedNext : "/portal";

      // Remove credentials from the visible URL and browser history before any
      // network request or navigation can accidentally preserve them.
      window.history.replaceState({}, "", window.location.pathname + window.location.search);

      if (!accessToken || !refreshToken) {
        if (active) setState("failed");
        return;
      }

      try {
        const supabase = createClient();
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) throw error;
        window.location.replace(next);
      } catch {
        if (active) setState("failed");
      }
    }

    void complete();
    return () => { active = false; };
  }, []);

  if (state === "failed") {
    return (
      <div className="login-message" role="alert">
        <strong>This sign-in link is invalid or expired.</strong>
        <span>Request a new single-use link and try again.</span>
        <Link className="button button-primary" href="/sign-in">Request a new link</Link>
      </div>
    );
  }

  return <p role="status" aria-live="polite">Verifying your secure link and loading the client communication center…</p>;
}
