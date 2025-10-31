import "./globals.css";
import { Navigation } from "@/components/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Lichess 4545 League Statistics",
  description: "Comprehensive statistics and analysis for the Lichess 4545 Team League",
  keywords: ["lichess", "4545", "chess", "statistics", "team league"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full font-syne antialiased bg-background text-foreground">
        <div className="min-h-full flex flex-col">
          <Navigation />
          <main className="flex-grow pb-10">
            {children}
          </main>
        </div>
        <SpeedInsights />
      </body>
    </html>
  );
}
