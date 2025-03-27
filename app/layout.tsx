import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import FullScreenProvider from "@/components/full-screen-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MatsyaMitra",
  description: "Your fishing companion app",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content",
  themeColor: "#3b82f6",
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
    "theme-color": "#3b82f6",
    "msapplication-navbutton-color": "#3b82f6",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "msapplication-starturl": "/",
  }
};

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
