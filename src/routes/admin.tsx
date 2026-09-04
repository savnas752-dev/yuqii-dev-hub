import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Section, SectionHeading } from "@/components/SectionHeading";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import type { ReviewRow } from "@/lib/queries";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin | Yuqii" },
      { name: "description", content: "Moderation dashboard for reviews and site content." },
      { property: "og:title", content: "Admin | Yuqii" },
      {
        property: "og:description",
        content: "Moderation dashboard for reviews and site content.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { isAdmin, loading, session } = useAuth();
  const queryClient = useQueryClient();

  const { data: reviews = [] } = useQuery({
    queryKey: ["admin", "reviews"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ReviewRow[];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<ReviewRow> }) => {
      const { error } = await supabase.from("reviews").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      void queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      void queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });

  if (loading) {
    return (
      <main className="pt-28">
        <Section>
          <p className="label-mono">Loading…</p>
        </Section>
      </main>
    );
  }

  if (!session || !isAdmin) {
    return (
      <main className="pt-28">
        <Section>
          <SectionHeading
            eyebrow="Admin"
            title="Not authorised"
            description="This area is restricted to administrators."
          />
        </Section>
      </main>
    );
  }

  const counts = {
    total: reviews.length,
    pending: reviews.filter((review) => review.status === "pending").length,
    approved: reviews.filter((review) => review.status === "approved").length,
  };

  return (
    <main className="pt-28">
      <Section>
        <SectionHeading
          eyebrow="Admin"
          title="Review moderation"
          description="Approve, hide, feature or delete submitted reviews."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {Object.entries(counts).map(([label, value]) => (
            <div key={label} className="card-surface p-6">
              <p className="label-mono">{label}</p>
              <p className="mt-2 text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="card-surface p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <StarRating value={review.rating} />
                <span className="font-mono text-[0.65rem] tracking-widest text-muted-foreground">
                  {review.status.toUpperCase()}
                  {review.featured ? " · FEATURED" : ""}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => update.mutate({ id: review.id, patch: { status: "approved" } })}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => update.mutate({ id: review.id, patch: { status: "rejected" } })}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => update.mutate({ id: review.id, patch: { status: "hidden" } })}
                >
                  Hide
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    update.mutate({ id: review.id, patch: { featured: !review.featured } })
                  }
                >
                  {review.featured ? "Unfeature" : "Feature"}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => remove.mutate(review.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {reviews.length === 0 && (
            <p className="text-sm text-muted-foreground">No reviews submitted yet.</p>
          )}
        </div>
      </Section>
    </main>
  );
}
