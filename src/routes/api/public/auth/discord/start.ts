import { createFileRoute } from "@tanstack/react-router";

function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

export const Route = createFileRoute("/api/public/auth/discord/start")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const clientId = process.env["DISCORD_CLIENT_ID"];
        if (!clientId) {
          return new Response("Discord sign-in is not configured yet.", { status: 503 });
        }
        const url = new URL(request.url);
        const origin = url.origin;
        const state = crypto.randomUUID();
        const next = safeNext(url.searchParams.get("next"));

        const authorize = new URL("https://discord.com/oauth2/authorize");
        authorize.searchParams.set("client_id", clientId);
        authorize.searchParams.set("redirect_uri", `${origin}/api/public/auth/discord/callback`);
        authorize.searchParams.set("response_type", "code");
        authorize.searchParams.set("scope", "identify");
        authorize.searchParams.set("state", state);
        authorize.searchParams.set("prompt", "consent");

        const cookie = [
          `yuqii_oauth_state=${state}.${encodeURIComponent(next)}`,
          "Path=/",
          "HttpOnly",
          "SameSite=Lax",
          "Max-Age=600",
          url.protocol === "https:" ? "Secure" : "",
        ]
          .filter(Boolean)
          .join("; ");

        return new Response(null, {
          status: 302,
          headers: { Location: authorize.toString(), "Set-Cookie": cookie },
        });
      },
    },
  },
});
