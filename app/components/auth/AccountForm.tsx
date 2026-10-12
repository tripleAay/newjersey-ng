"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";

import { createClient } from "@/app/lib/newjersey/supabase/client";

type Props = {
  mode: "login" | "register";
  next: string | null;
  confirmationError?: boolean;
};

const inputClass =
  "mt-2 min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-base text-[#181818] placeholder:text-[#777] focus:border-[#F58220]";

export default function AccountForm({
  mode,
  next,
  confirmationError = false,
}: Props) {
  const registering = mode === "register";

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(
    confirmationError
      ? "We couldn't complete email confirmation. Try signing in, or request a new confirmation email by registering again."
      : ""
  );
  const [emailSent, setEmailSent] = useState(false);

  const busyRef = useRef(false);

  const nextQuery = next ? `?next=${encodeURIComponent(next)}` : "";
  const alternateHref = registering
    ? `/login${nextQuery}`
    : `/register${nextQuery}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (busyRef.current) return;

    const form = event.currentTarget;
    const values = new FormData(form);

    const email = String(values.get("email") ?? "").trim();
    const password = String(values.get("password") ?? "");
    const fullName = String(values.get("full_name") ?? "").trim();
    const confirmation = String(values.get("confirm_password") ?? "");

    setError("");

    if (registering) {
      if (fullName.length < 2 || fullName.length > 120) {
        setError("Enter your name, between 2 and 120 characters.");
        return;
      }

      if (password.length < 8) {
        setError("Use at least 8 characters for your password.");
        return;
      }

      if (password !== confirmation) {
        setError("Your passwords do not match.");
        return;
      }
    }

    busyRef.current = true;
    setSubmitting(true);

    try {
      const supabase = createClient();

      if (registering) {
        const callback = new URL(
          "/auth/callback",
          window.location.origin
        );

        if (next) callback.searchParams.set("next", next);

        const { data, error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: callback.toString(),
          },
        });

        if (signupError) {
          throw new Error(
            signupError.code === "over_email_send_rate_limit" ||
              signupError.code === "over_request_rate_limit"
              ? "Too many requests. Please wait before trying again."
              : signupError.code === "weak_password"
                ? "Choose a stronger password."
                : "We couldn't create the account. If you already have one, sign in instead."
          );
        }

        if (!data.session) {
          form.reset();
          setEmailSent(true);
          return;
        }
      } else {
        const { error: signinError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (signinError) {
          throw new Error(
            signinError.code === "email_not_confirmed"
              ? "Confirm your email before signing in."
              : "Unable to sign in. Check your email and password."
          );
        }
      }

      // Staff permissions and destination are checked on the server.
      window.location.assign(`/auth/continue${nextQuery}`);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Something went wrong. Please try again."
      );
    } finally {
      busyRef.current = false;
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-[#FCFBF8] px-5 py-12 text-[#181818] sm:px-8 sm:py-20">
      <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-2 lg:gap-24">
        <div className="lg:pt-8">
          <Link
            href="/shop"
            className="text-xl font-bold tracking-[-0.06em]"
          >
            newjersey<span className="text-[#F58220]">.ng</span>
          </Link>

          <p className="mt-10 text-xs font-medium uppercase tracking-[0.14em] text-[#625D55]">
            Your NewJersey account
          </p>

          <h1 className="mt-4 max-w-md text-4xl font-bold leading-[1.08] tracking-[-0.05em] sm:text-5xl">
            {registering ? (
              <>
                Make room for
                <br />
                your next idea.
              </>
            ) : (
              <>
                Good to have
                <br />
                you back.
              </>
            )}
          </h1>

          <p className="mt-6 max-w-sm text-base leading-7 text-[#625D55]">
            {registering
              ? "Create an account for your purchases and custom projects."
              : "Sign in to your account to continue shopping with NewJersey."}
          </p>

          <Link
            href="/shop"
            className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-medium hover:underline"
          >
            Explore the store
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="min-w-0 border-t border-black/10 pt-8 lg:border-t-0 lg:pt-0">
          <h2 className="text-2xl font-semibold tracking-tight">
            {registering ? "Create your account" : "Sign in"}
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#625D55]">
            {registering ? "Already have an account?" : "New to NewJersey?"}{" "}
            <Link
              href={alternateHref}
              className="font-semibold text-[#181818] underline decoration-[#F58220] underline-offset-4"
            >
              {registering ? "Sign in" : "Create an account"}
            </Link>
          </p>

          {emailSent ? (
            <div
              role="status"
              className="mt-8 rounded-xl border border-black/10 bg-white p-6"
            >
              <h3 className="text-lg font-semibold">Check your email</h3>
              <p className="mt-3 text-sm leading-6 text-[#625D55]">
                If confirmation is required and the address is eligible,
                you’ll receive a link to confirm your account. Open it
                in this browser to complete registration.
              </p>
              <Link
                href={`/login${nextQuery}`}
                className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8">
              <fieldset disabled={submitting} className="space-y-5">
                {registering && (
                  <label className="block text-sm font-medium">
                    Full name
                    <input
                      name="full_name"
                      autoComplete="name"
                      required
                      minLength={2}
                      maxLength={120}
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </label>
                )}

                <label className="block text-sm font-medium">
                  Email address
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    maxLength={254}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </label>

                <div>
                  <label
                    htmlFor="account-password"
                    className="text-sm font-medium"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="account-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete={
                        registering ? "new-password" : "current-password"
                      }
                      required
                      minLength={registering ? 8 : undefined}
                      className={`${inputClass} pr-14`}
                    />

                    <button
                      type="button"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute bottom-0 right-1 flex h-12 w-12 items-center justify-center rounded-lg text-[#625D55]"
                    >
                      {showPassword ? (
                        <EyeOff size={19} aria-hidden="true" />
                      ) : (
                        <Eye size={19} aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  {registering && (
                    <p className="mt-2 text-xs text-[#625D55]">
                      Use at least 8 characters.
                    </p>
                  )}
                </div>

                {registering && (
                  <label className="block text-sm font-medium">
                    Confirm password
                    <input
                      name="confirm_password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={8}
                      className={inputClass}
                    />
                  </label>
                )}

                {error && (
                  <p
                    role="alert"
                    className="rounded-lg bg-red-50 p-4 text-sm leading-6 text-red-800"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#181818] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#363636] disabled:cursor-wait disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle
                        size={18}
                        aria-hidden="true"
                        className="animate-spin motion-reduce:animate-none"
                      />
                      {registering ? "Creating account…" : "Signing in…"}
                    </>
                  ) : (
                    <>
                      {registering ? "Create account" : "Sign in"}
                      <ArrowRight size={18} aria-hidden="true" />
                    </>
                  )}
                </button>
              </fieldset>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}