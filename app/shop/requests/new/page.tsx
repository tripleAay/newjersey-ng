"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { FiSend, FiLink, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

import Header from "@/app/components/dashboard components/mainheader";
import { useFynaroToast } from "@/app/components/dashboard components/common/fynaroToast";
import Footer from "@/app/components/Footer";

export default function VIPProjectRequestPage() {
  const { notifyProjectRequestCreated } = useFynaroToast();

  const [title, setTitle] = useState("");
  const [brandName, setBrandName] = useState("");
  const [brief, setBrief] = useState("");
  const [extraLink, setExtraLink] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    setTimeout(() => {
      notifyProjectRequestCreated({
        projectName: title || "New Fynaro Project Request",
      });
      setSubmitting(false);
      setTitle("");
      setBrandName("");
      setBrief("");
      setExtraLink("");
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#D4DF9E] text-neutral-900 flex flex-col">
      <div className="sticky top-0 z-50 bg-[#E0DED8]/95 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <Header />
      </div>

      {/* Breadcrumb + Back Button */}
      <div className="max-w-2xl mt-10 mx-auto w-full px-5 pt-8 pb-4">
        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/shop"
            className="flex items-center gap-1.5 text-neutral-600 hover:text-[#a8862f] transition-colors"
          >
            <FiArrowLeft className="text-lg" />
            Back
          </Link>

          <span className="text-neutral-400">•</span>

          <div className="flex items-center gap-2 text-neutral-500">
            <Link href="/shop" className="hover:text-[#a8862f] transition-colors">
              Dashboard
            </Link>
            <span className="text-neutral-400">›</span>
            <span className="text-[#a8862f] font-medium">Project Request</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col justify-center items-center flex-1 px-5 py-10 max-w-2xl mx-auto space-y-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-semibold tracking-tight text-center text-neutral-900"
        >
          Ready when you are
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-neutral-600 text-sm sm:text-base max-w-lg text-center"
        >
          Submit your project request. Your proposal will be reviewed before
          details like pricing and scope are shared.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          onSubmit={handleSubmit}
          className="w-full bg-white rounded-3xl p-8 flex flex-col gap-6 shadow-[0_18px_45px_rgba(0,0,0,0.08)] border border-black/5"
        >
          <InputField
            label="Project title"
            placeholder="e.g. Rebrand + merch launch"
            value={title}
            onChange={setTitle}
            required
          />

          <InputField
            label="Brand / Company"
            placeholder="Which brand?"
            value={brandName}
            onChange={setBrandName}
          />

          <TextAreaField
            label="Quick project brief"
            placeholder="Goals, audience, must-haves..."
            value={brief}
            onChange={setBrief}
            required
          />

          <InputField
            icon={<FiLink />}
            label="Reference link (optional)"
            placeholder="Figma, Notion, Drive..."
            value={extraLink}
            onChange={setExtraLink}
          />

          <motion.button
            type="submit"
            whileTap={{ scale: 0.96 }}
            disabled={submitting}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 text-white px-10 py-3.5 font-semibold text-sm shadow-lg hover:bg-neutral-800 disabled:opacity-70 transition-all active:scale-95"
          >
            {submitting ? (
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                Send Request <FiSend />
              </>
            )}
          </motion.button>

          <p className="text-[10px] text-neutral-400 text-center">
            No pressure. Only when you’re ready.
          </p>
        </motion.form>
      </div>

      <Footer />
    </main>
  );
}

/* ── Reusable Components ──────────────────────────────────────────────── */

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  required?: boolean;
}

function InputField({
  label,
  placeholder,
  value,
  onChange,
  icon,
  required,
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-500 mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-3 rounded-2xl bg-[#F4F3F0] border border-black/5 focus-within:border-[#a8862f] focus-within:bg-white px-4 py-3 transition-colors">
        {icon && <span className="text-[#a8862f]">{icon}</span>}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full bg-transparent text-neutral-900 placeholder:text-neutral-400 outline-none text-sm"
        />
      </div>
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

function TextAreaField({
  label,
  placeholder,
  value,
  onChange,
  required,
}: TextAreaFieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-500 mb-1.5">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        required={required}
        className="w-full rounded-2xl bg-[#F4F3F0] border border-black/5 focus-within:border-[#a8862f] focus:bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 outline-none resize-none text-sm transition-colors"
      />
    </div>
  );
}