import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Check, Download, X } from "lucide-react";
import { toast } from "sonner";
import { toCSV, downloadCSV } from "@/lib/csv";

export const Route = createFileRoute("/events/$id/check-in")({ component: CheckInPage });

type Ev = { id: string; slug: string; title: string; start_at: string; capacity: number | null; host_id: string };
type Attendee = {
  rsvp_id: string; user_id: string; status: string; ticket_code: string;
  checked_in_at: string | null; name: string; email: string;
};

function CheckInPage() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Ev | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [search, setSearch] = useState("");
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [lastCheckedInId, setLastCheckedInId] = useState<string | null>(null);

  const load = async () => {
    const { data: e } = await supabase.from("events")
      .select("id, slug, title, start_at, capacity, host_id").eq("id", id).maybeSingle();
    if (!e) { setAuthorized(false); return; }
    setEvent(e as any);

    const { data: members } = await supabase.from("host_members")
      .select("role").eq("host_id", e.host_id).eq("user_id", user!.id);
    if (!members || members.length === 0) { setAuthorized(false); return; }
    setIsHost(members.some((m: any) => m.role === "host"));
    setAuthorized(true);

    const { data: rsvps } = await supabase.from("rsvps")
      .select("id, user_id, status, ticket_code, checked_in_at")
      .eq("event_id", id).eq("status", "confirmed").order("created_at");
    const userIds = (rsvps ?? []).map((r: any) => r.user_id);
    const { data: profiles } = await supabase.from("profiles")
      .select("user_id, email, display_name").in("user_id", userIds);
    const pmap = new Map((profiles ?? []).map((p: any) => [p.user_id, p]));
    setAttendees(((rsvps as any) ?? []).map((r: any) => ({
      rsvp_id: r.id, user_id: r.user_id, status: r.status, ticket_code: r.ticket_code,
      checked_in_at: r.checked_in_at,
      name: pmap.get(r.user_id)?.display_name ?? "",
      email: pmap.get(r.user_id)?.email ?? "",
    })));
  };

  useEffect(() => {
    if (!loading && !user) { navigate({ to: "/login" }); return; }
    if (user) load();
  }, [id, user, loading]);

  const toggle = async (a: Attendee) => {
    const undo = !!a.checked_in_at;
    const { error } = await supabase.rpc("check_in_rsvp", { _rsvp_id: a.rsvp_id, _undo: undo });
    if (error) return toast.error(error.message);
    toast.success(undo ? "Check-in undone" : `Checked in ${a.name || a.email}`);
    setAttendees((prev) => prev.map((x) => x.rsvp_id === a.rsvp_id
      ? { ...x, checked_in_at: undo ? null : new Date().toISOString() } : x));
    setLastCheckedInId(undo ? null : a.rsvp_id);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return attendees;
    return attendees.filter((a) =>
      a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.ticket_code.toLowerCase().includes(q));
  }, [attendees, search]);

  const checkedIn = attendees.filter((a) => a.checked_in_at).length;

  const exportCsv = () => {
    if (!event) return;
    const rows = attendees.map((a) => ({
      name: a.name, email: a.email, rsvp_status: a.status,
      check_in_time: a.checked_in_at ? new Date(a.checked_in_at).toISOString() : "",
    }));
    downloadCSV(`${event.slug}-attendance.csv`, toCSV(rows, ["name", "email", "rsvp_status", "check_in_time"]));
  };

  if (authorized === false) {
    return <div className="min-h-screen bg-background"><SiteHeader />
      <div className="mx-auto max-w-md p-12 text-center">
        <h1 className="font-serif text-2xl">Not authorized</h1>
        <p className="mt-2 text-muted-foreground">You don't have access to check-in for this event.</p>
        <Button asChild className="mt-6"><Link to="/">Home</Link></Button>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:underline">← Back to dashboard</Link>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-serif text-3xl">{event?.title ?? "Loading…"}</h1>
            {event && <p className="mt-1 text-muted-foreground">
              {new Date(event.start_at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
            </p>}
          </div>
          {isHost && <Button variant="outline" onClick={exportCsv}><Download className="mr-1.5 h-4 w-4" /> Export CSV</Button>}
        </div>

        <Card className="mt-6 flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex gap-4 text-sm">
            <span>Going: <strong>{attendees.length}</strong></span>
            <span>Checked-in: <strong>{checkedIn}</strong></span>
          </div>
          <Input placeholder="Search by name, email, or ticket (code)" value={search} onChange={(e) => setSearch(e.target.value)} className="w-72 max-w-full" />
        </Card>

        <div className="mt-4 grid gap-2">
          {filtered.length === 0 ? (
            <Card className="border-dashed p-10 text-center text-muted-foreground">No matching attendees.</Card>
          ) : filtered.map((a) => {
            const checked = !!a.checked_in_at;
            const canUndo = checked && a.rsvp_id === lastCheckedInId;
            return (
              <Card key={a.rsvp_id} className={`flex items-center gap-3 p-3 ${checked ? "bg-muted/40" : ""}`}>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{a.name || a.email || "Attendee"}</p>
                  {a.name && <p className="truncate text-xs text-muted-foreground">{a.email}</p>}
                </div>
                {checked && <Badge variant="secondary">{new Date(a.checked_in_at!).toLocaleTimeString()}</Badge>}
                {!checked && (
                  <Button size="sm" onClick={() => toggle(a)}>
                    <Check className="mr-1 h-3.5 w-3.5" />Check in
                  </Button>
                )}
                {canUndo && (
                  <Button size="sm" variant="ghost" onClick={() => toggle(a)}>
                    <X className="mr-1 h-3.5 w-3.5" />Undo
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
