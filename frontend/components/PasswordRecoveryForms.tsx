"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { apiRequestPasswordReset, apiResetPassword, clearStoredAuth } from "@/lib/auth/api";

const inputClass = "w-full rounded-xl border border-border bg-ivory/60 px-4 py-3.5 text-sm text-dark outline-none transition placeholder:text-muted/70 hover:border-gold/50 focus:border-gold focus:ring-4 focus:ring-gold/10";
const buttonClass = "flex w-full items-center justify-center rounded-xl bg-[#38272a] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#513339] disabled:opacity-60";

export function ForgotPasswordForm({ initialEmail = "" }: { initialEmail?: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      const result = await apiRequestPasswordReset(email.trim().toLowerCase());
      setMessage(result.message);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not request a password reset. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return <main className="mx-auto w-full max-w-lg px-4 py-16 sm:py-24">
    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">Account recovery</p>
    <h1 className="font-heading text-3xl leading-tight text-dark sm:text-4xl">Forgot your password?</h1>
    <p className="mb-7 mt-3 text-sm leading-6 text-muted">Enter the email address for your account. If it matches an account, we’ll send a password reset link.</p>
    <form className="space-y-4" onSubmit={submit}>
      <label htmlFor="recovery-email" className="block text-xs font-semibold text-charcoal">Account email</label>
      <input id="recovery-email" className={inputClass} type="email" autoComplete="email" required maxLength={255} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
      <button className={buttonClass} type="submit" disabled={submitting}>{submitting ? "Sending…" : "Send reset link"}</button>
    </form>
    {message && <p role="status" className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900">{message}</p>}
    {error && <p role="alert" className="mt-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">{error}</p>}
    <p className="mt-7 border-t border-border pt-5 text-center text-sm text-muted"><Link href="/login" className="font-semibold text-gold-dark underline underline-offset-4">Back to sign in</Link></p>
  </main>;
}

export function ResetPasswordForm({ token, email }: { token: string; email: string }) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !email) {
      setError("This password reset link is incomplete. Request a new link and try again.");
      return;
    }
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      const result = await apiResetPassword({
        email: email.trim().toLowerCase(),
        token,
        password,
        password_confirmation: confirmation,
      });
      clearStoredAuth();
      setMessage(result.message);
      setPassword("");
      setConfirmation("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not reset your password. Request a new link and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return <main className="mx-auto w-full max-w-lg px-4 py-16 sm:py-24">
    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">Account recovery</p>
    <h1 className="font-heading text-3xl leading-tight text-dark sm:text-4xl">Set a new password</h1>
    <p className="mb-7 mt-3 text-sm leading-6 text-muted">Choose a new password for the account linked to this reset email.</p>
    {token && email ? <form className="space-y-4" onSubmit={submit}>
      <div><label htmlFor="reset-email" className="mb-2 block text-xs font-semibold text-charcoal">Account email</label><input id="reset-email" className={`${inputClass} bg-cream`} type="email" value={email} readOnly /></div>
      <div><label htmlFor="new-password" className="mb-2 block text-xs font-semibold text-charcoal">New password</label><input id="new-password" className={inputClass} type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" /></div>
      <div><label htmlFor="confirm-password" className="mb-2 block text-xs font-semibold text-charcoal">Confirm new password</label><input id="confirm-password" className={inputClass} type="password" autoComplete="new-password" required minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Enter the new password again" /></div>
      <button className={buttonClass} type="submit" disabled={submitting}>{submitting ? "Updating…" : "Reset password"}</button>
    </form> : <p role="alert" className="rounded-xl border border-gold/30 bg-cream px-4 py-3 text-sm leading-6 text-charcoal">This reset link is incomplete. Request a new link to continue.</p>}
    {message && <p role="status" className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900">{message} <Link href="/login" className="font-semibold underline underline-offset-4">Sign in</Link></p>}
    {error && <p role="alert" className="mt-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">{error}</p>}
    {!message && <p className="mt-7 border-t border-border pt-5 text-center text-sm text-muted"><Link href="/forgot-password" className="font-semibold text-gold-dark underline underline-offset-4">Request a new reset link</Link></p>}
  </main>;
}
