"use client";
import Link from "next/link";
import { Check, Info, CircleAlert } from "lucide-react";
import {
  ToastContainer,
  toast,
  cssTransition,
  type ToastOptions,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./newjerseyToast.css";
const transition = cssTransition({
  enter: "nj-toast-enter",
  exit: "nj-toast-exit",
  collapse: true,
  collapseDuration: 140,
});
export function FynaroToastHost() {
  return (
    <ToastContainer
      position="bottom-left"
      limit={2}
      newestOnTop
      autoClose={4200}
      hideProgressBar
      closeOnClick={false}
      pauseOnHover
      pauseOnFocusLoss
      draggable={false}
      theme="light"
      transition={transition}
      toastClassName="nj-toast"
      aria-label="NewJersey updates"
    />
  );
}
export function notifyShop(
  title: string,
  body?: string,
  options: ToastOptions & { href?: string; action?: string } = {},
) {
  const { href, action, ...rest } = options;
  toast.clearWaitingQueue();
  const Icon =
    rest.type === "error" ? CircleAlert : rest.type === "info" ? Info : Check;
  return toast(
    <div className="flex items-start gap-3">
      <Icon
        size={18}
        aria-hidden="true"
        className="mt-0.5 shrink-0 text-[#B94700]"
      />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-[#181818]">{title}</p>
        {body && (
          <p className="mt-1 text-xs leading-5 text-[#625D55]">{body}</p>
        )}
        {href && (
          <Link
            href={href}
            onClick={() => toast.dismiss(rest.toastId)}
            className="mt-2 inline-flex min-h-8 items-center text-xs font-semibold text-[#181818] underline underline-offset-4"
          >
            {action ?? "View"}
          </Link>
        )}
      </div>
    </div>,
    { ...rest, icon: false, role: rest.type === "error" ? "alert" : "status" },
  );
}
// Keep existing imports working while removing the old Fynaro/gold styling.
export function useFynaroToast() {
  return {
    notifyAddToCart: (name: string) =>
      notifyShop("Added to your cart", name, {
        toastId: `cart-${name}`,
        href: "/shop/cart",
        action: "View cart",
      }),
    notifyProjectRequestCreated: ({
      projectName,
      ref,
    }: { projectName?: string; ref?: string } = {}) =>
      notifyShop(
        "Request submitted",
        [projectName, ref].filter(Boolean).join(" · "),
        { href: "/shop/order", action: "View orders" },
      ),
    notifyWishlistToggle: (name: string, added: boolean) =>
      notifyShop(added ? "Saved" : "Removed", name, { type: "info" }),
    notifyGoldMoment: (title: string, body?: string) => notifyShop(title, body),
    rawToast: toast,
  };
}
