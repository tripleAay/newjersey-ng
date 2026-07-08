import StickyNavigation from "../components/StickyNavigation";
import TrainingHero from "../components/TrainingHero";
import TrainingComingSoon from "../components/TrainingComingSoon";
import Footer from "../components/Footer";
import Copyright from "../components/Copyright";


export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f7]">
      <StickyNavigation />
      <TrainingHero/>
      <TrainingComingSoon/>
      <Footer />
      <Copyright/>
    </main>
  );
}