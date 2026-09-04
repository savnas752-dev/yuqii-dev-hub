import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, Star, Trash2 } from "lucide-react";
import { Section, SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { approvedReviewsQuery, myReviewQuery, sanitizeText } from "@/lib/queries";
import { toast } from "sonner";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function ReviewsSection() {
  const { session, profile, userId, signInWithDiscord } = useAuth();
  const queryClient = useQueryClient();
  const { data: reviews = [] } = useQuery(approvedReviewsQuery);
  const { data: myReview } = useQuery(myReviewQuery(userId));

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating);
      setBody(myReview.body);
    }
  }, [myReview]);

  const save = useMutation({
    mutationFn: async () => {
      const clean = sanitizeText(body);
      if (clean.length < 20) throw new Error("Please write at least 20 characters.");
      if (clean.length > 1000) throw new Error("Reviews are limited to 1000 characters.");
      if (myReview) {
        const { error } = await supabase
          .from("reviews")
          .update({ rating, body: clean, status: "pending" })
          .eq("id", myReview.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("reviews")
          .insert({ user_id: userId!, rating, body: clean });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Review submitted — it will appear once approved.");
      setOpen(false);
      setConfirming(false);
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error: Error) => {
      setConfirming(false);
      toast.error(error.message);
    },
  });

  const remove = useMutation({
    mutationFn: async () => {
      if (!myReview) return;
      const { error } = await supabase.from("reviews").delete().eq("id", myReview.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Review deleted.");
      setBody("");
      setRating(5);
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <Section id="reviews">
      <SectionHeading
        eyebrow="09 / Reviews & Community"
        title="Reviews & Community"
        description="This portfolio is also a place for people I've worked with and helped to share their experience."
      />

      <div className="mt-10">
        {session ? (
          <Button onClick={() => setOpen((value) => !value)} className="shadow-glow">
            {myReview ? "Edit Your Review" : "Write a Review"}
          </Button>
        ) : (
          <Button onClick={signInWithDiscord} className="shadow-glow">
            Sign in with Discord to leave a review
          </Button>
        )}
      </div>

      {session && open ? (
        <div className="card-surface mt-6 max-w-2xl p-6">
          <p className="label-mono">Rating</p>
          <div className="mt-3 flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`${value} star${value > 1 ? "s" : ""}`}
                onClick={() => setRating(value)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-6 w-6 ${
                    value <= rating ? "fill-primary text-primary" : "text-muted-foreground"
                  }`}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>

          <label htmlFor="review-body" className="label-mono mt-6 block">
            Review
          </label>
          <textarea
            id="review-body"
            value={body}
            maxLength={1000}
            onChange={(event) => setBody(event.target.value)}
            rows={5}
            className="mt-3 w-full rounded-2xl border border-border bg-surface/70 p-4 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            placeholder="Share your experience…"
          />
          <p className="mt-2 font-mono text-[0.7rem] text-muted-foreground">
            {body.length}/1000 — reviews are published after approval.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {confirming ? (
              <>
                <span className="font-mono text-xs text-muted-foreground">Submit this review?</span>
                <Button onClick={() => save.mutate()} disabled={save.isPending}>
                  Confirm
                </Button>
                <Button variant="secondary" onClick={() => setConfirming(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setConfirming(true)}>Submit Review</Button>
            )}
            {myReview ? (
              <Button
                variant="ghost"
                className="gap-2 text-muted-foreground"
                onClick={() => remove.mutate()}
                disabled={remove.isPending}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      {myReview && myReview.status !== "approved" ? (
        <p className="mt-5 font-mono text-xs text-muted-foreground">
          Your review status: {myReview.status.toUpperCase()}
        </p>
      ) : null}

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews published yet.</p>
        ) : (
          reviews.map((review, index) => (
            <Reveal key={review.id} delay={index * 60}>
              <article className="card-surface card-interactive h-full p-6">
                <StarRating value={review.rating} />
                <p className="mt-4 text-sm leading-relaxed text-foreground">"{review.body}"</p>
                <div className="mt-6 flex items-center gap-3">
                  {review.profiles?.avatar_url ? (
                    <img
                      src={review.profiles.avatar_url}
                      alt={`${review.profiles.discord_username} avatar`}
                      className="h-9 w-9 rounded-full border border-border"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full border border-border bg-surface" />
                  )}
                  <div className="font-mono text-[0.7rem] leading-relaxed">
                    <p className="text-foreground">
                      {review.profiles?.discord_username ?? "Discord user"}
                    </p>
                    <p className="flex items-center gap-1 text-primary">
                      <BadgeCheck className="h-3 w-3" aria-hidden="true" /> Verified Discord
                    </p>
                    <p className="text-muted-foreground">{formatDate(review.created_at)}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))
        )}
      </div>

      {profile ? null : null}
    </Section>
  );
}
