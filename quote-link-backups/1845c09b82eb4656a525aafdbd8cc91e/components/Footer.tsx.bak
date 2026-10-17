import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa6";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

const footerLinks = {
  company: [
    { label: "About us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Track order", href: "/track-order" },
    { label: "Training", href: "/training" },
    { label: "Blog", href: "/blog" },
  ],
  services: [
    { label: "Custom printing", href: "/products" },
    { label: "Apparel printing", href: "/apparel" },
    {
      label: "Business stationery",
      href: "/products?category=business-stationery",
    },
    { label: "Event essentials", href: "/products?category=events" },
    { label: "Hire a designer", href: "/hire-designer" },
  ],
  support: [
    { label: "Print guidelines", href: "/print-guidelines" },
    { label: "Shipping & delivery", href: "/shipping" },
    { label: "Payment options", href: "/payment-options" },
    { label: "Privacy policy", href: "/privacy-policy" },
    { label: "Terms & conditions", href: "/terms" },
  ],
};

const socialLinks = [
  {
    label: "Facebook",
    href: "https://web.facebook.com/profile.php?id=61590863126697",
    icon: FaFacebookF,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/newjersey.ng/",
    icon: FaInstagram,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@newjersey.ng",
    icon: FaTiktok,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/2348089570493",
    icon: FaWhatsapp,
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#2E1E0F] text-white">
      {/* Ambient orange glow */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#FF6B00]/10 blur-[120px]" />

      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-[#FF6B00]/5 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        {/* =========================================================
            TOP CTA
        ========================================================= */}
        <div className="border-b border-white/10 py-14 sm:py-16 lg:py-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#FF6B00]" />

                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/40">
                  Ready when you are
                </span>
              </div>

              <h2 className="text-4xl font-black leading-[0.9] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                Got something
                <span className="text-[#FF6B00]"> to print?</span>
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-6 text-white/45">
                Tell us what you need. We’ll help you figure out the right
                print, quantity and finish for it.
              </p>
            </div>

            <Link
              href="/quote"
              className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-full bg-[#FF6B00] px-6 py-3.5 text-sm font-black text-white transition duration-300 hover:bg-white hover:text-black"
            >
              Request a quote

              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* =========================================================
            BRAND + CONTACT
        ========================================================= */}
        <div className="grid gap-12 border-b border-white/10 py-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <Link
              href="/"
              className="inline-block text-3xl font-black tracking-[-0.04em]"
            >
              New<span className="text-[#FF6B00]">Jersey</span>
              <span className="text-sm text-white/50">.ng</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/45">
              Printing, apparel, merchandise and branding for businesses,
              creators, teams, schools and events.
            </p>

            {/* Socials */}
            <div className="mt-7 flex items-center gap-2">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/45 transition duration-300 hover:border-[#FF6B00] hover:bg-[#FF6B00] hover:text-white"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="lg:justify-self-end lg:min-w-[300px]">
            <p className="mb-5 text-[9px] font-black uppercase tracking-[0.22em] text-[#FF6B00]">
              Talk to us
            </p>

            <div className="space-y-4">
              <a
                href="https://wa.me/2348089570493"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-white/40 transition group-hover:bg-[#FF6B00] group-hover:text-white">
                  <Phone className="h-3.5 w-3.5" />
                </span>

                <span className="text-sm text-white/55 transition group-hover:text-white">
                  +234 808 957 0493
                </span>
              </a>

              <a
                href="mailto:hello@newjersey.ng"
                className="group flex items-center gap-3"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-white/40 transition group-hover:bg-[#FF6B00] group-hover:text-white">
                  <Mail className="h-3.5 w-3.5" />
                </span>

                <span className="text-sm text-white/55 transition group-hover:text-white">
                  hello@newjersey.ng
                </span>
              </a>

              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-white/40">
                  <MapPin className="h-3.5 w-3.5" />
                </span>

                <span className="text-sm text-white/55">
                  Nigeria · Nationwide delivery
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            NAVIGATION
        ========================================================= */}
        <div className="grid grid-cols-2 gap-10 border-b border-white/10 py-12 sm:grid-cols-3 lg:grid-cols-3 lg:gap-16">
          <FooterColumn title="Company" links={footerLinks.company} />

          <FooterColumn title="Services" links={footerLinks.services} />

          <FooterColumn title="Support" links={footerLinks.support} />
        </div>

        {/* =========================================================
            BOTTOM
        ========================================================= */}
        <div className="flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/25">
            © {new Date().getFullYear()} NewJersey.ng · All rights reserved.
          </p>

          <div className="flex items-center gap-5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/25">
            <Link
              href="/privacy-policy"
              className="transition hover:text-white"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-white"
            >
              Terms
            </Link>

            <span className="text-[#FF6B00]">Made for brands.</span>
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
      <h3 className="mb-5 text-[9px] font-black uppercase tracking-[0.22em] text-[#FF6B00]">
        {title}
      </h3>

      <ul className="space-y-3">
        {links.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="group inline-flex items-center text-sm text-white/45 transition duration-300 hover:text-white"
            >
              <span>{item.label}</span>

              <ArrowUpRight className="ml-1 h-3 w-3 -translate-y-0.5 translate-x-0 opacity-0 transition duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}