import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, ExternalLink, Copy, Eye, EyeOff, Download, ScanLine, Users } from "lucide-react";
import { toast } from "sonner";
import { slugify, randomSuffix } from "@/lib/slug";
import { toCSV, downloadCSV } from "@/lib/csv";

export const Route = createFileRoute("/dashboard/")({ component: Dashboard });

type Host = { id: string; name: string; slug: string };
type Ev = {
  id: string; slug: string; title: string; status: "draft" | "published";
  visibility: "public" | "unlisted"; start_at: string; end_at: string; cover_image_url: string | null;
};
type Stats = { going: number; waitlist: number; checkedIn: number };

function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [host, setHost] = useState<Host | null>(null);
  const [events, setEvents] = useState<Ev[]>([]);
  const [stats, setStats] = useState<Record<string, Stats>>({});
  const [loadingData, setLoadingData] = useState(true);

  const refresh = async (hostId: string) => {
    const { data } = await supabase.from("events")
      .select("id, slug, title, status, visibility, start_at, end_at, cover_image_url")
      .eq("host_id", hostId)
      .order("start_at", { ascending: false });
    const evs = (data as any as Ev[]) ?? [];
    setEvents(evs);

    if (evs.length) {
      const ids = evs.map((e) => e.id);
      const { data: rsvps } = await supabase.from("rsvps")
        .select("event_id, status, checked_in_at").in("event_id", ids);
      const map: Record<string, Stats> = {};
      for (const id of ids) map[id] = { going: 0, waitlist: 0, checkedIn: 0 };
      (rsvps ?? []).forEach((r: any) => {
        if (!map[r.event_id]) return;
        if (r.status === "confirmed") map[r.event_id].going++;
        else if (r.status === "waitlist") map[r.event_id].waitlist++;
        if (r.checked_in_at) map[r.event_id].checkedIn++;
      });
      setStats(map);
    }
  };

  useEffect(() => {
    if (!loading && !user) { navigate({ to: "/login" }); return; }
    if (!user) return;
    (async () => {
      const { data: h } = await supabase.from("host_profiles")
        .select("id, name, slug").eq("user_id", user.id).maybeSingle();
      if (!h) {
        // Checker-only members (no own host profile) belong on My events
        const { data: mem } = await supabase.from("host_members")
          .select("host_id").eq("user_id", user.id).limit(1);
        if (mem && mem.length > 0) { navigate({ to: "/my-events" }); return; }
        navigate({ to: "/explore" }); return;
      }
      setHost(h);
      await refresh(h.id);
      setLoadingData(false);
    })();
  }, [user, loading, navigate]);

  const { upcoming, past } = useMemo(() => {
    const now = Date.now();
    const u: Ev[] = [], p: Ev[] = [];
    for (const e of events) (new Date(e.end_at).getTime() >= now ? u : p).push(e);
    u.sort((a, b) => +new Date(a.start_at) - +new Date(b.start_at));
    return { upcoming: u, past: p };
  }, [events]);

  const togglePublish = async (e: Ev) => {
    const next = e.status === "published" ? "draft" : "published";
    const { error } = await supabase.from("events").update({ status: next }).eq("id", e.id);
    if (error) return toast.error(error.message);
    toast.success(next === "published" ? "Published" : "Unpublished");
    if (host) refresh(host.id);
  };

  const duplicate = async (e: Ev) => {
    if (!host) return;
    const { data: full } = await supabase.from("events").select("*").eq("id", e.id).single();
    if (!full) return;
    const { id, created_at, updated_at, slug, ...rest } = full as any;
    const newSlug = `${slugify(full.title)}-${randomSuffix(5)}`;
    const { error } = await supabase.from("events").insert({
      ...rest, slug: newSlug, status: "draft", title: `${full.title} (copy)`,
    });
    if (error) return toast.error(error.message);
    toast.success("Duplicated as draft");
    refresh(host.id);
  };

  const copyLink = (e: Ev) => {
    const url = `${window.location.origin}/events/${e.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied");
  };

  const exportCsv = async (e: Ev) => {
    const { data: rsvps, error } = await supabase.from("rsvps")
      .select("user_id, status, checked_in_at, created_at").eq("event_id", e.id)
      .order("created_at");
    if (error) return toast.error(error.message);
    const userIds = Array.from(new Set((rsvps ?? []).map((r: any) => r.user_id)));
    const { data: profiles } = await supabase.from("profiles")
      .select("user_id, email, display_name").in("user_id", userIds);
    const pmap = new Map((profiles ?? []).map((p: any) => [p.user_id, p]));
    const rows = (rsvps ?? []).map((r: any) => {
      const p = pmap.get(r.user_id);
      return {
        name: p?.display_name ?? "",
        email: p?.email ?? "",
        rsvp_status: r.status,
        check_in_time: r.checked_in_at ? new Date(r.checked_in_at).toISOString() : "",
      };
    });
    const csv = toCSV(rows, ["name", "email", "rsvp_status", "check_in_time"]);
    downloadCSV(`${e.slug}-rsvps.csv`, csv);
  };

  if (loading || loadingData) {
    return <div className="min-h-screen bg-background"><SiteHeader /><div className="p-12 text-center text-muted-foreground">Loading…</div></div>;
  }

  const renderList = (list: Ev[], emptyMsg: string) => list.length === 0 ? (
    <Card className="border-dashed p-12 text-center text-muted-foreground">{emptyMsg}</Card>
  ) : (
    <div className="grid gap-4">
      {list.map((e) => {
        const s = stats[e.id] ?? { going: 0, waitlist: 0, checkedIn: 0 };
        return (
          <Card key={e.id} className="flex flex-wrap items-center gap-4 p-4">
            <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
              {e.cover_image_url ? (
                <img src={e.cover_image_url} alt={e.title} className="h-full w-full object-cover" />
              ) : <div className="h-full w-full gradient-warm opacity-70" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-serif text-lg">{e.title}</h3>
                <Badge variant={e.status === "published" ? "default" : "secondary"}>
                  {e.status === "published" ? "Published" : "Draft"}
                </Badge>
                <Badge variant="outline">{e.visibility === "public" ? "Public" : "Unlisted"}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {new Date(e.start_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
              </p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs">
                <span className="inline-flex items-center gap-1 text-muted-foreground"><Users className="h-3 w-3" /> Going <strong className="text-foreground">{s.going}</strong></span>
                <span className="text-muted-foreground">Waitlist <strong className="text-foreground">{s.waitlist}</strong></span>
                <span className="text-muted-foreground">Checked-in <strong className="text-foreground">{s.checkedIn}</strong></span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" asChild><Link to="/events/$id/check-in" params={{ id: e.id }}><ScanLine className="mr-1 h-3.5 w-3.5" />Check-in</Link></Button>
              <Button size="sm" variant="outline" asChild><Link to="/dashboard/events/$id" params={{ id: e.id }}>Edit</Link></Button>
              <Button size="sm" variant="outline" onClick={() => togglePublish(e)}>
                {e.status === "published" ? <><EyeOff className="mr-1 h-3.5 w-3.5" />Unpublish</> : <><Eye className="mr-1 h-3.5 w-3.5" />Publish</>}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => exportCsv(e)}><Download className="mr-1 h-3.5 w-3.5" />CSV</Button>
              <Button size="sm" variant="ghost" onClick={() => duplicate(e)}><Copy className="mr-1 h-3.5 w-3.5" />Duplicate</Button>
              <Button size="sm" variant="ghost" onClick={() => copyLink(e)}>Copy link</Button>
            </div>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Hosting as</p>
            <h1 className="font-serif text-3xl">{host?.name}</h1>
            {host && (
              <Link to="/hosts/$slug" params={{ slug: host.slug }} className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                View public host page <ExternalLink className="h-3 w-3" />
              </Link>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline"><Link to="/my-events">My events</Link></Button>
            <Button asChild variant="outline"><Link to="/dashboard/moderation">Moderation</Link></Button>
            <Button asChild variant="outline"><Link to="/dashboard/members">Team</Link></Button>
            <Button asChild><Link to="/dashboard/events/new"><Plus className="mr-1.5 h-4 w-4" /> Create event</Link></Button>
          </div>
        </div>

        {events.length === 0 ? (
          <Card className="border-dashed p-16 text-center">
            <p className="font-serif text-2xl">No events yet</p>
            <p className="mt-2 text-muted-foreground">Create your first event to share with your community.</p>
            <Button asChild className="mt-6"><Link to="/dashboard/events/new">Create event</Link></Button>
          </Card>
        ) : (
          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="mt-4">{renderList(upcoming, "No upcoming events.")}</TabsContent>
            <TabsContent value="past" className="mt-4">{renderList(past, "No past events.")}</TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
