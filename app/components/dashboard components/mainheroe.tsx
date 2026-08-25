import React, { useState, useRef } from "react";
import {
  Printer, Palette, Shirt, Image as ImageIcon, Wand2,
  Phone, Truck, Boxes, ArrowUpRight
} from "lucide-react";

const ITEM_H = 56;

const STATUS = {
  available: { label: "Available Now", color: "#1D9A6C" },
  madeToOrder: { label: "Made to Order", color: "#C1810F" },
  custom: { label: "Custom", color: "#5457E5" },
  preOrder: { label: "Pre-Order", color: "#D6304B" },
};

const CATEGORIES = [
  {
    id: "print", label: "Print", icon: Printer,
    blurb: "Paper, ink, same press run.",
    items: [
      { name: "Business Cards", status: "available" },
      { name: "Flyers", status: "available" },
      { name: "Posters", status: "available" },
      { name: "Banners", status: "madeToOrder" },
      { name: "Stickers", status: "available" },
      { name: "Labels", status: "available" },
      { name: "Invitations", status: "madeToOrder" },
      { name: "Letterheads", status: "available" },
      { name: "Certificates", status: "available" },
      { name: "Brochures", status: "madeToOrder" },
    ],
  },
  {
    id: "branding", label: "Branding", icon: Palette,
    blurb: "Identity, applied to real spaces.",
    items: [
      { name: "Business Branding", status: "madeToOrder" },
      { name: "Church Branding", status: "madeToOrder" },
      { name: "School Branding", status: "madeToOrder" },
      { name: "Event Branding", status: "preOrder" },
      { name: "Signage", status: "preOrder" },
    ],
  },
  {
    id: "apparel", label: "Apparel", icon: Shirt,
    blurb: "One tee, or one thousand.",
    items: [
      { name: "T-Shirts", status: "madeToOrder" },
      { name: "Caps", status: "madeToOrder" },
      { name: "Hoodies", status: "preOrder" },
      { name: "Tote Bags", status: "madeToOrder" },
    ],
  },
  {
    id: "art", label: "Art", icon: ImageIcon,
    blurb: "Prints worth framing.",
    items: [
      { name: "Wall Art", status: "madeToOrder" },
      { name: "Canvas Prints", status: "madeToOrder" },
      { name: "Posters", status: "available" },
      { name: "Custom Artwork", status: "custom" },
    ],
  },
  {
    id: "custom", label: "Custom", icon: Wand2,
    blurb: "Tell us what you're building.",
    items: [
      { name: "Custom Print", status: "custom" },
      { name: "Bulk Orders", status: "custom" },
      { name: "Bespoke Projects", status: "custom" },
    ],
  },
];

