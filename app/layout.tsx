import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { Inter, Fraunces, Nunito, JetBrains_Mono } from "next/font/google";
import CookieBanner from "@/components/CookieBanner";
import Analytics from "@/components/Analytics";
import ThemeProvider from "@/components/ThemeProvider";
import TopLoader from "@/components/TopLoader";
import Shell from "@/components/v2/Shell";
import { AuthProvider } from "./providers/auth-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--tb-font-inter",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
  variable: "--tb-font-fraunces",
});
const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800"],
  variable: "--tb-font-nunito",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "700"],
  variable: "--tb-font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Toolblip - Free Online Developer Tools",
    template: "%s | Toolblip",
  },
  description:
    "Free browser-based tools: word counter, JSON formatter, Base64, URL encoder, UUID generator, and more. 100% client-side, no uploads, no account needed.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://toolblip.com"),
  openGraph: {
    type: "website",
    siteName: "Toolblip",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-density="comfy"
      data-fontswap="sans"
      data-cat-color="on"
      className={`${inter.variable} ${fraunces.variable} ${nunito.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        {process.env.NEXT_PUBLIC_BING_VERIFICATION_CODE ? (
          <meta
            name="msvalidate.01"
            content={process.env.NEXT_PUBLIC_BING_VERIFICATION_CODE}
          />
        ) : null}
        <Script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;var s={};try{s=JSON.parse(localStorage.getItem('tb_settings')||'null')||{};}catch(e){}var legacy=localStorage.getItem('theme');var theme=s.theme||legacy||'system';var density=s.density||'comfy';var font=s.font||'sans';var isDark=theme==='dark'||(theme==='system'&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(isDark){d.classList.add('dark');d.setAttribute('data-theme','dark');}else{d.setAttribute('data-theme','light');}d.setAttribute('data-density',density);d.setAttribute('data-fontswap',font);}catch(e){}})()`,
          }}
        />
      </head>
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-red-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>

        <ThemeProvider>
          <AuthProvider>
            <Suspense fallback={null}>
              <TopLoader />
            </Suspense>
            <Shell>{children}</Shell>
            <Analytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
            <CookieBanner />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
