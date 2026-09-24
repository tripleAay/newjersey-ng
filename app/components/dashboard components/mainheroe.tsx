"use client";

import React, { useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Printer,
  Palette,
  Shirt,
  Image as ImageIcon,
  Wand2,
  Phone,
  Truck,
  Boxes,
  ArrowUpRight,
} from "lucide-react";

const ITEM_H = 56;

type StatusKey =
  | "available"
  | "madeToOrder"
  | "custom"
  | "preOrder";

type ProductItem = {
  name: string;
  status: StatusKey;
};

type Category = {
  id: string;
  label: string;
  icon: LucideIcon;
  blurb: string;
  items: ProductItem[];
};

type SideLinkProps = {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  last?: boolean;
};

const STATUS: Record<
  StatusKey,
  {
    label: string;
    color: string;
  }
> = {
  available: {
    label: "Available Now",
    color: "#1D9A6C",
  },
  madeToOrder: {
    label: "Made to Order",
    color: "#C1810F",
  },
  custom: {
    label: "Custom",
    color: "#5457E5",
  },
  preOrder: {
    label: "Pre-Order",
    color: "#D6304B",
  },
};

const CATEGORIES: Category[] = [
  {
    id: "print",
    label: "Print",
    icon: Printer,
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
    id: "branding",
    label: "Branding",
    icon: Palette,
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
    id: "apparel",
    label: "Apparel",
    icon: Shirt,
    blurb: "One tee, or one thousand.",
    items: [
      { name: "T-Shirts", status: "madeToOrder" },
      { name: "Caps", status: "madeToOrder" },
      { name: "Hoodies", status: "preOrder" },
      { name: "Tote Bags", status: "madeToOrder" },
    ],
  },
  {
    id: "art",
    label: "Art",
    icon: ImageIcon,
    blurb: "Prints worth framing.",
    items: [
      { name: "Wall Art", status: "madeToOrder" },
      { name: "Canvas Prints", status: "madeToOrder" },
      { name: "Posters", status: "available" },
      { name: "Custom Artwork", status: "custom" },
    ],
  },
  {
    id: "custom",
    label: "Custom",
    icon: Wand2,
    blurb: "Tell us what you're building.",
    items: [
      { name: "Custom Print", status: "custom" },
      { name: "Bulk Orders", status: "custom" },
      { name: "Bespoke Projects", status: "custom" },
    ],
  },
];

