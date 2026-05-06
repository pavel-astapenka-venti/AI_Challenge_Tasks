import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/hosts/$slug/edit")({ component: EditHostPage });

function EditHostPage() {
  const { slug } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [hostId, setHostId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;

    const timeout = window.setTimeout(() => {
      setLoadingData(false);
    }, 8000);

    return () => window.clearTimeout(timeout);
  }, [loading]);

  useEffect(() => {
    if (!loading && !user) { navigate({ to: "/login" }); return; }
    if (!user) return;
    (async () => {
      try {
        const { data: h, error } = await supabase.from("host_profiles")
          .select("id, user_id, name, bio, logo_url")
          .eq("slug", slug).maybeSingle();
        if (error) throw error;
        if (!h) { toast.error("Host not found"); navigate({ to: "/" }); return; }
        if (h.user_id !== user.id) { toast.error("You can't edit this host"); navigate({ to: "/hosts/$slug", params: { slug } }); return; }
        setHostId(h.id);
        setName(h.name);
        setBio(h.bio ?? "");
        const { data: emailData } = await supabase.rpc("get_my_host_contact_email", { _host_id: h.id });
        setContactEmail((emailData as string | null) ?? "");
        setLogoUrl(h.logo_url ?? "");
      } catch (err: any) {
        toast.error(err.message ?? "Could not load host profile");
        navigate({ to: "/hosts/$slug", params: { slug } });
      } finally {
        setLoadingData(false);
      }
    })();
  }, [user, loading, navigate, slug]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostId) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("host_profiles").update({
        name, bio: bio || null, contact_email: contactEmail, logo_url: logoUrl || null,
      }).eq("id", hostId);
      if (error) throw error;
      toast.success("Host profile updated");
      navigate({ to: "/hosts/$slug", params: { slug } });
    } catch (err: any) {
      toast.error(err.message ?? "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingData) {
    return <div className="min-h-screen bg-background"><SiteHeader /><div className="p-12 text-center text-muted-foreground">Loading…</div></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8">
          <h1 className="font-serif text-4xl">Edit host</h1>
          <p className="mt-2 text-muted-foreground">Update your public host profile.</p>
        </div>
        <Card className="p-6">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <Label htmlFor="name">Host name *</Label>
              <Input id="name" required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Contact email *</Label>
              <Input id="email" type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="logo">Logo URL</Label>
              <Input id="logo" type="url" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://…" />
            </div>
            <div>
              <Label htmlFor="bio">Short bio</Label>
              <Textarea id="bio" rows={4} maxLength={500} value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
              <Button type="button" variant="ghost" asChild><Link to="/hosts/$slug" params={{ slug }}>Cancel</Link></Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
