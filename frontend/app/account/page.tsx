import type { Metadata } from "next";
import { AccountWorkspace } from "@/components/AccountWorkspace";

export const metadata: Metadata = { title: "My account" };

export default function AccountPage() {
  return <AccountWorkspace />;
}
