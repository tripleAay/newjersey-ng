"use client";
import Image from "next/image";
import { useState } from "react";
import { Package, Printer, Shirt, Signpost } from "lucide-react";
export default function ProductImage({
  src,
  name,
  department = "apparel",
  jersey = false,
}: {
  src?: string;
  name: string;
  department?: string;
  jersey?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const Icon =
    jersey || department === "apparel"
      ? Shirt
      : department === "print"
        ? Printer
        : department === "branding"
          ? Signpost
          : Package;
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      {src && !failed ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="(max-width:639px) 48vw,(max-width:1023px) 25vw,210px"
          className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_top,_#ffffff,_#eee9e2)] px-5">
          <Icon
            size={40}
            strokeWidth={1}
            className="text-[#FF6B00]/40"
            aria-hidden="true"
          />
          <span className="line-clamp-2 text-center text-[11px] font-medium text-[#625D55]">
            {name}
          </span>
        </div>
      )}
    </div>
  );
}
