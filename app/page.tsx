import StickyNavigation from "./components/StickyNavigation";
import Hero from "./components/Hero";
import SeamlessPrintsDelivery from "./components/Seamless";
import BusinessStationery from "./components/Stationery";
import TshirtsClothing from "./components/Clothing";
import EventsSection from "./components/Events";
import TrustedBrandsSection from "./components/TrustedBrand";
import TestimonialsSection from "./components/Testimony";
import NewsletterSection from "./components/Newslettr";
import Footer from "./components/Footer";
import Copyright from "./components/Copyright";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <StickyNavigation />

      <Hero />
      <SeamlessPrintsDelivery />
      <BusinessStationery />
      <TshirtsClothing />
      <EventsSection />
      <TrustedBrandsSection />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
      <Copyright />
    </main>
  );
}