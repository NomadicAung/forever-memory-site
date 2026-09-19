import type { Metadata } from "next";
import Script from "next/script";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Nostalgic Product Discovery`,
    template: `%s | ${site.name}`
  },
  description: site.description
};

const adsenseClient =
  process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT || "ca-pub-5353173099203932";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {adsenseClient ? (
        <Script
          id="google-adsense"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      ) : null}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-PPVHE6M6X7"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-PPVHE6M6X7');
        `}
      </Script>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
