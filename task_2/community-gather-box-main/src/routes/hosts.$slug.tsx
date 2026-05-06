import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar, MapPin, Pencil } from "lucide-react";
import { useAuth } from "@/lib/auth";

type Host = { id: string; user_id: string; name: string; logo_url: string | null; bio: string | null; contact_email: string | null };
type Ev = { id: string; slug: string; title: string; start_at: string; end_at: string; location: string | null; is_online: boolean; cover_image_url: string | null };

export const Route = createFileRoute("/hosts/$slug")({
  loader: async ({ params }) => {
    const { data } = await supabase.from("host_profiles")
      .select("name, bio, logo_url")
      .eq("slug", params.slug)
      .maybeSingle();
    return { hostMeta: data as { name: string; bio: string | null; logo_url: string | null } | null };
  },
  head: ({ loaderData }) => {
    const h = loaderData?.hostMeta;
    const title = h ? `${h.name} — Gather` : "Host — Gather";
    const desc = h ? (h.bio ?? `Events hosted by ${h.name} on Gather.`).slice(0, 160) : "View host details and public events on Gather.";
    const meta: Array<Record<string, string>> = [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: desc },
    ];
    if (h?.logo_url) {
      meta.push({ property: "og:image", content: h.logo_url });
      meta.push({ name: "twitter:image", content: h.logo_url });
      meta.push({ name: "twitter:card", content: "summary_large_image" });
    }
    return { meta };
  },
  component: HostPage,
});

function HostPage() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const matchRoute = useMatchRoute();
  const isEditRoute = !!matchRoute({ to: "/hosts/$slug/edit", params: { slug } });
  const [host, setHost] = useState<Host | null>(null);
  const [loadingHost, setLoadingHost] = useState(true);
  const [hostMissing, setHostMissing] = useState(false);
  const [events, setEvents] = useState<Ev[]>([]);

  useEffect(() => {
    if (isEditRoute) return;

    let active = true;

    (async () => {
      setLoadingHost(true);
      const { data, error } = await supabase.from("host_profiles")
        .select("id, user_id, name, logo_url, bio, contact_email")
        .eq("slug", slug)
        .maybeSingle();

      if (!active) return;

      if (error || !data) {
        setHost(null);
        setHostMissing(true);
        setLoadingHost(false);
        return;
      }

      setHost(data as Host);
      setHostMissing(false);
      setLoadingHost(false);
    })();

    return () => {
      active = false;
    };
  }, [isEditRoute, slug]);

  useEffect(() => {
    if (isEditRoute || !host?.id) return;

    supabase.from("events")
      .select("id, slug, title, start_at, end_at, location, is_online, cover_image_url")
      .eq("host_id", host.id).eq("status", "published").eq("visibility", "public")
      .order("start_at", { ascending: true })
      .then(({ data }) => setEvents((data as any) ?? []));
  }, [host?.id, isEditRoute]);

  useEffect(() => {
    if (!host || typeof document === "undefined") return;

    const desc = (host.bio ?? `Events hosted by ${host.name} on Gather.`).slice(0, 160);
    document.title = `${host.name} — Gather`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute("content", desc);
  }, [host]);

  if (isEditRoute) {
    return <Outlet />;
  }

  if (loadingHost) {
    return <Wrap><p className="p-12 text-center text-muted-foreground">Loading…</p></Wrap>;
  }

  if (hostMissing || !host) {
    return (
      <Wrap>
        <div className="mx-auto max-w-md p-12 text-center">
          <h1 className="font-serif text-3xl">Host not found</h1>
          <Button asChild className="mt-6"><Link to="/">Back home</Link></Button>
        </div>
      </Wrap>
    );
  }

  const isOwner = !!user && user.id === host.user_id;
  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.end_at).getTime() >= now);
  const past = events.filter((e) => new Date(e.end_at).getTime() < now);

  return (
    <Wrap>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex flex-wrap items-start gap-6">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-muted shadow-soft">
            {host.logo_url ? <img src={host.logo_url} alt={host.name} className="h-full w-full object-cover" />
              : <div className="flex h-full w-full items-center justify-center font-serif text-3xl text-primary gradient-soft">{host.name.charAt(0)}</div>}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="font-serif text-4xl">{host.name}</h1>
              {isOwner && (
                <Button asChild size="sm" variant="outline">
                  <Link to="/hosts/$slug/edit" params={{ slug }}><Pencil className="mr-1.5 h-3.5 w-3.5" />Edit host</Link>
                </Button>
              )}
            </div>
            {host.bio && <p className="mt-3 max-w-2xl text-muted-foreground">{host.bio}</p>}
            {host.contact_email && (
              <a href={`mailto:${host.contact_email}`} className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                <Mail className="h-3.5 w-3.5" /> {host.contact_email}
              </a>
            )}
          </div>
        </div>

        <h2 className="mt-12 font-serif text-2xl">Upcoming events</h2>
        {upcoming.length === 0 ? (
          <Card className="mt-4 border-dashed p-8 text-center text-muted-foreground">No upcoming public events.</Card>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {upcoming.map((e) => <HostEventCard key={e.id} e={e} />)}
          </div>
        )}

        {past.length > 0 && (
          <>
            <h2 className="mt-12 font-serif text-2xl">Past events</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {past.map((e) => <HostEventCard key={e.id} e={e} ended />)}
            </div>
          </>
        )}
      </div>
    </Wrap>
  );
}

function HostEventCard({ e, ended }: { e: Ev; ended?: boolean }) {
  return (
    <Link to="/events/$slug" params={{ slug: e.slug }}>
      <Card className="overflow-hidden transition hover:shadow-warm">
        <div className="relative aspect-[16/9] bg-muted">
          {e.cover_image_url
            ? <img src={e.cover_image_url} alt={e.title} className={`h-full w-full object-cover ${ended ? "grayscale" : ""}`} />
            : <div className={`h-full w-full gradient-warm ${ended ? "opacity-40" : "opacity-80"}`} />}
          {ended && <Badge variant="secondary" className="absolute left-3 top-3 bg-foreground/80 text-background">Ended</Badge>}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(e.start_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
          </div>
          <h3 className="mt-1.5 font-serif text-lg">{e.title}</h3>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {e.is_online ? "Online" : (e.location ?? "TBA")}
          </div>
        </div>
      </Card>
    </Link>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background"><SiteHeader />{children}</div>;
}
