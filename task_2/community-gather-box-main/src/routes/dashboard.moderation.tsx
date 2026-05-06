import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, X, EyeOff, Eye } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/moderation")({ component: Moderation });

const BUCKET = "event-photos";
const photoUrl = (p: string) => supabase.storage.from(BUCKET).getPublicUrl(p).data.publicUrl;

type PendingPhoto = {
  id: string; storage_path: string; caption: string | null; created_at: string;
  event_id: string; event: { title: string; slug: string } | null;
};
type Report = {
  id: string; target_type: "event" | "photo"; target_id: string; reason: string;
  status: string; created_at: string;
};

function Moderation() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [hostId, setHostId] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingPhoto[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [targets, setTargets] = useState<Record<string, any>>({});

  const refresh = async (hid: string) => {
    const { data: events } = await supabase.from("events").select("id").eq("host_id", hid);
    const ids = ((events as any) ?? []).map((e: any) => e.id);
    if (!ids.length) { setPending([]); setReports([]); return; }

    const { data: ph } = await supabase.from("event_photos")
      .select("id, storage_path, caption, created_at, event_id, event:events(title, slug)")
      .in("event_id", ids).eq("status", "pending").order("created_at");
    setPending((ph as any) ?? []);

    const { data: rep } = await supabase.from("reports")
      .select("id, target_type, target_id, reason, status, created_at")
      .eq("status", "open").order("created_at", { ascending: false });
    const allReports = (rep as any as Report[]) ?? [];

    // Resolve targets and filter to ones this host owns
    const eventTargetIds = allReports.filter((r) => r.target_type === "event").map((r) => r.target_id);
    const photoTargetIds = allReports.filter((r) => r.target_type === "photo").map((r) => r.target_id);
    const map: Record<string, any> = {};
    if (eventTargetIds.length) {
      const { data } = await supabase.from("events")
        .select("id, title, slug, host_id, hidden_at").in("id", eventTargetIds);
      (data ?? []).forEach((e: any) => { map[`event:${e.id}`] = e; });
    }
    if (photoTargetIds.length) {
      const { data } = await supabase.from("event_photos")
        .select("id, storage_path, caption, hidden_at, event_id, event:events(host_id, title, slug)")
        .in("id", photoTargetIds);
      (data ?? []).forEach((p: any) => { map[`photo:${p.id}`] = p; });
    }
    setTargets(map);
    setReports(allReports.filter((r) => {
      const t = map[`${r.target_type}:${r.target_id}`];
      if (!t) return false;
      const owner = r.target_type === "event" ? t.host_id : t.event?.host_id;
      return owner === hid;
    }));
  };

  useEffect(() => {
    if (!loading && !user) { navigate({ to: "/login" }); return; }
    if (!user) return;
    (async () => {
      const { data: h } = await supabase.from("host_profiles").select("id").eq("user_id", user.id).maybeSingle();
      if (h) {
        setHostId(h.id);
        refresh(h.id);
        return;
      }
      // Check if user is a host-role member of any org
      const { data: m } = await supabase.from("host_members")
        .select("host_id, role").eq("user_id", user.id).eq("role", "host").limit(1);
      if (m && m.length > 0) {
        setHostId(m[0].host_id);
        refresh(m[0].host_id);
      } else {
        toast.error("You don't have access to moderation");
        navigate({ to: "/dashboard" });
      }
    })();
  }, [user, loading, navigate]);

  const reviewPhoto = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("event_photos")
      .update({ status, reviewed_at: new Date().toISOString(), reviewed_by: user!.id }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(status === "approved" ? "Approved" : "Rejected");
    if (hostId) refresh(hostId);
  };

  const setHidden = async (type: "event" | "photo", id: string, hide: boolean) => {
    const table = type === "event" ? "events" : "event_photos";
    const { error } = await supabase.from(table)
      .update({ hidden_at: hide ? new Date().toISOString() : null }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(hide ? "Hidden" : "Unhidden");
    if (hostId) refresh(hostId);
  };

  const resolveReport = async (id: string, status: "actioned" | "dismissed") => {
    const { error } = await supabase.from("reports")
      .update({ status, resolved_at: new Date().toISOString(), resolved_by: user!.id }).eq("id", id);
    if (error) return toast.error(error.message);
    if (hostId) refresh(hostId);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:underline">← Back to dashboard</Link>
        <h1 className="mt-3 font-serif text-3xl">Moderation</h1>

        <Tabs defaultValue="photos" className="mt-6">
          <TabsList>
            <TabsTrigger value="photos">Pending photos ({pending.length})</TabsTrigger>
            <TabsTrigger value="reports">Reports ({reports.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="photos" className="mt-4">
            {pending.length === 0 ? (
              <Card className="border-dashed p-10 text-center text-muted-foreground">No photos waiting for review.</Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {pending.map((p) => (
                  <Card key={p.id} className="overflow-hidden">
                    <img src={photoUrl(p.storage_path)} alt="" className="aspect-square w-full object-cover" />
                    <div className="p-3">
                      <p className="truncate text-xs text-muted-foreground">For: {p.event?.title}</p>
                      {p.caption && <p className="mt-1 text-sm">{p.caption}</p>}
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" className="flex-1" onClick={() => reviewPhoto(p.id, "approved")}>
                          <Check className="mr-1 h-3.5 w-3.5" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => reviewPhoto(p.id, "rejected")}>
                          <X className="mr-1 h-3.5 w-3.5" /> Reject
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reports" className="mt-4">
            {reports.length === 0 ? (
              <Card className="border-dashed p-10 text-center text-muted-foreground">No open reports.</Card>
            ) : (
              <div className="grid gap-3">
                {reports.map((r) => {
                  const t = targets[`${r.target_type}:${r.target_id}`];
                  const hidden = !!t?.hidden_at;
                  const title = r.target_type === "event" ? t?.title : (t?.caption || "Photo");
                  const slug = r.target_type === "event" ? t?.slug : t?.event?.slug;
                  return (
                    <Card key={r.id} className="flex flex-wrap items-start gap-4 p-4">
                      {r.target_type === "photo" && t && (
                        <img src={photoUrl(t.storage_path)} alt="" className="h-20 w-20 shrink-0 rounded object-cover" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">{r.target_type}</Badge>
                          <span className="font-medium">{title ?? "—"}</span>
                          {hidden && <Badge variant="secondary">Hidden</Badge>}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{r.reason}</p>
                        {slug && r.target_type === "event" && (
                          <Link to="/events/$slug" params={{ slug }} className="mt-1 inline-block text-xs text-primary hover:underline">View event</Link>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => setHidden(r.target_type, r.target_id, !hidden)}>
                          {hidden ? <><Eye className="mr-1 h-3.5 w-3.5" /> Unhide</> : <><EyeOff className="mr-1 h-3.5 w-3.5" /> Hide</>}
                        </Button>
                        <Button size="sm" onClick={() => resolveReport(r.id, "actioned")}>Resolve</Button>
                        <Button size="sm" variant="ghost" onClick={() => resolveReport(r.id, "dismissed")}>Dismiss</Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
