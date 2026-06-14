export default function NewsletterSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#f7f7f7] px-4 py-16 md:px-10 lg:px-20">
      {/* Left dotted pattern */}
      <div className="absolute left-8 top-8 grid grid-cols-6 gap-5 opacity-100">
        {Array.from({ length: 48 }).map((_, index) => (
          <span key={index} className="h-1.5 w-1.5 rounded-full bg-black" />
        ))}
      </div>

      {/* Right dotted pattern */}
      <div className="absolute bottom-8 right-8 grid grid-cols-6 gap-5 opacity-100">
        {Array.from({ length: 48 }).map((_, index) => (
          <span key={index} className="h-1.5 w-1.5 rounded-full bg-black" />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] rounded-3xl bg-[#ffea00] px-6 py-20 text-center md:px-16 lg:px-24">
        <h2 className="mx-auto max-w-[980px] text-3xl font-black leading-tight text-black md:text-5xl">
          Subscribe to our newsletter here and <br className="hidden md:block" />
          be the first to be updated on latest news
        </h2>

        <form className="mx-auto mt-16 flex max-w-[620px] overflow-hidden rounded-md">
          <input
            type="email"
            placeholder="Your email address"
            className="h-20 flex-1 bg-white px-8 text-lg text-black outline-none placeholder:text-gray-400"
          />

          <button
            type="submit"
            className="h-20 bg-black px-10 text-lg font-semibold text-white"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}