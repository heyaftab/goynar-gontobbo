import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/PasswordRecoveryForms";

export const metadata: Metadata = { title: "Reset password", robots: { index: false, follow: false } };

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string | string[]; email?: string | string[] }> }) {
  const params = await searchParams;
  return <ResetPasswordForm token={typeof params.token === "string" ? params.token : ""} email={typeof params.email === "string" ? params.email : ""} />;
}
