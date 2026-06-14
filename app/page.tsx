import TopBar from "./components/TopBar";
import Header from "./components/Header";
import Hero from "./components/Hero"; 
import SeamlessPrintsDelivery from "./components/Seamless";
import BusinessStationery from "./components/Stationery"; 
import TshirtsClothing from "./components/Clothing"; 
import EventsSection from "./components/Events";
import TrustedBrandsSection from "./components/TrustedBrand";
import NewsletterSection from "./components/Newslettr";

import Copyright from "./components/Copyright";

import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <TopBar />

      <Header />
      <Hero />
      <SeamlessPrintsDelivery/>
      <BusinessStationery/>
      <TshirtsClothing/>
      <EventsSection/>
      <TrustedBrandsSection/>
      
      <NewsletterSection/>
      <Footer/>
      <Copyright/>

      
    </main>
  );
}