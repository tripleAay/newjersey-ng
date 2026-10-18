"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
export default function QuickDialog({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) {
      const previous = document.activeElement as HTMLElement | null;
      const overflow = document.body.style.overflow;
      dialog.showModal();
      document.body.style.overflow = "hidden";
      return () => {
        dialog.close();
        document.body.style.overflow = overflow;
        previous?.focus();
      };
    }
    dialog.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-labelledby={id}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100vw_-_1.5rem)] max-w-4xl overflow-y-auto rounded-2xl border-0 bg-[#FCFBF8] p-0 text-[#181818] shadow-2xl backdrop:bg-black/45"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-black/10 bg-[#FCFBF8]/95 px-5 py-3 backdrop-blur">
        <h2 id={id} className="text-sm font-semibold">
          {title}
        </h2>
        <button
          type="button"
          aria-label="Close product details"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[#F58220]"
        >
          <X size={19} />
        </button>
      </div>
      {open && children}
    </dialog>
  );
}
