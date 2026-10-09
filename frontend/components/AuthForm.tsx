"use client";

import { useCallback, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GoogleAutofillButton } from "@/components/GoogleAutofillButton";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const isRegister = mode === "register";
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const fillFromGoogle = useCallback((profile: { name: string; email: string }) => {
    setName(profile.name);
    setEmail(profile.email);
    if (isRegister) {
      setMessage("Your name and verified Google email were filled in. Set a password to finish this preview form; manual account creation is not connected yet.");
    } else {
      setMessage("Google sign-in successful. Opening your account…");
      router.push("/account");
    }
  }, [isRegister, router]);
  const showGoogleError = useCallback((error: string) => setMessage(error), []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (isRegister && formData.get("password") !== formData.get("password_confirmation")) {
      setMessage("The passwords do not match. Please check both password fields.");
      return;
    }
    setMessage(
      isRegister
        ? "Manual account creation is not connected yet. You can sign in with Google from the login page."
        : "Email and password sign-in is not connected yet. Use the Google sign-in option above.",
    );
  }

  return (
    <section className="mx-auto w-full max-w-xl px-4 py-12 sm:px-6 sm:py-20">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-10">
        <Image src="/brand-logo.jpg" alt="Goynar Gontobbo" width={1000} height={634} className="mx-auto mb-4 h-auto w-40 rounded-sm" />
        <h1 className="font-heading text-center text-3xl text-dark sm:text-4xl">
          {isRegister ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mx-auto mb-8 mt-3 max-w-sm text-center text-sm leading-6 text-muted">
          {isRegister
            ? "Join us to keep your favourite pieces close and enjoy a more personal shopping experience."
            : "Sign in to continue to your Goynar Gontobbo account."}
        </p>

        {isRegister && (
          <div className="mb-6">
            <GoogleAutofillButton purpose={isRegister ? "autofill" : "login"} onAutofill={fillFromGoogle} onError={showGoogleError} />
            <p className="mt-2 text-center text-xs text-muted">{isRegister ? "Use Google to fill in your name and email" : "Sign in securely with your Google account"}</p>
            <div className="mt-6 flex items-center gap-4 text-xs text-muted"><span className="h-px flex-1 bg-border" /><span>or enter your details</span><span className="h-px flex-1 bg-border" /></div>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {isRegister && (
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-charcoal">Full name</label>
              <input id="name" name="name" type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20" placeholder="Your full name" />
            </div>
          )}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-charcoal">Email address</label>
            <input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-charcoal">Password</label>
            <div className="relative">
              <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete={isRegister ? "new-password" : "current-password"} required minLength={8} className="w-full rounded-lg border border-border bg-white px-4 py-3 pr-20 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20" placeholder="At least 8 characters" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 my-auto text-xs font-medium text-muted hover:text-charcoal" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {isRegister && (
            <div>
              <label htmlFor="password_confirmation" className="mb-2 block text-sm font-medium text-charcoal">Confirm password</label>
              <input id="password_confirmation" name="password_confirmation" type={showPassword ? "text" : "password"} autoComplete="new-password" required minLength={8} className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20" placeholder="Enter your password again" />
            </div>
          )}
          {!isRegister && (
            <div className="-mt-1 flex justify-end">
              <span className="text-xs text-muted">Forgot password? Contact our support team.</span>
            </div>
          )}
          <button type="submit" className="w-full rounded-lg bg-charcoal px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gold-dark focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2">
            {isRegister ? "Create account" : "Sign in"}
          </button>
        </form>

        {message && <p role="status" className="mt-5 rounded-lg border border-gold/30 bg-cream px-4 py-3 text-sm leading-6 text-charcoal">{message}</p>}
        <p className="mt-7 text-center text-sm text-muted">
          {isRegister ? "Already have an account? " : "New to Goynar Gontobbo? "}
          <Link href={isRegister ? "/login" : "/register"} className="font-semibold text-gold-dark underline-offset-4 hover:underline">
            {isRegister ? "Sign in" : "Create an account"}
          </Link>
        </p>
        <p className="mt-6 border-t border-border pt-5 text-center text-xs leading-5 text-muted">
          {isRegister
            ? "Google only fills your name and email here. Manual account creation is not connected yet; this form does not send or save your password."
            : "Google sign-in creates a short-lived browser session. Email and password sign-in is not connected yet."}
        </p>
      </div>
    </section>
  );
}
