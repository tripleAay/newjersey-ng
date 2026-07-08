import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa6";

const footerLinks = {
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Track Order", href: "/track-order" },
    { label: "Training", href: "/training" },
    { label: "Blog", href: "/blog" },
  ],
  services: [
    { label: "Custom Printing", href: "/products" },
    { label: "Apparel Printing", href: "/apparel" },
    { label: "Business Stationery", href: "/products?category=business-stationery" },
    { label: "Event Essentials", href: "/products?category=events" },
    { label: "Hire a Designer", href: "/hire-designer" },
  ],
  support: [
    { label: "Print Guidelines", href: "/print-guidelines" },
    { label: "Shipping & Delivery", href: "/shipping" },
    { label: "Payment Options", href: "/payment-options" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

const socialLinks = [
  {
    label: "Facebook",
    href: "https://web.facebook.com/profile.php?id=61590863126697",
    icon: FaFacebookF,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@newjersey.ng",
    icon: FaTiktok,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/newjersey.ng/",
    icon: FaInstagram,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/2348089570493",
    icon: FaWhatsapp,
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#0b0b0b] text-white">
      <div className="mx-auto max-w-7xl px-8 py-16 lg:px-16">
        <div className="mb-12 flex flex-col gap-6 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-md">
            <Link href="/" className="text-2xl font-black tracking-tight">
              New<span className="text-[#ff6b00]">Jersey</span>
              <span className="text-sm">.ng</span>
            </Link>

            <p className="mt-4 text-sm leading-7 text-white/55">
              Custom printing, apparel, merchandise, and brand materials made
              for businesses, creators, schools, teams, and events.
            </p>
          </div>

          <Link
            href="/quote"
            className="w-fit rounded-full bg-[#ff6b00] px-6 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-black"
          >
            Request a Quote
          </Link>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.2fr]">
          <FooterColumn title="Company" links={footerLinks.company} />
          <FooterColumn title="Services" links={footerLinks.services} />
          <FooterColumn title="Support" links={footerLinks.support} />

          <div>
            <h3 className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-[#ff6b00]">
              Connect
            </h3>

            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:border-[#ff6b00] hover:bg-[#ff6b00] hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">
                Payment
              </p>
              <p className="mt-3 text-sm font-semibold leading-6 text-white/70">
                Card • Bank Transfer • Online Checkout
              </p>
            </div>

           
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-[#ff6b00]">
        {title}
      </h3>

      <ul className="space-y-3">
        {links.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-sm text-white/55 transition hover:text-white"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}