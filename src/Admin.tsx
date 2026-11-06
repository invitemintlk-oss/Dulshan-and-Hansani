import React, { useEffect, useRef, useState } from "react";
import { Check, Copy, ExternalLink, Link2, MessageCircle } from "lucide-react";
import { COUPLE_NAMES, WEDDING } from "./config";
import {
  PREFIXES,
  type Prefix,
  buildDisplayName,
  buildGreeting,
  buildInviteLink,
  buildInviteMessage,
  copyText,
} from "./guest";

type Generated = {
  prefix: Prefix;
  guestName: string;
  displayName: string;
  link: string;
  message: string;
};

export default function AdminPage() {
  const [prefix, setPrefix] = useState<Prefix>("Mr.");
  const [guestName, setGuestName] = useState("");
  const [generated, setGenerated] = useState<Generated | null>(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    document.title = `Invitation Links · ${COUPLE_NAMES}`;
    return () => window.clearTimeout(toastTimer.current);
  }, []);

  const baseURL = window.location.origin;
  const livePreviewName = buildDisplayName(prefix, guestName);
  const isStale =
    generated !== null && (generated.prefix !== prefix || generated.guestName !== guestName);

  const showToast = (text: string) => {
    setToast(text);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2200);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = buildDisplayName(prefix, guestName);
    if (!displayName) {
      setError("Please enter the guest name.");
      return;
    }
    setError("");
    const link = buildInviteLink(baseURL, displayName);
    // Prefix and guest name are intentionally kept in the form after generating.
    setGenerated({ prefix, guestName, displayName, link, message: buildInviteMessage(displayName, link) });
  };

  const handleCopy = async (text: string, label: string) => {
    const ok = await copyText(text);
    showToast(ok ? label : "Copy failed — please copy manually");
  };

  return (
    <main className="admin-shell min-h-[100dvh] h-[100dvh] overflow-y-auto font-montserrat text-stone-700">
      <div className="mx-auto w-full max-w-2xl px-4 py-10 md:py-16">
        <header className="text-center mb-10">
          <p className="text-[11px] uppercase tracking-[0.45em] text-theme-700 font-semibold">Admin · Invitation Links</p>
          <h1 className="font-cinzel text-3xl md:text-4xl text-theme-900 mt-3 tracking-wide">
            {WEDDING.groom.name} <span className="font-script text-theme-600 normal-case">&amp;</span> {WEDDING.bride.name}
          </h1>
          <p className="text-sm text-stone-500 mt-2">{WEDDING.dateLong} · {WEDDING.venue.name}, {WEDDING.venue.city}</p>
        </header>

        <form
          onSubmit={handleGenerate}
          className="bg-white rounded-2xl border border-theme-100 shadow-[0_20px_50px_-25px_rgba(122,92,0,0.35)] p-5 sm:p-8 space-y-6"
        >
          <div className="grid gap-5 sm:grid-cols-[180px_1fr]">
            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-500">Select Prefix</span>
              <select
                value={prefix}
                onChange={(e) => setPrefix(e.target.value as Prefix)}
                className="w-full rounded-xl border border-theme-200 bg-theme-50/40 px-4 py-3 text-base text-stone-800 focus:outline-none focus:ring-2 focus:ring-theme-300"
              >
                {PREFIXES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-500">Guest Name</span>
              <input
                type="text"
                value={guestName}
                onChange={(e) => {
                  setGuestName(e.target.value);
                  if (error) setError("");
                }}
                placeholder="e.g. Sanjaya"
                autoComplete="off"
                className="w-full rounded-xl border border-theme-200 bg-theme-50/40 px-4 py-3 text-base text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-theme-300"
              />
            </label>
          </div>

          <div className="rounded-xl bg-theme-50 border border-theme-100 px-4 py-3 text-sm">
            <span className="text-stone-500">Greeting preview: </span>
            <span className="font-semibold text-theme-800">
              {livePreviewName ? buildGreeting(livePreviewName) : "Dear … ❤️"}
            </span>
          </div>

          {error && <p className="text-sm text-red-600 -mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-theme-500 hover:bg-theme-400 text-theme-900 py-3.5 font-semibold tracking-wide transition-colors"
          >
            <Link2 className="w-4 h-4" />
            Generate Link
          </button>
        </form>

        <section className="mt-8 bg-white rounded-2xl border border-theme-100 shadow-[0_20px_50px_-25px_rgba(122,92,0,0.25)] p-5 sm:p-8 space-y-6">
          {isStale && (
            <p className="text-xs rounded-lg bg-amber-50 border border-amber-200 text-amber-800 px-3 py-2">
              The details above have changed — click <strong>Generate Link</strong> again to update.
            </p>
          )}

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-500">Generated Link</p>
            {generated ? (
              <div className="flex items-center gap-2 rounded-xl border border-theme-200 bg-theme-50/40 px-4 py-3">
                <span className="flex-1 break-all text-sm text-theme-800 font-medium select-all">{generated.link}</span>
                <a
                  href={generated.link}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 text-theme-700 hover:text-theme-800"
                  aria-label="Open invitation in a new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <p className="text-sm text-stone-400 italic">Generate a link to see it here.</p>
            )}
          </div>

          {generated && (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-stone-500">Message Preview</p>
              <pre className="whitespace-pre-wrap break-words rounded-xl border border-theme-100 bg-stone-50 px-4 py-4 text-sm leading-relaxed font-montserrat text-stone-700">
                {generated.message}
              </pre>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={!generated}
              onClick={() => generated && handleCopy(generated.link, "Link copied!")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-theme-300 text-theme-800 py-3 font-semibold hover:bg-theme-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              <Copy className="w-4 h-4" />
              Copy Link Only
            </button>
            <button
              type="button"
              disabled={!generated}
              onClick={() => generated && handleCopy(generated.message, "Message copied!")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-theme-500 text-theme-900 py-3 font-semibold hover:bg-theme-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-theme-500"
            >
              <MessageCircle className="w-4 h-4" />
              Copy Full Message
            </button>
          </div>
        </section>
      </div>

      <div
        role="status"
        aria-live="polite"
        className={`fixed left-1/2 bottom-6 -translate-x-1/2 z-50 transition-all duration-300 ${
          toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-white text-sm px-5 py-2.5 shadow-lg">
          <Check className="w-4 h-4 text-theme-300" />
          {toast}
        </div>
      </div>
    </main>
  );
}
