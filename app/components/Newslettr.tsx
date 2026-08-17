import { ArrowRight } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="w-full bg-[#ff6b00]">
      <div
        className="
          mx-auto
          flex
          min-h-[88px]
          max-w-7xl
          flex-col
          justify-center
          gap-5
          px-5
          py-7

          sm:px-8
          sm:py-8

          md:flex-row
          md:items-center
          md:justify-between
          md:gap-8
          md:px-6
          md:py-0
          lg:min-h-[88px]
        "
      >
        {/* TEXT */}
        <div className="flex items-start gap-3 md:items-center md:gap-4">
          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-white md:mt-0" />

          <div>
            <h2
              className="
                text-[18px]
                font-black
                leading-none
                tracking-[-0.02em]
                text-white
                sm:text-lg
              "
            >
              Stay Updated
            </h2>

            <p
              className="
                mt-1.5
                max-w-[270px]
                text-[11px]
                leading-4
                text-white/75
                sm:text-xs
              "
            >
              Offers, print inspiration, and product updates.
            </p>
          </div>
        </div>

        {/* FORM */}
        <form
          className="
            flex
            w-full
            max-w-md
            items-center
            gap-2
            md:shrink-0
          "
        >
          <input
            type="email"
            placeholder="Your email"
            className="
              h-11
              min-w-0
              flex-1
              rounded-full
              border
              border-white/20
              bg-white
              px-4
              text-[13px]
              text-black
              outline-none
              placeholder:text-gray-400
              transition
              focus:border-white
              focus:ring-2
              focus:ring-white/20
              sm:px-5
              sm:text-sm
            "
          />

          <button
            type="submit"
            className="
              flex
              h-11
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-full
              bg-black
              px-5
              text-[12px]
              font-bold
              text-white
              transition-all
              duration-300
              hover:bg-[#111]
              hover:gap-2.5
              sm:text-sm
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