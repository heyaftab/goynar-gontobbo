"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { demoAccounts, demoUserForEmail, roleLabels } from "@/lib/demo-accounts";
import { loadWorkspace, saveWorkspace } from "@/lib/demo-data";
import { GoogleAutofillButton } from "@/components/GoogleAutofillButton";
import { BrandImage } from "@/components/BrandImageViewer";
import { apiLogin, apiRegister, setStoredAuth, type AuthUser } from "@/lib/auth/api";

interface AuthFormProps { mode: "login" | "register"; }

export function AuthForm({ mode }: AuthFormProps) {
  const isRegister = mode === "register";
  const showDemoControls = process.env.NODE_ENV !== "production";
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function demoLogin(accountEmail: string) {
    const account = loadWorkspace().users.find((user) => user.email === accountEmail.trim().toLowerCase()) ?? demoUserForEmail(accountEmail);
    if (!account) return;
    const workspace = loadWorkspace();
    workspace.activeUser = account;
    saveWorkspace(workspace);
    router.push("/account");
  }

  function handleGoogleLogin(profile: { name: string; email: string; token?: string; user?: unknown }) {
    const trimmedEmail = profile.email.trim().toLowerCase();
    const trimmedName = profile.name.trim();

    if (profile.token && profile.user) {
      setStoredAuth(profile.token, profile.user as AuthUser);
    }

    const workspace = loadWorkspace();
    const existing = workspace.users.find((u) => u.email === trimmedEmail) ?? demoUserForEmail(trimmedEmail);
    const user = existing ?? { name: trimmedName, email: trimmedEmail, role: "customer" as const };
    if (!existing) {
      workspace.users = [...workspace.users, user];
    }
    workspace.activeUser = user;
    saveWorkspace(workspace);
    router.push("/account");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (isRegister) {
      if (!trimmedEmail || !trimmedName) {
        setSubmitting(false);
        return;
      }

      // Try database registration first
      try {
        const res = await apiRegister({
          name: trimmedName,
          email: trimmedEmail,
          password: password || "password123",
        });

        const workspace = loadWorkspace();
        const newUser = { name: res.user.name, email: res.user.email, role: res.user.role };
        workspace.users = [...workspace.users.filter((u) => u.email !== res.user.email), newUser];
        workspace.activeUser = newUser;
        saveWorkspace(workspace);
        router.push("/account?created=1");
        return;
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Account creation failed. Please try again.");
        return;
      } finally {
        setSubmitting(false);
      }
    }

    // Login mode
    if (password) {
      try {
        const res = await apiLogin({ email: trimmedEmail, password });
        const workspace = loadWorkspace();
        const active = { name: res.user.name, email: res.user.email, role: res.user.role };
        workspace.users = [...workspace.users.filter((u) => u.email !== res.user.email), active];
        workspace.activeUser = active;
        saveWorkspace(workspace);
        router.push("/account");
        return;
      } catch (err) {
        // If password login failed against backend and not a demo account, show error
        const isDemo = demoUserForEmail(trimmedEmail);
        if (!isDemo) {
          setMessage(err instanceof Error ? err.message : "Invalid email or password.");
          setSubmitting(false);
          return;
        }
      }
    }

    // Demo account passwordless fallback
    const account = demoUserForEmail(trimmedEmail);
    if (!account) {
      setMessage("Enter your password to sign in, or select a demo role below.");
      setSubmitting(false);
      return;
    }

    demoLogin(account.email);
    setSubmitting(false);
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="auth-card grid min-w-0 overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-[0_24px_80px_rgba(46,31,20,0.12)] lg:min-h-[700px] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <aside className="relative min-w-0 min-h-[250px] overflow-hidden bg-[#43252a] sm:min-h-[310px] lg:min-h-full" aria-label="Goynar Gontobbo jewellery">
          <Image
            src="/assets/WhatsApp Image 2026-10-09 at 16.20.42.jpeg"
            alt="Close-up of a model wearing a pearl and gold Goynar Gontobbo earring"
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 45vw"
            className="object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#28171b]/90 via-[#28171b]/5 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9 lg:p-10">
            <span className="mb-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f1d9a7] sm:text-xs">
              <span className="h-px w-7 bg-[#d9b96f]" />Adornment with a story
            </span>
            <p className="max-w-sm font-heading text-2xl leading-tight sm:text-3xl">Tradition, treasured in every detail.</p>
            <p className="mt-3 max-w-sm text-xs leading-5 text-white/75 sm:text-sm sm:leading-6">Discover jewellery inspired by the artistry and warmth of Bangladesh.</p>
          </div>
        </aside>

        <div className="auth-content flex min-w-0 flex-col justify-center px-5 py-8 sm:px-10 sm:py-10 lg:px-8 lg:py-12 xl:px-12">
          <div className="mx-auto w-full min-w-0 max-w-xl">
            <div className="mb-7 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/20 bg-cream/70">
                <BrandImage alt="" width={1254} height={1254} className="h-9 w-9 object-contain" />
              </span>
              <span>
                <span className="block font-heading text-lg leading-tight text-dark">Goynar Gontobbo</span>
                <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.18em] text-muted">{showDemoControls ? "Your personal preview" : "Your personal account"}</span>
              </span>
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">{isRegister ? "A new beginning" : "Welcome back"}</p>
            <h1 className="font-heading text-3xl leading-tight text-dark sm:text-[2.35rem]">{isRegister ? "Create your account" : "Sign in to your account"}</h1>
            <p className="mb-6 mt-3 max-w-lg text-sm leading-6 text-muted">
              {isRegister ? "Create a customer account with your name, email, and password." : showDemoControls ? "Sign in to your customer account, or choose a demo role to explore the local preview." : "Sign in to your customer account."}
            </p>

            {!isRegister && showDemoControls && (
              <div className="auth-preview-note mb-6 flex gap-3 rounded-2xl border border-[#e7d5ad] bg-[#fbf6eb] p-4 text-sm leading-5 text-charcoal">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-gold-dark" aria-hidden="true">i</span>
                <p><strong className="font-semibold">Preview mode.</strong> Demo accounts and edits stay in this browser. Role access is for demonstration and isn’t production authentication.</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {isRegister && (
                <div>
                  <label htmlFor="name" className="mb-2 block text-xs font-semibold text-charcoal">Full name</label>
                  <input id="name" name="name" type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} className="w-full rounded-xl border border-border bg-ivory/60 px-4 py-3.5 text-sm text-dark outline-none transition placeholder:text-muted/70 hover:border-gold/50 focus:border-gold focus:ring-4 focus:ring-gold/10" placeholder="Your full name" />
                </div>
              )}
              <div>
                <label htmlFor="email" className="mb-2 block text-xs font-semibold text-charcoal">Email address</label>
                <input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-xl border border-border bg-ivory/60 px-4 py-3.5 text-sm text-dark outline-none transition placeholder:text-muted/70 hover:border-gold/50 focus:border-gold focus:ring-4 focus:ring-gold/10" placeholder={showDemoControls ? "customer@goynar.demo" : "you@example.com"} />
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-xs font-semibold text-charcoal">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={isRegister ? 6 : undefined}
                    required={isRegister || !showDemoControls}
                    className="w-full rounded-xl border border-border bg-ivory/60 px-4 py-3.5 pr-20 text-sm text-dark outline-none transition placeholder:text-muted/70 hover:border-gold/50 focus:border-gold focus:ring-4 focus:ring-gold/10"
                    placeholder={isRegister ? "At least 6 characters" : showDemoControls ? "Password (optional for demo accounts)" : "Your password"}
                  />
                  <button type="button" className="absolute inset-y-0 right-3 my-auto h-fit rounded px-2 py-1 text-xs font-semibold text-gold-dark hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button>
                </div>
                <p className="mt-2 text-xs text-muted">
                  {isRegister ? "Saved securely to your account database." : showDemoControls ? "Enter your password for your saved account, or select a demo role below." : "Enter your account password."}
                </p>
                {!isRegister && <Link href={email.trim() ? `/forgot-password?email=${encodeURIComponent(email.trim())}` : "/forgot-password"} className="mt-2 inline-block text-xs font-semibold text-gold-dark underline underline-offset-4 hover:text-gold">Forgot password?</Link>}
              </div>
              <button type="submit" disabled={submitting} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#38272a] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(56,39,42,0.16)] transition hover:-translate-y-0.5 hover:bg-[#513339] hover:shadow-[0_12px_24px_rgba(56,39,42,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-60">
                {submitting ? (isRegister ? "Creating account…" : "Signing in…") : (isRegister ? "Create account" : "Continue with email")}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </form>

            {isRegister ? (
              <div className="auth-google-wrap mt-6">
                <div className="auth-google-divider" aria-hidden="true"><span>OR GET STARTED WITH</span></div>
                <div className="auth-google-panel mt-4 rounded-2xl border p-4 sm:p-5">
                  <div className="auth-google-heading mb-4 flex items-start gap-3">
                    <span className="auth-google-mark flex h-10 w-10 shrink-0 items-center justify-center rounded-full" aria-hidden="true">
                      <svg viewBox="0 0 48 48" aria-hidden="true" className="auth-google-g h-5 w-5"><path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z"/><path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2C9.2 39.4 16 44 24 44Z"/><path fill="#FBBC05" d="M12.6 27.5a12 12 0 0 1 0-7v-5.2H5.8a20 20 0 0 0 0 17.4l6.8-5.2Z"/><path fill="#EA4335" d="M24 12.1c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6.1 29.5 4 24 4 16 4 9.2 8.6 5.8 15.3l6.8 5.2c1.6-4.8 6.1-8.4 11.4-8.4Z"/></svg>
                    </span>
                    <span>
                      <span className="auth-google-kicker block text-[10px] font-semibold uppercase tracking-[0.19em]">Quick and secure</span>
                      <span className="auth-google-title mt-1 block font-heading text-lg leading-tight">A little faster with Google</span>
                      <span className="auth-google-description mt-1 block text-xs leading-5">Fill in your profile details in one step.</span>
                    </span>
                  </div>
                  <GoogleAutofillButton purpose="autofill" onAutofill={(profile) => { setName(profile.name); setEmail(profile.email); setMessage("Google details loaded. Click Continue to enter your account."); }} onError={setMessage} />
                  <p className="auth-google-footnote mt-3 text-center text-[11px] leading-5">Your name and email fill this form. Set a password above to create your account.</p>
                </div>
              </div>
            ) : (
              <div className="auth-google-wrap mt-6">
                <div className="auth-google-divider" aria-hidden="true"><span>OR SIGN IN WITH</span></div>
                <div className="auth-google-panel mt-4 rounded-2xl border p-4 sm:p-5">
                  <div className="auth-google-heading mb-4 flex items-start gap-3">
                    <span className="auth-google-mark flex h-10 w-10 shrink-0 items-center justify-center rounded-full" aria-hidden="true">
                      <svg viewBox="0 0 48 48" aria-hidden="true" className="auth-google-g h-5 w-5"><path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z"/><path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2C9.2 39.4 16 44 24 44Z"/><path fill="#FBBC05" d="M12.6 27.5a12 12 0 0 1 0-7v-5.2H5.8a20 20 0 0 0 0 17.4l6.8-5.2Z"/><path fill="#EA4335" d="M24 12.1c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 6.1 29.5 4 24 4 16 4 9.2 8.6 5.8 15.3l6.8 5.2c1.6-4.8 6.1-8.4 11.4-8.4Z"/></svg>
                    </span>
                    <span>
                      <span className="auth-google-kicker block text-[10px] font-semibold uppercase tracking-[0.19em]">Quick and secure</span>
                      <span className="auth-google-title mt-1 block font-heading text-lg leading-tight">Sign in with Google</span>
                      <span className="auth-google-description mt-1 block text-xs leading-5">Continue securely with your Google account.</span>
                    </span>
                  </div>
                  <GoogleAutofillButton purpose="login" onAutofill={handleGoogleLogin} onError={setMessage} />
                </div>
              </div>
            )}

            {!isRegister && showDemoControls && (
              <div className="mt-7">
                <div className="mb-4 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted sm:text-xs"><span className="h-px flex-1 bg-border" />Explore a demo role<span className="h-px flex-1 bg-border" /></div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {demoAccounts.map((account) => (
                    <button key={account.role} type="button" onClick={() => demoLogin(account.email)} className="auth-demo-account group flex min-w-0 items-center gap-3 rounded-xl border border-border bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-gold/60 hover:bg-cream/35 hover:shadow-[0_8px_20px_rgba(46,31,20,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream font-heading text-sm text-gold-dark transition group-hover:bg-[#f0e2c6]">{account.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("")}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-dark">{roleLabels[account.role]}</span>
                        <span className="mt-0.5 block truncate text-[11px] text-muted">{account.email}</span>
                      </span>
                      <span aria-hidden="true" className="text-muted transition group-hover:translate-x-0.5 group-hover:text-gold-dark">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {message && <p role="status" className="mt-5 rounded-xl border border-gold/30 bg-cream px-4 py-3 text-sm leading-6 text-charcoal">{message}</p>}
            <p className="mt-7 border-t border-border pt-5 text-center text-sm text-muted">{isRegister ? "Already have an account? " : showDemoControls ? "Need a customer preview? " : "New to Goynar Gontobbo? "}<Link href={isRegister ? "/login" : "/register"} className="font-semibold text-gold-dark underline decoration-gold/40 underline-offset-4 transition hover:text-gold hover:decoration-gold">{isRegister ? "Sign in" : "Create an account"}</Link></p>
          </div>
        </div>
      </div>
    </section>
  );
}
