import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/PasswordRecoveryForms";

export const metadata: Metadata = { title: "Forgot password", robots: { index: false, follow: false } };

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ email?: string | string[] }> }) {
  const params = await searchParams;
  return <ForgotPasswordForm initialEmail={typeof params.email === "string" ? params.email : ""} />;
}
