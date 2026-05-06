import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { ReportButton } from "@/components/ReportButton";

type Photo = { id: string; storage_path: string; caption: string | null; user_id: string; status: string };

const BUCKET = "event-photos";

function publicUrl(path: string) {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export function EventGallery({ eventId, isAttendee }: { eventId: string; isAttendee: boolean }) {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [myPending, setMyPending] = useState<Photo[]>([]);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const refresh = async () => {
    const { data } = await supabase.from("event_photos")
      .select("id, storage_path, caption, user_id, status")
      .eq("event_id", eventId).eq("status", "approved").is("hidden_at", null)
      .order("created_at", { ascending: false });
    setPhotos((data as any) ?? []);

    if (user) {
      const { data: mine } = await supabase.from("event_photos")
        .select("id, storage_path, caption, user_id, status")
        .eq("event_id", eventId).eq("user_id", user.id).neq("status", "approved")
        .order("created_at", { ascending: false });
      setMyPending((mine as any) ?? []);
    } else {
      setMyPending([]);
    }
  };

  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, [eventId, user?.id]);

  const upload = async () => {
    if (!file || !user) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("Max file size is 10 MB"); return; }
    if (!file.type.startsWith("image/")) { toast.error("Only images allowed"); return; }
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${user.id}/${eventId}/${crypto.randomUUID()}.${ext}`;
    const up = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
    if (up.error) { toast.error(up.error.message); setUploading(false); return; }
    const { error } = await supabase.from("event_photos").insert({
      event_id: eventId, user_id: user.id, storage_path: path, caption: caption.trim() || null,
    });
    setUploading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Uploaded — waiting for host approval");
    setFile(null); setCaption("");
    refresh();
  };

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl">Gallery</h2>
        {photos.length > 0 && <span className="text-xs text-muted-foreground">{photos.length} photo{photos.length === 1 ? "" : "s"}</span>}
      </div>

      {isAttendee && user && (
        <Card className="mt-3 p-4">
          <p className="text-sm font-medium">Share a photo from this event</p>
          <p className="mt-1 text-xs text-muted-foreground">Hosts approve uploads before they appear publicly.</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="max-w-xs" />
            <Input placeholder="Caption (optional)" value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={140} className="min-w-0 flex-1" />
            <Button onClick={upload} disabled={!file || uploading}>
              <Upload className="mr-1.5 h-4 w-4" /> {uploading ? "Uploading…" : "Upload"}
            </Button>
          </div>
          {myPending.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-muted-foreground">Your submissions</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {myPending.map((p) => (
                  <div key={p.id} className="relative">
                    <img src={publicUrl(p.storage_path)} className="h-16 w-16 rounded object-cover" alt="" />
                    <Badge variant="secondary" className="absolute -bottom-1 -right-1 text-[9px]">{p.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {photos.length === 0 ? (
        <Card className="mt-4 border-dashed p-10 text-center text-muted-foreground">
          <ImageIcon className="mx-auto h-8 w-8 opacity-50" />
          <p className="mt-2 text-sm">No photos yet.</p>
        </Card>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((p) => (
            <figure key={p.id} className="group relative overflow-hidden rounded-xl bg-muted">
              <img src={publicUrl(p.storage_path)} alt={p.caption ?? ""} className="aspect-square w-full object-cover" />
              {p.caption && <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-xs text-white">{p.caption}</figcaption>}
              <div className="absolute right-1 top-1 opacity-0 transition group-hover:opacity-100">
                <ReportButton targetType="photo" targetId={p.id} compact />
              </div>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
