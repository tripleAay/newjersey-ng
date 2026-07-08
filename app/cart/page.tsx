
import TopBar from "@/app/components/TopBar";
import Header from "@/app/components/Header";
import EmptyCartPanel from "@/app/components/EmptyCartPanel"; 
import CartPicks from "@/app/components/CartPicks";
import OrderSummary from "@/app/components/OrderSummary";
import Footer from "@/app/components/Footer";
import Copyright from "@/app/components/Copyright";

export default function CartPage() {
    return (
        <main className="min-h-screen bg-[#fafafa]">
            <TopBar />
            <Header />
            <div className="mx-auto grid max-w-7xl gap-8 px-8 py-8 lg:grid-cols-[1fr_360px] lg:px-16">
                {/* Left scrollable side */}
                <section className="space-y-8">
                    <EmptyCartPanel />
                    <CartPicks />
                </section>

                {/* Right static side */}

                <aside className="lg:sticky lg:top-24 lg:h-fit">
                    <OrderSummary />
                </aside>
            </div>
            <Footer />
            <Copyright />
        </main>
    );
}