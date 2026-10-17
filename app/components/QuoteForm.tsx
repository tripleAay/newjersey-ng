"use client";

import { useId, useState } from "react";
import { ArrowUpRight } from "lucide-react";

const inputClass =
  "mt-2 block min-h-12 w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-base text-[#181818] placeholder:text-[#8A847B] focus:border-[#181818] focus:outline-none focus:ring-2 focus:ring-black/5";

const categories = [
  "Printing & stationery",
  "Apparel & merchandise",
  "Brand identity",
  "Signage",
  "Vehicle branding",
  "Office or shop branding",
  "Packaging & labels",
  "Something else",
];

export default function QuoteForm() {
  const formId = useId();
  const [category, setCategory] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.reportValidity()) return;

    const data = new FormData(form);

    function read(name: string): string {
      const value = data.get(name);
      return typeof value === "string" ? value.trim() : "";
    }

    const name = read("name");
    const brief = read("brief");

    if (!name || !brief) return;

    const message = [
      "Hello NewJersey.ng, I'd like a project quote.",
      "",
      `Name: ${name}`,
      `Business: ${read("business") || "Not provided"}`,
      `Email: ${read("email") || "Not provided"}`,
      `Service: ${read("category")}`,
      "",
      "Project brief:",
      brief,
      "",
      `Artwork: ${read("artwork")}`,
      `Delivery / installation location: ${
        read("location") || "To be discussed"
      }`,
      `Preferred timing: ${read("timing") || "Flexible"}`,
      `Budget: ${read("budget") || "Please advise"}`,
    ].join("\n");

    window.location.assign(
      `https://wa.me/2348089570493?text=${encodeURIComponent(message)}`
    );
  }

  return (
    <section className="bg-[#FCFBF8] px-5 pb-16 pt-8 text-[#181818] sm:px-8 sm:pb-24 sm:pt-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#625D55]">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-[#F58220]"
              />
              Request a quote
            </p>

            <h1 className="mt-5 max-w-md text-4xl font-semibold leading-[1.1] tracking-[-0.05em] sm:text-5xl">
              Tell us what
              <br />
              you need made.
            </h1>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#625D55]">
              Printing, apparel, packaging or branding. Share the
              basics and we’ll help you work out the right
              specification for your project.
            </p>

            <div className="mt-8 max-w-sm border-t border-black/10 pt-6">
              <h2 className="text-sm font-semibold">
                Not sure about the details?
              </h2>

              <p className="mt-2 text-sm leading-7 text-[#625D55]">
                Describe what you want to achieve. If you have
                quantities, sizes or references, include them.
                We can clarify the rest together.
              </p>
            </div>

            <ol className="mt-7 space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="text-[#7A7368]">01</span>
                Share your requirements.
              </li>
              <li className="flex gap-3">
                <span className="text-[#7A7368]">02</span>
                We confirm the scope and specifications.
              </li>
              <li className="flex gap-3">
                <span className="text-[#7A7368]">03</span>
                Review your quote before committing.
              </li>
            </ol>

            <a
              href="https://wa.me/2348089570493"
              className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold underline decoration-black/20 underline-offset-4 hover:decoration-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
            >
              Prefer to chat directly?
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-black/10 bg-white p-5 sm:p-8"
          >
            <h2 className="text-xl font-semibold tracking-tight">
              Your project details
            </h2>

            <p className="mt-2 text-xs leading-6 text-[#625D55]">
              Only your name, service and project brief are required.
            </p>

            <div className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`${formId}-name`}
                    className="text-sm font-medium"
                  >
                    Your name
                  </label>

                  <input
                    id={`${formId}-name`}
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={120}
                    placeholder="Full name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor={`${formId}-business`}
                    className="text-sm font-medium"
                  >
                    Business name
                    <Optional />
                  </label>

                  <input
                    id={`${formId}-business`}
                    name="business"
                    autoComplete="organization"
                    maxLength={160}
                    placeholder="Business or organisation"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor={`${formId}-email`}
                  className="text-sm font-medium"
                >
                  Email address
                  <Optional />
                </label>

                <input
                  id={`${formId}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label
                  htmlFor={`${formId}-category`}
                  className="text-sm font-medium"
                >
                  What do you need?
                </label>

                <select
                  id={`${formId}-category`}
                  name="category"
                  required
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select a service
                  </option>

                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor={`${formId}-brief`}
                  className="text-sm font-medium"
                >
                  Describe your project
                </label>

                <textarea
                  id={`${formId}-brief`}
                  name="brief"
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={4}
                  aria-describedby={`${formId}-brief-help`}
                  placeholder="For example: 200 branded T-shirts for an event, printed on the front and back."
                  className={`${inputClass} resize-y`}
                />

                <p
                  id={`${formId}-brief-help`}
                  className="mt-2 text-xs leading-6 text-[#625D55]"
                >
                  Include quantities, approximate sizes and how the
                  finished work will be used, if you know them.
                </p>
              </div>

              <fieldset>
                <legend className="text-sm font-medium">
                  Do you have artwork or an existing logo?
                </legend>

                <div className="mt-2 space-y-1">
                  {[
                    "Yes, I have artwork",
                    "I need design help",
                    "Not sure yet",
                  ].map((option) => (
                    <label
                      key={option}
                      className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-[#625D55]"
                    >
                      <input
                        type="radio"
                        name="artwork"
                        value={option}
                        defaultChecked={option === "Not sure yet"}
                        className="h-4 w-4 accent-[#181818]"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label
                  htmlFor={`${formId}-location`}
                  className="text-sm font-medium"
                >
                  Delivery or installation location
                  <Optional />
                </label>

                <input
                  id={`${formId}-location`}
                  name="location"
                  maxLength={160}
                  placeholder="City and state, or tell us if you prefer pickup"
                  className={inputClass}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={`${formId}-timing`}
                    className="text-sm font-medium"
                  >
                    Preferred timing
                    <Optional />
                  </label>

                  <input
                    id={`${formId}-timing`}
                    name="timing"
                    maxLength={120}
                    placeholder="A date, or “flexible”"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor={`${formId}-budget`}
                    className="text-sm font-medium"
                  >
                    Budget
                    <Optional />
                  </label>

                  <input
                    id={`${formId}-budget`}
                    name="budget"
                    maxLength={100}
                    placeholder="Amount or range, if known"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="mt-7 border-t border-black/10 pt-6">
              <button
                type="submit"
                className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#181818] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#363636] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#181818] focus-visible:ring-offset-2"
              >
                Continue on WhatsApp
                <ArrowUpRight size={17} aria-hidden="true" />
              </button>

              <p className="mt-3 text-xs leading-6 text-[#625D55]">
                Review your message in WhatsApp, then press Send.
                Attach your artwork or reference photos in the chat.
                This is an enquiry, not a confirmed order.
              </p>

              <noscript>
                <p className="mt-3 text-sm">
                  To request a quote,{" "}
                  <a
                    href="https://wa.me/2348089570493"
                    className="underline"
                  >
                    contact us on WhatsApp
                  </a>
                  .
                </p>
              </noscript>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Optional() {
  return (
    <span className="ml-1 text-xs font-normal text-[#7A7368]">
      (optional)
    </span>
  );
}