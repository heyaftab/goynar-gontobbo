"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface AccountUser {
  name: string;
  email: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        const result = await response.json() as { user: AccountUser | null };
        return result.user;
      })
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setChecked(true));
  }, []);

  async function signOut() {
    await fetch("/api/auth/session", { method: "DELETE" });
    setUser(null);
  }

  if (!checked) {
    return <section className="mx-auto max-w-3xl px-4 py-24 text-center text-sm text-muted">Loading your account…</section>;
  }

  if (user) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <div className="rounded-2xl border border-border bg-surface p-7 text-center shadow-sm sm:p-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold-dark">Your account</p>
          <h1 className="font-heading text-4xl text-dark">Welcome, {user.name}</h1>
          <p className="mt-3 text-sm text-muted">Signed in with Google</p>
          <div className="mx-auto mt-8 max-w-md rounded-xl bg-cream px-5 py-4 text-left">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">Email</p>
            <p className="mt-1 break-all text-sm text-charcoal">{user.email}</p>
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/shop" className="rounded-lg bg-charcoal px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold-dark">Continue shopping</Link>
            <button type="button" onClick={signOut} className="rounded-lg border border-charcoal px-6 py-3 text-sm font-semibold text-charcoal transition hover:border-gold-dark hover:text-gold-dark">Sign out</button>
          </div>
          <p className="mt-6 text-xs leading-5 text-muted">Google sign-in is active for this browser session. Customer profiles and order history are not yet stored.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-24">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold-dark">Your account</p>
      <h1 className="font-heading text-4xl text-dark sm:text-5xl">A more personal experience</h1>
      <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted">Sign in with Google or create an account to get started. Your cart and wishlist are saved in this browser.</p>
      <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/login" className="rounded-lg bg-charcoal px-7 py-3 text-sm font-semibold text-white transition hover:bg-gold-dark">Sign in</Link>
        <Link href="/register" className="rounded-lg border border-charcoal px-7 py-3 text-sm font-semibold text-charcoal transition hover:border-gold-dark hover:text-gold-dark">Create an account</Link>
      </div>
    </section>
  );
}
