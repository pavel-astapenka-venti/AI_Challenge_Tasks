import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

/**
 * Subscribes to the signed-in user's RSVPs and shows a toast when they're
 * promoted from waitlist to confirmed. Also runs an initial check so the
 * notice appears even if the promotion happened while the user was offline.
 */
export function PromotionWatcher() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const seen = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!user) { seen.current.clear(); return; }

    let cancelled = false;

    const notify = (rsvp: { id: string; event_id: string; promoted_at: string | null; acknowledged_promotion_at: string | null; status: string; }) => {
      if (rsvp.status !== "confirmed") return;
      if (!rsvp.promoted_at) return;
      if (rsvp.acknowledged_promotion_at) return;
      if (seen.current.has(rsvp.id)) return;
      seen.current.add(rsvp.id);

      // Look up the event slug for the toast action
      supabase.from("events").select("slug, title").eq("id", rsvp.event_id).maybeSingle().then(({ data }) => {
        toast.success(`A spot opened up — you're confirmed${data?.title ? ` for ${data.title}` : ""}!`, {
          duration: 10000,
          action: data?.slug ? {
            label: "View ticket",
            onClick: () => navigate({ to: "/events/$slug", params: { slug: data.slug } }),
          } : undefined,
        });
        supabase.rpc("acknowledge_promotion", { _rsvp_id: rsvp.id });
      });
    };

    const sweep = () => {
      supabase
        .from("rsvps")
        .select("id, event_id, status, promoted_at, acknowledged_promotion_at")
        .eq("user_id", user.id)
        .eq("status", "confirmed")
        .not("promoted_at", "is", null)
        .is("acknowledged_promotion_at", null)
        .then(({ data }) => {
          if (cancelled || !data) return;
          data.forEach(notify);
        });
    };

    sweep();
    const interval = window.setInterval(sweep, 30000);

    return () => { cancelled = true; window.clearInterval(interval); };
  }, [user, navigate]);

  return null;
}
