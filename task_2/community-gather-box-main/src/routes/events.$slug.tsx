import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { TicketCard } from "@/components/TicketCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Globe, Users, Clock, Share2 } from "lucide-react";
import { toast } from "sonner";
import { EventGallery } from "@/components/EventGallery";
import { EventFeedback } from "@/components/EventFeedback";
import { ReportButton } from "@/components/ReportButton";

type EventDetail = {
  id: string; slug: string; title: string; description: string | null;
  start_at: string; end_at: string; time_zone: string;
  is_online: boolean; location: string | null; online_url: string | null;
  capacity: number | null; cover_image_url: string | null; visibility: string;
  host: { name: string; slug: string; logo_url: string | null; bio: string | null } | null;
};

type RsvpRow = { id: string; status: "confirmed" | "waitlist" | "cancelled"; ticket_code: string; checked_in_at: string | null };

export const Route = createFileRoute("/events/$slug")({
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("events")
      .select("*, host:host_profiles(name, slug, logo_url, bio)")
      .eq("slug", params.slug)
      .eq("status", "published")
      .is("hidden_at", null)
      .maybeSingle();
    if (!data) throw notFound();
    return { event: data as unknown as EventDetail };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const e = loaderData.event;
    const desc = (e.description ?? `Hosted by ${e.host?.name ?? "a community host"}`).slice(0, 160);
    const meta: Array<Record<string, string>> = [
      { title: `${e.title} — Gather` },
      { name: "description", content: desc },
      { property: "og:title", content: e.title },
      { property: "og:description", content: desc },
      { property: "og:type", content: "event" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: e.title },
      { name: "twitter:description", content: desc },
    ];
    if (e.cover_image_url) {
      meta.push({ property: "og:image", content: e.cover_image_url });
      meta.push({ name: "twitter:image", content: e.cover_image_url });
    }
    return { meta };
  },
  notFoundComponent: () => (
    <Page>
      <div className="mx-auto max-w-md p-12 text-center">
        <h1 className="font-serif text-3xl">Event not found</h1>
        <p className="mt-2 text-muted-foreground">It may have been removed or is still a draft.</p>
        <Button asChild className="mt-6"><Link to="/">Back home</Link></Button>
      </div>
    </Page>
  ),
  errorComponent: ({ error }) => (
    <Page><p className="p-12 text-center text-muted-foreground">{error.message}</p></Page>
  ),
  component: EventPage,
});

