import StickyNavigation from "../components/StickyNavigation";
import ProductFilterHeader from "../components/ProductFilterHeader";
import ProductsGrid from "../components/ProductsGrid";
import Footer from "../components/Footer";
import Copyright from "../components/Copyright";


export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f7]">
      <StickyNavigation />
      <ProductFilterHeader />
      <ProductsGrid />
      
      <Footer />
      <Copyright/>
    </main>
  );
}