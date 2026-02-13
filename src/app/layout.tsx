import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/supabase/auth-context";
import { ThemeProvider } from "@/lib/theme-provider";
import { OfflineIndicator } from "@/components/ui/offline-indicator";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Colab — Connect. Create. Collaborate.",
  description:
    "A networking and collaboration platform for rising artists and influencers. Discover creators, collaborate on projects, and grow together.",
  keywords: [
    "creator platform",
    "collaboration",
    "artists",
    "influencers",
    "networking",
    "portfolio",
  ],
  openGraph: {
    title: "Colab — Connect. Create. Collaborate.",
    description:
      "A networking and collaboration platform for rising artists and influencers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>
        <AuthProvider>
          <ThemeProvider>
            <main id="main-content">
              {children}
            </main>
            <OfflineIndicator />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
