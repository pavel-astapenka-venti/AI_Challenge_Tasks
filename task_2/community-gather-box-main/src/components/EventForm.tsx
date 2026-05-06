import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type EventFormValues = {
  title: string;
  description: string;
  start_at: string; // datetime-local
  end_at: string;
  time_zone: string;
  is_online: boolean;
  location: string;
  online_url: string;
  capacity: string;
  cover_image_url: string;
  visibility: "public" | "unlisted";
  is_paid: boolean;
};

export const emptyEvent: EventFormValues = {
  title: "", description: "", start_at: "", end_at: "",
  time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  is_online: false, location: "", online_url: "",
  capacity: "", cover_image_url: "", visibility: "public", is_paid: false,
};

const COMMON_TZ = ["UTC","America/New_York","America/Los_Angeles","America/Chicago","Europe/London","Europe/Paris","Europe/Berlin","Asia/Tokyo","Asia/Singapore","Australia/Sydney"];

export function EventForm({
  initial, submitting, onSubmit, submitLabel,
}: {
  initial: EventFormValues;
  submitting?: boolean;
  submitLabel: string;
  onSubmit: (v: EventFormValues) => Promise<void> | void;
}) {
  const [v, setV] = useState<EventFormValues>(initial);
  const update = <K extends keyof EventFormValues>(k: K, val: EventFormValues[K]) => setV((s) => ({ ...s, [k]: val }));

  const handle = async (e: FormEvent) => { e.preventDefault(); await onSubmit(v); };

  return (
    <form onSubmit={handle} className="space-y-6">
      <Card className="space-y-5 p-6">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input id="title" required maxLength={120} value={v.title} onChange={(e) => update("title", e.target.value)} placeholder="Friday Night Potluck" />
        </div>
        <div>
          <Label htmlFor="desc">Description</Label>
          <Textarea id="desc" rows={5} maxLength={2000} value={v.description} onChange={(e) => update("description", e.target.value)} placeholder="What should attendees know?" />
        </div>
        <div>
          <Label htmlFor="cover">Cover image URL</Label>
          <Input id="cover" type="url" value={v.cover_image_url} onChange={(e) => update("cover_image_url", e.target.value)} placeholder="https://…" />
        </div>
      </Card>

      <Card className="space-y-5 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="start">Starts *</Label>
            <Input id="start" type="datetime-local" required value={v.start_at} onChange={(e) => update("start_at", e.target.value)} />
          </div>
          <div>
            <Label htmlFor="end">Ends *</Label>
            <Input id="end" type="datetime-local" required value={v.end_at} onChange={(e) => update("end_at", e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Time zone</Label>
          <Select value={v.time_zone} onValueChange={(val) => update("time_zone", val)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {COMMON_TZ.includes(v.time_zone) ? null : <SelectItem value={v.time_zone}>{v.time_zone}</SelectItem>}
              {COMMON_TZ.map((tz) => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="space-y-5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="online">Online event</Label>
            <p className="text-xs text-muted-foreground">Toggle for a virtual gathering.</p>
          </div>
          <Switch id="online" checked={v.is_online} onCheckedChange={(b) => update("is_online", b)} />
        </div>
        {v.is_online ? (
          <div>
            <Label htmlFor="url">Meeting link</Label>
            <Input id="url" type="url" value={v.online_url} onChange={(e) => update("online_url", e.target.value)} placeholder="https://meet…" />
          </div>
        ) : (
          <div>
            <Label htmlFor="loc">Venue address</Label>
            <Input id="loc" value={v.location} onChange={(e) => update("location", e.target.value)} placeholder="123 Main St, City" />
          </div>
        )}
      </Card>

      <Card className="space-y-5 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="cap">Capacity</Label>
            <Input id="cap" type="number" min={1} value={v.capacity} onChange={(e) => update("capacity", e.target.value)} placeholder="Optional" />
          </div>
          <div>
            <Label>Visibility</Label>
            <Select value={v.visibility} onValueChange={(val: "public" | "unlisted") => update("visibility", val)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public — searchable</SelectItem>
                <SelectItem value="unlisted">Unlisted — link-only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/40 p-4">
          <div>
            <div className="flex items-center gap-2">
              <Label htmlFor="paid">Paid event</Label>
              <Badge variant="outline" className="text-xs">Coming soon</Badge>
            </div>
            <p className="text-xs text-muted-foreground">All events are free for now.</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}>
                  <Switch id="paid" disabled checked={v.is_paid} />
                </span>
              </TooltipTrigger>
              <TooltipContent>Coming soon — paid ticketing isn't available yet.</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>{submitting ? "Saving…" : submitLabel}</Button>
      </div>
    </form>
  );
}
