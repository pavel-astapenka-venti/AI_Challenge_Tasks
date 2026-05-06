import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { TicketCard, type TicketEvent } from "@/components/TicketCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Row = {
  id: string; status: "confirmed" | "waitlist" | "cancelled"; ticket_code: string; checked_in_at: string | null;
  event: TicketEvent & { end_at: string };
};

export const Route = createFileRoute("/tickets")({
  validateSearch: (s: Record<string, unknown>) => ({ past: s.past === "1" || s.past === true ? "1" : undefined }) as { past?: "1" },
  head: () => ({ meta: [{ title: "My tickets — Gather" }] }),
  component: TicketsPage,
});

function TicketsPage() {
  const { user, loading } = useAuth();
  const { past } = Route.useSearch();
  const [rows, setRows] = useState<Row[]>([]);
  const [fetching, setFetching] = useState(true);
  const [displayName, setDisplayName] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    setFetching(true);
    const [{ data }, { data: prof }] = await Promise.all([
      supabase
        .from("rsvps")
        .select("id, status, ticket_code, checked_in_at, event:events(id, slug, title, description, start_at, end_at, location, is_online, online_url)")
        .eq("user_id", user.id).neq("status", "cancelled")
        .order("created_at", { ascending: false }),
      supabase.from("profiles").select("display_name").eq("user_id", user.id).maybeSingle(),
    ]);
    setRows(((data as any) ?? []) as Row[]);
    setDisplayName(prof?.display_name ?? null);
    setFetching(false);
  };

  useEffect(() => { if (!loading) load(); /* eslint-disable-next-line */ }, [loading, user?.id]);

  if (!loading && !user) {
    throw redirect({ to: "/login", search: { redirect: "/tickets" } });
  }

  const now = Date.now();
  const upcoming = rows.filter((r) => new Date(r.event.end_at).getTime() >= now);
  const pastRows = rows.filter((r) => new Date(r.event.end_at).getTime() < now);
  const showing = past ? pastRows : upcoming;

  const cancel = async (eventId: string) => {
    const { error } = await supabase.rpc("cancel_rsvp", { _event_id: eventId });
    if (error) { toast.error(error.message); return; }
    toast.success("RSVP cancelled");
    load();
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-serif text-4xl">My tickets</h1>
            <p className="mt-2 text-muted-foreground">Your upcoming gatherings and passes.</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant={!past ? "default" : "outline"} size="sm">
              <Link to="/tickets" search={{}}>Upcoming</Link>
            </Button>
            <Button asChild variant={past ? "default" : "outline"} size="sm">
              <Link to="/tickets" search={{ past: "1" }}>Past</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {fetching ? (
            <p className="text-center text-muted-foreground">Loading…</p>
          ) : showing.length === 0 ? (
            <Card className="border-dashed p-12 text-center">
              <p className="font-serif text-2xl">No {past ? "past" : "upcoming"} tickets</p>
              <p className="mt-2 text-muted-foreground">Find an event to attend.</p>
              <Button asChild className="mt-6"><Link to="/explore">Explore events</Link></Button>
            </Card>
          ) : (
            showing.map((r) => (
              <TicketCard
                key={r.id}
                event={r.event}
                status={r.status as "confirmed" | "waitlist"}
                ticketCode={r.ticket_code}
                onCancel={past ? undefined : () => cancel(r.event.id)}
                checkedInAt={r.checked_in_at}
                attendeeName={displayName ?? user?.email ?? null}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
