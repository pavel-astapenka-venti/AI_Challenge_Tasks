import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Search, X } from "lucide-react";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore events — Gather" },
      { name: "description", content: "Browse upcoming community gatherings. Search by name, date, or location." },
      { property: "og:title", content: "Explore events — Gather" },
      { property: "og:description", content: "Browse upcoming community gatherings. Search by name, date, or location." },
    ],
  }),
  component: ExplorePage,
});

type Ev = {
  id: string; slug: string; title: string; description: string | null;
  start_at: string; end_at: string; location: string | null; is_online: boolean;
  cover_image_url: string | null;
  host: { name: string; slug: string } | null;
};

function ExplorePage() {
  const [all, setAll] = useState<Ev[]>([]);
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [includePast, setIncludePast] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("events")
      .select("id, slug, title, description, start_at, end_at, location, is_online, cover_image_url, host:host_profiles(name, slug)")
      .eq("status", "published")
      .eq("visibility", "public")
      .order("start_at", { ascending: true })
      .limit(200)
      .then(({ data }) => { setAll((data as any) ?? []); setLoading(false); });
  }, []);

  const now = Date.now();
  const filtered = useMemo(() => {
    return all.filter((e) => {
      const start = new Date(e.start_at).getTime();
      const end = new Date(e.end_at).getTime();
      if (!includePast && end < now) return false;
      if (q && !`${e.title} ${e.description ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (loc) {
        const hay = (e.is_online ? "online" : (e.location ?? "")).toLowerCase();
        if (!hay.includes(loc.toLowerCase())) return false;
      }
      if (from && start < new Date(from).getTime()) return false;
      if (to && start > new Date(to).getTime() + 86_400_000) return false;
      return true;
    });
  }, [all, q, loc, from, to, includePast, now]);

  const reset = () => { setQ(""); setLoc(""); setFrom(""); setTo(""); setIncludePast(false); };
  const hasFilters = q || loc || from || to || includePast;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-serif text-4xl">Explore gatherings</h1>
        <p className="mt-2 text-muted-foreground">Find your next community moment.</p>

        <Card className="mt-6 grid gap-4 p-5 md:grid-cols-[1.5fr_1fr_auto_auto_auto]">
          <div>
            <Label htmlFor="q" className="text-xs uppercase tracking-wide text-muted-foreground">Search</Label>
            <div className="relative mt-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Title or description" className="pl-9" />
            </div>
          </div>
          <div>
            <Label htmlFor="loc" className="text-xs uppercase tracking-wide text-muted-foreground">Location</Label>
            <Input id="loc" value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="City or 'online'" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="from" className="text-xs uppercase tracking-wide text-muted-foreground">From</Label>
            <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="to" className="text-xs uppercase tracking-wide text-muted-foreground">To</Label>
            <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1" />
          </div>
          <div className="flex items-end">
            <label className="flex h-10 items-center gap-2 rounded-md border border-input px-3 text-sm">
              <Switch checked={includePast} onCheckedChange={setIncludePast} />
              Include past
            </label>
          </div>
        </Card>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>{loading ? "Loading…" : `${filtered.length} event${filtered.length === 1 ? "" : "s"}`}{!includePast && " · Upcoming"}</span>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={reset}><X className="mr-1 h-3.5 w-3.5" /> Clear</Button>
          )}
        </div>

        {!loading && filtered.length === 0 ? (
          <Card className="mt-6 border-dashed p-12 text-center text-muted-foreground">No events match your filters.</Card>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => <ExploreCard key={e.id} e={e} now={now} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function ExploreCard({ e, now }: { e: Ev; now: number }) {
  const start = new Date(e.start_at);
  const ended = new Date(e.end_at).getTime() < now;
  return (
    <Link to="/events/$slug" params={{ slug: e.slug }} className="group">
      <Card className="overflow-hidden border-border/60 transition hover:shadow-warm">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          {e.cover_image_url
            ? <img src={e.cover_image_url} alt={e.title} loading="lazy" className={`h-full w-full object-cover transition group-hover:scale-105 ${ended ? "grayscale" : ""}`} />
            : <div className={`h-full w-full gradient-warm ${ended ? "opacity-40" : "opacity-80"}`} />}
          {ended && (
            <Badge variant="secondary" className="absolute left-3 top-3 bg-foreground/80 text-background">Ended</Badge>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {start.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} ·{" "}
            {start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
          </div>
          <h3 className="mt-2 font-serif text-xl leading-snug group-hover:text-primary">{e.title}</h3>
          <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{e.is_online ? "Online" : (e.location ?? "Location TBA")}</span>
          </div>
          {e.host && (
            <p className="mt-3 text-xs text-muted-foreground">Hosted by <span className="font-medium text-foreground">{e.host.name}</span></p>
          )}
        </div>
      </Card>
    </Link>
  );
}
