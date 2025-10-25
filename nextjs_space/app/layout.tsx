
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: "Instagram Content Generator | Create Viral Reels with AI",
  description: "Transform your photos into viral Instagram Reels using AI. Upload, transform, animate, and download ready-to-post vertical videos in 1080x1920 resolution.",
  keywords: ["Instagram Reels", "AI video generator", "viral content", "social media", "video creation"],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Instagram Content Generator | Create Viral Reels with AI",
    description: "Transform your photos into viral Instagram Reels using AI",
    images: [{ url: "/og-image.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Content Generator",
    description: "Transform your photos into viral Instagram Reels using AI",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SessionProvider>
            {children}
            <Toaster />
            <SonnerToaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
