import EmptyCartPanel from "../components/cart/EmptyCartPanel";
import CartPicks from "../components/cart/CartPicks";
import OrderSummary from "../components/cart/OrderSummary";

export default function CartPage() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
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
    </main>
  );
}