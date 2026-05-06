import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { EventForm, emptyEvent, type EventFormValues } from "@/components/EventForm";
import { toast } from "sonner";
import { slugify, randomSuffix } from "@/lib/slug";

export const Route = createFileRoute("/dashboard/events/new")({ component: NewEvent });

function NewEvent() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [hostId, setHostId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) { navigate({ to: "/login" }); return; }
    if (!user) return;
    supabase.from("host_profiles").select("id").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => {
        if (!data) { navigate({ to: "/become-host" }); return; }
        setHostId(data.id);
      });
  }, [user, loading, navigate]);

  const onSubmit = async (v: EventFormValues) => {
    if (!hostId) return;
    if (new Date(v.end_at) <= new Date(v.start_at)) {
      toast.error("End time must be after start time");
      return;
    }
    setSubmitting(true);
    try {
      const slug = `${slugify(v.title)}-${randomSuffix(5)}`;
      const { error } = await supabase.from("events").insert({
        host_id: hostId, slug,
        title: v.title, description: v.description || null,
        start_at: new Date(v.start_at).toISOString(),
        end_at: new Date(v.end_at).toISOString(),
        time_zone: v.time_zone,
        is_online: v.is_online,
        location: v.is_online ? null : (v.location || null),
        online_url: v.is_online ? (v.online_url || null) : null,
        capacity: v.capacity ? parseInt(v.capacity, 10) : null,
        cover_image_url: v.cover_image_url || null,
        visibility: v.visibility, status: "draft", is_paid: false,
      });
      if (error) throw error;
      toast.success("Event created as draft");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err.message ?? "Could not create event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:underline">← Back to dashboard</Link>
        <h1 className="mt-3 font-serif text-3xl">New event</h1>
        <p className="mb-8 mt-1 text-muted-foreground">It will be saved as a draft. Publish when you're ready.</p>
        <EventForm initial={emptyEvent} submitting={submitting} submitLabel="Create draft" onSubmit={onSubmit} />
      </div>
    </div>
  );
}
