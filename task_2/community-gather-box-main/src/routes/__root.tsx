import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth";
import { PromotionWatcher } from "@/components/PromotionWatcher";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Gather — Host warm, simple community events" },
      { name: "description", content: "Publish events, share a link, and welcome your community. A lightweight tool for free community-style gatherings." },
      { property: "og:title", content: "Gather — Host warm, simple community events" },
      { property: "og:description", content: "Publish events, share a link, and welcome your community. A lightweight tool for free community-style gatherings." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Gather — Host warm, simple community events" },
      { name: "twitter:description", content: "Publish events, share a link, and welcome your community. A lightweight tool for free community-style gatherings." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/936bdf7d-6d1c-40ee-89fd-60667b4d8d23/id-preview-49a73ad6--2e20830b-5438-4406-901a-4169f4b3657d.lovable.app-1778014450282.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/936bdf7d-6d1c-40ee-89fd-60667b4d8d23/id-preview-49a73ad6--2e20830b-5438-4406-901a-4169f4b3657d.lovable.app-1778014450282.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <PromotionWatcher />
      <Outlet />
      <Toaster richColors position="top-center" />
    </AuthProvider>
  );
}
