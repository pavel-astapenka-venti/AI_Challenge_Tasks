import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function SiteHeader() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [hasRole, setHasRole] = useState<boolean | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setHasRole(null); setDisplayName(null); return; }
    let active = true;
    supabase.from("host_members").select("host_id").eq("user_id", user.id).limit(1)
      .then(({ data }) => { if (active) setHasRole((data?.length ?? 0) > 0); });
    supabase.from("profiles").select("display_name").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => { if (active) setDisplayName(data?.display_name ?? null); });
    return () => { active = false; };
  }, [user]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-warm shadow-warm">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-semibold">Gather</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link to="/explore" className="hidden rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground sm:block">
            Explore
          </Link>
          {user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline" suppressHydrationWarning>
                Hello, {displayName ?? user.email}
              </span>
              <Button asChild variant="ghost" size="sm">
                <Link to="/tickets">My tickets</Link>
              </Button>
              {hasRole && (
                <>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/my-events">My events</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                </>
              )}
              {hasRole === false && (
                <Button asChild variant="ghost" size="sm">
                  <Link to="/become-host">Become a host</Link>
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={async () => { await signOut(); navigate({ to: "/" }); }}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/become-host">Become a host</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
