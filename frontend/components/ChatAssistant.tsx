"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { mockProducts } from "@/data/mock-products";
import { loadWorkspace } from "@/lib/demo-data";
import { useStore } from "@/components/StoreProvider";
import type { Product } from "@/types";

interface ChatMessage {
  id: number;
  role: "assistant" | "user";
  text: string;
  products?: Product[];
  actions?: Array<{ label: string; href: string }>;
  followUp?: string;
}

const initialMessage: ChatMessage = {
  id: 0,
  role: "assistant",
  text: "Hello! I’m your Goynar Gontobbo guide. Tell me the style, occasion, material, or budget you have in mind and I’ll help find a piece. I can also guide you around the store.",
};

const quickQuestions = ["Pearl earrings under ৳3,000", "Find bridal jewellery", "How does delivery work?"];
const stopWords = new Set(["i", "me", "my", "a", "an", "the", "for", "with", "show", "find", "want", "need", "some", "please", "under", "below", "less", "than", "taka", "tk", "tks", "budget", "around", "buy", "looking", "recommend", "recommendations", "something", "beautiful", "piece", "jewellery", "jewelry", "like", "style", "occasion"]);

function guideReply(text: string, cartCount: number, wishlistCount: number): Omit<ChatMessage, "id" | "role"> {
  const query = text.toLocaleLowerCase().trim();
  const links = (phrases: string[]) => phrases.some((phrase) => query.includes(phrase));

  if (links(["hello", "hi", "hey", "assalam", "good morning", "good evening"])) {
    return { text: "Welcome! Tell me what kind of jewellery you’re looking for, your budget, or a question about the store." };
  }
  if (links(["cart", "bag", "basket"])) {
    return { text: cartCount ? `You have ${cartCount} ${cartCount === 1 ? "piece" : "pieces"} in your shopping bag. Open it to review quantities and your subtotal. Checkout is not available in this preview yet.` : "Your shopping bag is empty right now. Browse the collection and tap Add to Cart on a piece you like.", products: [] };
  }
  if (links(["wishlist", "saved", "save for later", "favourite", "favorite"])) {
    return { text: wishlistCount ? `You have ${wishlistCount} ${wishlistCount === 1 ? "piece" : "pieces"} saved in your wishlist. Your saved list stays in this browser.` : "Your wishlist is empty. Tap the heart on a product card to save it for later." };
  }
  if (links(["shipping", "delivery", "deliver", "courier", "shipping fee"])) {
    return { text: "The storefront currently advertises complimentary delivery on orders over ৳5,000 across Bangladesh. Checkout is not active yet, so delivery areas, timing, and final charges still need confirmation.", products: [] };
  }
  if (links(["return", "exchange", "refund"])) {
    return { text: "Returns and exchanges are not available yet because this preview does not accept orders. The policy page will be updated before checkout launches.", products: [] };
  }
  if (links(["size", "sizing", "ring fit", "bangle fit"])) {
    return { text: "For quick measuring tips, visit the size guide. Product-specific measurements will be added when confirmed details are available.", products: [] };
  }
  if (links(["checkout", "payment", "pay", "order", "purchase", "buy now"])) {
    return { text: "Online ordering and payment are not connected yet. You can browse pieces and save them to your cart or wishlist in this browser.", products: [] };
  }
  if (links(["account", "login", "log in", "sign in", "google", "register", "create account"])) {
    return { text: "I can take you to your account to review your own saved profile, preferences, cart, and wishlist. I can’t reveal private information belonging to another account. This preview’s role demo accounts are local to your browser.", actions: [{ label: "Open my account", href: "/account" }, { label: "Sign in", href: "/login" }] };
  }
  if (links(["my personal data", "my information", "my address", "my phone", "my notes", "private data", "personal information", "someone else", "another customer"])) {
    return { text: "I can’t disclose private profile details, addresses, contact information, or notes in chat. You can review and edit your own saved details in your account. I can help you find jewellery without using private account data.", actions: [{ label: "Open my account", href: "/account" }] };
  }
  if (links(["contact", "help", "support", "faq", "question"])) {
    return { text: "I can help you browse products, check this demo’s delivery and checkout details, or find a store page. For more information, see the FAQs or Contact Us page." };
  }

  const budgetMatch = query.match(/(?:under|below|less than|within|budget(?: of)?|৳|tk\s*)(?:\s*৳?\s*)([\d,]+)/);
  const budget = budgetMatch ? Number(budgetMatch[1].replaceAll(",", "")) : undefined;
  const categoryRules: Array<[RegExp, string[]]> = [
    [/jhumka|jhumki/, ["jhumka"]],
    [/earring|earrings|chandbali|studs?/, ["earrings", "jhumka"]],
    [/bangle|bangles|bracelet|cuff/, ["bangles", "cuffs"]],
    [/necklace|necklaces|chain|pendant/, ["necklaces", "tana"]],
    [/ring|rings/, ["rings"]],
    [/bridal|jewellery set|jewelry set|\bset\b/, ["sets"]],
  ];
  const matchedCategories = categoryRules.find(([pattern]) => pattern.test(query))?.[1];
  const materialPattern = /pearl|kundan|silver|gold|rose gold|antique|green|ruby/;
  const tokens = query.split(/[^\p{L}\p{N}]+/u).filter((token) => token.length > 2 && !stopWords.has(token) && !/^\d+$/.test(token));
  const catalog = typeof window === "undefined" ? mockProducts : loadWorkspace().products;
  const ranked = catalog
    .filter((product) => product.inStock)
    .filter((product) => !budget || product.price <= budget)
    .filter((product) => !matchedCategories || matchedCategories.includes(product.categorySlug))
    .map((product) => {
      const words = `${product.name} ${product.category} ${product.description ?? ""}`.toLocaleLowerCase();
      const matchScore = tokens.reduce((score, token) => score + (words.includes(token) ? (token.length > 5 ? 3 : 2) : 0), 0);
      const materialScore = materialPattern.test(query) && words.includes(query.match(materialPattern)?.[0] ?? "") ? 2 : 0;
      const occasionScore = /bridal|wedding|party|festive|gift/.test(query) && /bridal|set|kundan|jhumka|necklace/i.test(words) ? 2 : 0;
      const categoryScore = matchedCategories ? 3 : 0;
      const score = matchScore + materialScore + occasionScore + categoryScore + (product.isBestSeller ? 1 : 0);
      return { product, score };
    })
    .filter((entry) => !tokens.length || entry.score > 0 || matchedCategories || budget)
    .sort((a, b) => b.score - a.score || a.product.price - b.product.price);

  if (budget || matchedCategories || tokens.length) {
    const products = ranked.slice(0, 3).map(({ product }) => product);
    if (products.length) {
      const budgetDescription = budget ? ` under ৳${budget.toLocaleString()}` : "";
      const categoryDescription = matchedCategories ? ` in ${matchedCategories[0]}` : "";
      return { text: `I found ${products.length === 1 ? "a piece" : "a few pieces"}${categoryDescription}${budgetDescription} that may fit. You can open a product to see its full images and details. These are preview listings, and checkout is not active.`, products, followUp: "Would you like me to open one of these for you?" };
    }
    return { text: `I couldn’t find an in-stock match${budget ? ` under ৳${budget.toLocaleString()}` : ""}. Try another budget or browse all categories.`, products: [] };
  }

  if (links(["occasion", "gift", "wedding", "bridal", "party", "festive", "everyday"])) {
    return { text: "I can narrow it down by occasion. For bridal or wedding looks, try a set, kundan, or jhumka; for everyday wear, pearl drops, studs, and simple cuffs are easy starting points. What is the occasion and budget?", actions: [{ label: "Browse sets", href: "/categories/sets" }, { label: "Browse jhumka", href: "/categories/jhumka" }] };
  }
  if (links(["what do you have", "collections", "categories", "browse", "guide me", "help me choose"])) {
    return { text: "You can explore earrings, rings, bangles, necklaces, jhumka, cuffs, tana, and sets. Tell me a category, material, occasion, or budget and I’ll suggest matching pieces.", actions: [{ label: "Browse all jewellery", href: "/shop" }, { label: "View categories", href: "/categories" }] };
  }

  return { text: "I’m not sure I understood that yet. Tell me a category (like jhumka or bangles), a material (like pearl or kundan), an occasion, or a maximum budget and I’ll find some options." };
}

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const { cart, wishlist, addToCart } = useStore();
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);

  function sendMessage(value: string) {
    const text = value.trim();
    if (!text) return;
    const messageId = messages.length;
    const userMessage: ChatMessage = { id: messageId, role: "user", text };
    const answer = guideReply(text, cartCount, wishlist.length);
    const assistantMessage: ChatMessage = { ...answer, id: messageId + 1, role: "assistant" };
    setMessages((current) => [...current, userMessage, assistantMessage]);
    setInput("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="fixed bottom-4 right-4 z-[70] sm:bottom-6 sm:right-6">
      {open && (
        <section aria-label="Goynar Gontobbo shopping assistant" className="mb-3 flex h-[min(76vh,620px)] w-[min(400px,calc(100vw-2rem))] animate-chat-in flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_24px_80px_rgba(26,26,26,0.24)]">
          <header className="flex items-center gap-3 bg-charcoal px-4 py-4 text-cream">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-lg" aria-hidden="true">✦</div>
            <div className="min-w-0 flex-1"><h2 className="font-heading text-lg">Jewellery Guide</h2><p className="text-[11px] text-cream/60">Free preview · uses this catalogue</p></div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 text-cream/80 transition hover:bg-white/10 hover:text-white" aria-label="Close assistant">×</button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto bg-ivory p-4" aria-live="polite" aria-relevant="additions">
            {messages.map((message) => (
              <div key={message.id} className={`animate-chat-message flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[92%] rounded-2xl px-3.5 py-3 text-sm leading-6 ${message.role === "user" ? "rounded-br-md bg-charcoal text-white" : "rounded-bl-md border border-border bg-white text-charcoal shadow-sm"}`}>
                  <p>{message.text}</p>
                  {message.role === "assistant" && message.text.includes("FAQs") && <div className="mt-2 flex gap-3 text-xs font-semibold text-gold-dark"><Link href="/faq">FAQs</Link><Link href="/contact">Contact Us</Link></div>}
                  {message.role === "assistant" && message.actions && <div className="mt-3 flex flex-wrap gap-2">{message.actions.map((action) => <Link key={action.href} href={action.href} className="rounded-full border border-gold/35 bg-cream px-3 py-1.5 text-[11px] font-semibold text-gold-dark hover:border-gold">{action.label}</Link>)}</div>}
                  {message.role === "assistant" && message.text.includes("size guide") && <Link href="/size-guide" className="mt-2 inline-block text-xs font-semibold text-gold-dark underline underline-offset-4">Open size guide</Link>}
                  {message.role === "assistant" && message.text.includes("account page") && <Link href="/account" className="mt-2 inline-block text-xs font-semibold text-gold-dark underline underline-offset-4">Go to your account</Link>}
                  {message.role === "assistant" && message.text.includes("shopping bag") && <Link href="/cart" className="mt-2 inline-block text-xs font-semibold text-gold-dark underline underline-offset-4">Open shopping bag</Link>}
                  {message.role === "assistant" && message.text.includes("wishlist") && <Link href="/wishlist" className="mt-2 inline-block text-xs font-semibold text-gold-dark underline underline-offset-4">Open wishlist</Link>}
                  {message.products?.map((product) => (
                    <article key={product.id} className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-ivory p-2">
                      <Link href={`/products/${product.slug}`} className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-cream"><Image src={product.images[0] || "/jewellery-placeholder.svg"} alt={product.name} fill sizes="56px" className="object-cover" /></Link>
                      <div className="min-w-0 flex-1"><Link href={`/products/${product.slug}`} className="line-clamp-2 text-xs font-semibold leading-5 text-dark hover:text-gold-dark">{product.name}</Link><p className="text-xs text-muted">{product.currency}{product.price.toLocaleString()} · {product.category}</p></div>
                      <div className="flex shrink-0 flex-col gap-1"><Link href={`/products/${product.slug}`} className="rounded-lg border border-charcoal px-2.5 py-1.5 text-center text-[10px] font-semibold text-charcoal transition hover:border-gold-dark hover:text-gold-dark">Open</Link><button type="button" onClick={() => addToCart(product)} disabled={!product.inStock} className="rounded-lg bg-charcoal px-2.5 py-1.5 text-[10px] font-semibold text-white transition hover:bg-gold-dark disabled:opacity-50" aria-label={`Add ${product.name} to cart`}>Add</button></div>
                    </article>
                  ))}
                  {message.followUp && <p className="mt-3 text-xs font-medium text-gold-dark">{message.followUp}</p>}
                </div>
              </div>
            ))}
          </div>

          {messages.length === 1 && <div className="flex flex-wrap gap-2 border-t border-border bg-ivory px-4 pb-3">{quickQuestions.map((question) => <button type="button" key={question} onClick={() => sendMessage(question)} className="rounded-full border border-gold/30 bg-white px-3 py-1.5 text-[11px] text-charcoal transition hover:border-gold hover:bg-cream">{question}</button>)}</div>}

          <form onSubmit={submit} className="flex gap-2 border-t border-border bg-white p-3">
            <label htmlFor="guide-message" className="sr-only">Ask the jewellery guide</label>
            <input id="guide-message" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about styles, budget, or the store…" className="min-w-0 flex-1 rounded-xl border border-border bg-ivory px-3 py-2.5 text-xs outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20" maxLength={300} />
            <button type="submit" disabled={!input.trim()} className="rounded-xl bg-gold px-4 text-xs font-semibold text-white transition hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-45" aria-label="Send message">Send</button>
          </form>
        </section>
      )}

      <button type="button" data-motion="178" onClick={() => setOpen((current) => !current)} className="ml-auto flex items-center gap-2 rounded-full bg-charcoal px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-gold-dark hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2" aria-expanded={open} aria-label={open ? "Close jewellery guide" : "Ask the jewellery guide"}>
        <span className="text-lg" aria-hidden="true">{open ? "×" : "✦"}</span><span>{open ? "Close" : "Ask GG"}</span>
      </button>
    </div>
  );
}
