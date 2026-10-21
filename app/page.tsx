import type { Metadata } from "next";

import StickyNavigation from "./components/StickyNavigation";
import Hero from "./components/Hero";
import SeamlessPrintsDelivery from "./components/Seamless";
import LandingApparel from "./components/LandingApparel";
import BusinessStationery from "./components/Stationery";
import TrustedBrandsSection from "./components/TrustedBrand";
import TestimonialsSection from "./components/Testimony";
import NewsletterSection from "./components/Newslettr";
import Footer from "./components/Footer";
import PageScrollControls from "./components/PageScrollControls";

export const dynamic = "force-dynamic";

const title = "NewJersey.ng | Printing & Branding in Nigeria";

const description =
  "Your print shop for business cards, flyers, packaging, signage, branded apparel and custom merchandise. Order from NewJersey.ng with nationwide delivery.";

export const metadata: Metadata = {
  metadataBase: new URL("https://newjersey.ng"),

  title: {
    absolute: title,
  },

  description,

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "/",
    siteName: "NewJersey.ng",
    locale: "en_NG",
    title,
    description,
  },

  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#181818]">
      <div className="sticky top-0 z-50 w-full bg-[#EBEBD3] shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
        <StickyNavigation />
      </div>

      <main id="main-content">
        <Hero />
        <SeamlessPrintsDelivery />
        <BusinessStationery />
        <LandingApparel />
        <TrustedBrandsSection />
        <TestimonialsSection />
        <NewsletterSection />
      </main>

      <Footer />
      <PageScrollControls />
    </div>
  );
}