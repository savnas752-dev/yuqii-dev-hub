import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Section, SectionHeading } from "@/components/SectionHeading";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { myReviewQuery } from "@/lib/queries";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile | Yuqii" },
      {
        name: "description",
        content: "Your Discord profile on Yuqii, including the review you have submitted.",
      },
      { property: "og:title", content: "Your Profile | Yuqii" },
      {
        property: "og:description",
        content: "Your Discord profile on Yuqii, including the review you have submitted.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { session, profile, userId, loading, signInWithDiscord } = useAuth();
  const { data: myReview } = useQuery(myReviewQuery(userId));

  if (loading) {
    return (
      <main className="pt-28">
        <Section>
          <p className="label-mono">Loading…</p>
        </Section>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="pt-28">
        <Section>
          <SectionHeading
            eyebrow="Profile"
            title="Sign in required"
            description="Sign in with Discord to view your profile and reviews."
          />
          <Button className="mt-8" onClick={signInWithDiscord}>
            Continue with Discord
          </Button>
        </Section>
      </main>
    );
  }

  return (
    <main className="pt-28">
      <Section>
        <SectionHeading eyebrow="Profile" title="Your account" />
        <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="card-surface flex items-center gap-4 p-6">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                className="h-16 w-16 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full border border-border bg-secondary" />
            )}
            <div>
              <p className="font-mono text-sm text-foreground">
                {profile?.discord_username ?? "user"}
              </p>
              <p className="mt-1 font-mono text-[0.65rem] text-primary">✓ Verified Discord</p>
              {profile?.created_at && (
                <p className="mt-1 font-mono text-[0.65rem] text-muted-foreground">
                  Joined{" "}
                  {new Date(profile.created_at).toLocaleDateString("en-GB", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>

          <div id="my-reviews" className="card-surface p-6">
            <p className="label-mono">My Reviews</p>
            {myReview ? (
              <div className="mt-4">
                <StarRating value={myReview.rating} />
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {myReview.body}
                </p>
                <p className="mt-3 font-mono text-[0.65rem] text-muted-foreground">
                  Status: {myReview.status.toUpperCase()}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                You haven't written a review yet.
              </p>
            )}
          </div>
        </div>
      </Section>
    </main>
  );
}
