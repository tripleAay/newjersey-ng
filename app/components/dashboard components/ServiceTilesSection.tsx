"use client";

import { useEffect, useMemo, useState } from "react";
import ServiceDisplayTile, {
  ServiceDisplayItem,
} from "@/components/dashboard components/service-display-tile";

type DbService = {
  id: string;
  title: string;
  category: string | null;
  image?: string | null;
  pricing: string | number | null;
  delivery: string | null;
  status?: "Active" | "Draft" | "Paused" | null;
  description?: string | null;
  features?: string[] | null;
  link?: string | null;
};

type ServicesResponse = {
  services: DbService[];
};

type ServiceTilesSectionProps = {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  showDetailsButton?: boolean;
};

function mapServiceToDisplay(service: DbService): ServiceDisplayItem {
  return {
    id: service.id,
    title: service.title || "Untitled Service",
    category: service.category || "Service",
    image: service.image || "/images/placeholder-service.jpg",
    pricing: service.pricing || "Price on request",
    delivery: service.delivery || "Timeline on request",
    status: service.status || "Draft",
    description:
      service.description ||
      "A premium Fynaro service designed for serious brands that want refined execution and clear delivery.",
    features: Array.isArray(service.features) ? service.features : [],
    link: service.link || `/shop/services/${service.id}`,
  };
}

export default function ServiceTilesSection({
  customerName = "",
  customerEmail = "",
  customerPhone = "",
  showDetailsButton = true,
}: ServiceTilesSectionProps) {
  const [services, setServices] = useState<DbService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/services", {
          method: "GET",
          cache: "no-store",
        });

        const text = await res.text();

        let data: ServicesResponse;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(`Invalid server response: ${text}`);
        }

        if (!res.ok) {
          throw new Error("Failed to fetch services");
        }

        setServices(data.services ?? []);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const activeServices = useMemo(() => {
    return services.filter((service) => {
      const status = service.status?.toLowerCase();
      return status === "active" || !status;
    });
  }, [services]);

  return (
    <section className="px-4 sm:px-6 lg:px-8 xl:px-10 py-10 md:py-12">
      <div className="mx-auto max-w-7xl">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ServiceDisplayTile key={i} service={null} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-red-400/20 bg-red-500/5 p-6 text-sm text-red-200">
            {error}
          </div>
        ) : !activeServices.length ? (
          <div className="overflow-hidden rounded-[28px] border border-dashed border-white/10 bg-white/[0.03]">
            <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.04]">
                <span className="text-xl text-white/70">+</span>
              </div>

              <p className="text-sm font-medium uppercase tracking-[0.16em] text-white/35">
                Service Library
              </p>

              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                No active services yet
              </h3>

              <p className="mt-3 max-w-md text-sm leading-6 text-white/55">
                Start adding services to build a clearer and stronger offer catalog
                inside your workspace.
              </p>
            </div>
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
            {activeServices.map((service) => (
              <ServiceDisplayTile
                key={service.id}
                service={mapServiceToDisplay(service)}
                customerName={customerName}
                customerEmail={customerEmail}
                customerPhone={customerPhone}
                showDetailsButton={showDetailsButton}
              />
            ))}
          </section>
        )}
      </div>
    </section>
  );
}