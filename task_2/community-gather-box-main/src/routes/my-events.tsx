import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScanLine, Edit, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/my-events")({ component: MyEvents });

type Row = {
  id: string; slug: string; title: string; start_at: string; end_at: string;
  host_id: string; host_name: string; host_slug: string; role: "host" | "checker";
};

function MyEvents() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [search, setSearch] = useState("");
  const [hostFilter, setHostFilter] = useState<string>("all");
  const [range, setRange] = useState<"upcoming" | "past" | "all">("upcoming");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    if (!loading && !user) { navigate({ to: "/login" }); return; }
    if (!user) return;
    (async () => {
      const { data: members } = await supabase.from("host_members")
        .select("host_id, role, host:host_profiles(id, name, slug)")
        .eq("user_id", user.id);
      const memberRows = (members as any) ?? [];
      if (!memberRows.length) { navigate({ to: "/explore" }); return; }
      const hostIds = memberRows.map((m: any) => m.host_id);
      const { data: events } = await supabase.from("events")
        .select("id, slug, title, start_at, end_at, host_id")
        .in("host_id", hostIds)
        .order("start_at", { ascending: false });
      const byHost = new Map<string, any>(memberRows.map((m: any) => [m.host_id, m]));
      const out: Row[] = ((events as any) ?? []).map((e: any) => {
        const m = byHost.get(e.host_id);
        return {
          ...e, role: m.role, host_name: m.host?.name ?? "", host_slug: m.host?.slug ?? "",
        };
      });
      setRows(out);
    })();
  }, [user, loading, navigate]);

  const hosts = useMemo(() => {
    const m = new Map<string, string>();
    rows.forEach((r) => m.set(r.host_id, r.host_name));
    return Array.from(m, ([id, name]) => ({ id, name }));
  }, [rows]);

  const filtered = useMemo(() => {
    const now = Date.now();
    const fromT = from ? new Date(from).getTime() : null;
    const toT = to ? new Date(to).getTime() + 86_400_000 : null;
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (hostFilter !== "all" && r.host_id !== hostFilter) return false;
      const start = new Date(r.start_at).getTime();
      const end = new Date(r.end_at).getTime();
      if (range === "upcoming" && end < now) return false;
      if (range === "past" && end >= now) return false;
      if (fromT && start < fromT) return false;
      if (toT && start > toT) return false;
      if (q && !r.title.toLowerCase().includes(q) && !r.host_name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, search, hostFilter, range, from, to]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="font-serif text-3xl">My events</h1>
        <p className="mt-1 text-muted-foreground">All events from hosts where you have a role.</p>

        <Card className="mt-6 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
          <Input placeholder="Search title or host" value={search} onChange={(e) => setSearch(e.target.value)} className="lg:col-span-2" />
          <Select value={hostFilter} onValueChange={setHostFilter}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All hosts</SelectItem>
              {hosts.map((h) => <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={range} onValueChange={(v: any) => setRange(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="past">Past</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full min-w-0" />
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full min-w-0" />
        </Card>

        <div className="mt-6 grid gap-3">
          {filtered.length === 0 ? (
            <Card className="border-dashed p-10 text-center text-muted-foreground">No events match.</Card>
          ) : filtered.map((r) => (
            <Card key={r.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-serif text-lg">{r.title}</h3>
                  <Badge variant={r.role === "host" ? "default" : "secondary"}>{r.role}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {new Date(r.start_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                  {" · "}
                  <Link to="/hosts/$slug" params={{ slug: r.host_slug }} className="hover:underline">{r.host_name}</Link>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" asChild><Link to="/events/$id/check-in" params={{ id: r.id }}><ScanLine className="mr-1 h-3.5 w-3.5" />Check-in</Link></Button>
                {r.role === "host" && (
                  <Button size="sm" variant="outline" asChild><Link to="/dashboard/events/$id" params={{ id: r.id }}><Edit className="mr-1 h-3.5 w-3.5" />Edit</Link></Button>
                )}
                <Button size="sm" variant="ghost" asChild><Link to="/events/$slug" params={{ slug: r.slug }}><ExternalLink className="mr-1 h-3.5 w-3.5" />View</Link></Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
