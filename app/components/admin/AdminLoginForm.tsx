"use client";

import {
  type FormEvent,
  useState,
} from "react";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import {
  createClient,
} from "@/app/lib/newjersey/supabase/client";

type Props = {
  next: string;
};

export default function AdminLoginForm({
  next,
}: Props) {
  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] =
    useState(false);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (submitting) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const supabase =
        createClient();

      const {
        error:
          signInError,
      } =
        await supabase.auth.signInWithPassword({
          email:
            email.trim(),
          password,
        });

      if (signInError) {
        throw new Error(
          "Invalid email or password."
        );
      }

      /*
       * Do not decide whether the user
       * is an admin in the browser.
       *
       * /shop/admin performs the real
       * server-side authorization.
       */

      window.location.assign(
        next
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to sign in."
      );
    } finally {
      setSubmitting(
        false
      );
    }
  }

  return (
    <section className="bg-[#f7f7f5] px-5 py-16 sm:px-8 lg:py-24">
      <div className="mx-auto grid max-w-[1100px] overflow-hidden rounded-[32px] border border-black/[0.06] bg-white shadow-sm lg:grid-cols-[1fr_480px]">
        <div className="hidden bg-[#222] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6B00]">
              <ShieldCheck
                size={22}
              />
            </div>

            <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF8A33]">
              NewJersey
            </p>

            <h1 className="mt-3 max-w-sm text-4xl font-bold tracking-[-0.045em]">
              Production control,
              in one workspace.
            </h1>

            <p className="mt-4 max-w-md text-sm leading-6 text-white/55">
              Review orders,
              artwork, pricing,
              production and
              fulfilment from the
              NewJersey admin
              workspace.
            </p>
          </div>

          <p className="text-[10px] text-white/30">
            Authorized staff
            access only.
          </p>
        </div>

        <div className="p-6 sm:p-10 lg:p-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff2e8] text-[#FF6B00] lg:hidden">
            <ShieldCheck
              size={21}
            />
          </div>

          <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF6B00] lg:mt-0">
            Admin access
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em]">
            Sign in.
          </h2>

          <p className="mt-2 text-xs leading-5 text-[#888]">
            Access the NewJersey
            production workspace.
          </p>

          <form
            onSubmit={
              handleSubmit
            }
            className="mt-8 space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#777]"
              >
                Email
              </label>

              <div className="mt-2 flex items-center rounded-xl border border-black/10 bg-white px-4 focus-within:border-[#FF6B00]">
                <Mail
                  size={16}
                  className="shrink-0 text-[#aaa]"
                />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(
                    event
                  ) =>
                    setEmail(
                      event.target
                        .value
                    )
                  }
                  placeholder="you@example.com"
                  className="w-full bg-transparent px-3 py-3.5 text-sm outline-none placeholder:text-[#bbb]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#777]"
              >
                Password
              </label>

              <div className="mt-2 flex items-center rounded-xl border border-black/10 bg-white px-4 focus-within:border-[#FF6B00]">
                <LockKeyhole
                  size={16}
                  className="shrink-0 text-[#aaa]"
                />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  required
                  value={
                    password
                  }
                  onChange={(
                    event
                  ) =>
                    setPassword(
                      event.target
                        .value
                    )
                  }
                  placeholder="Your password"
                  className="w-full bg-transparent px-3 py-3.5 text-sm outline-none placeholder:text-[#bbb]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (
                        current
                      ) =>
                        !current
                    )
                  }
                  className="text-[#999] transition hover:text-[#222]"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff
                      size={16}
                    />
                  ) : (
                    <Eye
                      size={16}
                    />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <p className="text-[10px] font-semibold text-red-600">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={
                submitting
              }
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#222] px-5 py-4 text-xs font-bold text-white transition hover:bg-[#FF6B00] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <LoaderCircle
                    size={15}
                    className="animate-spin"
                  />

                  Signing in
                </>
              ) : (
                <>
                  Sign in to
                  workspace

                  <ArrowRight
                    size={15}
                  />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}