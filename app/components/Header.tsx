import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <header className="w-full bg-white border-b border-black/10">
            <div className="h-[72px] flex items-center justify-between px-10">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-[26px] font-black tracking-tight text-black">
                        New<span className="text-[#ff6b00]">Jersey</span>
                        <span className="text-[15px] font-bold text-black">.ng</span>
                    </span>


                </Link>

                <nav className="hidden lg:flex items-center gap-9 text-[15px] font-semibold text-black/75">
                    {[
                        { label: "All Products", href: "/products" },
                        { label: "Apparel", href: "/apparel" },
                        { label: "Hire a Designer", href: "/hire-designer" },
                        { label: "Training", href: "/training" },
                        { label: "About", href: "/about" },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="
        relative
        transition-colors
        duration-300
        hover:text-[#ff6b00]
        after:absolute
        after:left-0
        after:-bottom-2
        after:h-[2px]
        after:w-0
        after:bg-[#ff6b00]
        after:transition-all
        after:duration-300
        hover:after:w-full
      "
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <button className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 hover:bg-zinc-50">
                        <Image src="/icons/search.svg" alt="Search" width={18} height={18} />
                    </button>

                    <Link
                        href="/quote"
                        className="hidden rounded-full bg-black px-5 py-2.5 text-[13px] font-bold text-white hover:bg-[#ff6b00] md:inline-flex"
                    >
                        Get Quote
                    </Link>

                    <Link
                        href="/cart"
                        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-black"
                    >
                        <Image src="/icons/cart.svg" alt="Cart" width={18} height={18} />

                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff6b00] text-[10px] font-bold text-white">
                            0
                        </span>
                    </Link>

                    <button className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 hover:bg-zinc-50">
                        <Image src="/icons/user.svg" alt="Account" width={18} height={18} />
                    </button>
                </div>
            </div>
        </header>
    );
}