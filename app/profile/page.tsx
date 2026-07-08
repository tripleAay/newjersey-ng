 
import DashboardHeader from "../components/DashboardHeader";
import ProductFilterHeader from "../components/ProductFilterHeader";
import ProductsGrid from "../components/ProductsGrid";
import Footer from "../components/Footer";
import Copyright from "../components/Copyright";


export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f7]">
      <DashboardHeader/>
      <ProductFilterHeader />
      <ProductsGrid />
      
      <Footer />
      <Copyright/>
    </main>
  );
}