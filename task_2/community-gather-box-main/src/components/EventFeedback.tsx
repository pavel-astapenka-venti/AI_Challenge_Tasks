import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";

type Feedback = { id: string; rating: number; comment: string | null };
type Review = { id: string; rating: number; comment: string | null; created_at: string; user_id: string };

export function EventFeedback({ eventId, isAttendee }: { eventId: string; isAttendee: boolean }) {
  const { user } = useAuth();
  const [mine, setMine] = useState<Feedback | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [summary, setSummary] = useState<{ count: number; avg: number }>({ count: 0, avg: 0 });
  const [reviews, setReviews] = useState<Review[]>([]);

  const refresh = async () => {
    const { data: all } = await supabase.from("event_feedback")
      .select("id, rating, comment, created_at, user_id")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });
    const list = ((all as any) ?? []) as Review[];
    const count = list.length;
    const avg = count ? list.reduce((s, r) => s + r.rating, 0) / count : 0;
    setSummary({ count, avg });
    setReviews(list);

    if (user) {
      const { data } = await supabase.from("event_feedback")
        .select("id, rating, comment").eq("event_id", eventId).eq("user_id", user.id).maybeSingle();
      const f = (data as any) ?? null;
      setMine(f);
      if (f) { setRating(f.rating); setComment(f.comment ?? ""); }
    }
  };

  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, [eventId, user?.id]);

  const submit = async () => {
    if (!user || rating < 1) { toast.error("Pick a star rating"); return; }
    setSubmitting(true);
    const payload = { event_id: eventId, user_id: user.id, rating, comment: comment.trim() || null };
    const { error } = mine
      ? await supabase.from("event_feedback").update(payload).eq("id", mine.id)
      : await supabase.from("event_feedback").insert(payload);
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success(mine ? "Feedback updated" : "Thanks for your feedback!");
    refresh();
  };

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl">Feedback</h2>
        {summary.count > 0 && (
          <span className="text-sm text-muted-foreground">
            <Star className="mr-1 inline h-4 w-4 fill-primary text-primary" />
            {summary.avg.toFixed(1)} · {summary.count} review{summary.count === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {isAttendee ? (
        <Card className="mt-3 p-5">
          <p className="text-sm font-medium">{mine ? "Update your feedback" : "How was the event?"}</p>
          <div className="mt-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`}>
                <Star className={`h-7 w-7 transition ${n <= rating ? "fill-primary text-primary" : "text-muted-foreground/40"}`} />
              </button>
            ))}
          </div>
          <Textarea
            className="mt-3" placeholder="Anything you'd like to share? (optional)"
            value={comment} onChange={(e) => setComment(e.target.value)} maxLength={500} rows={3}
          />
          <div className="mt-3 flex justify-end">
            <Button onClick={submit} disabled={submitting || rating < 1}>
              {mine ? "Update" : "Submit feedback"}
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="mt-3 border-dashed p-6 text-center text-sm text-muted-foreground">
          Only confirmed attendees can leave feedback once the event ends.
        </Card>
      )}

      {reviews.length > 0 && (
        <div className="mt-6 space-y-3">
          {reviews.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className={`h-4 w-4 ${n <= r.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
                ))}
                <span className="ml-auto text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
              {r.comment && <p className="mt-2 text-sm text-foreground/90">{r.comment}</p>}
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
