import {
  CheckCircle2,
  Clock3,
  FileCheck2,
  Truck,
} from "lucide-react";

type ProductInformationProps = {
  turnaround?: string;
};

const information = [
  {
    icon: FileCheck2,
    title: "Artwork",
    description:
      "Send your print-ready artwork or request design support from NewJersey.",
  },
  {
    icon: CheckCircle2,
    title: "Approval",
    description:
      "Production begins after your specifications and final artwork are confirmed.",
  },
  {
    icon: Truck,
    title: "Delivery",
    description:
      "Delivery options and charges are confirmed with your order.",
  },
];

export default function ProductInformation({
  turnaround,
}: ProductInformationProps) {
  return (
    <section className="border-t border-black/10 py-12 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
            Before production
          </p>

          <h2 className="mt-3 max-w-sm text-2xl font-semibold tracking-tight text-[#222] sm:text-3xl">
            From your artwork to the finished print.
          </h2>

          {turnaround && (
            <div className="mt-6 flex max-w-md gap-3 rounded-2xl bg-[#f5f5f3] p-4">
              <Clock3
                size={18}
                className="mt-0.5 shrink-0 text-[#FF6B00]"
              />

              <div>
                <p className="text-xs font-semibold text-[#333]">
                  Turnaround
                </p>

                <p className="mt-1 text-xs leading-5 text-[#777]">
                  {turnaround}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {information.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-black/10 bg-white p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff3ea] text-[#FF6B00]">
                  <Icon size={18} />
                </div>

                <h3 className="mt-5 text-sm font-semibold text-[#222]">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-[#888]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}