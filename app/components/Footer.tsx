import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa6";
const footerLinks = {
  company: ["About", "Contact", "Track Order", "Training", "Blog"],
  services: [
    "Custom Printing",
    "Apparel Printing",
    "Business Stationery",
    "Event Essentials",
    "Hire a Designer",
  ],
  support: [
    "Print Guidelines",
    "Shipping & Delivery",
    "Payment Options",
    "Privacy Policy",
    "Terms & Conditions",
  ],
};

export default function Footer() {
  return (
    <footer className="w-full bg-[#0b0b0b] text-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-12 flex flex-col justify-between gap-6 border-b border-white/10 pb-10 lg:flex-row lg:items-end">
          <div>
            <Link href="/" className="text-3xl font-black tracking-tight">
              New<span className="text-[#ff6b00]">Jersey</span>
              <span className="text-lg">.ng</span>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-6 text-white/55">
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

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-5 text-sm font-black uppercase tracking-[0.18em] text-[#ff6b00]">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-white/60 hover:text-white">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-black uppercase tracking-[0.18em] text-[#ff6b00]">
              Services
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-white/60 hover:text-white">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-black uppercase tracking-[0.18em] text-[#ff6b00]">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-white/60 hover:text-white">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-black uppercase tracking-[0.18em] text-[#ff6b00]">
              Connect
            </h3>

            <div className="flex items-center gap-3">
              {[FaFacebookF, FaTiktok, FaInstagram, FaWhatsapp].map(
                (Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:border-[#ff6b00] hover:bg-[#ff6b00] hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              )}
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
                Payment
              </p>
              <p className="mt-3 text-sm font-semibold text-white/70">
                Card • Bank Transfer • Online Checkout
              </p>
            </div>

                     </div>
        </div>

       
      </div>
    </footer>
  );
}