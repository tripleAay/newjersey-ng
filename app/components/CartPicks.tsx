import Image from "next/image";
import Link from "next/link";

const sections = [
    {
        title: "Trending Products",
        products: [
            { title: "Custom Mug", image: "/images/mug.jpg" },
            { title: "Business Card", image: "/images/business-card.jpg" },
            { title: "Flyer Printing", image: "/images/flyer.jpg" },
            { title: "Paper Bag", image: "/images/paper-bag.jpg" },
        ],
    },

    {
        title: "Business Essentials",
        products: [
            { title: "Letterhead", image: "/images/letterhead.jpg" },
            { title: "Branded Envelope", image: "/images/envelope.jpg" },
            { title: "Plastic ID Card", image: "/images/id-card.jpg" },
            { title: "Wall Calendar", image: "/images/calendar.jpg" },
        ],
    },

    {
        title: "Apparel & Merchandise",
        products: [
            { title: "Custom T-Shirt", image: "/images/tshirt.jpg" },
            { title: "Polo Shirt", image: "/images/polo.jpg" },
            { title: "Hoodie", image: "/images/hoodie.jpg" },
            { title: "Face Cap", image: "/images/cap.jpg" },
        ],
    },
];

export default function CartPicks() {
    return (
        <section className="space-y-12">
            <div className="flex items-end justify-between">
                <div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff6b00]">
                        Recommended
                    </span>

                    <h2 className="mt-2 text-2xl font-black text-black">
                        Explore NewJersey.ng Picks
                    </h2>

                    <p className="mt-2 text-sm text-black/50">
                        Popular products customers order every day.
                    </p>
                </div>

                <Link
                    href="/products"
                    className="text-sm font-bold text-black/60 hover:text-[#ff6b00]"
                >
                    View all →
                </Link>
            </div>

            {sections.map((section) => (
                <div key={section.title}>
                    <div className="mb-5 flex items-center justify-between">
                        <h3 className="text-lg font-black text-black">
                            {section.title}
                        </h3>

                        <Link
                            href="/products"
                            className="text-xs font-bold text-black/40 hover:text-[#ff6b00]"
                        >
                            See More
                        </Link>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {section.products.map((item) => (
                            <Link
                                href="/products"
                                key={item.title}
                                className="
                  group
                  overflow-hidden
                  rounded-2xl
                  bg-white
                  border
                  border-black/5
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#ff6b00]/20
                  hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]
                "
                            >
                                <div className="relative h-[180px] overflow-hidden bg-zinc-100">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition duration-700 group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                                </div>

                                <div className="flex items-center justify-between px-4 py-3">
                                    <div>
                                        <h4 className="text-sm font-bold text-black">
                                            {item.title}
                                        </h4>

                                        <p className="mt-1 text-xs text-black/45">
                                            Customize & Order
                                        </p>
                                    </div>

                                    <span
                                        className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      bg-[#fafafa]
                      text-black/40
                      transition
                      group-hover:bg-[#ff6b00]
                      group-hover:text-white
                    "
                                    >
                                        →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
}