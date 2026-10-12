import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CartProvider } from "@/context/CartContext";
import { OfflineQueueProvider } from "@/components/OfflineQueueProvider";
import { RecoveryBanner } from "@/components/RecoveryBanner";
import { PreviewBanner } from "@/components/PreviewBanner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const alro = localFont({
  src: [
    {
      path: "../../public/fonts/alro-regular-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/alro-bold-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-heading",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFF7E4" },
    { media: "(prefers-color-scheme: dark)",  color: "#000000" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://0seven.vercel.app"
  ),
  title: {
    default: "0Seven — Faith-Inspired Apparel",
    template: "%s | 0Seven",
  },
  description:
    "Nigerian DTC faith-inspired apparel. T-Shirts, Roundnecks, Sweatshirts, Hoodies, Caps. Order on WhatsApp.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    siteName: "0Seven",
    title: "0Seven — Faith-Inspired Apparel",
    description:
      "Nigerian DTC faith-inspired apparel. T-Shirts, Roundnecks, Sweatshirts, Hoodies, Caps. Order on WhatsApp.",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: "0Seven — Faith-Inspired Apparel",
    description:
      "Nigerian DTC faith-inspired apparel. T-Shirts, Roundnecks, Sweatshirts, Hoodies, Caps. Order on WhatsApp.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "0Seven",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${alro.variable} flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          storageKey="0s-theme"
        >
          <ErrorBoundary>
            <CartProvider>
              <OfflineQueueProvider>
                <PreviewBanner />
                <RecoveryBanner />
                <Header />
                <div id="main-content" className="flex-1 flex flex-col min-w-0 w-full max-w-full">
                  {children}
                </div>
                <Footer />
              </OfflineQueueProvider>
            </CartProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
