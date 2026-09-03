import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Signing in — Yuqii" },
      { name: "description", content: "Completing your Discord sign-in for Yuqii." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Finishing sign-in…");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    if (error) {
      setMessage(error);
      return;
    }
    const tokenHash = params.get("token_hash");
    const next = params.get("next") ?? "/";
    if (!tokenHash) {
      setMessage("Sign-in link was incomplete. Please try again.");
      return;
    }
    void supabase.auth
      .verifyOtp({ token_hash: tokenHash, type: "email" })
      .then(({ error: verifyError }) => {
        if (verifyError) {
          setMessage("Sign-in could not be completed. Please try again.");
          return;
        }
        const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
        window.location.replace(safeNext);
      });
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="card-surface max-w-md px-8 py-10 text-center">
        <p className="label-mono">Discord</p>
        <h1 className="mt-3 text-2xl font-semibold">{message}</h1>
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          visitor@yuqii:~$ auth --provider discord
        </p>
      </div>
    </main>
  );
}
