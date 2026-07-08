import StickyNavigation from "../components/StickyNavigation";
import DesignerHero from "../components/DesignerHero";
import HireDesignerForm from "../components/HireDesignerForm";
import Footer from "../components/Footer";
import Copyright from "../components/Copyright";


export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f7]">
      <StickyNavigation />
      <DesignerHero />
      <HireDesignerForm />
      <Footer />
      <Copyright/>
    </main>
  );
}