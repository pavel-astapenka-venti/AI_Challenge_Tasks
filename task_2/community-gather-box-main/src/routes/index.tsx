import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({ component: Index });

type EventRow = {
  id: string; slug: string; title: string; description: string | null;
  start_at: string; location: string | null; is_online: boolean;
  cover_image_url: string | null;
  host: { name: string; slug: string } | null;
};

function Index() {
  const [events, setEvents] = useState<EventRow[]>([]);

  useEffect(() => {
    supabase
      .from("events")
      .select("id, slug, title, description, start_at, location, is_online, cover_image_url, host:host_profiles(name, slug)")
      .eq("status", "published")
      .eq("visibility", "public")
      .or(`end_at.gte.${new Date().toISOString()},and(end_at.is.null,start_at.gte.${new Date().toISOString()})`)
      .order("start_at", { ascending: true })
      .limit(12)
      .then(({ data }) => setEvents((data as any) ?? []));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <span className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              For warm, welcoming communities
            </span>
            <h1 className="mt-5 font-serif text-5xl leading-[1.05] md:text-6xl">
              Host gatherings your <span className="text-primary">people</span> will remember.
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Publish a beautiful event page in minutes. Share one link. Welcome your community at the door.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/become-host">Start hosting <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/explore">Explore events</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] gradient-warm opacity-20 blur-3xl" />
            <img
              src={heroImg}
              alt="People gathered under string lights at a warm community event"
              width={1600} height={1024}
              className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-warm"
            />
          </div>
        </div>
      </section>

      {/* Discover */}
      <section id="discover" className="border-t border-border/60 gradient-soft">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-3xl">Upcoming gatherings</h2>
              <p className="mt-1 text-muted-foreground">Public events from hosts around the community.</p>
            </div>
          </div>

          {events.length === 0 ? (
            <Card className="border-dashed bg-card/60 p-12 text-center">
              <p className="font-serif text-2xl">No public events yet</p>
              <p className="mt-2 text-muted-foreground">Be the first to host something wonderful.</p>
              <Button asChild className="mt-6"><Link to="/become-host">Become a host</Link></Button>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => <EventCard key={e.id} e={e} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function EventCard({ e }: { e: EventRow }) {
  const d = new Date(e.start_at);
  return (
    <Link to="/events/$slug" params={{ slug: e.slug }} className="group">
      <Card className="overflow-hidden border-border/60 bg-card transition hover:shadow-warm">
        <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
          {e.cover_image_url ? (
            <img src={e.cover_image_url} alt={e.title} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" />
          ) : (
            <div className="h-full w-full gradient-warm opacity-80" />
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} ·{" "}
            {d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
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
