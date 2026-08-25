import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CartProvider } from "@/context/CartContext";
import { RecoveryBanner } from "@/components/RecoveryBanner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "0Seven — Faith-Inspired Apparel",
  description:
    "Nigerian DTC faith-inspired apparel brand. T-Shirts, Roundnecks, Sweatshirts, Hoodies, Caps.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF8" },
    { media: "(prefers-color-scheme: dark)",  color: "#0E0D0C" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          storageKey="0s-theme"
        >
          <ErrorBoundary>
            <CartProvider>
              <RecoveryBanner />
              <Header />
              <div id="main-content" className="flex-1 flex flex-col">
                {children}
              </div>
              <Footer />
            </CartProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
