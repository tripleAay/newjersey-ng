import StickyNavigation from "./components/StickyNavigation";
import Hero from "./components/Hero";
import SeamlessPrintsDelivery from "./components/Seamless";
import BusinessStationery from "./components/Stationery";

import TrustedBrandsSection from "./components/TrustedBrand";
import TestimonialsSection from "./components/Testimony";
import NewsletterSection from "./components/Newslettr";
import Footer from "./components/Footer";


export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <StickyNavigation />

      <Hero />
      <SeamlessPrintsDelivery />
      <BusinessStationery />

      <TrustedBrandsSection />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
      {/* <Copyright /> */}
    </main>
  );
}