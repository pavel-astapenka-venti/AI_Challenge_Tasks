import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Trash2, Link2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/members")({ component: MembersPage });

type Role = "host" | "checker";
type Member = { id: string; user_id: string; role: Role; created_at: string };
type Invite = { id: string; token: string; role: Role; expires_at: string; revoked_at: string | null; created_at: string };

function MembersPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [hostId, setHostId] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [role, setRole] = useState<Role>("checker");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) { navigate({ to: "/login" }); return; }
    if (!user) return;
    (async () => {
      const { data: h } = await supabase.from("host_profiles").select("id").eq("user_id", user.id).maybeSingle();
      if (!h) { navigate({ to: "/become-host" }); return; }
      setHostId(h.id);
      await refresh(h.id);
    })();
  }, [user, loading, navigate]);

  const refresh = async (hid: string) => {
    const [{ data: m }, { data: i }] = await Promise.all([
      supabase.from("host_members").select("id, user_id, role, created_at").eq("host_id", hid).order("created_at"),
      supabase.from("host_invites").select("id, token, role, expires_at, revoked_at, created_at").eq("host_id", hid).order("created_at", { ascending: false }),
    ]);
    setMembers((m as any) ?? []);
    setInvites((i as any) ?? []);
  };

  const createInvite = async () => {
    if (!hostId || !user) return;
    setBusy(true);
    const { error } = await supabase.from("host_invites").insert({ host_id: hostId, role, created_by: user.id });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Invite link created");
    refresh(hostId);
  };

  const copyInvite = (token: string) => {
    const url = `${window.location.origin}/join/${token}`;
    navigator.clipboard.writeText(url);
    toast.success("Invite link copied");
  };

  const revokeInvite = async (id: string) => {
    const { error } = await supabase.from("host_invites").update({ revoked_at: new Date().toISOString() }).eq("id", id);
    if (error) return toast.error(error.message);
    if (hostId) refresh(hostId);
  };

  const removeMember = async (id: string) => {
    if (!confirm("Remove this member?")) return;
    const { error } = await supabase.from("host_members").delete().eq("id", id);
    if (error) return toast.error(error.message);
    if (hostId) refresh(hostId);
  };

  const isExpired = (i: Invite) => new Date(i.expires_at) < new Date();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:underline">← Back to dashboard</Link>
        <h1 className="mt-3 font-serif text-3xl">Team members</h1>
        <p className="mt-1 text-muted-foreground">Invite people to help manage events or check guests in at the door.</p>

        <Card className="mt-8 p-6">
          <h2 className="font-serif text-xl">Create invite link</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            <strong className="text-foreground">Host</strong> can manage everything. <strong className="text-foreground">Checker</strong> can only access check-in.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="checker">Checker</SelectItem>
                <SelectItem value="host">Host</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={createInvite} disabled={busy}><Link2 className="mr-1.5 h-4 w-4" /> Create link</Button>
          </div>
        </Card>

        <h2 className="mt-10 font-serif text-2xl">Active invites</h2>
        {invites.length === 0 ? (
          <Card className="mt-3 border-dashed p-6 text-center text-muted-foreground">No invites yet.</Card>
        ) : (
          <div className="mt-3 grid gap-3">
            {invites.map((i) => {
              const expired = isExpired(i);
              const revoked = !!i.revoked_at;
              return (
                <Card key={i.id} className="flex flex-wrap items-center gap-3 p-4">
                  <Badge variant={i.role === "host" ? "default" : "secondary"}>{i.role}</Badge>
                  <code className="min-w-0 flex-1 truncate rounded bg-muted px-2 py-1 text-xs">/join/{i.token}</code>
                  {revoked ? <Badge variant="outline">Revoked</Badge>
                    : expired ? <Badge variant="outline">Expired</Badge>
                    : <span className="text-xs text-muted-foreground">Expires {new Date(i.expires_at).toLocaleDateString()}</span>}
                  <Button size="sm" variant="outline" disabled={revoked || expired} onClick={() => copyInvite(i.token)}>
                    <Copy className="mr-1 h-3.5 w-3.5" /> Copy
                  </Button>
                  {!revoked && !expired && (
                    <Button size="sm" variant="ghost" onClick={() => revokeInvite(i.id)}>Revoke</Button>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        <h2 className="mt-10 font-serif text-2xl">Members</h2>
        <div className="mt-3 grid gap-3">
          {members.map((m) => (
            <Card key={m.id} className="flex items-center gap-3 p-4">
              <Badge variant={m.role === "host" ? "default" : "secondary"}>{m.role}</Badge>
              <code className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{m.user_id}</code>
              {m.user_id !== user?.id && (
                <Button size="sm" variant="ghost" onClick={() => removeMember(m.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
