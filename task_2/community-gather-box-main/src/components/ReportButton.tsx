import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Flag } from "lucide-react";
import { toast } from "sonner";

export function ReportButton({
  targetType, targetId, compact,
}: { targetType: "event" | "photo"; targetId: string; compact?: boolean }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  

  const submit = async () => {
    if (!user) { navigate({ to: "/login", search: { redirect: window.location.pathname } }); return; }
    if (reason.trim().length < 4) { toast.error("Please provide a brief reason"); return; }
    setBusy(true);
    const { error } = await supabase.from("reports").insert({
      target_type: targetType, target_id: targetId,
      reporter_id: user.id, reason: reason.trim().slice(0, 500),
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Report submitted — thank you");
    setOpen(false); setReason("");
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      navigate({ to: "/login", search: { redirect: window.location.pathname } });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={compact ? "secondary" : "ghost"}
          size={compact ? "icon" : "sm"}
          className={compact ? "h-7 w-7" : ""}
          onClick={handleTriggerClick}
        >
          <Flag className={compact ? "h-3.5 w-3.5" : "mr-1.5 h-4 w-4"} />
          {!compact && "Report"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report this {targetType}</DialogTitle>
          <DialogDescription>Tell us what's wrong. The host will review your report.</DialogDescription>
        </DialogHeader>
        <Textarea value={reason} onChange={(e) => setReason(e.target.value)} maxLength={500} rows={4}
          placeholder="What's the issue?" />
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={busy}>Submit report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
