"use client";

import {
  ToastContainer,
  toast,
  ToastOptions,
  Slide,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ProjectRequestPayload = {
  projectName?: string;
  ref?: string;
};

const baseOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 2600,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
  transition: Slide, // ✨ smooth slide-in
};

/**
 * Mount this once (e.g. in layout.tsx) so toasts can render.
 */
export function FynaroToastHost() {
  return <ToastContainer newestOnTop pauseOnFocusLoss={false} />;
}

/**
 * Hook to trigger branded toasts across the app.
 */
export function useFynaroToast() {
  const notifyAddToCart = (productName: string) => {
    toast(
      <div className="flex items-start gap-2">
        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-lg">
          🛒
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold text-white">Added to cart</p>
          <p className="text-[11px] text-neutral-300 truncate">
            {productName}
          </p>
          <p className="mt-0.5 text-[10px] text-neutral-500">
            You can adjust quantity from your Fynaro cart.
          </p>
        </div>
      </div>,
      baseOptions
    );
  };

  const notifyProjectRequestCreated = ({
    projectName,
    ref,
  }: ProjectRequestPayload = {}) => {
    const title = projectName || "New project request";
    const suffix = ref ? `Ref: ${ref}` : "We’ll update you on this dashboard.";

    toast(
      <div className="flex items-start gap-2">
        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-lg">
          ✅
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold text-white">{title}</p>
          <p className="text-[11px] text-neutral-300 mt-0.5">{suffix}</p>
          <p className="mt-0.5 text-[10px] text-neutral-500">
            Timeline, pricing and updates will live in your Fynaro dashboard.
          </p>
        </div>
      </div>,
      baseOptions
    );
  };

  const notifyWishlistToggle = (productName: string, added: boolean) => {
    toast(
      <div className="flex items-start gap-2">
        {/* Icon bubble — dark luxe */}
        <div
          className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full text-lg ${
            added
              ? "bg-pink-500/20 text-pink-300"
              : "bg-neutral-700/30 text-neutral-300"
          }`}
        >
          {added ? "💖" : "💭"}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold text-white">
            {added ? "Added to wishlist" : "Removed from wishlist"}
          </p>

          <p className="text-[11px] text-neutral-300 truncate">
            {productName}
          </p>

          <p className="mt-0.5 text-[10px] text-neutral-500">
            {added
              ? "Saved for later — check your Fynaro wishlist anytime."
              : "Item removed from your wishlist."}
          </p>
        </div>
      </div>,
      baseOptions
    );
  };

  /**
   * 💎 Luxury gold toast – for special / premium actions
   * e.g. upgrades, credits, milestone, VIP stuff.
   */
  const notifyGoldMoment = (title: string, body?: string) => {
    toast(
      <div className="relative flex items-start gap-3">
        {/* Gold glow ring */}
        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#c8a96a]/15 text-[#f5e9ce] text-lg shadow-[0_0_18px_rgba(200,169,106,0.45)]">
          ✨
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#f9f1d0]">
            {title}
          </p>
          {body && (
            <p className="mt-0.5 text-[11px] text-neutral-300">
              {body}
            </p>
          )}
          <p className="mt-0.5 text-[10px] text-neutral-500">
            Enjoy the upgrade — it’s live in your Fynaro workspace.
          </p>
        </div>
      </div>,
      {
        ...baseOptions,
        className:
          "bg-[#050506] border border-[#c8a96a]/60 shadow-[0_14px_40px_rgba(0,0,0,0.9)]",
      }
    );
  };

  return {
    notifyAddToCart,
    notifyProjectRequestCreated,
    notifyWishlistToggle,
    notifyGoldMoment,
    rawToast: toast,
  };
}
