import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CHS CHAOS — Cuthbertson High School Theatre & Chorus Boosters",
  description:
    "CHS CHAOS supports the theatre and choral programs at Cuthbertson High School in Waxhaw, NC. Tickets, events, volunteering, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- intentional: site-wide display fonts loaded globally */}
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Fraunces:ital,opsz,wght@0,9..144,400..900;1,9..144,400..700&family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
