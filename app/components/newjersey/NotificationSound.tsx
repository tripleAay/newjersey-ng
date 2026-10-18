"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { freshSoundEvents, type SoundEvent } from "@/app/lib/newjersey/notifications/policy";

export function useNotificationSound(scope: "customer" | "admin") {
 const key = `newjersey-${scope}-sound-v1`;
 const [enabled, setEnabled] = useState(false);
 const [message, setMessage] = useState("");
 const enabledRef = useRef(false);
 const seen = useRef<Set<string> | null>(null);
 const context = useRef<AudioContext | null>(null);
 const lastSound = useRef(0);
 const active = useRef(false);
 useEffect(() => {
  active.current = true;
  try { enabledRef.current = localStorage.getItem(key) === "on"; setEnabled(enabledRef.current); } catch { /* Default stays off. */ }
  const sync = (event: StorageEvent) => { if (event.key === key || event.key === null) { enabledRef.current = event.newValue === "on"; setEnabled(enabledRef.current); } };
  const visibility = () => { seen.current = null; };
  // Only an intentional user interaction may unlock audio after a reload.
  const unlock = () => { if (enabledRef.current) { try { context.current ??= new AudioContext(); void context.current.resume().catch(() => {}); } catch { /* Visual alerts remain available. */ } } };
  window.addEventListener("storage", sync);
  window.addEventListener("pointerdown", unlock);
  window.addEventListener("keydown", unlock);
  document.addEventListener("visibilitychange", visibility);
  return () => { active.current = false; window.removeEventListener("storage", sync); window.removeEventListener("pointerdown", unlock); window.removeEventListener("keydown", unlock); document.removeEventListener("visibilitychange", visibility); const old = context.current; context.current = null; if (old && old.state !== "closed") void old.close().catch(() => {}); };
 }, [key]);
 const play = useCallback(() => {
  const audio = context.current;
  if (!active.current || !enabledRef.current || document.visibilityState !== "visible" || !audio || audio.state !== "running") return false;
  const now = audio.currentTime;
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(640, now);
  oscillator.frequency.exponentialRampToValueAtTime(440, now + 0.16);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.035, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
  oscillator.connect(gain); gain.connect(audio.destination);
  oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  oscillator.start(now); oscillator.stop(now + 0.22);
  return true;
 }, []);
 const observe = useCallback((items: SoundEvent[]) => {
  const now = Date.now();
  const fresh = freshSoundEvents(items, seen.current, scope, now);
  // Retain observed IDs for this mount; bound the set for long-lived admin tabs.
  seen.current = new Set([...(seen.current ?? []), ...items.map(item => item.id)].slice(-1000));
  if (!enabledRef.current || !fresh.length || now - lastSound.current < 15000 || document.visibilityState !== "visible") return;
  // One lock covers all events in the batch, all tabs and both admin/customer panels.
  // Without locking or storage, fail silent instead of risking duplicate sounds.
  if (!navigator.locks) return;
  void navigator.locks.request("newjersey-notification-audio", () => {
   try {
    const last = Number(localStorage.getItem("newjersey-last-notification-sound") ?? 0);
    if (Date.now() - last < 15000) return;
    const id = `${scope}:${fresh[0].id}`;
    const previous: unknown = JSON.parse(localStorage.getItem("newjersey-played-sound-events") ?? "[]");
    const played = Array.isArray(previous) ? previous.filter((value): value is string => typeof value === "string") : [];
    if (played.includes(id)) return;
    if (play()) { lastSound.current = Date.now(); localStorage.setItem("newjersey-last-notification-sound", String(lastSound.current)); localStorage.setItem("newjersey-played-sound-events", JSON.stringify([...played, ...fresh.map(item => `${scope}:${item.id}`)].slice(-200))); }
   } catch { /* Storage may be blocked. Keep visual notifications working. */ }
  }).catch(() => {});
 }, [scope, play]);
 const toggle = async () => {
  setMessage("");
  if (enabledRef.current) { enabledRef.current = false; setEnabled(false); try { localStorage.setItem(key, "off"); } catch {} return; }
  try {
   context.current ??= new AudioContext();
   await context.current.resume();
   if (!active.current || context.current?.state !== "running") { setMessage("Sound is unavailable. Visual notifications remain on."); return; }
   enabledRef.current = true; setEnabled(true);
   try { localStorage.setItem(key, "on"); } catch { setMessage("Enabled for this visit. Your browser could not save this setting."); }
   play(); // One soft preview after explicit opt-in.
  } catch { setMessage("Your browser could not enable sound. Visual notifications remain on."); }
 };
 return { enabled, message, toggle, observe };
}
export function NotificationSoundControl({ sound }: { sound: ReturnType<typeof useNotificationSound> }) {
 const Icon = sound.enabled ? Volume2 : VolumeX;
 return <div className="border-b border-black/10 px-5 py-3"><button type="button" role="switch" aria-checked={sound.enabled} onClick={() => void sound.toggle()} className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg text-left text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]"><span className="flex items-center gap-2"><Icon size={15} aria-hidden="true"/>Notification sound</span><span className="font-semibold">{sound.enabled ? "On" : "Off"}</span></button><p className="text-[11px] leading-5 text-[#625D55]">Optional soft sound for important new updates. This browser only.</p><p role="status" className="text-[11px] leading-5 text-[#625D55]">{sound.message}</p></div>;
}
