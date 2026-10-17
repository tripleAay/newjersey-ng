"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

const services = [
  "Brand identity",
  "Signage",
  "Vehicle branding",
  "Office or shop branding",
  "Several services",
  "I need guidance",
];

const inputClass =
  "mt-2 min-h-12 w-full rounded-lg border border-black/15 bg-white px-3 py-3 text-base text-[#181818] placeholder:text-[#8A847B] focus:border-[#181818] focus:outline-none focus:ring-2 focus:ring-black/5";

export default function BrandingEnquiry() {
  const [service, setService] = useState("");

  return (
    <form
      action="https://wa.me/2348089570493"
      method="get"
      onSubmit={(event) => {
        event.preventDefault();

        const form = event.currentTarget;
        if (!form.reportValidity()) return;

        const data = new FormData(form);

        function read(name: string) {
          return String(data.get(name) ?? "").trim();
        }

        const message = [
          "Hello NewJersey.ng, I'd like a branding quote.",
          "",
          `Name: ${read("name")}`,
          `Business: ${read("business") || "Not provided"}`,
          `Service: ${read("service")}`,
          `Location: ${read("location") || "Not provided"}`,
          `Preferred timing: ${read("timing") || "Flexible"}`,
          "",
          "Project brief:",
          read("brief"),
        ].join("\n");

        window.location.assign(
          `https://wa.me/2348089570493?text=${encodeURIComponent(message)}`
        );
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Your name
          <input
            name="name"
            autoComplete="name"
            required
            maxLength={120}
            className={inputClass}
            placeholder="Full name"
          />
        </label>

        <label className="block text-sm font-medium">
          Business name
          <span className="ml-1 font-normal text-[#625D55]">
            (optional)
          </span>
          <input
            name="business"
            autoComplete="organization"
            maxLength={160}
            className={inputClass}
            placeholder="Your business or organisation"
          />
        </label>
      </div>

      <label className="block text-sm font-medium">
        What do you need?
        <select
          name="service"
          required
          value={service}
          onChange={(event) => setService(event.target.value)}
          className={inputClass}
        >
          <option value="" disabled>
            Select a service
          </option>
          {services.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium">
        Tell us about the project
        <textarea
          name="brief"
          required
          minLength={10}
          maxLength={2000}
          rows={4}
          className={`${inputClass} resize-y`}
          placeholder={
            service === "Vehicle branding"
              ? "Vehicle type, number of vehicles and the areas you want branded."
              : service === "Signage"
                ? "Type of sign, approximate size and where it will be installed."
                : service === "Office or shop branding"
                  ? "Describe the space and the walls, windows or surfaces you want branded."
                  : "What does your business do, and what would you like us to create?"
          }
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Project location
          <span className="ml-1 font-normal text-[#625D55]">
            (optional)
          </span>
          <input
            name="location"
            maxLength={160}
            className={inputClass}
            placeholder="City and state"
          />
        </label>

        <label className="block text-sm font-medium">
          When do you need it?
          <select
            name="timing"
            defaultValue=""
            className={inputClass}
          >
            <option value="">Not sure yet</option>
            <option>This week</option>
            <option>Within two weeks</option>
            <option>This month</option>
            <option>Planning ahead</option>
          </select>
        </label>
      </div>

      <div className="border-t border-black/10 pt-5">
        <button
          type="submit"
          className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#181818] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#363636] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#181818] focus-visible:ring-offset-2 sm:w-auto"
        >
          Continue on WhatsApp
          <ArrowUpRight size={17} aria-hidden="true" />
        </button>

        <p className="mt-3 text-xs leading-6 text-[#625D55]">
          WhatsApp opens with your brief. Review it and press Send.
          You can attach photos, measurements or your existing logo there.
        </p>

        <noscript>
          <p className="mt-3 text-sm">
            JavaScript is disabled.{" "}
            <a
              href="https://wa.me/2348089570493"
              className="underline"
            >
              Contact us directly on WhatsApp
            </a>
            .
          </p>
        </noscript>
      </div>
    </form>
  );
}