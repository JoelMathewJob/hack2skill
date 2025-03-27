import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import FullScreenProvider from "@/components/full-screen-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MatsyaMitra",
  description: "Your fishing companion app",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MatsyaMitra"
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "application-name": "MatsyaMitra",
    "apple-mobile-web-app-title": "MatsyaMitra",
    "msapplication-navbutton-color": "#3b82f6",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "msapplication-starturl": "/",
  }
};

// ✅ Move viewport configuration here
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: "no",
  viewportFit: "cover",
  interactiveWidget: "resizes-content"
};

// ✅ Move themeColor separately
export const themeColor = "#3b82f6";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <FullScreenProvider>
          {children}
          <Toaster />
        </FullScreenProvider>
      </body>
    </html>
  );
}
