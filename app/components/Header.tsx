"use client";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Search, Phone, MessageCircle, ShoppingCart, UserRound, X, Menu } from "lucide-react";
import { useCart } from "@/app/contexts/cartContext";
import { useShopIdentity } from "@/app/components/newjersey/experience/useShopIdentity";
const links = [{label:"All products",href:"/shop"},{label:"Apparel",href:"/shop/apparel"},{label:"Hire a designer",href:"/hire-a-designer"},{label:"Training",href:"/training"},{label:"About",href:"/about"}];
const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2";
export default function Header() {
  const { itemCount, hydrated } = useCart();
  const identity = useShopIdentity();
  const [panel,setPanel] = useState<"search"|"account"|"menu"|null>(null);
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement|null>(null);
  const id = useId();
  useEffect(()=>{
    if (!panel) return;
    function outside(e:PointerEvent){if(e.target instanceof Node && !root.current?.contains(e.target)) setPanel(null);}
    function escape(e:KeyboardEvent){if(e.key === "Escape"){setPanel(null);trigger.current?.focus();}}
    document.addEventListener("pointerdown",outside); document.addEventListener("keydown",escape);
    return ()=>{document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",escape);};
  },[panel]);
  function toggle(name:typeof panel,button:HTMLButtonElement){trigger.current=button;setPanel(current=>current===name?null:name);}
  const iconClass = `inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-black/5 ${focus}`;
  return <header ref={root} className="relative w-full border-b border-black/10 bg-[#EBEBD3] text-[#181818]">
    <div className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between gap-2 px-4 sm:px-8">
      <Link href="/" aria-label="NewJersey.ng home" className={`shrink-0 rounded-sm text-[23px] font-black tracking-tight ${focus}`}>New<span className="text-[#FF6B00]">Jersey</span><span className="text-sm">.ng</span></Link>
      <nav aria-label="Main navigation" className="hidden items-center gap-6 lg:flex">{links.map(link=><Link key={link.href} href={link.href} className={`inline-flex min-h-11 items-center rounded-sm text-sm font-semibold hover:text-[#9A4000] ${focus}`}>{link.label}</Link>)}</nav>
      <div className="flex items-center gap-1">
        <button type="button" aria-label="Search products" aria-expanded={panel==="search"} aria-controls={`${id}-search`} onClick={e=>toggle("search",e.currentTarget)} className={iconClass}><Search size={19}/></button>
        <a href="tel:+2348089570493" aria-label="Call NewJersey" className={`hidden sm:inline-flex ${iconClass}`}><Phone size={18}/></a>
        <a href="https://wa.me/2348089570493" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp support (opens in a new tab)" className={`hidden sm:inline-flex ${iconClass}`}><MessageCircle size={20}/></a>
        <Link href="/shop/cart" aria-label={`Cart${hydrated?`, ${itemCount} items`:""}`} className={`relative ${iconClass}`}><ShoppingCart size={20}/>{hydrated && itemCount>0 && <span className="absolute -right-0.5 top-0 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#FF6B00] px-1 text-[10px] font-bold">{itemCount>99?"99+":itemCount}</span>}</Link>
        <button type="button" aria-label="Your account" aria-expanded={panel==="account"} aria-controls={`${id}-account`} onClick={e=>toggle("account",e.currentTarget)} className={iconClass}><UserRound size={20}/></button>
        <button type="button" aria-label="Main menu" aria-expanded={panel==="menu"} aria-controls={`${id}-menu`} onClick={e=>toggle("menu",e.currentTarget)} className={`${iconClass} lg:hidden`}>{panel==="menu"?<X size={20}/>:<Menu size={20}/>}</button>
      </div>
    </div>
    {panel==="search" && <div id={`${id}-search`} className="absolute right-4 top-full z-[120] mt-2 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border border-black/10 bg-white p-4 shadow-xl">
      <form action="/shop/search" method="get" onSubmit={()=>setPanel(null)}><label htmlFor={`${id}-q`} className="text-xs font-semibold">Find something for your next order</label><input id={`${id}-q`} name="q" type="search" required maxLength={120} autoFocus placeholder="Printing, apparel, jerseys…" className={`mt-3 min-h-12 w-full rounded-xl border border-black/15 px-3 text-base ${focus}`}/><button className={`mt-3 min-h-11 w-full rounded-xl bg-[#FF6B00] text-sm font-semibold ${focus}`}>Search products</button></form>
    </div>}
    {panel==="account" && <div id={`${id}-account`} className="absolute right-4 top-full z-[120] mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-black/10 bg-white p-4 shadow-xl">
      {identity===undefined?<p role="status" className="text-sm">Loading account…</p>:identity?<><p className="mb-2 text-sm font-semibold">Your NewJersey</p>{[{label:"Your account",href:"/shop/account"},{label:"Your orders",href:"/shop/order"}].map(link=><Link key={link.href} href={link.href} onClick={()=>setPanel(null)} className={`flex min-h-11 items-center rounded-lg px-2 text-sm hover:bg-[#F0EFEB] ${focus}`}>{link.label}</Link>)}</>:<><p className="text-sm font-semibold">Make yourself at home.</p><p className="mt-2 text-xs leading-6 text-[#625D55]">Browse and build your cart first. Sign in when you’re ready to order.</p><Link href="/register?next=%2Fshop%2Fcart" onClick={()=>setPanel(null)} className={`mt-3 flex min-h-11 items-center justify-center rounded-xl bg-[#FF6B00] text-sm font-semibold ${focus}`}>Create account</Link><Link href="/login?next=%2Fshop%2Fcart" onClick={()=>setPanel(null)} className={`mt-2 flex min-h-11 items-center justify-center rounded-xl text-sm underline ${focus}`}>Already registered? Sign in</Link></>}
    </div>}
    {panel==="menu" && <nav id={`${id}-menu`} aria-label="Mobile main navigation" className="border-t border-black/10 px-4 py-3 lg:hidden">{links.map(link=><Link key={link.href} href={link.href} onClick={()=>setPanel(null)} className={`flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold ${focus}`}>{link.label}</Link>)}</nav>}
  </header>;
}
