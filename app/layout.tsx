import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { CartProvider } from "./contexts/cartContext";
import { WishlistProvider } from "./contexts/wishlistContext";
import { FynaroToastHost } from "./components/dashboard components/common/fynaroToast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://newjersey.ng";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "NewJersey.ng | Custom Printing, Jerseys & Branding",
    template: "%s | NewJersey.ng",
  },

  description:
    "Order custom jerseys, branded apparel, business cards, flyers, packaging and merchandise from NewJersey.ng. Printing and branding with nationwide delivery in Nigeria.",

  applicationName: "NewJersey.ng",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "NewJersey.ng",
    title: "NewJersey.ng | Custom Printing, Jerseys & Branding",
    description:
      "Custom jerseys, branded apparel, print materials and merchandise. Order from NewJersey.ng with nationwide delivery in Nigeria.",
  },

  twitter: {
    card: "summary_large_image",
    title: "NewJersey.ng | Custom Printing, Jerseys & Branding",
    description:
      "Custom jerseys, branded apparel, print materials and merchandise. Nationwide delivery in Nigeria.",
  },

  category: "Shopping",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FF6B00",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-NG"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <WishlistProvider>
            {children}
            <FynaroToastHost />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}