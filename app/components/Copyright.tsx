import Link from "next/link";

export default function Copyright() {
  return (
    <footer className="bg-[#0b0b0b]">
      <div className="h-[2px] w-full bg-[#ff6b00]" />

      <div className="mx-auto flex h-[58px] max-w-7xl items-center justify-between px-6">
        <p className="text-[12px] text-white/45">
          © {new Date().getFullYear()} NewJersey.ng
        </p>

        <div className="flex items-center gap-2 text-[12px] text-white/45">
          <span>Designed & Powered by</span>

          <Link
            href="/"
            className="font-bold text-[#ff6b00] transition hover:text-white"
          >
            Fynaro Tech
          </Link>
        </div>
      </div>
    </footer>
  );
}