function StatusBadge({
  statusKey,
  size = "sm",
}: {
  statusKey: StatusKey;
  size?: "sm" | "md";
}) {
  const status = STATUS[statusKey];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${
        size === "sm"
          ? "text-[10px] px-2 py-[3px]"
          : "text-[11px] px-2.5 py-1"
      }`}
      style={{
        background: `${status.color}1A`,
        color: status.color,
        fontFamily: "var(--font-mono)",
        letterSpacing: ".02em",
      }}
    >
      <span
        className="rounded-full"
        style={{
          width: 5,
          height: 5,
          background: status.color,
        }}
      />

      {status.label}
    </span>
  );
}

function CornerMarks() {
  const baseStyle: React.CSSProperties = {
    position: "absolute",
    width: 14,
    height: 14,
    borderColor: "var(--ink)",
    opacity: 0.28,
  };

  return (
    <>
      <span
        style={{
          ...baseStyle,
          top: 10,
          left: 10,
          borderTop: "1.5px solid",
          borderLeft: "1.5px solid",
        }}
      />

      <span
        style={{
          ...baseStyle,
          top: 10,
          right: 10,
          borderTop: "1.5px solid",
          borderRight: "1.5px solid",
        }}
      />

      <span
        style={{
          ...baseStyle,
          bottom: 10,
          left: 10,
          borderBottom: "1.5px solid",
          borderLeft: "1.5px solid",
        }}
      />

      <span
        style={{
          ...baseStyle,
          bottom: 10,
          right: 10,
          borderBottom: "1.5px solid",
          borderRight: "1.5px solid",
        }}
      />
    </>
  );
}

function MegaMenu({ category }: { category: Category }) {
  return (
    <div className="flex h-full w-full flex-col px-10 pb-4 pt-8">
      <div className="flex items-baseline justify-between">
        <div>
          <p
            className="text-[11px] font-semibold uppercase"
            style={{
              color: "var(--accent)",
              fontFamily: "var(--font-mono)",
              letterSpacing: ".08em",
            }}
          >
            {String(
              CATEGORIES.findIndex(
                (currentCategory) =>
                  currentCategory.id === category.id
              ) + 1
            ).padStart(2, "0")}{" "}
            / {category.label}
          </p>

          <p
            className="mt-1 text-sm"
            style={{
              color: "var(--ink-soft)",
            }}
          >
            {category.blurb}
          </p>
        </div>

        <span
          className="text-xs"
          style={{
            color: "var(--ink-soft)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {category.items.length}{" "}
          {category.items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div
        className="mt-6 grid flex-1 content-start gap-3"
        style={{
          gridTemplateColumns:
            "repeat(auto-fill, minmax(190px, 1fr))",
        }}
      >
        {category.items.map((item, index) => (
          <div
            key={`${category.id}-${item.name}`}
            className="cursor-pointer rounded-xl px-4 py-3.5 transition-all"
            style={{
              border: "1px solid var(--border)",
              background: "var(--paper)",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.borderColor =
                "var(--accent)";
              event.currentTarget.style.transform =
                "translateY(-2px)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.borderColor =
                "var(--border)";
              event.currentTarget.style.transform =
                "translateY(0)";
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <span
                className="text-[11px]"
                style={{
                  color: "var(--ink-soft)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <p
              className="mt-1.5 text-[15px] font-semibold"
              style={{
                color: "var(--ink)",
                fontFamily: "var(--font-heading)",
              }}
            >
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
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background: "var(--paper)",
      }}
    >
      <CornerMarks />

      {/* Registration marks */}
      <div
        className="absolute right-10 top-10 h-40 w-40 opacity-90"
        style={{
          mixBlendMode: "multiply",
        }}
      >
        <span
          className="reg-circle"
          style={{
            background: "#00AEEF",
            animationDelay: "0s",
          }}
        />

        <span
          className="reg-circle"
          style={{
            background: "#EC008C",
            animationDelay: "-3.3s",
          }}
        />

        <span
          className="reg-circle"
          style={{
            background: "#FFE800",
            animationDelay: "-6.6s",
          }}
        />
      </div>

      <div className="relative flex h-full flex-col justify-center px-10 pb-14">
        <p
          className="text-[11px] font-semibold uppercase"
          style={{
            color: "var(--accent)",
            fontFamily: "var(--font-mono)",
            letterSpacing: ".14em",
          }}
        >
          NewJersey.ng — Lagos Print &amp; Branding House
        </p>

        <h1
          className="mt-4 font-black leading-[0.92]"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--ink)",
            fontSize: "clamp(32px, 4vw, 52px)",
            maxWidth: 520,
          }}
        >
          Everything with your name on it.
        </h1>

        <p
          className="mt-4 max-w-md text-sm"
          style={{
            color: "var(--ink-soft)",
          }}
        >
          Business cards to branded jerseys — designed,
          printed and produced from one Lagos press. Order one,
          or order five thousand.
        </p>
      </div>
    </div>
  );
}

function StatusLegend() {
  const statusKeys = Object.keys(STATUS) as StatusKey[];

  return (
    <div
      className="flex h-12 shrink-0 items-center gap-5 overflow-x-auto px-10"
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--paper-2)",
      }}
    >
      <span
        className="shrink-0 text-[10px] font-semibold uppercase"
        style={{
          color: "var(--ink-soft)",
          fontFamily: "var(--font-mono)",
          letterSpacing: ".1em",
        }}
      >
        Status key
      </span>

      {statusKeys.map((key) => (
        <StatusBadge key={key} statusKey={key} />
      ))}
    </div>
  );
}

function SideLink({
  icon: Icon,
  title,
  subtitle,
  last = false,
}: SideLinkProps) {
  return (
    <div
      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition-colors"
      style={{
        borderBottom: last
          ? "none"
          : "1px solid var(--border)",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.background =
          "var(--paper-2)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.background =
          "transparent";
      }}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={{
          border: "1.5px solid var(--accent)",
        }}
      >
        <Icon
          className="h-4 w-4"
          style={{
            color: "var(--accent)",
          }}
          strokeWidth={2}
        />
      </div>

      <div>
        <p
          className="text-[13px] font-bold tracking-wide"
          style={{
            color: "var(--ink)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {title}
        </p>

        {subtitle && (
          <p
            className="text-[13px]"
            style={{
              color: "var(--ink-soft)",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export default function NewJerseyHero() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(
    null
  );

  const leaveTimer =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLeave = () => {
    if (leaveTimer.current !== null) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearLeave();

    leaveTimer.current = setTimeout(() => {
      setHoveredIdx(null);
    }, 120);
  };

  const activeCategory =
    hoveredIdx !== null
      ? CATEGORIES[hoveredIdx] ?? null
      : null;

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center p-6"
      style={{
        background: "var(--page-bg)",
        marginBottom: -30,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        :root {
          --font-display: 'Archivo Black', ui-sans-serif, sans-serif;
          --font-heading: 'Space Grotesk', ui-sans-serif, sans-serif;
          --font-body: 'Inter', ui-sans-serif, sans-serif;
          --font-mono: 'IBM Plex Mono', ui-monospace, monospace;

          --page-bg: #FF6B00;
          --paper: #FBFAF7;
          --paper-2: #F1EFE9;
          --ink: #1B1B1F;
          --ink-soft: #63625C;
          --accent: #C4157A;
          --border: #E1DFD6;
        }

        .newjersey-hero {
          font-family: var(--font-body);
        }

        .reg-circle {
          position: absolute;
          inset: 0;
          margin: auto;
          width: 84px;
          height: 84px;
          border-radius: 9999px;
          animation: registerDrift 11s ease-in-out infinite;
        }

        @keyframes registerDrift {
          0% {
            transform: translate(0px, 0px);
          }

          25% {
            transform: translate(6px, -4px);
          }

          50% {
            transform: translate(0px, 0px);
          }

          75% {
            transform: translate(-6px, 4px);
          }

          100% {
            transform: translate(0px, 0px);
          }
        }

        .nav-item {
          position: relative;
          cursor: pointer;
        }

        .nav-item .row {
          transition:
            color 0.15s ease,
            background 0.15s ease;
        }

        .nav-item.is-active .row {
          color: var(--accent);
          background: var(--paper-2);
        }

        .nav-item .row:hover {
          background: var(--paper-2);
        }

        .panel-fade-enter {
          animation: panelIn 0.3s cubic-bezier(.22,.8,.32,1);
        }

        @keyframes panelIn {
          from {
            opacity: 0;
            transform: translateX(8px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .reg-circle,
          .panel-fade-enter {
            animation: none !important;
          }
        }

        @media (max-width: 1100px) {
          .newjersey-main-grid {
            grid-template-columns: 220px 1fr !important;
          }

          .newjersey-right-rail {
            grid-column: 1 / -1;
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 760px) {
          .newjersey-hero {
            padding: 12px !important;
          }

          .newjersey-main-grid {
            grid-template-columns: 1fr !important;
          }

          .newjersey-left-rail {
            min-height: auto;
          }

          .newjersey-right-rail {
            grid-column: auto;
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div
        className="newjersey-hero newjersey-main-grid grid w-full max-w-[1400px] gap-4"
        style={{
          gridTemplateColumns: "260px 1fr 300px",
        }}
      >
        {/* LEFT RAIL */}
        <div
          className="newjersey-left-rail relative flex flex-col overflow-hidden rounded-2xl"
          style={{
            background: "var(--paper)",
            border: "1px solid var(--border)",
          }}
          onMouseLeave={scheduleClose}
        >
          <div className="px-5 pb-3 pt-5">
            <p
              className="text-lg font-black leading-none"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--ink)",
              }}
            >
              NewJersey
              <span
                style={{
                  color: "var(--accent)",
                }}
              >
                .ng
              </span>
            </p>
          </div>

          <div
            className="absolute w-[3px] rounded-r"
            style={{
              left: 0,
              top: 88,
              height: ITEM_H - 16,
              background: "var(--accent)",
              transform: `translateY(${
                (hoveredIdx ?? 0) * ITEM_H
              }px)`,
              opacity: hoveredIdx !== null ? 1 : 0,
              transition:
                "transform .22s cubic-bezier(.22,.8,.32,1), opacity .15s",
            }}
          />

          <ul className="flex-1 py-1">
            {CATEGORIES.map((category, index) => {
              const Icon = category.icon;

              return (
                <li
                  key={category.id}
                  className={`nav-item ${
                    hoveredIdx === index
                      ? "is-active"
                      : ""
                  }`}
                  onMouseEnter={() => {
                    clearLeave();
                    setHoveredIdx(index);
                  }}
                  style={{
                    height: ITEM_H,
                  }}
                >
                  <div
                    className="row flex h-full items-center gap-3 px-5"
                    style={{
                      color: "var(--ink)",
                    }}
                  >
                    <Icon
                      className="h-[19px] w-[19px]"
                      strokeWidth={1.8}
                    />

                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{
                          fontFamily:
                            "var(--font-heading)",
                        }}
                      >
                        {category.label}
                      </p>

                      <p
                        className="text-[11px]"
                        style={{
                          color: "var(--ink-soft)",
                        }}
                      >
                        {category.items.length} products
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div
            className="px-5 py-4"
            style={{
              borderTop: "1px solid var(--border)",
            }}
          >
            <p
              className="text-[11px] leading-snug"
              style={{
                color: "var(--ink-soft)",
              }}
            >
              Public catalogue shown here reflects what we can
              fulfil today — more categories are on the way.
            </p>
          </div>
        </div>

        {/* MIDDLE PANEL */}
        <div
          className="relative flex min-h-[530px] flex-col overflow-hidden rounded-2xl"
          style={{
            background: "var(--paper)",
            border: "1px solid var(--border)",
          }}
          onMouseLeave={scheduleClose}
          onMouseEnter={clearLeave}
        >
          <div className="relative flex-1">
            {activeCategory ? (
              <div
                key={activeCategory.id}
                className="panel-fade-enter absolute inset-0"
              >
                <MegaMenu category={activeCategory} />
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
        <div className="newjersey-right-rail flex flex-col gap-4">
          <div
            className="rounded-2xl p-2"
            style={{
              background: "var(--paper)",
              border: "1px solid var(--border)",
            }}
          >
            <SideLink
              icon={Phone}
              title="PRINT DESK"
              subtitle="0813 204 7700"
            />

            <SideLink
              icon={Truck}
              title="Track your job"
            />

            <SideLink
              icon={Boxes}
              title="Request a bulk quote"
              last
            />
          </div>

          <div
            className="relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl p-6"
            style={{
              background: "var(--ink)",
            }}
          >
            <div className="absolute left-0 right-0 top-0 flex h-1.5">
              {[
                "#00AEEF",
                "#EC008C",
                "#FFE800",
                "#1B1B1F",
                "#C4157A",
              ].map((color) => (
                <span
                  key={color}
                  style={{
                    flex: 1,
                    background: color,
                  }}
                />
              ))}
            </div>

            <div className="mt-2">
              <p
                className="text-xl font-black leading-tight text-white"
                style={{
                  fontFamily: "var(--font-display)",
                }}
              >
                Scaling up?
              </p>

              <p className="mt-3 text-sm leading-snug text-white/70">
                5,000 tote bags. 2,000 jerseys. One press, one
                job ticket, start to finish.
              </p>
            </div>

            <button
              type="button"
              className="mt-4 flex self-start items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold"
              style={{
                background: "var(--accent)",
                color: "#fff",
              }}
            >
              Get a quote
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}