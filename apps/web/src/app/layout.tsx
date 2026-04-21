import type { Metadata } from "next";
import { DM_Sans, IBM_Plex_Mono, Newsreader } from "next/font/google";
import { Providers } from "@/components/Providers";
import { getSiteOrigin } from "@/lib/site-urls";
import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-ui-sans",
  display: "swap",
});

const serif = Newsreader({
  subsets: ["latin"],
  variable: "--font-ui-serif",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ui-mono",
  display: "swap",
});

const siteUrl = getSiteOrigin();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AUDD Subscriptions",
    template: "%s · AUDD Subscriptions",
  },
  description:
    "Open-source subscription billing in AUDD on Solana: embeddable checkout, merchant dashboard, and integration patterns for web and mobile.",
  keywords: [
    "AUDD",
    "Solana",
    "subscriptions",
    "stablecoin",
    "Australia",
    "merchant",
    "open source",
  ],
  authors: [{ name: "SolAUDD" }],
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: siteUrl,
    siteName: "AUDD Subscriptions",
    title: "AUDD Subscriptions · recurring revenue on Solana",
    description:
      "AUD-quoted plans settled in AUDD: self-hosted checkout, widget embed, and HTTP APIs for web and mobile.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AUDD Subscriptions",
    description:
      "Open infrastructure for AUD-quoted subscriptions settled in AUDD on Solana.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sans.variable} ${serif.variable} ${mono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
