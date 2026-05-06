import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/join/$token")({ component: JoinPage });

type Preview = { host_id: string; host_name: string; host_slug: string; role: "host" | "checker"; expires_at: string; revoked: boolean };

function JoinPage() {
  const { token } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [preview, setPreview] = useState<Preview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    supabase.rpc("preview_host_invite", { _token: token }).then(({ data, error }) => {
      if (error) { setError(error.message); return; }
      const row = (data as any)?.[0];
      if (!row) { setError("Invite not found"); return; }
      setPreview(row);
    });
  }, [token]);

  const accept = async () => {
    if (!user) {
      navigate({ to: "/login", search: { redirect: `/join/${token}` } });
      return;
    }
    setAccepting(true);
    const { error } = await supabase.rpc("accept_host_invite", { _token: token });
    setAccepting(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`Joined ${preview?.host_name} as ${preview?.role}`);
    navigate({ to: preview?.role === "host" ? "/dashboard" : "/" });
  };

  const expired = preview && new Date(preview.expires_at) < new Date();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-md px-4 py-16">
        <Card className="p-8 text-center">
          {error ? (
            <>
              <h1 className="font-serif text-2xl">Invite unavailable</h1>
              <p className="mt-2 text-muted-foreground">{error}</p>
              <Button asChild className="mt-6"><Link to="/">Back home</Link></Button>
            </>
          ) : !preview ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : preview.revoked || expired ? (
            <>
              <h1 className="font-serif text-2xl">Invite no longer valid</h1>
              <p className="mt-2 text-muted-foreground">{preview.revoked ? "This invite was revoked." : "This invite has expired."}</p>
              <Button asChild className="mt-6"><Link to="/">Back home</Link></Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">You've been invited to join</p>
              <h1 className="mt-2 font-serif text-3xl">{preview.host_name}</h1>
              <Badge className="mt-3" variant={preview.role === "host" ? "default" : "secondary"}>as {preview.role}</Badge>
              <p className="mt-4 text-sm text-muted-foreground">
                {preview.role === "host"
                  ? "You'll be able to create and manage events, members, and attendees."
                  : "You'll be able to check guests in at events."}
              </p>
              <Button className="mt-6 w-full" onClick={accept} disabled={accepting || loading}>
                {user ? "Accept invite" : "Sign in to accept"}
              </Button>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
