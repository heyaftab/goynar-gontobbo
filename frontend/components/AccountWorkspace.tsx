"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";
import { categories } from "@/data/mock-categories";
import { roleLabels, type DemoRole } from "@/lib/demo-accounts";
import { defaultProfile, defaultUserPreferences, hasRole, loadWorkspace, saveWorkspace, type DemoNotification, type DemoWorkspace, type PrivateNote } from "@/lib/demo-data";
import { apiGetProfile, apiLogout, apiUpdateProfile, getStoredToken } from "@/lib/auth/api";

const panel = "rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6";
const input = "w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-charcoal outline-none focus:border-gold focus:ring-2 focus:ring-gold/15";

export function AccountWorkspace() {
  const router = useRouter();
  const [workspace, setWorkspace] = useState<DemoWorkspace>(() => loadWorkspace());
  const [tab, setTab] = useState<"overview" | "profile" | "settings">("overview");
  const [status, setStatus] = useState("");
  const [noteText, setNoteText] = useState("");
  const [productForm, setProductForm] = useState({ name: "", category: "Earrings", price: "", image: "/assets/products/earring-pearl-drop.jpg" });
  const [collectionName, setCollectionName] = useState("");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationTarget, setNotificationTarget] = useState("");

  const user = workspace.activeUser;
  const role = user?.role ?? "customer";
  const userNotes = user ? (canReplyToPrivateNotes(role) ? Object.entries(workspace.notes).flatMap(([ownerEmail, notes]) => notes.map((note) => ({ ...note, ownerEmail }))) : (workspace.notes[user.email] ?? []).map((note) => ({ ...note, ownerEmail: user.email }))) : [];
  const profile = user ? workspace.profiles[user.email] ?? defaultProfile(user) : null;
  const preferences = user ? workspace.preferences[user.email] ?? defaultUserPreferences() : null;
  const orders = user ? workspace.orders[user.email] ?? [] : [];
  const notifications = user ? workspace.notifications[user.email] ?? [] : [];
  const canManageCatalog = hasRole(role, "moderator");
  const canManageTeam = hasRole(role, "admin");
  const [isDbSynced, setIsDbSynced] = useState(false);

  useEffect(() => {
    async function syncDbUser() {
      if (!getStoredToken() || !user) return;
      try {
        const dbUser = await apiGetProfile();
        if (dbUser) {
          setIsDbSynced(true);
          const next = loadWorkspace();
          next.profiles[user.email] = {
            name: dbUser.name || user.name,
            phone: dbUser.phone || "",
            address: dbUser.address || "",
          };
          saveWorkspace(next);
          setWorkspace(next);
        }
      } catch (err) {
        console.warn("Could not fetch remote profile:", err);
      }
    }
    syncDbUser();
  }, [user]);

  function commit(next: DemoWorkspace, message?: string) {
    saveWorkspace(next);
    setWorkspace(next);
    if (message) setStatus(message);
  }

  async function updateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!workspace || !user) return;
    const formData = new FormData(event.currentTarget);
    const newName = String(formData.get("name") ?? "");
    const newPhone = String(formData.get("phone") ?? "");
    const newAddress = String(formData.get("address") ?? "");

    if (getStoredToken()) {
      try {
        await apiUpdateProfile({ name: newName, phone: newPhone, address: newAddress });
        setStatus("Profile saved in database and synced.");
      } catch (err) {
        console.warn("Failed to sync profile to database:", err);
      }
    }

    commit({
      ...workspace,
      profiles: {
        ...workspace.profiles,
        [user.email]: { name: newName, phone: newPhone, address: newAddress },
      },
    }, getStoredToken() ? "Profile saved in the database." : "Profile saved in this browser.");
  }

  function updatePreferences(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!workspace || !user) return;
    const formData = new FormData(event.currentTarget);
    commit({ ...workspace, preferences: { ...workspace.preferences, [user.email]: { preferredCategories: formData.getAll("category").map(String), style: String(formData.get("style") ?? ""), material: String(formData.get("material") ?? ""), notifyNewCollections: formData.get("notify") === "on" } } }, "Preferences saved in this browser.");
  }

  function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !noteText.trim()) return;
    const note: PrivateNote = { id: crypto.randomUUID(), text: noteText.trim(), createdAt: new Date().toISOString() };
    commit({ ...workspace, notes: { ...workspace.notes, [user.email]: [note, ...(workspace.notes[user.email] ?? [])] } }, "Private note saved. Only this browser profile can see it.");
    setNoteText("");
  }

  function addReply(noteId: string, reply: string) {
    if (!workspace || !user) return;
    const ownerEmail = Object.keys(workspace.notes).find((email) => workspace.notes[email].some((note) => note.id === noteId));
    if (!ownerEmail) return;
    const nextNotes = workspace.notes[ownerEmail].map((note) => note.id === noteId ? { ...note, reply } : note);
    commit({ ...workspace, notes: { ...workspace.notes, [ownerEmail]: nextNotes } }, "Private reply saved for this local demo account.");
  }

  function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!productForm.name.trim() || Number(productForm.price) <= 0) return;
    const slug = productForm.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const category = categories.find((item) => item.name === productForm.category) ?? categories[0];
    const product: Product = { id: `demo-${Date.now()}`, name: productForm.name.trim(), slug, price: Number(productForm.price), currency: "৳", images: [productForm.image], category: category.name, categorySlug: category.slug, inStock: true, description: "A new piece added to the local demo catalog." };
    commit({ ...workspace, products: [product, ...workspace.products.filter((item) => item.slug !== slug)] }, "Catalog change saved to this browser's demo workspace.");
    setProductForm({ name: "", category: "Earrings", price: "", image: "/assets/products/earring-pearl-drop.jpg" });
  }

  function changePrice(productId: string, price: number) {
    if (price <= 0) return;
    if (workspace.products.find((product) => product.id === productId)?.price === price) return;
    commit({ ...workspace, products: workspace.products.map((product) => product.id === productId ? { ...product, price } : product) }, "Price updated in the local demo catalog.");
  }

  function changeImage(productId: string, image: string) {
    const current = workspace.products.find((product) => product.id === productId);
    if (!current || current.images[0] === image) return;
    commit({ ...workspace, products: workspace.products.map((product) => product.id === productId ? { ...product, images: [image, ...product.images.slice(1)] } : product) }, "Picture updated in the local demo catalog.");
  }

  function addCollection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = collectionName.trim();
    if (!name || workspace.collectionNames.some((item) => item.toLowerCase() === name.toLowerCase())) return;
    commit({ ...workspace, collectionNames: [...workspace.collectionNames, name] }, "Collection saved to the local demo workspace.");
    setCollectionName("");
  }

  function updateRole(email: string, nextRole: DemoRole) {
    const updatedUsers = workspace.users.map((account) => account.email === email ? { ...account, role: nextRole } : account);
    const updatedActive = workspace.activeUser?.email === email ? { ...workspace.activeUser, role: nextRole } : workspace.activeUser;
    commit({ ...workspace, users: updatedUsers, activeUser: updatedActive }, "Demo role updated.");
  }

  function sendNotification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (role !== "system_admin" || !notificationTitle.trim() || !notificationMessage.trim()) return;
    const target = notificationTarget.trim();
    const normalizedRole = (Object.entries(roleLabels).find(([, label]) => label.toLowerCase() === target.toLowerCase())?.[0] ?? target.toLowerCase().replaceAll(" ", "_")) as DemoRole;
    const isRole = Object.hasOwn(roleLabels, normalizedRole);
    const emailTarget = target.toLowerCase();
    const recipients = workspace.users.filter((account) => isRole ? account.role === normalizedRole : account.email.toLowerCase() === emailTarget);
    if (!recipients.length) {
      setStatus("No demo account matched that role or email. Check the target and try again.");
      return;
    }
    const nextNotifications = { ...workspace.notifications };
    for (const recipient of recipients) {
      const notification: DemoNotification = { id: crypto.randomUUID(), title: notificationTitle.trim(), message: notificationMessage.trim(), createdAt: new Date().toISOString(), read: false, target };
      nextNotifications[recipient.email] = [notification, ...(nextNotifications[recipient.email] ?? [])];
    }
    commit({ ...workspace, notifications: nextNotifications }, `Notification saved for ${recipients.length} demo account${recipients.length === 1 ? "" : "s"}.`);
    setNotificationTitle("");
    setNotificationMessage("");
  }

  function markNotificationRead(notificationId: string) {
    if (!user) return;
    const nextNotifications = (workspace.notifications[user.email] ?? []).map((notification) => notification.id === notificationId ? { ...notification, read: true } : notification);
    commit({ ...workspace, notifications: { ...workspace.notifications, [user.email]: nextNotifications } });
  }

  async function signOut() {
    await apiLogout();
    commit({ ...workspace, activeUser: null });
    router.push("/login");
  }

  const stats = useMemo(() => {
    return { products: workspace.products.length, collections: workspace.collectionNames.length, notes: Object.values(workspace.notes).reduce((sum, notes) => sum + notes.length, 0), customers: workspace.users.filter((account) => account.role === "customer").length, savedOrders: Object.values(workspace.orders).reduce((sum, ordersForUser) => sum + ordersForUser.length, 0) };
  }, [workspace]);

  if (!user) return <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-24"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold-dark">Your account</p><h1 className="font-heading text-4xl text-dark sm:text-5xl">A more personal experience</h1><p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted">Sign in to save your profile, preferences, cart choices, wishlist, and private notes in this browser.</p><div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/login" className="rounded-lg bg-charcoal px-7 py-3 text-sm font-semibold text-white transition hover:bg-gold-dark">Sign in</Link><Link href="/register" className="rounded-lg border border-charcoal px-7 py-3 text-sm font-semibold text-charcoal transition hover:border-gold-dark hover:text-gold-dark">Create account</Link></div></section>;

  return <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
    <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-gold-dark">{roleLabels[role]} workspace · local demo</p><h1 className="font-heading text-3xl text-dark sm:text-4xl">Welcome, {profile?.name || user.name}</h1><p className="mt-2 break-all text-sm text-muted">{user.email}</p></div><div className="flex flex-wrap gap-2"><button onClick={() => setTab("overview")} className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === "overview" ? "bg-charcoal text-white" : "border border-border text-charcoal"}`}>Overview</button><button onClick={() => setTab("profile")} className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === "profile" ? "bg-charcoal text-white" : "border border-border text-charcoal"}`}>Profile</button><button onClick={() => setTab("settings")} className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === "settings" ? "bg-charcoal text-white" : "border border-border text-charcoal"}`}>Settings</button><button onClick={signOut} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-charcoal hover:border-gold">Sign out</button></div></div>
    {isDbSynced ? (
      <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-50/70 px-4 py-3 text-xs leading-5 text-emerald-900">
        ✓ <strong>Connected Account:</strong> Signed in with your persistent database account ({user.email}). Profile changes sync directly to the database.
      </div>
    ) : (
      <div className="mb-6 rounded-xl border border-gold/30 bg-cream/60 px-4 py-3 text-xs leading-5 text-charcoal">
        Demo workspace: saved data and role changes live in this browser. Register or sign in with Google to sync with your persistent database account.
      </div>
    )}
    {status && <p role="status" className="mb-5 rounded-lg border border-border bg-white px-4 py-3 text-sm text-charcoal">{status}</p>}

    {tab === "profile" && <div className={panel}><h2 className="font-heading text-2xl text-dark">Profile</h2><p className="mb-6 mt-1 text-sm text-muted">Your details are saved locally for the selected demo account.</p><form className="grid gap-4 sm:grid-cols-2" onSubmit={updateProfile}><label className="text-sm text-charcoal">Display name<input className={`${input} mt-2`} name="name" defaultValue={profile?.name} required /></label><label className="text-sm text-charcoal">Email<input className={`${input} mt-2 bg-cream`} value={user.email} readOnly /></label><label className="text-sm text-charcoal">Phone<input className={`${input} mt-2`} name="phone" defaultValue={profile?.phone} placeholder="Optional" /></label><label className="text-sm text-charcoal sm:col-span-2">Delivery address for your preview profile<textarea className={`${input} mt-2 min-h-24`} name="address" defaultValue={profile?.address} placeholder="Optional; no order will be placed" /></label><div className="sm:col-span-2"><button className="rounded-lg bg-charcoal px-5 py-2.5 text-sm font-semibold text-white hover:bg-gold-dark">Save profile</button></div></form></div>}

    {tab === "settings" && <div className={panel}><h2 className="font-heading text-2xl text-dark">Saved preferences</h2><p className="mb-6 mt-1 text-sm text-muted">Choose the styles and collections you want this demo account to remember.</p><form className="space-y-6" onSubmit={updatePreferences}><fieldset><legend className="mb-3 text-sm font-medium text-charcoal">Favourite categories</legend><div className="grid gap-2 sm:grid-cols-4">{categories.map((category) => <label key={category.slug} className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm"><input type="checkbox" name="category" value={category.name} defaultChecked={preferences?.preferredCategories.includes(category.name)} className="accent-amber-700" />{category.name}</label>)}</div></fieldset><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm text-charcoal">Preferred style<select name="style" className={`${input} mt-2`} defaultValue={preferences?.style}><option value="">Choose one</option>{["Traditional", "Contemporary", "Bridal", "Everyday", "Minimal"].map((value) => <option key={value}>{value}</option>)}</select></label><label className="text-sm text-charcoal">Preferred material<select name="material" className={`${input} mt-2`} defaultValue={preferences?.material}><option value="">Choose one</option>{["Gold plated", "Silver plated", "Pearl", "Kundan", "Brass"].map((value) => <option key={value}>{value}</option>)}</select></label></div><label className="flex items-start gap-3 text-sm text-charcoal"><input name="notify" type="checkbox" defaultChecked={preferences?.notifyNewCollections} className="mt-1 accent-amber-700" /><span>Remember that I am interested in new collection announcements <span className="block text-xs text-muted">This demo does not send emails or notifications.</span></span></label><button className="rounded-lg bg-charcoal px-5 py-2.5 text-sm font-semibold text-white hover:bg-gold-dark">Save preferences</button></form></div>}

    {tab === "overview" && <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        {role === "system_admin" && <div className={panel}><h2 className="font-heading text-2xl text-dark">System overview</h2><p className="mb-5 mt-1 text-sm text-muted">Aggregated information from this browser’s demo workspace.</p><div className="grid grid-cols-2 gap-3 sm:grid-cols-5">{Object.entries({ Products: stats?.products, Collections: stats?.collections, "Demo users": workspace.users.length, "Private notes": stats?.notes, "Preview orders": stats?.savedOrders }).map(([label, value]) => <div key={label} className="rounded-xl bg-cream p-4"><p className="text-xs text-muted">{label}</p><p className="mt-2 text-2xl font-semibold text-dark">{value}</p></div>)}</div><p className="mt-4 text-xs leading-5 text-muted">Runtime, database, and server analytics are not available in this browser-only demo.</p><form onSubmit={sendNotification} className="mt-6 space-y-3 border-t border-border pt-5"><div><h3 className="font-heading text-xl text-dark">Send a notification</h3><p className="mt-1 text-xs leading-5 text-muted">Target a role name (including “system admin”) or one demo account email. This creates an in-app notification in this browser only; it does not send email.</p></div><input className={input} value={notificationTarget} onChange={(event) => setNotificationTarget(event.target.value)} placeholder="customer or customer@goynar.demo" required /><input className={input} value={notificationTitle} onChange={(event) => setNotificationTitle(event.target.value)} placeholder="Notification title" maxLength={80} required /><textarea className={`${input} min-h-24`} value={notificationMessage} onChange={(event) => setNotificationMessage(event.target.value)} placeholder="Write guidance or an announcement…" maxLength={500} required /><button className="rounded-lg bg-charcoal px-5 py-2.5 text-sm font-semibold text-white hover:bg-gold-dark">Send notification</button></form></div>}

        {role === "admin" && <div className={panel}><h2 className="font-heading text-2xl text-dark">Store administration</h2><p className="mt-1 text-sm text-muted">Admin can use catalog, customer, and marketing preview tools. All changes are local.</p><div className="mt-5 grid gap-3 sm:grid-cols-3">{[["Catalog items", stats?.products], ["Collections", stats?.collections], ["Demo customers", stats?.customers]].map(([label, value]) => <div key={String(label)} className="rounded-xl bg-cream p-4"><p className="text-xs text-muted">{label}</p><p className="mt-2 text-2xl font-semibold text-dark">{value}</p></div>)}</div></div>}

        {role === "marketing" && <div className={panel}><h2 className="font-heading text-2xl text-dark">Marketing desk</h2><p className="mt-1 text-sm text-muted">Explore collections and customer preference signals saved in this demo.</p><div className="mt-5 flex flex-wrap gap-2">{workspace.collectionNames.map((name) => <span key={name} className="rounded-full border border-border bg-white px-3 py-1.5 text-xs text-charcoal">{name}</span>)}</div><p className="mt-4 text-sm text-muted">Customer interest profiles saved: {Object.keys(workspace.preferences).length}. No campaigns are sent.</p></div>}

        {role === "customer" && <><div className={panel}><h2 className="font-heading text-2xl text-dark">Your saved choices</h2><div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-cream p-4"><p className="text-xs text-muted">Cart items</p><p className="mt-2 text-2xl font-semibold text-dark">{safeCount("gg-cart")}</p></div><div className="rounded-xl bg-cream p-4"><p className="text-xs text-muted">Wishlist items</p><p className="mt-2 text-2xl font-semibold text-dark">{safeCount("gg-wishlist")}</p></div><div className="rounded-xl bg-cream p-4"><p className="text-xs text-muted">Favourite categories</p><p className="mt-2 text-sm font-medium text-dark">{preferences?.preferredCategories.join(", ") || "Not selected"}</p></div></div><div className="mt-5 flex flex-wrap gap-3"><Link className="text-sm font-semibold text-gold-dark underline" href="/cart">Open cart</Link><Link className="text-sm font-semibold text-gold-dark underline" href="/wishlist">Open wishlist</Link><Link className="text-sm font-semibold text-gold-dark underline" href="/shop">Continue shopping</Link></div></div><div className={panel}><h2 className="font-heading text-2xl text-dark">Order history</h2>{orders.length ? orders.map((order) => <div key={order.id} className="mt-4 rounded-xl bg-cream p-4"><p className="font-medium text-dark">{order.id} · {order.status}</p><p className="mt-1 text-sm text-muted">{order.items.join(", ")} · ৳{order.total.toLocaleString()}</p></div>) : <p className="mt-3 text-sm leading-6 text-muted">No past orders are available. Checkout is not enabled in this preview, so no order can be placed or retrieved.</p>}</div></>}

        {role === "moderator" && <div className={panel}><h2 className="font-heading text-2xl text-dark">Catalog and community</h2><p className="mt-1 text-sm text-muted">Moderators can do customer actions, edit local demo prices and pictures, add items and collections, and reply to that account’s private notes.</p><div className="mt-5 grid gap-3 sm:grid-cols-3">{[["Products", stats?.products], ["Collections", stats?.collections], ["Notes in workspace", stats?.notes]].map(([label, value]) => <div key={String(label)} className="rounded-xl bg-cream p-4"><p className="text-xs text-muted">{label}</p><p className="mt-2 text-2xl font-semibold text-dark">{value}</p></div>)}</div></div>}

        {canManageCatalog && <div className={panel}><h2 className="font-heading text-2xl text-dark">Catalog editor</h2><p className="mb-5 mt-1 text-sm text-muted">These edits are kept in this browser’s demo workspace and used by the jewellery guide. They do not update Laravel or the server-rendered storefront catalog.</p><div className="max-h-72 space-y-2 overflow-auto">{workspace.products.map((product) => <div key={product.id} className="grid grid-cols-[1fr_105px] items-center gap-3 rounded-lg border border-border p-3"><div className="min-w-0"><p className="truncate text-sm font-medium text-dark">{product.name}</p><p className="text-xs text-muted">{product.category} · ৳{product.price.toLocaleString()}</p></div><label className="text-[10px] text-muted">Set price<input aria-label={`Price for ${product.name}`} type="number" min="1" defaultValue={product.price} onBlur={(event) => changePrice(product.id, Number(event.currentTarget.value))} className={`${input} mt-1 px-2 py-1`} /><select aria-label={`Picture for ${product.name}`} value={product.images[0] ?? ""} onChange={(event) => changeImage(product.id, event.target.value)} className={`${input} mt-2 px-2 py-1`}>{[...new Set(workspace.products.flatMap((item) => item.images))].map((image) => <option key={image} value={image}>{image.split("/").pop()}</option>)}</select></label></div>)}</div><form onSubmit={saveProduct} className="mt-5 grid gap-3 border-t border-border pt-5 sm:grid-cols-2"><h3 className="font-medium text-dark sm:col-span-2">Add a catalog item</h3><input className={input} placeholder="Item name" value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} required /><select className={input} value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}>{categories.map((category) => <option key={category.slug}>{category.name}</option>)}</select><input className={input} type="number" min="1" placeholder="Price in ৳" value={productForm.price} onChange={(event) => setProductForm({ ...productForm, price: event.target.value })} required /><select className={input} value={productForm.image} onChange={(event) => setProductForm({ ...productForm, image: event.target.value })}>{[...new Set(workspace.products.flatMap((product) => product.images))].map((image) => <option key={image} value={image}>{image.split("/").pop()}</option>)}</select><button className="rounded-lg bg-charcoal px-4 py-2.5 text-sm font-semibold text-white hover:bg-gold-dark sm:col-span-2">Save new item</button></form><form onSubmit={addCollection} className="mt-5 flex gap-2 border-t border-border pt-5"><input className={input} placeholder="New collection name" value={collectionName} onChange={(event) => setCollectionName(event.target.value)} required /><button className="shrink-0 rounded-lg border border-charcoal px-4 text-sm font-semibold text-charcoal hover:border-gold">Add collection</button></form><div className="mt-4 flex flex-wrap gap-2">{workspace.collectionNames.map((name) => <span key={name} className="rounded-full bg-cream px-3 py-1.5 text-xs text-charcoal">{name}</span>)}</div></div>}

        {canManageTeam && <div className={panel}><h2 className="font-heading text-2xl text-dark">Demo role access</h2><p className="mb-4 mt-1 text-sm text-muted">Change roles for this browser preview. System admin can inspect all roles.</p><div className="space-y-2">{workspace.users.map((account) => <div key={account.email} className="flex flex-col justify-between gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center"><div><p className="text-sm font-medium text-dark">{account.name}</p><p className="text-xs text-muted">{account.email}</p></div><select aria-label={`Role for ${account.email}`} value={account.role} onChange={(event) => updateRole(account.email, event.target.value as DemoRole)} className={`${input} sm:max-w-48`}>{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>)}</div></div>}

        <div className={panel}><h2 className="font-heading text-2xl text-dark">Notifications and guidance <span className="ml-2 align-middle rounded-full bg-cream px-2 py-1 text-xs font-sans text-gold-dark">{notifications.filter((notification) => !notification.read).length} new</span></h2><p className="mt-1 text-sm text-muted">Role guidance and admin notices for this demo account.</p><div className="mt-4 space-y-3">{notifications.map((notification) => <article key={notification.id} className={`rounded-xl border p-4 ${notification.read ? "border-border bg-white" : "border-gold/40 bg-cream/70"}`}><div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-semibold text-dark">{notification.title}</h3><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-muted">{notification.message}</p><p className="mt-2 text-[11px] text-muted">{new Date(notification.createdAt).toLocaleString()}</p></div>{!notification.read && <button type="button" onClick={() => markNotificationRead(notification.id)} className="shrink-0 text-xs font-semibold text-gold-dark underline">Mark read</button>}</div></article>)}{!notifications.length && <p className="rounded-xl bg-cream p-4 text-sm text-muted">No new notifications.</p>}</div></div>

        <div className={panel}><h2 className="font-heading text-2xl text-dark">Private notes</h2><p className="mt-1 text-sm text-muted">Notes are not published. Customers see their own notes; a moderator can privately reply in this local demo workspace.</p><form onSubmit={addNote} className="mt-4 space-y-3"><textarea className={`${input} min-h-24`} value={noteText} onChange={(event) => setNoteText(event.target.value)} placeholder="Write a private note, question, or preference…" required /><button className="rounded-lg bg-charcoal px-5 py-2.5 text-sm font-semibold text-white hover:bg-gold-dark">Save private note</button></form><div className="mt-5 space-y-3">{userNotes.map((note) => <article key={`${note.ownerEmail}-${note.id}`} className="rounded-xl border border-border bg-white p-4"><div className="flex flex-wrap justify-between gap-2"><span className="text-xs font-semibold uppercase tracking-wider text-gold-dark">{canReplyToPrivateNotes(role) ? `Private to ${workspace.users.find((account) => account.email === note.ownerEmail)?.name ?? "customer"}` : "Private to you"}</span><time className="text-xs text-muted">{new Date(note.createdAt).toLocaleString()}</time></div><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-charcoal">{note.text}</p>{note.reply && <div className="mt-3 rounded-lg bg-cream p-3"><p className="text-xs font-semibold text-gold-dark">Private reply</p><p className="mt-1 whitespace-pre-wrap text-sm text-charcoal">{note.reply}</p></div>}{canReplyToPrivateNotes(role) && <PrivateReply note={note} onReply={(reply) => addReply(note.id, reply)} />}</article>)}{!userNotes.length && <p className="rounded-xl bg-cream p-4 text-sm text-muted">No private notes saved yet.</p>}</div></div>
      </div>
      <aside className="space-y-6"><div className={panel}><h2 className="font-heading text-xl text-dark">Quick links</h2><div className="mt-4 space-y-3">{[["Browse catalog", "/shop"], ["View wishlist", "/wishlist"], ["View cart", "/cart"], ["Profile details", "#profile"], ["Saved preferences", "#settings"]].map(([label, href]) => <Link key={label} href={href.startsWith("#") ? "/account" : href} onClick={() => { if (href === "#profile") setTab("profile"); if (href === "#settings") setTab("settings"); }} className="block text-sm text-charcoal transition hover:text-gold-dark">{label} →</Link>)}</div></div><div className={panel}><h2 className="font-heading text-xl text-dark">Role capabilities</h2><ul className="mt-3 space-y-2 text-sm leading-5 text-muted">{capabilities[role].map((capability) => <li key={capability}>• {capability}</li>)}</ul></div>{role === "system_admin" && <div className={panel}><h2 className="font-heading text-xl text-dark">System information</h2><dl className="mt-3 space-y-2 text-xs text-muted"><div className="flex justify-between gap-2"><dt>Workspace</dt><dd>Browser local storage</dd></div><div className="flex justify-between gap-2"><dt>Authorization</dt><dd>Demo only</dd></div><div className="flex justify-between gap-2"><dt>Store API</dt><dd>{process.env.LARAVEL_API_URL ? "Configured" : "Mock catalog"}</dd></div><div className="flex justify-between gap-2"><dt>Persistent orders</dt><dd>Unavailable</dd></div></dl></div>}</aside>
    </div>}
  </section>;
}

const customerCapabilities = ["Save profile and style preferences", "Keep cart and wishlist in this browser", "Add notes that remain private to this workspace", "Review order history when a real order system exists"];
const moderatorCapabilities = ["Edit fallback catalog prices and pictures", "Add local catalog items and collection names", "Reply privately to customer notes"];
const capabilities: Record<DemoRole, string[]> = {
  customer: customerCapabilities,
  marketing: [...customerCapabilities, "Review collection names and saved preference counts", "Plan campaigns locally; no messages are sent"],
  moderator: [...customerCapabilities, ...moderatorCapabilities],
  admin: [...customerCapabilities, ...moderatorCapabilities, "Use marketing preview tools", "Change demo role assignments", "Review demo account and catalog totals"],
  system_admin: [...customerCapabilities, ...moderatorCapabilities, "Use marketing and admin capabilities", "Inspect workspace statistics and available runtime information", "Change demo role assignments"],
};

function safeCount(key: string): number {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "[]") as unknown[];
    return Array.isArray(value) ? value.length : 0;
  } catch { return 0; }
}

function canReplyToPrivateNotes(role: DemoRole): boolean {
  return role === "moderator" || role === "admin" || role === "system_admin";
}

function PrivateReply({ note, onReply }: { note: PrivateNote; onReply: (reply: string) => void }) {
  const [reply, setReply] = useState(note.reply ?? "");
  return <form className="mt-4 flex gap-2" onSubmit={(event) => { event.preventDefault(); if (reply.trim()) onReply(reply.trim()); }}><input className={input} value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Private reply" /><button className="shrink-0 rounded-lg border border-charcoal px-3 text-xs font-semibold text-charcoal hover:border-gold">Reply</button></form>;
}
