"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sendDesignBrief } from "./actions";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronRight,
  PenTool,
  Shapes,
  Star,
  X,
} from "lucide-react";

type DesignerId = "ink" | "form";
type Designer = {
  id: DesignerId;
  name: string;
  role: string;
  line: string;
  description: string;
  strengths: string[];
  goodFor: string;
  process: string[];
};

const designers: Designer[] = [
  {
    id: "ink",
    name: "INK",
    role: "Artwork & merchandise",
    line: "Made to stand out.",
    description:
      "A bold direction for clothing graphics, posters and merchandise. Strong lettering, expressive colour and one clear focal point.",
    strengths: [
      "Statement graphics",
      "Expressive typography",
      "Merchandise artwork",
    ],
    goodFor: "T-shirt graphics, event posters and artwork-led merchandise.",
    process: [
      "Start with the message, audience and references.",
      "Build a strong graphic direction around the idea.",
      "Refine the artwork for its intended print or product.",
    ],
  },
  {
    id: "form",
    name: "FORM",
    role: "Brand design & layout",
    line: "Every detail in place.",
    description:
      "A considered direction for brand materials and business print. Clear hierarchy, precise spacing and a visual system that holds together.",
    strengths: ["Clean layouts", "Brand consistency", "Business print design"],
    goodFor: "Business cards, brand stationery, brochures and product labels.",
    process: [
      "Understand the brand, content and intended use.",
      "Set a clear layout and visual direction.",
      "Refine the hierarchy, spacing and production details.",
    ],
  },
];

const projectTypes = [
  "Clothing / jersey artwork",
  "Poster / flyer",
  "Business cards / stationery",
  "Brand identity",
  "Labels / packaging",
  "Something else",
];
const field =
  "mt-2 min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-base text-[#181818] placeholder:text-[#9A9389] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40";
const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2";

