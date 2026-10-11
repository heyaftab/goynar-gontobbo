export type DemoRole = "system_admin" | "admin" | "moderator" | "marketing" | "customer";

export interface DemoUser {
  name: string;
  email: string;
  role: DemoRole;
}

export const demoAccounts: DemoUser[] = [
  { name: "System Administrator", email: "system.admin@goynar.demo", role: "system_admin" },
  { name: "Store Administrator", email: "admin@goynar.demo", role: "admin" },
  { name: "Catalog Moderator", email: "moderator@goynar.demo", role: "moderator" },
  { name: "Marketing Manager", email: "marketing@goynar.demo", role: "marketing" },
  { name: "Demo Customer", email: "customer@goynar.demo", role: "customer" },
];

export const roleLabels: Record<DemoRole, string> = {
  system_admin: "System admin",
  admin: "Admin",
  moderator: "Moderator",
  marketing: "Marketing",
  customer: "Customer",
};

export function demoUserForEmail(email: string): DemoUser | undefined {
  return demoAccounts.find((account) => account.email === email.trim().toLowerCase());
}
