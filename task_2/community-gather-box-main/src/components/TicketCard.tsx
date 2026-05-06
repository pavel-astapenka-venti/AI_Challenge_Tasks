import { QRCodeSVG } from "qrcode.react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Calendar, MapPin, Globe, Download, X } from "lucide-react";
import { buildIcs, downloadIcs } from "@/lib/calendar";

export type TicketEvent = {
  id: string; slug: string; title: string; description: string | null;
  start_at: string; end_at: string; location: string | null;
  is_online: boolean; online_url: string | null;
};

export function TicketCard({
  event, status, ticketCode, onCancel, cancelling, checkedInAt, attendeeName,
}: {
  event: TicketEvent;
  status: "confirmed" | "waitlist";
  ticketCode: string;
  onCancel?: () => void;
  cancelling?: boolean;
  checkedInAt?: string | null;
  attendeeName?: string | null;
}) {
  const checkedIn = !!checkedInAt;
  const start = new Date(event.start_at);
  const end = new Date(event.end_at);

  const addToCalendar = () => {
    const ics = buildIcs({
      uid: ticketCode,
      title: event.title,
      description: event.description,
      location: event.is_online ? (event.online_url ?? "Online") : event.location,
      start, end,
      url: typeof window !== "undefined" ? `${window.location.origin}/events/${event.slug}` : undefined,
    });
    downloadIcs(`${event.slug}.ics`, ics);
  };

  return (
    <Card className="overflow-hidden">
      <div className="grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={checkedIn ? "default" : status === "confirmed" ? "default" : "secondary"}>
              {checkedIn ? "Checked in" : status === "confirmed" ? "Confirmed" : "Waitlist"}
            </Badge>
          </div>
          <Link to="/events/$slug" params={{ slug: event.slug }}>
            <h3 className="mt-2 font-serif text-2xl hover:text-primary">{event.title}</h3>
          </Link>
          {attendeeName && (
            <p className="mt-1 text-sm text-muted-foreground">Attendee: <span className="font-medium text-foreground">{attendeeName}</span></p>
          )}
          <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              {start.toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
            </div>
            <div className="flex items-center gap-2">
              {event.is_online ? <Globe className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
              <span className="truncate">{event.is_online ? "Online" : (event.location ?? "TBA")}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={addToCalendar}>
              <Download className="mr-1.5 h-3.5 w-3.5" /> Add to calendar
            </Button>
            {onCancel && !checkedIn && (
              <Button size="sm" variant="ghost" onClick={onCancel} disabled={cancelling}>
                <X className="mr-1.5 h-3.5 w-3.5" /> {cancelling ? "Cancelling…" : "Cancel RSVP"}
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-xl border border-border bg-white p-3 shadow-soft">
            <QRCodeSVG value={ticketCode} size={120} level="M" />
          </div>
          <code className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {ticketCode.slice(0, 8)}
          </code>
        </div>
      </div>
    </Card>
  );
}