function StatusBadge({ statusKey, size = "sm" }) {
  const s = STATUS[statusKey];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${size === "sm" ? "text-[10px] px-2 py-[3px]" : "text-[11px] px-2.5 py-1"}`}
      style={{ background: s.color + "1A", color: s.color, fontFamily: "var(--font-mono)", letterSpacing: ".02em" }}
    >
      <span className="rounded-full" style={{ width: 5, height: 5, background: s.color }} />
      {s.label}
    </span>
  );
}

function CornerMarks() {
  const style = { position: "absolute", width: 14, height: 14, borderColor: "var(--ink)", opacity: 0.28 };
  return (
    <>
      <span style={{ ...style, top: 10, left: 10, borderTop: "1.5px solid", borderLeft: "1.5px solid" }} />
      <span style={{ ...style, top: 10, right: 10, borderTop: "1.5px solid", borderRight: "1.5px solid" }} />
      <span style={{ ...style, bottom: 10, left: 10, borderBottom: "1.5px solid", borderLeft: "1.5px solid" }} />
      <span style={{ ...style, bottom: 10, right: 10, borderBottom: "1.5px solid", borderRight: "1.5px solid" }} />
    </>
  );
}

function MegaMenu({ category }) {
  return (
    <div className="h-full w-full px-10 pt-8 pb-4 flex flex-col">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-[11px] uppercase font-semibold" style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", letterSpacing: ".08em" }}>
            {String(CATEGORIES.findIndex((c) => c.id === category.id) + 1).padStart(2, "0")} / {category.label}
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>{category.blurb}</p>
        </div>
        <span className="text-xs" style={{ color: "var(--ink-soft)", fontFamily: "var(--font-mono)" }}>
          {category.items.length} {category.items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="mt-6 grid gap-3 flex-1 content-start" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))" }}>
        {category.items.map((item, i) => (
          <div
            key={item.name}
            className="rounded-xl px-4 py-3.5 cursor-pointer transition-all"
            style={{ border: "1px solid var(--border)", background: "var(--paper)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px]" style={{ color: "var(--ink-soft)", fontFamily: "var(--font-mono)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-1.5 text-[15px] font-semibold" style={{ color: "var(--ink)", fontFamily: "var(--font-heading)" }}>
              {item.name}
            </p>
            <div className="mt-2.5">
              <StatusBadge statusKey={item.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroPanel() {
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: "var(--paper)" }}>
      <CornerMarks />

      {/* registration marks — CMY circles drifting toward/away from register */}
      <div className="absolute right-10 top-10 w-40 h-40 opacity-90" style={{ mixBlendMode: "multiply" }}>
        <span className="reg-circle" style={{ background: "#00AEEF", animationDelay: "0s" }} />
        <span className="reg-circle" style={{ background: "#EC008C", animationDelay: "-3.3s" }} />
        <span className="reg-circle" style={{ background: "#FFE800", animationDelay: "-6.6s" }} />
      </div>

      <div className="relative h-full flex flex-col justify-center px-10 pb-14">
        <p className="text-[11px] font-semibold uppercase" style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", letterSpacing: ".14em" }}>
          NewJersey.ng — Lagos Print &amp; Branding House
        </p>
        <h1
          className="mt-4 font-black leading-[0.92]"
          style={{ fontFamily: "var(--font-display)", color: "var(--ink)", fontSize: "clamp(32px, 4vw, 52px)", maxWidth: 520 }}
        >
          Everything with your name on it.
        </h1>
        <p className="mt-4 text-sm max-w-md" style={{ color: "var(--ink-soft)" }}>
          Business cards to branded jerseys — designed, printed and produced from one Lagos press.
          Order one, or order five thousand.
        </p>
      </div>
    </div>
  );
}

function StatusLegend() {
  return (
    <div
      className="flex items-center gap-5 px-10 h-12 shrink-0 overflow-x-auto"
      style={{ borderTop: "1px solid var(--border)", background: "var(--paper-2)" }}
    >
      <span className="text-[10px] font-semibold uppercase shrink-0" style={{ color: "var(--ink-soft)", fontFamily: "var(--font-mono)", letterSpacing: ".1em" }}>
        Status key
      </span>
      {Object.keys(STATUS).map((k) => (
        <StatusBadge key={k} statusKey={k} />
      ))}
    </div>
  );
}

export default function NewJerseyHero() {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const leaveTimer = useRef(null);

  const clearLeave = () => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  };
  const scheduleClose = () => {
    clearLeave();
    leaveTimer.current = setTimeout(() => setHoveredIdx(null), 120);
  };

  const active = hoveredIdx !== null ? CATEGORIES[hoveredIdx] : null;

  return (
    <div className="w-full mb-[-30] min-h-screen flex items-center justify-center p-6" style={{ background: "var(--page-bg)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        :root {
          --font-display: 'Archivo Black', ui-sans-serif, sans-serif;
          --font-heading: 'Space Grotesk', ui-sans-serif, sans-serif;
          --font-body: 'Inter', ui-sans-serif, sans-serif;
          --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
          --page-bg: #E7E5DF;
          --paper: #FBFAF7;
          --paper-2: #F1EFE9;
          --ink: #1B1B1F;
          --ink-soft: #63625C;
          --accent: #C4157A;
          --border: #E1DFD6;
        }
        * { font-family: var(--font-body); }
        .reg-circle {
          position: absolute; inset: 0; margin: auto;
          width: 84px; height: 84px; border-radius: 9999px;
          animation: registerDrift 11s ease-in-out infinite;
        }
        @keyframes registerDrift {
          0%   { transform: translate(0px, 0px); }
          25%  { transform: translate(6px, -4px); }
          50%  { transform: translate(0px, 0px); }
          75%  { transform: translate(-6px, 4px); }
          100% { transform: translate(0px, 0px); }
        }
        .nav-item { position: relative; cursor: pointer; }
        .nav-item .row { transition: color .15s ease, background .15s ease; }
        .nav-item.is-active .row { color: var(--accent); background: var(--paper-2); }
        .nav-item .row:hover { background: var(--paper-2); }
        .panel-fade-enter { animation: panelIn .3s cubic-bezier(.22,.8,.32,1); }
        @keyframes panelIn { from { opacity: 0; transform: translateX(8px);} to { opacity: 1; transform: translateX(0);} }
        @media (prefers-reduced-motion: reduce) {
          .reg-circle, .panel-fade-enter { animation: none !important; }
        }
      `}</style>

      <div className="w-full max-w-[1400px] grid gap-4" style={{ gridTemplateColumns: "260px 1fr 300px" }}>
        {/* LEFT RAIL */}
        <div
          className="rounded-2xl overflow-hidden relative flex flex-col"
          style={{ background: "var(--paper)", border: "1px solid var(--border)" }}
          onMouseLeave={scheduleClose}
        >
          <div className="px-5 pt-5 pb-3">
            <p className="font-black text-lg leading-none" style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}>
              NewJersey<span style={{ color: "var(--accent)" }}>.ng</span>
            </p>
          </div>
          <div
            className="absolute w-[3px] rounded-r"
            style={{
              left: 0, top: 88,
              height: ITEM_H - 16,
              background: "var(--accent)",
              transform: `translateY(${(hoveredIdx ?? 0) * ITEM_H}px)`,
              opacity: hoveredIdx !== null ? 1 : 0,
              transition: "transform .22s cubic-bezier(.22,.8,.32,1), opacity .15s",
            }}
          />
          <ul className="py-1 flex-1">
            {CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <li
                  key={cat.id}
                  className={`nav-item ${hoveredIdx === i ? "is-active" : ""}`}
                  onMouseEnter={() => { clearLeave(); setHoveredIdx(i); }}
                  style={{ height: ITEM_H }}
                >
                  <div className="row flex items-center gap-3 px-5 h-full" style={{ color: "var(--ink)" }}>
                    <Icon className="w-[19px] h-[19px]" strokeWidth={1.8} />
                    <div>
                      <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-heading)" }}>{cat.label}</p>
                      <p className="text-[11px]" style={{ color: "var(--ink-soft)" }}>{cat.items.length} products</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="px-5 py-4" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="text-[11px] leading-snug" style={{ color: "var(--ink-soft)" }}>
              Public catalogue shown here reflects what we can fulfil today — more categories are on the way.
            </p>
          </div>
        </div>

        {/* MIDDLE PANEL */}
        <div
          className="rounded-2xl overflow-hidden relative flex flex-col"
          style={{ background: "var(--paper)", border: "1px solid var(--border)", minHeight: 530 }}
          onMouseLeave={scheduleClose}
          onMouseEnter={clearLeave}
        >
          <div className="relative flex-1">
            {active ? (
              <div key={active.id} className="absolute inset-0 panel-fade-enter">
                <MegaMenu category={active} />
              </div>
            ) : (
              <div className="absolute inset-0">
                <HeroPanel />
              </div>
            )}
          </div>
          <StatusLegend />
        </div>

        {/* RIGHT RAIL */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl p-2" style={{ background: "var(--paper)", border: "1px solid var(--border)" }}>
            <SideLink icon={Phone} title="PRINT DESK" subtitle="0813 204 7700" />
            <SideLink icon={Truck} title="Track your job" />
            <SideLink icon={Boxes} title="Request a bulk quote" last />
          </div>

          <div
            className="rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden"
            style={{ background: "var(--ink)", minHeight: 220 }}
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 flex">
              {["#00AEEF", "#EC008C", "#FFE800", "#1B1B1F", "#C4157A"].map((c, i) => (
                <span key={i} style={{ flex: 1, background: c }} />
              ))}
            </div>
            <div className="mt-2">
              <p className="text-white font-black text-xl leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                Scaling up?
              </p>
              <p className="text-white/70 text-sm mt-3 leading-snug">
                5,000 tote bags. 2,000 jerseys. One press, one job ticket, start to finish.
              </p>
            </div>
            <button
              className="mt-4 self-start rounded-full px-5 py-2.5 text-sm font-bold flex items-center gap-1.5"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Get a quote <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SideLink({ icon: Icon, title, subtitle, last }) {
  return (
    <div
      className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-colors"
      style={{ borderBottom: last ? "none" : "1px solid var(--border)" }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--paper-2)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ border: "1.5px solid var(--accent)" }}>
        <Icon className="w-4 h-4" style={{ color: "var(--accent)" }} strokeWidth={2} />
      </div>
      <div>
        <p className="text-[13px] font-bold tracking-wide" style={{ color: "var(--ink)", fontFamily: "var(--font-mono)" }}>{title}</p>
        {subtitle && <p className="text-[13px]" style={{ color: "var(--ink-soft)" }}>{subtitle}</p>}
      </div>
    </div>
  );
}