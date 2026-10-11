import { demoAccounts, roleLabels, type DemoRole, type DemoUser } from "@/lib/demo-accounts";
import { mockProducts } from "@/data/mock-products";
import { categories } from "@/data/mock-categories";
import type { Product } from "@/types";

export interface PrivateNote { id: string; text: string; createdAt: string; reply?: string; }
export interface DemoOrder { id: string; createdAt: string; status: "Preview"; items: string[]; total: number; }
export interface DemoProfile { name: string; phone: string; address: string; }
export interface Preferences { preferredCategories: string[]; style: string; material: string; notifyNewCollections: boolean; }
export interface DemoNotification { id: string; title: string; message: string; createdAt: string; read: boolean; target: string; }
export interface DemoWorkspace {
  users: DemoUser[];
  activeUser: DemoUser | null;
  notes: Record<string, PrivateNote[]>;
  orders: Record<string, DemoOrder[]>;
  profiles: Record<string, DemoProfile>;
  preferences: Record<string, Preferences>;
  notifications: Record<string, DemoNotification[]>;
  products: Product[];
  collectionNames: string[];
}

const workspaceKey = "gg-demo-workspace-v1";
const defaultPreferences: Preferences = { preferredCategories: [], style: "", material: "", notifyNewCollections: false };

function initialWorkspace(): DemoWorkspace {
  return {
    users: demoAccounts,
    activeUser: null,
    notes: {},
    orders: {},
    profiles: {},
    preferences: {},
    notifications: {},
    products: mockProducts,
    collectionNames: [...new Set(categories.map((category) => category.name))],
  };
}

const roleGuidance: Record<DemoRole, string> = {
  customer: "Save your profile and style preferences, then keep favourite jewellery in your wishlist. Cart, preferences, and notes stay in this browser. Checkout and order history are not connected yet.",
  marketing: "Review collection names and saved preference counts in the Marketing desk. You can plan locally; this preview does not send campaigns or customer messages.",
  moderator: "Use the catalog editor to adjust demo prices, add items and collections, and reply privately to customer notes. These changes stay in this browser and do not update Laravel.",
  admin: "Review demo catalog totals and role access. You inherit moderator preview tools, and all changes remain local to this browser.",
  system_admin: "Review the workspace overview and use the notification composer to send a local in-app notice to a role or exact demo account email. No email is sent.",
};

function ensureRoleGuidance(workspace: DemoWorkspace): DemoWorkspace {
  const user = workspace.activeUser;
  if (!user || (workspace.notifications[user.email] ?? []).some((notification) => notification.id.startsWith("guidance-"))) return workspace;
  const guidance: DemoNotification = { id: `guidance-${user.role}`, title: `Getting started: ${roleLabels[user.role]}`, message: roleGuidance[user.role], createdAt: new Date().toISOString(), read: false, target: user.role };
  return { ...workspace, notifications: { ...workspace.notifications, [user.email]: [guidance, ...(workspace.notifications[user.email] ?? [])] } };
}

export function loadWorkspace(): DemoWorkspace {
  if (typeof window === "undefined") return initialWorkspace();
  try {
    const saved = localStorage.getItem(workspaceKey);
    if (!saved) return initialWorkspace();
    const parsed = JSON.parse(saved) as Partial<DemoWorkspace>;
    const storedUsers = Array.isArray(parsed.users) ? parsed.users : demoAccounts;
    const storedActive = parsed.activeUser ? storedUsers.find((account) => account.email === parsed.activeUser?.email) ?? parsed.activeUser : null;
    const base = { ...initialWorkspace(), ...parsed, users: storedUsers, activeUser: storedActive, notifications: parsed.notifications ?? {} };
    const needsGuidance = Boolean(base.activeUser && !(base.notifications[base.activeUser.email] ?? []).some((notification) => notification.id.startsWith("guidance-")));
    const workspace = ensureRoleGuidance(base);
    if (needsGuidance) saveWorkspace(workspace);
    return workspace;
  } catch {
    localStorage.removeItem(workspaceKey);
    return initialWorkspace();
  }
}

export function saveWorkspace(workspace: DemoWorkspace): void {
  if (typeof window !== "undefined") localStorage.setItem(workspaceKey, JSON.stringify(workspace));
}

export function defaultProfile(user: DemoUser): DemoProfile {
  return { name: user.name, phone: "", address: "" };
}

export function defaultUserPreferences(): Preferences {
  return { ...defaultPreferences };
}

export function hasRole(role: DemoRole, minimum: DemoRole): boolean {
  const rank: Record<DemoRole, number> = { customer: 0, marketing: 1, moderator: 2, admin: 3, system_admin: 4 };
  return rank[role] >= rank[minimum];
}

export function productForNoteSlug(slug: string, products: Product[]): Product | undefined {
  return products.find((product) => product.slug === slug);
}
