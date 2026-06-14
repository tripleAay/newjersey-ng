import { ArrowRight } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="w-full bg-[#ff6b00]">
      <div className="mx-auto flex min-h-[88px] max-w-7xl items-center justify-between gap-8 px-6">
        <div className="flex items-center gap-4">
          <span className="hidden h-2 w-2 rounded-full bg-white md:block" />

          <div>
            <h2 className="text-lg font-black text-white">
              Stay Updated
            </h2>

            <p className="text-xs text-white/80">
              Offers, print inspiration, and product updates.
            </p>
          </div>
        </div>

        <form className="flex w-full max-w-md items-center gap-2">
          <input
            type="email"
            placeholder="Your email"
            className="
              h-11
              flex-1
              rounded-full
              border
              border-white/20
              bg-white
              px-5
              text-sm
              text-black
              outline-none
              placeholder:text-gray-400
            "
          />

          <button
            type="submit"
            className="
              flex
              h-11
              items-center
              gap-2
              rounded-full
              bg-black
              px-5
              text-sm
              font-bold
              text-white
              transition
              hover:bg-[#111]
            "
          >
            Join
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  );
}