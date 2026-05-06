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
import { slugify, randomSuffix } from "@/lib/slug";

export const Route = createFileRoute("/become-host")({ component: BecomeHostPage });

function BecomeHostPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; contactEmail?: string }>({});

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
    if (user) {
      setContactEmail(user.email ?? "");
      supabase.from("host_profiles").select("id").eq("user_id", user.id).maybeSingle()
        .then(({ data }) => { if (data) navigate({ to: "/dashboard" }); });
    }
  }, [user, loading, navigate]);

  const validate = () => {
    const next: { name?: string; contactEmail?: string } = {};
    if (!name.trim()) next.name = "Host name is required";
    if (!contactEmail.trim()) next.contactEmail = "Contact email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) next.contactEmail = "Please enter a valid email address";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!validate()) return;
    setSubmitting(true);
    try {
      const slug = `${slugify(name)}-${randomSuffix(4)}`;
      const { error } = await supabase.from("host_profiles").insert({
        user_id: user.id, name, slug, bio: bio || null,
        logo_url: logoUrl || null, contact_email: contactEmail,
      });
      if (error) throw error;
      toast.success("Your host profile is live!");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err.message ?? "Could not create profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8">
          <h1 className="font-serif text-4xl">Become a host</h1>
          <p className="mt-2 text-muted-foreground">Tell your community who you are. You can update this anytime.</p>
        </div>
        <Card className="p-6">
          <form onSubmit={submit} className="space-y-5" noValidate>
            <div>
              <Label htmlFor="name">Host name *</Label>
              <Input id="name" maxLength={80} value={name} onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({ ...errors, name: undefined }); }} placeholder="Sunset Book Club" aria-invalid={!!errors.name} />
              {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="email">Contact email *</Label>
              <Input id="email" type="email" value={contactEmail} onChange={(e) => { setContactEmail(e.target.value); if (errors.contactEmail) setErrors({ ...errors, contactEmail: undefined }); }} aria-invalid={!!errors.contactEmail} />
              {errors.contactEmail && <p className="mt-1 text-sm text-destructive">{errors.contactEmail}</p>}
            </div>
            <div>
              <Label htmlFor="logo">Logo URL</Label>
              <Input id="logo" type="url" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://…" />
            </div>
            <div>
              <Label htmlFor="bio">Short bio</Label>
              <Textarea id="bio" rows={4} maxLength={500} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="What kind of gatherings do you host?" />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={submitting}>{submitting ? "Creating…" : "Create host profile"}</Button>
              <Button type="button" variant="ghost" asChild><Link to="/">Cancel</Link></Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
