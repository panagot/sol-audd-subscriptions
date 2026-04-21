import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="site-shell flex min-h-screen flex-col">
      <SiteHeader />
      <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 pb-20 pt-12 sm:px-6">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