function StyleStudy({
  id,
  large = false,
}: {
  id: DesignerId;
  large?: boolean;
}) {
  return id === "ink" ? (
    <div
      aria-label="INK illustrative typography study"
      className={`relative flex h-full min-h-64 flex-col justify-between overflow-hidden bg-[#E86A35] p-6 text-[#251C17] ${large ? "sm:p-10" : "sm:p-7"}`}
    >
      <div className="relative z-10 flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.16em]">
        <span>NewJersey / Studio</span>
        <span>01 — INK</span>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 top-16 h-56 w-56 rounded-full border-[35px] border-[#F7B58D]/45"
      />
      <div className="relative z-10 py-7">
        <p
          className={`font-black uppercase leading-[0.82] tracking-[-0.075em] ${large ? "text-7xl sm:text-8xl" : "text-6xl sm:text-7xl"}`}
        >
          Wear
          <br />
          <span className="text-[#FFF2E6]">the</span>
          <br />
          idea.
        </p>
      </div>
      <div className="relative z-10 flex items-end justify-between gap-3">
        <span className="text-[9px] uppercase tracking-[0.14em]">
          Type. Colour. Character.
        </span>
        <span aria-hidden="true" className="text-3xl">
          ↗
        </span>
      </div>
    </div>
  ) : (
    <div
      aria-label="FORM illustrative layout study"
      className={`relative flex h-full min-h-64 flex-col justify-between overflow-hidden bg-[#E7E4DA] p-6 text-[#232820] ${large ? "sm:p-10" : "sm:p-7"}`}
    >
      <div className="flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.16em]">
        <span>NewJersey / Studio</span>
        <span>02 — FORM</span>
      </div>
      <div className="grid grid-cols-[1fr_auto] items-center gap-3 py-8">
        <p
          className={`font-medium leading-[0.92] tracking-[-0.07em] ${large ? "text-6xl sm:text-7xl" : "text-5xl sm:text-6xl"}`}
        >
          Good
          <br />
          by
          <br />
          <span className="italic">design.</span>
        </p>
        <div aria-hidden="true" className="grid w-14 grid-cols-2 gap-1 sm:w-20">
          <span className="aspect-square bg-[#46543D]" />
          <span className="aspect-square rounded-full border border-[#46543D]" />
          <span className="aspect-square rounded-full bg-[#8C987F]" />
          <span className="aspect-square border border-[#46543D]" />
        </div>
      </div>
      <div className="flex items-end justify-between gap-3 border-t border-[#232820]/20 pt-4">
        <span className="text-[9px] uppercase tracking-[0.14em]">
          Clarity in every detail.
        </span>
        <span className="text-[9px]">NJ / 02</span>
      </div>
    </div>
  );
}

export default function DesignerSelection() {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const submissionKey = useRef<string>("");
  const [selected, setSelected] = useState<DesignerId | null>(null);
  const [profile, setProfile] = useState<DesignerId | null>(null);
  const [brief, setBrief] = useState({
    type: "",
    name: "",
    email: "",
    phone: "",
    description: "",
    deadline: "",
  });
  const [review, setReview] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const profileTriggerRef = useRef<HTMLButtonElement | null>(null);
  const briefRef = useRef<HTMLElement>(null);
  const briefHeadingRef = useRef<HTMLHeadingElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  const chosen = designers.find((d) => d.id === selected);
  const currentProfile = designers.find((d) => d.id === profile);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (profile && dialog && !dialog.open) dialog.showModal();
    if (!profile && dialog?.open) dialog.close();
  }, [profile]);

  function moveToBrief(id: DesignerId) {
    setSelected(id);
    setReview(false);
    setProfile(null);
    requestAnimationFrame(() => {
      briefRef.current?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
      briefHeadingRef.current?.focus({ preventScroll: true });
    });
  }
  function closeProfile() {
    dialogRef.current?.close();
    setProfile(null);
    profileTriggerRef.current?.focus();
  }
  function updateBrief(key: keyof typeof brief, value: string) {
    setBrief((current) => ({ ...current, [key]: value }));
    setReview(false);
  }
  async function sendBrief() {
    if (!chosen || sending) return;
    setSending(true);
    setSendError("");
    submissionKey.current ||= crypto.randomUUID();
    try {
      const result = await sendDesignBrief({
        ...brief,
        designer: chosen.id,
        key: submissionKey.current,
      });
      if (result.error || !result.id) {
        setSendError(result.error || "Please try again.");
        setSending(false);
        return;
      }
      router.push(`/shop/design/${result.id}`);
    } catch {
      setSendError("Unable to send your brief. Try again from this page.");
      setSending(false);
    }
  }
  function reviewBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!chosen) return;
    setReview(true);
    requestAnimationFrame(() => reviewRef.current?.focus());
  }

  return (
    <main className="mx-auto max-w-[1200px] px-5 pb-16 pt-5 sm:px-8 sm:pb-20 lg:px-12">
      <Link
        href="/shop"
        className={`inline-flex min-h-11 items-center gap-2 rounded-sm text-xs text-[#625D55] ${focus}`}
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back to shop
      </Link>
      <Link href="/shop/design" className="ml-6 text-xs underline">
        My design requests
      </Link>
      <section
        aria-labelledby="designer-title"
        className="pb-10 pt-7 sm:pb-12 sm:pt-10"
      >
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8A8379]">
            NewJersey.ng / Design studio
          </p>
          <span className="rounded-full border border-black/10 px-2.5 py-1 text-[9px] font-medium uppercase tracking-wider text-[#746E65]">
            NewJersey studio
          </span>
        </div>
        <div className="mt-5 grid items-end gap-6 md:grid-cols-[1.15fr_0.85fr]">
          <h1
            id="designer-title"
            className="text-4xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-6xl"
          >
            Two perspectives.
            <br />
            <span className="text-[#8A8379]">Your next idea.</span>
          </h1>
          <p className="max-w-sm text-sm leading-7 text-[#625D55]">
            Choose the design direction that feels right for your project. Meet
            INK and FORM, our studio designers, and shape your brief.
          </p>
        </div>
      </section>
      <section
        aria-label="Choose between two designers"
        className="grid gap-5 md:grid-cols-2"
      >
        {designers.map((designer) => {
          const active = selected === designer.id;
          const Icon = designer.id === "ink" ? PenTool : Shapes;
          return (
            <article
              key={designer.id}
              className={`min-w-0 overflow-hidden rounded-[20px] border bg-white transition-colors ${active ? "border-[#181818] ring-1 ring-[#181818]" : "border-black/10"}`}
            >
              <div className="relative aspect-[6/5] sm:aspect-[7/5]">
                <StyleStudy id={designer.id} />
                <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[8px] font-medium uppercase tracking-wider text-[#494540]">
                  Illustrative style study
                </span>
              </div>
              <div className="p-5 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-3xl font-semibold tracking-[-0.055em]">
                        {designer.name}
                      </h2>
                      {active && (
                        <CheckCircle2
                          size={18}
                          aria-label="Selected"
                          className="text-[#46543D]"
                        />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-[#746E65]">
                      {designer.role}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 pt-2 text-[10px] text-[#8A8379]">
                    <Star size={12} aria-hidden="true" />
                    <span>Not rated yet</span>
                  </div>
                </div>
                <h3 className="mt-5 text-base font-semibold tracking-tight">
                  {designer.line}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[#625D55]">
                  {designer.description}
                </p>
                <ul
                  aria-label={`${designer.name} design focus`}
                  className="mt-5 flex flex-wrap gap-2"
                >
                  {designer.strengths.map((strength) => (
                    <li
                      key={strength}
                      className="rounded-full bg-[#F5F4F0] px-3 py-1.5 text-[10px] text-[#625D55]"
                    >
                      {strength}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 grid grid-cols-[1fr_auto] items-center gap-3 border-t border-black/10 pt-5">
                  <button
                    type="button"
                    onClick={() => moveToBrief(designer.id)}
                    aria-pressed={active}
                    className={`inline-flex min-h-12 items-center justify-between gap-3 rounded-full bg-[#181818] px-5 text-xs font-semibold text-white hover:bg-[#363636] ${focus}`}
                  >
                    {active
                      ? `${designer.name} selected`
                      : `Choose ${designer.name}`}
                    {active ? (
                      <Check size={16} aria-hidden="true" />
                    ) : (
                      <ArrowUpRight size={16} aria-hidden="true" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      profileTriggerRef.current = event.currentTarget;
                      setProfile(designer.id);
                    }}
                    className={`inline-flex min-h-12 items-center gap-1 rounded-sm px-2 text-xs font-medium text-[#625D55] hover:text-black ${focus}`}
                  >
                    Meet {designer.name}
                    <ChevronRight size={14} aria-hidden="true" />
                  </button>
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-[10px] leading-5 text-[#8A8379]">
                  <Icon size={12} aria-hidden="true" />
                  Scope, pricing and availability confirmed after review.
                </p>
              </div>
            </article>
          );
        })}
      </section>
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[11px] leading-6 text-[#8A8379]">
        <span>01 / Choose a direction</span>
        <span>02 / Describe the project</span>
        <span>03 / Review the brief</span>
      </div>
      <section
        ref={briefRef}
        aria-labelledby="designer-brief-title"
        className="mt-12 scroll-mt-56 border-t border-black/10 pt-8 sm:mt-16 sm:pt-10"
      >
        <div className="grid gap-7 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A8379]">
              The brief
            </p>
            <h2
              ref={briefHeadingRef}
              tabIndex={-1}
              id="designer-brief-title"
              className="mt-3 text-3xl font-semibold tracking-[-0.045em] focus:outline-none"
            >
              {chosen ? `Let’s brief ${chosen.name}.` : "Start with your idea."}
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[#625D55]">
              {chosen
                ? chosen.goodFor
                : "Choose INK or FORM above, then tell us what you want to make."}
            </p>
            <p className="mt-5 max-w-sm rounded-xl bg-[#F0EFEB] p-4 text-xs leading-6 text-[#625D55]">
              Send your brief first. We’ll confirm scope, price, deadline and
              included revisions before payment. Add reference files on your
              project page after submitting.
            </p>
          </div>
          <form
            onSubmit={reviewBrief}
            className="rounded-2xl border border-black/10 bg-white p-5 sm:p-7"
          >
            <fieldset disabled={!chosen || sending} className="min-w-0">
              <legend className="sr-only">Project brief</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-xs font-medium sm:col-span-2">
                  What are we designing?
                  <select
                    required
                    value={brief.type}
                    onChange={(e) => updateBrief("type", e.target.value)}
                    className={field}
                  >
                    <option value="">Choose a project type</option>
                    {projectTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </label>
                <label className="text-xs font-medium">
                  Your name
                  <input
                    required
                    maxLength={120}
                    autoComplete="name"
                    value={brief.name}
                    onChange={(e) => updateBrief("name", e.target.value)}
                    className={field}
                  />
                </label>
                <label className="text-xs font-medium">
                  Email address
                  <input
                    required
                    type="email"
                    maxLength={254}
                    autoComplete="email"
                    value={brief.email}
                    onChange={(e) => updateBrief("email", e.target.value)}
                    className={field}
                  />
                </label>
                <label className="text-xs font-medium sm:col-span-2">
                  Contact number
                  <input
                    type="tel"
                    required
                    maxLength={30}
                    autoComplete="tel"
                    value={brief.phone}
                    onChange={(e) => updateBrief("phone", e.target.value)}
                    className={field}
                    placeholder="+234…"
                  />
                </label>
                <label className="text-xs font-medium sm:col-span-2">
                  Tell us about the idea
                  <textarea
                    required
                    minLength={15}
                    maxLength={3000}
                    rows={4}
                    value={brief.description}
                    onChange={(e) => updateBrief("description", e.target.value)}
                    placeholder="What is it for? What should it say? Where will the design be used?"
                    className={field}
                  />
                </label>
                <label className="text-xs font-medium sm:col-span-2">
                  Preferred deadline{" "}
                  <span className="font-normal text-[#8A8379]">(optional)</span>
                  <input
                    type="date"
                    value={brief.deadline}
                    onChange={(e) => updateBrief("deadline", e.target.value)}
                    className={field}
                  />
                </label>
              </div>
              <button
                disabled={!chosen}
                className={`mt-6 inline-flex min-h-12 w-full items-center justify-between gap-3 rounded-full bg-[#181818] px-5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-35 ${focus}`}
              >
                Review brief
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </fieldset>
            {!chosen && (
              <p className="mt-3 text-center text-xs text-[#746E65]">
                Select a designer to unlock your brief.
              </p>
            )}
          </form>
        </div>
        {review && chosen && (
          <div
            ref={reviewRef}
            tabIndex={-1}
            role="region"
            aria-labelledby="brief-review-heading"
            className="mt-7 rounded-2xl border border-[#46543D]/25 bg-[#F0F3ED] p-5 focus:outline-none sm:p-7"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#65725C]">
              Review your brief
            </p>
            <h3
              id="brief-review-heading"
              className="mt-2 text-xl font-semibold"
            >
              Your project with {chosen.name}
            </h3>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
              {[
                ["Project", brief.type],
                ["Name", brief.name.trim()],
                ["Email", brief.email],
                ["Preferred deadline", brief.deadline || "Not specified"],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs text-[#625D55]">{label}</dt>
                  <dd className="mt-1 break-words font-medium">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 whitespace-pre-wrap break-words border-t border-black/10 pt-4 text-sm leading-7 text-[#494540]">
              {brief.description.trim()}
            </p>
            <p className="mt-5 text-xs leading-6 text-[#625D55]">
              Sending creates your design request. You can review the confirmed
              quote before making a payment.
            </p>
            {sendError && (
              <p role="alert" className="mt-4 text-sm text-red-800">
                {sendError}{" "}
                <Link
                  href="/login?next=%2Fhire-a-designer"
                  className="underline"
                >
                  Sign in
                </Link>
              </p>
            )}
            <button
              type="button"
              disabled={sending}
              onClick={sendBrief}
              className="mt-5 mr-5 inline-flex min-h-12 items-center rounded-full bg-[#FF6B00] px-6 text-sm font-semibold text-[#181818] disabled:opacity-50"
            >
              {sending ? "Sending…" : "Send brief"}
            </button>
            <button
              type="button"
              disabled={sending}
              onClick={() => {
                setReview(false);
                briefHeadingRef.current?.focus();
              }}
              className={`mt-3 inline-flex min-h-11 items-center rounded-sm text-xs font-semibold underline underline-offset-4 ${focus}`}
            >
              Edit brief
            </button>
          </div>
        )}
      </section>
      <dialog
        ref={dialogRef}
        onCancel={() => setProfile(null)}
        onClose={() => setProfile(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeProfile();
        }}
        aria-labelledby="designer-profile-title"
        className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100vw_-_2rem)] max-w-3xl overflow-y-auto rounded-2xl border-0 bg-[#FCFBF8] p-0 text-[#181818] shadow-2xl backdrop:bg-black/45"
      >
        {currentProfile && (
          <>
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#8A8379]">
                NewJersey studio / Designer profile
              </p>
              <button
                type="button"
                autoFocus
                onClick={closeProfile}
                aria-label="Close designer profile"
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5 ${focus}`}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="grid md:grid-cols-2">
              <div className="min-h-80">
                <StyleStudy id={currentProfile.id} large />
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-xs text-[#746E65]">{currentProfile.role}</p>
                <h2
                  id="designer-profile-title"
                  className="mt-2 text-4xl font-semibold tracking-[-0.055em]"
                >
                  Meet {currentProfile.name}.
                </h2>
                <p className="mt-4 text-sm leading-7 text-[#625D55]">
                  {currentProfile.description}
                </p>
                <h3 className="mt-6 text-sm font-semibold">
                  The design approach
                </h3>
                <ol className="mt-3 space-y-3">
                  {currentProfile.process.map((step, index) => (
                    <li
                      key={step}
                      className="flex gap-3 text-xs leading-6 text-[#625D55]"
                    >
                      <span className="font-semibold text-[#8A8379]">
                        0{index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
                <p className="mt-5 text-[11px] leading-6 text-[#8A8379]">
                  The visual is a style study, not a completed client project.
                  Client portfolios and customer ratings have not been added.
                </p>
                <button
                  type="button"
                  onClick={() => moveToBrief(currentProfile.id)}
                  className={`mt-5 inline-flex min-h-12 w-full items-center justify-between rounded-full bg-[#181818] px-5 text-xs font-semibold text-white ${focus}`}
                >
                  Choose {currentProfile.name}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          </>
        )}
      </dialog>
    </main>
  );
}
