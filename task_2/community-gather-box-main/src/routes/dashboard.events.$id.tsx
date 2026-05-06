import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { EventForm, type EventFormValues } from "@/components/EventForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/events/$id")({ component: EditEvent });

function toLocal(iso: string) {
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}

function EditEvent() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<EventFormValues | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) { navigate({ to: "/login" }); return; }
    if (!user) return;
    (async () => {
      const { data, error } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
      if (error || !data) { toast.error("Event not found"); navigate({ to: "/dashboard" }); return; }
      const { data: members } = await supabase.from("host_members")
        .select("role").eq("host_id", data.host_id).eq("user_id", user.id);
      const isHost = (members ?? []).some((m: any) => m.role === "host");
      if (!isHost) {
        toast.error("You don't have access to edit this event");
        const { data: anyHost } = await supabase.from("host_members")
          .select("host_id").eq("user_id", user.id).eq("role", "host").limit(1);
        navigate({ to: anyHost && anyHost.length ? "/dashboard" : "/become-host" });
        return;
      }
      setInitial({
        title: data.title, description: data.description ?? "",
        start_at: toLocal(data.start_at), end_at: toLocal(data.end_at),
        time_zone: data.time_zone, is_online: data.is_online,
        location: data.location ?? "", online_url: data.online_url ?? "",
        capacity: data.capacity ? String(data.capacity) : "",
        cover_image_url: data.cover_image_url ?? "",
        visibility: data.visibility, is_paid: data.is_paid,
      });
    })();
  }, [id, user, loading, navigate]);

  const onSubmit = async (v: EventFormValues): Promise<void> => {
    if (new Date(v.end_at) <= new Date(v.start_at)) {
      toast.error("End time must be after start time"); return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("events").update({
      title: v.title, description: v.description || null,
      start_at: new Date(v.start_at).toISOString(),
      end_at: new Date(v.end_at).toISOString(),
      time_zone: v.time_zone, is_online: v.is_online,
      location: v.is_online ? null : (v.location || null),
      online_url: v.is_online ? (v.online_url || null) : null,
      capacity: v.capacity ? parseInt(v.capacity, 10) : null,
      cover_image_url: v.cover_image_url || null,
      visibility: v.visibility,
    }).eq("id", id);
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
    navigate({ to: "/dashboard" });
  };

  const remove = async () => {
    if (!confirm("Delete this event? This can't be undone.")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:underline">← Back to dashboard</Link>
        <div className="mt-3 mb-8 flex items-center justify-between">
          <h1 className="font-serif text-3xl">Edit event</h1>
          <Button variant="ghost" onClick={remove} className="text-destructive hover:text-destructive">Delete</Button>
        </div>
        {initial ? (
          <EventForm initial={initial} submitting={submitting} submitLabel="Save changes" onSubmit={onSubmit} />
        ) : <p className="text-muted-foreground">Loading…</p>}
      </div>
    </div>
  );
}
