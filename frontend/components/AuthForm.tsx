"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { demoAccounts, demoUserForEmail, roleLabels } from "@/lib/demo-accounts";
import { loadWorkspace, saveWorkspace } from "@/lib/demo-data";
import { GoogleAutofillButton } from "@/components/GoogleAutofillButton";

interface AuthFormProps { mode: "login" | "register"; }

export function AuthForm({ mode }: AuthFormProps) {
  const isRegister = mode === "register";
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function demoLogin(accountEmail: string) {
    const account = loadWorkspace().users.find((user) => user.email === accountEmail.trim().toLowerCase()) ?? demoUserForEmail(accountEmail);
    if (!account) return;
    const workspace = loadWorkspace();
    workspace.activeUser = account;
    saveWorkspace(workspace);
    router.push("/account");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isRegister) {
      setMessage("Customer registration is a local preview only. Choose the customer demo account to explore saved preferences and profile settings.");
      return;
    }
    const account = demoUserForEmail(email);
    if (!account) {
      setMessage("This preview supports the listed demo accounts. Choose a demo account below to continue.");
      return;
    }
    demoLogin(account.email);
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-10">
        <Image src="/assets/Luxurious%20Gold%20Goynar%20Gontobbo%20Monogram.png" alt="Goynar Gontobbo" width={1254} height={1254} className="mx-auto mb-4 h-24 w-24 object-contain" />
        <h1 className="font-heading text-center text-3xl text-dark sm:text-4xl">{isRegister ? "Create your account" : "Sign in to your account"}</h1>
        <p className="mx-auto mb-7 mt-3 max-w-lg text-center text-sm leading-6 text-muted">{isRegister ? "Customer registration is a preview. Use a demo account to try role specific account features." : "Enter a demo email or choose a role below. Each account opens a private local preview workspace."}</p>

        {!isRegister && <div className="mb-7 rounded-xl border border-gold/30 bg-cream/60 p-4 text-sm leading-6 text-charcoal"><strong>Demo mode:</strong> accounts and changes are stored in this browser only. Role access is for preview and is not secure production authentication.</div>}

        <form className="mx-auto max-w-md space-y-4" onSubmit={handleSubmit}>
          {isRegister && <div><label htmlFor="name" className="mb-2 block text-sm font-medium text-charcoal">Full name</label><input id="name" name="name" type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none focus:border-gold" placeholder="Your full name" /></div>}
          <div><label htmlFor="email" className="mb-2 block text-sm font-medium text-charcoal">Email address</label><input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none focus:border-gold" placeholder="customer@goynar.demo" /></div>
          {isRegister && <div><label htmlFor="password" className="mb-2 block text-sm font-medium text-charcoal">Password</label><input id="password" name="password" type={showPassword ? "text" : "password"} minLength={8} onChange={() => undefined} className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm outline-none focus:border-gold" placeholder="Not saved in this preview" /><button type="button" className="mt-2 text-xs text-muted underline" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"} password</button></div>}
          <button type="submit" className="w-full rounded-lg bg-charcoal px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gold-dark">{isRegister ? "Continue" : "Continue with email"}</button>
        </form>

        {!isRegister && <div className="mx-auto mt-8 max-w-2xl"><div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted"><span className="h-px flex-1 bg-border" />Role demo accounts<span className="h-px flex-1 bg-border" /></div><div className="grid gap-3 sm:grid-cols-2">{demoAccounts.map((account) => <button key={account.role} type="button" onClick={() => demoLogin(account.email)} className="rounded-xl border border-border bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-gold hover:shadow-sm"><span className="block text-xs font-semibold uppercase tracking-wider text-gold-dark">{roleLabels[account.role]}</span><span className="mt-1 block font-medium text-dark">{account.name}</span><span className="mt-1 block break-all text-xs text-muted">{account.email}</span></button>)}</div></div>}

        {isRegister && <div className="mx-auto mt-7 max-w-md rounded-xl border border-border p-4"><GoogleAutofillButton purpose="autofill" onAutofill={(profile) => { setName(profile.name); setEmail(profile.email); setMessage("Google filled the form. This preview will not save it as a customer account."); }} onError={setMessage} /><p className="mt-3 text-center text-xs text-muted">Google only fills in profile fields here; registration is not persisted.</p></div>}
        {message && <p role="status" className="mt-5 rounded-lg border border-gold/30 bg-cream px-4 py-3 text-sm leading-6 text-charcoal">{message}</p>}
        <p className="mt-7 text-center text-sm text-muted">{isRegister ? "Already have an account? " : "Need a customer preview? "}<Link href={isRegister ? "/login" : "/register"} className="font-semibold text-gold-dark underline-offset-4 hover:underline">{isRegister ? "Sign in" : "Create an account"}</Link></p>
      </div>
    </section>
  );
}