function EventPage() {
  const { event } = Route.useLoaderData();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const start = new Date(event.start_at);
  const end = new Date(event.end_at);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const ended = mounted ? end.getTime() < Date.now() : false;

  const [rsvp, setRsvp] = useState<RsvpRow | null>(null);
  const [confirmedCount, setConfirmedCount] = useState<number>(0);
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    const { data: countData } = await supabase.rpc("get_event_confirmed_count", { _event_id: event.id });
    setConfirmedCount((countData as number | null) ?? 0);

    if (user) {
      const { data } = await supabase.from("rsvps")
        .select("id, status, ticket_code, checked_in_at")
        .eq("event_id", event.id).eq("user_id", user.id).maybeSingle();
      setRsvp((data as RsvpRow) ?? null);
    } else {
      setRsvp(null);
    }
  };

  useEffect(() => { if (!authLoading) refresh(); /* eslint-disable-next-line */ }, [user?.id, authLoading, event.id]);

  const handleRsvp = async () => {
    if (!user) {
      navigate({ to: "/login", search: { redirect: `/events/${event.slug}` } });
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.rpc("create_rsvp", { _event_id: event.id });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    const row = data as unknown as RsvpRow;
    setRsvp(row);
    toast.success(row.status === "confirmed" ? "You're in! Ticket ready below." : "Event is full — added to waitlist.");
    refresh();
  };

  const handleCancel = async () => {
    setBusy(true);
    const { error } = await supabase.rpc("cancel_rsvp", { _event_id: event.id });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("RSVP cancelled");
    refresh();
  };

  const spotsLeft = event.capacity != null ? Math.max(0, event.capacity - confirmedCount) : null;
  const active = rsvp && rsvp.status !== "cancelled";

  return (
    <Page>
      <article className="mx-auto max-w-3xl px-4 py-10">
        {event.cover_image_url && (
          <div className="relative mb-8">
            <img src={event.cover_image_url} alt={event.title}
                 className={`aspect-[16/9] w-full rounded-3xl object-cover shadow-soft ${ended ? "grayscale" : ""}`} />
            {ended && <Badge variant="secondary" className="absolute left-4 top-4 bg-foreground/80 text-background">Ended</Badge>}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-4xl md:text-5xl">{event.title}</h1>
          {ended && !event.cover_image_url && <Badge variant="secondary">Ended</Badge>}
        </div>
        {event.host && (
          <p className="mt-3 text-muted-foreground">
            Hosted by <Link to="/hosts/$slug" params={{ slug: event.host.slug }} className="font-medium text-foreground hover:underline">{event.host.name}</Link>
          </p>
        )}

        <Card className="mt-8 grid gap-4 p-6 sm:grid-cols-2">
          <Detail icon={<Calendar className="h-4 w-4" />} label="Date">
            <span suppressHydrationWarning>
              {start.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </span>
          </Detail>
          <Detail icon={<Clock className="h-4 w-4" />} label="Time">
            <span suppressHydrationWarning>
              {start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} – {end.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
            </span>
            <span className="ml-1 text-xs text-muted-foreground">({event.time_zone})</span>
          </Detail>
          <Detail icon={event.is_online ? <Globe className="h-4 w-4" /> : <MapPin className="h-4 w-4" />} label={event.is_online ? "Online" : "Venue"}>
            {event.is_online
              ? (active && rsvp?.status === "confirmed" && event.online_url
                  ? <a href={event.online_url} className="text-primary hover:underline">{event.online_url}</a>
                  : "Link shared with attendees")
              : (event.location ?? "TBA")}
          </Detail>
          {event.capacity && (
            <Detail icon={<Users className="h-4 w-4" />} label="Capacity">
              {confirmedCount} / {event.capacity}
              {spotsLeft != null && spotsLeft > 0 && spotsLeft <= 10 && (
                <span className="ml-2 text-xs text-primary">{spotsLeft} left</span>
              )}
            </Detail>
          )}
        </Card>

        {/* RSVP block */}
        {!ended && (
          <Card className="mt-6 p-6 gradient-soft">
            {active && rsvp ? (
              <div className="space-y-4">
                <p className="font-serif text-xl">
                  {rsvp.checked_in_at ? "You're checked in ✓" : rsvp.status === "confirmed" ? "You're going! 🎉" : "You're on the waitlist"}
                </p>
                <TicketCard
                  event={event}
                  status={rsvp.status as "confirmed" | "waitlist"}
                  ticketCode={rsvp.ticket_code}
                  onCancel={handleCancel}
                  cancelling={busy}
                  checkedInAt={rsvp.checked_in_at}
                />
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-serif text-xl">Coming to this event?</p>
                  <p className="text-sm text-muted-foreground">
                    {spotsLeft === 0 ? "Capacity reached — you can join the waitlist." : "RSVP to get your ticket."}
                  </p>
                </div>
                <Button size="lg" onClick={handleRsvp} disabled={busy}>
                  {busy ? "Please wait…" : spotsLeft === 0 ? "Join waitlist" : "RSVP"}
                </Button>
              </div>
            )}
          </Card>
        )}

        {event.description && (
          <div className="mt-8 whitespace-pre-wrap text-base leading-relaxed text-foreground/90">{event.description}</div>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied");
          }}>
            <Share2 className="mr-1.5 h-4 w-4" /> Share this event
          </Button>
          <ReportButton targetType="event" targetId={event.id} />
        </div>

        {ended && <EventFeedback eventId={event.id} isAttendee={!!active && rsvp?.status === "confirmed"} />}
        <EventGallery eventId={event.id} isAttendee={!!active && rsvp?.status === "confirmed"} />
      </article>
    </Page>
  );
}

function Detail({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">{icon}{label}</div>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  );
}

function Page({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background"><SiteHeader />{children}</div>;
}
