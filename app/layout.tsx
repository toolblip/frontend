import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import Script from "next/script";
import localFont from "next/font/local";
import CookieBanner from "@/components/CookieBanner";
import Analytics from "@/components/Analytics";
import ThemeProvider from "@/components/ThemeProvider";
import TopLoader from "@/components/TopLoader";
import BrowserPolicyBoundary from "@/components/BrowserPolicyBoundary";
import Shell from "@/components/v2/Shell";
import Footer from "@/components/v2/Footer";
import { AuthProvider } from "./providers/auth-provider";
import PwaProvider from "./providers/pwa-provider";
import { buildSiteJsonLd, jsonLdScript } from "@/lib/tool-jsonld";
import "./globals.css";
import "./fonts/fallbacks.css";

// Keep explicit weights and fallback metrics aligned with fonts/manifest.json.
const inter = localFont({
  src: [
    { path: "./fonts/inter/inter-latin.woff2", weight: "100 900", style: "normal" },
  ],
  display: "swap",
  variable: "--tb-font-inter",
  preload: true,
  adjustFontFallback: false,
});
const interExtended = localFont({
  src: [
    { path: "./fonts/inter/inter.woff2", weight: "100 900", style: "normal" },
  ],
  display: "swap",
  variable: "--tb-font-inter-extended",
  preload: false,
  adjustFontFallback: false,
  fallback: ["Inter Fallback"],
  // Exact full-font coverage outside inter-latin.woff2; defer this file for extended glyphs.
  declarations: [{ prop: "unicode-range", value: "U+100-130,U+132-148,U+14A-151,U+154-1C3,U+1C5-254,U+256-27B,U+27E-284,U+286-290,U+292-2A4,U+2A6-2BA,U+2BD-2C5,U+2C7-2D9,U+2DB,U+2DD-303,U+306-307,U+309-30A,U+30C,U+30F,U+313,U+315,U+31B,U+323,U+326-328,U+32C,U+337-338,U+342-343,U+346-36F,U+374-376,U+37A-37F,U+384-38A,U+38C,U+38E-3A1,U+3A3-3D7,U+3DC-3DD,U+3F0-3F6,U+3F9-3FA,U+3FC-479,U+480-49D,U+4A0-4FF,U+52F,U+E3F,U+1D00,U+1D0D,U+1D1B,U+1D43,U+1D47-1D49,U+1D4D,U+1D4F-1D50,U+1D52,U+1D56-1D58,U+1D5B,U+1D62-1D65,U+1D9C,U+1DA0,U+1DBB,U+1DBF-1DF5,U+1DFC-1E9B,U+1E9D-1F15,U+1F18-1F1D,U+1F20-1F45,U+1F48-1F4D,U+1F50-1F57,U+1F59,U+1F5B,U+1F5D,U+1F5F-1F7D,U+1F80-1FB4,U+1FB6-1FC4,U+1FC6-1FD3,U+1FD6-1FDB,U+1FDD-1FEF,U+1FF2-1FF4,U+1FF6-1FFE,U+2070-2071,U+2074-208E,U+2090-209C,U+20A0-20AB,U+20AD-20AF,U+20B1-20B5,U+20B8-20BA,U+20BC-20BF,U+20DB-20DE,U+20E8,U+20F0,U+2100-2101,U+2103,U+2105-2106,U+2109,U+2113,U+2116-2117,U+211E-2121,U+2126,U+212A-212B,U+212E,U+2132,U+213B,U+214D,U+2150-217F,U+2183-2186,U+2189,U+21A9-21AA,U+21B0-21B1,U+21B3-21B5,U+21BA-21BB,U+21D0,U+21D2,U+21D4,U+21DE-21DF,U+21E4-21E5,U+21E7,U+21EA,U+2202,U+2205-2206,U+220F,U+221A,U+221E,U+222B,U+2236,U+2248,U+2260,U+2264-2265,U+2295-2298,U+2303-2305,U+2325-2327,U+232B,U+2380,U+2387,U+238B,U+23CE-23CF,U+2423,U+2460-2468,U+24B6-24CF,U+24EA,U+25A0-25A2,U+25AA,U+25B2-25B3,U+25B6-25B7,U+25BA-25BD,U+25C0-25C1,U+25C4-25C7,U+25CA-25CB,U+25CF,U+25E6,U+25EF,U+2600,U+2605-2606,U+263C,U+2661,U+2665,U+26A0,U+2713,U+2717,U+2756,U+2764,U+2780-2788,U+27EF,U+27F5-27FA,U+2913,U+2A38,U+2B06,U+2B12-2B13,U+2B1C,U+2B24,U+2C7C,U+2C7F,U+2DFF,U+2E18,U+A69F,U+A7FF,U+A92E,U+E000,U+E002-E05E,U+E06A-E0BD,U+E0C8-E0CC,U+E0DC-E0E6,U+E0F3-E0F5,U+E106,U+E109-E10A,U+E10C-E10F,U+E111-E113,U+E117-E118,U+E121-E122,U+E124,U+E12A-E15E,U+E163,U+E1C3,U+E1D2-E1DF,U+E1E1-E2DC,U+EE01-EE07,U+EE09-EE0A,U+EE0C-EE12,U+EE14,U+EE17,U+EE1D-EE45,U+EE47-EE84,U+EE87-EED6,U+EED8-EEE1,U+F6C3,U+1F12F-1F149,U+1F16A-1F16B,U+1F850,U+1F852" }],
});
const fraunces = localFont({
  src: [
    { path: "./fonts/fraunces/fraunces.woff2", weight: "500", style: "normal" },
    { path: "./fonts/fraunces/fraunces.woff2", weight: "600", style: "normal" },
    { path: "./fonts/fraunces/fraunces.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--tb-font-fraunces",
  preload: false,
  adjustFontFallback: false,
  fallback: ["Fraunces Fallback"],
});
const nunito = localFont({
  src: [
    { path: "./fonts/nunito/nunito.woff2", weight: "600", style: "normal" },
    { path: "./fonts/nunito/nunito.woff2", weight: "700", style: "normal" },
    { path: "./fonts/nunito/nunito.woff2", weight: "800", style: "normal" },
  ],
  display: "swap",
  variable: "--tb-font-nunito",
  preload: false,
  adjustFontFallback: false,
  fallback: ["Nunito Fallback"],
});
const jetbrainsMono = localFont({
  src: [
    { path: "./fonts/jetbrainsmono/jetbrainsmono.woff2", weight: "500", style: "normal" },
    { path: "./fonts/jetbrainsmono/jetbrainsmono.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--tb-font-mono",
  preload: false,
  adjustFontFallback: false,
  fallback: ["JetBrains Mono Fallback"],
});
const notoBengali = localFont({
  src: [
    { path: "./fonts/notosansbengali/notosansbengali.woff2", weight: "400", style: "normal" },
    { path: "./fonts/notosansbengali/notosansbengali.woff2", weight: "600", style: "normal" },
  ],
  display: "swap",
  variable: "--tb-font-bengali",
  preload: false,
  adjustFontFallback: false,
  fallback: ["Noto Sans Bengali Fallback"],
});

export const metadata: Metadata = {
  applicationName: "Toolblip",
  title: {
    default: "Toolblip - Free Online Developer Tools",
    template: "%s",
  },
  description:
    "Free browser tools for JSON, Base64, QR codes, word counts, and more. Most process input in your browser; accounts and some features use online services.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://toolblip.com"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Toolblip",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Toolblip",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: "/icons/apple-touch-icon.png",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1f" },
    { media: "(prefers-color-scheme: light)", color: "#1a1a1f" },
  ],
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
      className={`${inter.variable} ${interExtended.variable} ${fraunces.variable} ${nunito.variable} ${jetbrainsMono.variable} ${notoBengali.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM guidance" />
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(buildSiteJsonLd()) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-red-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>

        <ThemeProvider>
          <PwaProvider>
            <AuthProvider>
              <Suspense fallback={null}>
                <TopLoader />
              </Suspense>
              <BrowserPolicyBoundary>
                <Shell footer={<Footer />}>{children}</Shell>
              </BrowserPolicyBoundary>
              <Analytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
              <CookieBanner />
            </AuthProvider>
          </PwaProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
