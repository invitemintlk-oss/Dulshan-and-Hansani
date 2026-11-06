import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, CalendarPlus, Clock, ExternalLink, Heart, MapPin, Navigation, Play, SkipForward, Sparkles, Volume2, VolumeX } from "lucide-react";
import { COUPLE_NAMES, GOOGLE_SCRIPT_URL, WEDDING } from "./config";

/**
 * Dulshan & Hashini — Traditional Sri Lankan Wedding Invitation
 * Theme: bright traditional yellow, mandala & peacock motifs.
 */

// All images are web-optimised WebP copies in public/opt (originals are kept untouched).
const mandalaImage = "/opt/mandala.webp";
const heroBackground = "/opt/hero-bg.webp"; // from public/1.png
const venueBackground = "/opt/venue-bg.webp"; // from public/2.jpg
const rsvpBackground = "/opt/rsvp-bg.webp"; // from public/3.jpg
const wishesBackground = "/opt/wishes-bg.webp"; // from public/5.png (grey border cropped)
/** Background song for the whole invitation (public/song.mp3 compressed to AAC). */
const backgroundSong = "/opt/song.m4a";
/** Mobile-optimised copy of public/intro.mp4 (540p, ~1.1 MB instead of 5.5 MB). */
const introVideo = "/opt/intro.mp4";
const introPoster = "/opt/intro-poster.webp";
const peacockLeft = "/opt/peacock-left.webp";
const peacockRight = "/opt/peacock-right.webp";
/** Replace this file with the couple's own illustration (transparent PNG works best). */
const coupleImage = "/opt/couple.webp";

type FormStatus = "idle" | "submitting" | "success" | "error";

type InviteImageProps = React.ComponentProps<"img"> & { eager?: boolean };

function InviteImage({ eager = false, loading, decoding, ...props }: InviteImageProps) {
  return <img loading={loading ?? (eager ? "eager" : "lazy")} decoding={decoding ?? "async"} {...props} />;
}

function MandalaFrame({ minimal = false }: { minimal?: boolean }) {
  return (
    <div className="mandala-frame pointer-events-none fixed inset-0 z-[12] overflow-hidden" aria-hidden="true">
      <div className="mandala-corner mandala-corner-tr">
        <InviteImage src={mandalaImage} alt="" className="mandala-art" eager />
      </div>
      {!minimal && (
        <>
          <div className="mandala-corner mandala-corner-bl mandala-mobile-hidden">
            <InviteImage src={mandalaImage} alt="" className="mandala-art" />
          </div>
          <div className="mandala-corner mandala-corner-tl is-soft mandala-mobile-hidden">
            <InviteImage src={mandalaImage} alt="" className="mandala-art" />
          </div>
          <div className="mandala-corner mandala-corner-br is-soft mandala-mobile-hidden">
            <InviteImage src={mandalaImage} alt="" className="mandala-art" />
          </div>
        </>
      )}
    </div>
  );
}

type Petal = { id: number; x: number; size: number; rotation: number; duration: number; delay: number; color: string; drift: number };

function FloatingPetals({ disabled = false }: { disabled?: boolean }) {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    if (disabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPetals([]);
      return;
    }
    const colors = ["#fff3b0", "#ffe266", "#fdd535", "#fffdf0", "#f5c518"];
    setPetals(
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 7 + 7,
        rotation: Math.random() * 360,
        duration: Math.random() * 11 + 16,
        delay: Math.random() * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        drift: Math.random() * 24 - 12,
      })),
    );
  }, [disabled]);

  if (disabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-40" aria-hidden="true">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute drop-shadow-[0_2px_6px_rgba(245,197,24,0.35)]"
          style={{ color: petal.color }}
          initial={{ x: `${petal.x}vw`, y: "-10vh", rotate: petal.rotation, opacity: 0 }}
          animate={{
            y: "110vh",
            x: `${petal.x + petal.drift}vw`,
            rotate: petal.rotation + 720,
            opacity: [0, 0.9, 0.8, 0],
          }}
          transition={{ duration: petal.duration, repeat: Infinity, delay: petal.delay, ease: "linear" }}
        >
          <svg width={petal.size} height={petal.size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2C12,2 10,6 10,10C10,14 12,22 12,22C12,22 14,14 14,10C14,6 12,2 12,2Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/** Thin gold rule with a centred diamond. */
function Ornament({ className = "", light = false }: { className?: string; light?: boolean }) {
  const line = light ? "via-accent-300" : "via-accent-500";
  return (
    <div className={`flex items-center justify-center gap-3 w-full ${className}`} aria-hidden="true">
      <div className={`h-px w-16 md:w-28 bg-gradient-to-r from-transparent ${line} to-accent-400`} />
      <div className="w-1.5 h-1.5 rotate-45 bg-accent-400" />
      <div className={`w-2.5 h-2.5 rotate-45 border ${light ? "border-accent-300" : "border-accent-500"}`} />
      <div className="w-1.5 h-1.5 rotate-45 bg-accent-400" />
      <div className={`h-px w-16 md:w-28 bg-gradient-to-l from-transparent ${line} to-accent-400`} />
    </div>
  );
}

function SectionEyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`text-[11px] md:text-[13px] uppercase tracking-[0.45em] md:tracking-[0.55em] font-semibold ${
        light ? "text-theme-200" : "text-theme-700"
      }`}
    >
      {children}
    </p>
  );
}

function CountdownTimer() {
  const targetDate = new Date(WEDDING.poruwaISO).getTime();
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, targetDate - Date.now()));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(Math.max(0, targetDate - Date.now())), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const stats = [
    { label: "Days", value: Math.floor(timeLeft / 86_400_000) },
    { label: "Hours", value: Math.floor((timeLeft % 86_400_000) / 3_600_000) },
    { label: "Minutes", value: Math.floor((timeLeft % 3_600_000) / 60_000) },
    { label: "Seconds", value: Math.floor((timeLeft % 60_000) / 1000) },
  ];

  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-8 justify-center w-full max-w-4xl mx-auto mt-10 md:mt-16 z-20 px-2">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, type: "spring", stiffness: 80 }}
          className="relative group"
        >
          <div className="relative w-[4.6rem] h-[6.6rem] sm:w-24 sm:h-32 md:w-32 md:h-44 bg-white rounded-t-full shadow-[0_15px_35px_-10px_rgba(122,92,0,0.18)] border border-theme-100 flex flex-col items-center justify-center overflow-hidden transition-transform duration-700 group-hover:-translate-y-3">
            <div className="absolute inset-1.5 sm:inset-2 md:inset-3 border border-accent-300/70 rounded-t-full pointer-events-none" />
            <span className="font-cinzel text-3xl sm:text-4xl md:text-6xl text-theme-800 leading-none relative z-10 mt-3 md:mt-6">
              {stat.value.toString().padStart(2, "0")}
            </span>
            <span className="mt-2 md:mt-5 text-[9px] sm:text-[10px] md:text-[12px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-theme-700 font-semibold relative z-10">
              {stat.label}
            </span>
            <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 w-1 h-1 md:w-1.5 md:h-1.5 rotate-45 bg-accent-400" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Full-screen intro video with a "You are welcome" overlay.
 * Plays muted (browsers only allow muted autoplay) and opens the invitation when it ends.
 */
function IntroVideo({
  guestName,
  onFinish,
  musicOn,
  onToggleMusic,
}: {
  guestName: string;
  onFinish: () => void;
  musicOn: boolean;
  onToggleMusic: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const finishedRef = useRef(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [showText, setShowText] = useState(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish();
  }, [onFinish]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    // Autoplay can be blocked (e.g. iOS Low Power Mode) — then ask for one tap.
    video.play().catch(() => setNeedsTap(true));
    const textTimer = window.setTimeout(() => setShowText(true), 800);
    return () => window.clearTimeout(textTimer);
  }, []);

  const startWithTap = () => {
    setNeedsTap(false);
    if (!musicOn) onToggleMusic();
    videoRef.current?.play().catch(() => finish());
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.9, ease: "easeInOut" } }}
      className="fixed inset-0 z-[60] bg-theme-900 flex items-center justify-center overflow-hidden"
    >
      {/* Desktop: soft blurred backdrop around the portrait video */}
      <img src={introPoster} alt="" aria-hidden="true" className="hidden md:block absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-60" />

      <div className="relative h-full w-full md:w-auto md:aspect-[9/16] overflow-hidden md:shadow-[0_0_80px_rgba(0,0,0,0.45)]">
        <video
          ref={videoRef}
          src={introVideo}
          poster={introPoster}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
          autoPlay
          preload="auto"
          onEnded={() => window.setTimeout(finish, 700)}
          onError={finish}
        />

        {/* Readability gradients: top for controls, bottom for the welcome text */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black/75 via-black/35 to-transparent pointer-events-none" />

        {/* Welcome text — placed over the lower part of the frame so the couple's faces stay clear */}
        <AnimatePresence>
          {showText && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
              className="absolute inset-x-0 bottom-[8%] px-6 text-center pointer-events-none"
            >
              <p className="font-cinzel text-[11px] md:text-xs uppercase tracking-[0.45em] text-white/85 drop-shadow">
                {WEDDING.groom.name} &amp; {WEDDING.bride.name}
              </p>
              <h1 className="font-script text-[3.6rem] sm:text-7xl leading-[1.05] text-white mt-2 drop-shadow-[0_4px_18px_rgba(0,0,0,0.55)]">
                You are welcome
              </h1>
              {guestName && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 1 }}
                  className="font-cinzel text-lg sm:text-xl tracking-[0.15em] text-theme-200 mt-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] break-words"
                >
                  {guestName}
                </motion.p>
              )}
              <div className="mx-auto mt-4 flex items-center justify-center gap-3" aria-hidden="true">
                <div className="h-px w-14 bg-gradient-to-r from-transparent to-theme-300" />
                <div className="w-1.5 h-1.5 rotate-45 bg-theme-300" />
                <div className="h-px w-14 bg-gradient-to-l from-transparent to-theme-300" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <button
          type="button"
          onClick={onToggleMusic}
          className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md border border-white/30 px-3.5 py-2.5 text-white hover:bg-white/25 transition-colors"
          aria-label={musicOn ? "Pause music" : "Play music"}
        >
          {musicOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          {!musicOn && <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">Music</span>}
        </button>
        <button
          type="button"
          onClick={finish}
          className="absolute top-4 right-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md border border-white/30 px-4 py-2 text-[11px] uppercase tracking-[0.25em] font-semibold text-white hover:bg-white/25 transition-colors"
        >
          Skip <SkipForward size={14} />
        </button>

        {needsTap && (
          <button
            type="button"
            onClick={startWithTap}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/20"
            aria-label="Play intro"
          >
            <span className="w-20 h-20 rounded-full bg-white/90 text-theme-900 flex items-center justify-center shadow-2xl">
              <Play size={30} className="ml-1" />
            </span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

const googleCalendarLink = (() => {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Wedding of ${COUPLE_NAMES}`,
    // 9.00 A.M. – 4.00 P.M. Sri Lanka time (UTC+05:30)
    dates: "20270124T033000Z/20270124T103000Z",
    details: `Poruwa Ceremony at ${WEDDING.poruwaTime}. Location: ${WEDDING.venue.mapsLink}`,
    location: `${WEDDING.venue.name}, ${WEDDING.venue.city}, ${WEDDING.venue.country}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
})();

async function postToSheet(fields: Record<string, string>) {
  // Apps Script web apps don't return CORS headers, so the response is opaque (no-cors).
  await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(fields),
  });
}

export default function WeddingInvitation({ guestName = "" }: { guestName?: string }) {
  const [isOpened, setIsOpened] = useState(false);
  const [isLowPerformanceMode, setIsLowPerformanceMode] = useState(false);

  // RSVP form
  const [rsvpName, setRsvpName] = useState(guestName);
  const [rsvpAttending, setRsvpAttending] = useState<"Yes" | "No">("Yes");
  const [rsvpGuests, setRsvpGuests] = useState("1");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpNotes, setRsvpNotes] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState<FormStatus>("idle");

  // Wishes form
  const [wishName, setWishName] = useState(guestName);
  const [wishMessage, setWishMessage] = useState("");
  const [wishStatus, setWishStatus] = useState<FormStatus>("idle");

  // Audio
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const inviteeLine = guestName || "you";

  useEffect(() => {
    document.title = guestName
      ? `${guestName} · You're invited to ${COUPLE_NAMES}'s Wedding`
      : `${COUPLE_NAMES} · Wedding Invitation`;
  }, [guestName]);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch((e) => console.log("Audio play failed", e));
    }
  };

  const handleOpenInvitation = () => {
    setIsOpened(true);
    audioRef.current?.play().then(() => setIsPlaying(true)).catch((e) => console.log("Audio autoplay prevented", e));
  };

  const submitRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;
    setRsvpStatus("submitting");
    try {
      await postToSheet({
        type: "RSVP",
        invitedAs: guestName,
        name: rsvpName.trim(),
        attending: rsvpAttending,
        guests: rsvpAttending === "Yes" ? rsvpGuests : "0",
        phone: rsvpPhone.trim(),
        notes: rsvpNotes.trim(),
      });
      setRsvpStatus("success");
      setRsvpNotes("");
      setRsvpPhone("");
      setTimeout(() => setRsvpStatus("idle"), 4000);
    } catch (err) {
      console.error(err);
      setRsvpStatus("error");
      setTimeout(() => setRsvpStatus("idle"), 4000);
    }
  };

  const submitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishName.trim() || !wishMessage.trim()) return;
    setWishStatus("submitting");
    try {
      await postToSheet({ type: "Wishes", invitedAs: guestName, name: wishName.trim(), message: wishMessage.trim() });
      setWishStatus("success");
      setWishMessage("");
      setTimeout(() => setWishStatus("idle"), 4000);
    } catch (err) {
      console.error(err);
      setWishStatus("error");
      setTimeout(() => setWishStatus("idle"), 4000);
    }
  };

  useEffect(() => {
    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & {
      connection?: {
        saveData?: boolean;
        effectiveType?: string;
        addEventListener?: (type: string, listener: () => void) => void;
        removeEventListener?: (type: string, listener: () => void) => void;
      };
    }).connection;
    const getDeviceMemory = () => (navigator as Navigator & { deviceMemory?: number }).deviceMemory;

    const updatePerformanceMode = () => {
      const constrainedNetwork = Boolean(connection?.saveData) || /2g/.test(connection?.effectiveType ?? "");
      const memory = getDeviceMemory();
      const lowMemory = typeof memory === "number" && memory <= 4;
      const smallScreen = window.innerWidth < 768;
      setIsLowPerformanceMode(motionMedia.matches || constrainedNetwork || lowMemory || smallScreen);
    };

    updatePerformanceMode();
    motionMedia.addEventListener("change", updatePerformanceMode);
    window.addEventListener("resize", updatePerformanceMode);
    connection?.addEventListener?.("change", updatePerformanceMode);
    return () => {
      motionMedia.removeEventListener("change", updatePerformanceMode);
      window.removeEventListener("resize", updatePerformanceMode);
      connection?.removeEventListener?.("change", updatePerformanceMode);
    };
  }, []);

  const statusLabel = (status: FormStatus, idle: string) =>
    status === "submitting" ? "Sending…" : status === "success" ? "Thank you! Received ♥" : status === "error" ? "Something went wrong — try again" : idle;

  return (
    <main
      className={`h-[100dvh] w-full bg-paper transition-all duration-1000 ${
        isOpened ? "overflow-y-auto overflow-x-hidden smooth-mobile-scroll" : "overflow-hidden flex items-center justify-center"
      } relative font-montserrat scroll-smooth`}
    >
      <MandalaFrame minimal={isLowPerformanceMode} />
      <FloatingPetals disabled={isLowPerformanceMode} />

      <AnimatePresence mode="wait">
        {!isOpened ? (
          /* ───────────────────────── INTRO VIDEO ───────────────────────── */
          <IntroVideo key="intro-stage" guestName={guestName} onFinish={handleOpenInvitation} musicOn={isPlaying} onToggleMusic={toggleAudio} />
        ) : (
          /* ───────────────────────── WEBSITE ───────────────────────── */
          <motion.div key="website-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="website-shell relative z-20 w-full">

            {/* ── Hero ── */}
            <section className="min-h-[100dvh] w-full flex flex-col items-center justify-center px-4 pt-20 pb-24 md:py-24 relative overflow-hidden">
              {/* Background image (public/1.png, web-optimised copy) */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${heroBackground})` }}
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,253,240,0.7)_0%,rgba(255,253,240,0.3)_55%,transparent_80%)]"
                aria-hidden="true"
              />

              <div className="relative z-10 w-full max-w-xl flex flex-col items-center text-center">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-[10px] md:text-xs uppercase tracking-[0.45em] text-theme-800 font-semibold"
                >
                  Together with their families
                </motion.p>

                {/* 1 ─ Mandala + couple illustration (artwork only, no text on top) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
                  className="relative w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[340px] md:h-[340px] mt-5 shrink-0"
                >
                  <img
                    src={mandalaImage}
                    alt=""
                    className={`absolute inset-0 w-full h-full object-contain ${isLowPerformanceMode ? "" : "animate-spin-slow"}`}
                    style={{ animationDuration: "60s" }}
                  />
                  <motion.img
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.7 }}
                    src={coupleImage}
                    alt={COUPLE_NAMES}
                    className="absolute left-1/2 bottom-[6%] -translate-x-1/2 h-[86%] w-auto object-contain drop-shadow-[0_15px_25px_rgba(90,66,0,0.25)]"
                  />
                </motion.div>

                {/* 2 ─ Names, clearly below the artwork */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.9 }}
                  className="mt-8 md:mt-10 w-full max-w-md rounded-[1.75rem] bg-white/85 backdrop-blur-sm border border-theme-200 shadow-[0_20px_50px_-25px_rgba(122,92,0,0.45)] px-6 py-7 md:px-10 md:py-8 relative"
                >
                  <div className="absolute inset-2 rounded-[1.4rem] border border-accent-300/80 pointer-events-none" />
                  <h1 className="relative font-cinzel text-[2.5rem] sm:text-5xl md:text-6xl text-theme-900 tracking-[0.1em] leading-none">
                    {WEDDING.groom.name.toUpperCase()}
                  </h1>
                  <p className="relative font-script text-5xl md:text-6xl text-theme-700 leading-none my-1.5">&amp;</p>
                  <h1 className="relative font-cinzel text-[2.5rem] sm:text-5xl md:text-6xl text-theme-900 tracking-[0.1em] leading-none">
                    {WEDDING.bride.name.toUpperCase()}
                  </h1>

                  <Ornament className="mt-6 mb-4" />
                  <p className="relative font-cinzel text-base md:text-lg text-theme-900 tracking-[0.3em]">{WEDDING.dateShort}</p>
                  <p className="relative text-[10px] md:text-[11px] text-theme-700 tracking-[0.35em] uppercase font-semibold mt-1.5">
                    {WEDDING.venue.name} · {WEDDING.venue.city}
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 1 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
              >
                <span className="text-[10px] uppercase tracking-[0.4em] text-theme-700/70 font-semibold">Scroll</span>
                <div className="w-px h-10 relative overflow-hidden bg-theme-100">
                  <motion.div animate={{ y: [-40, 60] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="w-full h-8 bg-theme-500" />
                </div>
              </motion.div>
            </section>

            {/* ── The Invitation (modelled on the printed card) ── */}
            <section className="cv-auto py-20 md:py-28 w-full flex flex-col items-center px-4 relative">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif italic text-xl md:text-2xl text-theme-800 text-center max-w-xl leading-relaxed mb-10 md:mb-14 px-2"
              >
                We cordially invite{" "}
                <span className="not-italic font-semibold text-theme-700">{inviteeLine}</span> to celebrate our special day with us.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
                className="relative w-full max-w-3xl bg-white/95 border border-theme-100 shadow-[0_35px_80px_-30px_rgba(122,92,0,0.35)] rounded-[1.75rem] overflow-hidden"
              >
                <div className="absolute inset-3 md:inset-4 border border-accent-300/80 rounded-[1.3rem] pointer-events-none" />
                <div className="absolute inset-[18px] md:inset-[22px] border border-theme-200/70 rounded-[1.1rem] pointer-events-none" />
                <InviteImage src={peacockLeft} alt="" className="absolute -left-6 bottom-0 w-[110px] md:w-[170px] opacity-35 pointer-events-none" />
                <InviteImage src={peacockRight} alt="" className="absolute -right-6 bottom-0 w-[110px] md:w-[170px] opacity-35 pointer-events-none" />

                <div className="relative z-10 px-6 sm:px-10 md:px-16 py-14 md:py-20 text-center">
                  {/* Names + parents */}
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6 md:gap-6">
                    <div>
                      <h2 className="font-cinzel text-4xl md:text-5xl text-theme-900 tracking-[0.12em]">{WEDDING.groom.name.toUpperCase()}</h2>
                      <p className="mt-3 text-[11px] md:text-xs uppercase tracking-[0.35em] text-stone-500 font-semibold">Son of</p>
                      <p className="font-cinzel text-sm md:text-base text-stone-700 tracking-[0.12em] mt-1">{WEDDING.groom.parents}</p>
                    </div>
                    <p className="font-script text-6xl md:text-7xl text-theme-600 leading-none">&amp;</p>
                    <div>
                      <h2 className="font-cinzel text-4xl md:text-5xl text-theme-900 tracking-[0.12em]">{WEDDING.bride.name.toUpperCase()}</h2>
                      <p className="mt-3 text-[11px] md:text-xs uppercase tracking-[0.35em] text-stone-500 font-semibold">Daughter of</p>
                      <p className="font-cinzel text-sm md:text-base text-stone-700 tracking-[0.12em] mt-1">{WEDDING.bride.parents}</p>
                    </div>
                  </div>

                  <Ornament className="my-10" />

                  <p className="font-cinzel text-xs sm:text-sm md:text-base text-stone-700 tracking-[0.25em] uppercase">
                    Request the pleasure of the presence of
                  </p>

                  {/* Guest line */}
                  <div className="mx-auto mt-5 max-w-lg dotted-line pb-2 min-h-[3.75rem] flex items-end justify-center">
                    <p className="font-script text-4xl md:text-5xl text-theme-700 leading-tight break-words px-2">
                      {guestName || "Our Beloved Guest"}
                    </p>
                  </div>

                  <p className="font-cinzel text-xs sm:text-sm md:text-base text-stone-700 tracking-[0.25em] uppercase mt-7">
                    To celebrate their marriage
                  </p>
                </div>
              </motion.div>

              {/* Quick details */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 md:mt-14"
              >
                {[
                  { icon: Calendar, label: "Date", value: WEDDING.dateLong.replace(/^\w+, /, ""), sub: WEDDING.weekday },
                  { icon: Clock, label: "Celebration", value: `${WEDDING.startTime} – ${WEDDING.endTime}`, sub: `${WEDDING.venue.name}, ${WEDDING.venue.city}` },
                  { icon: Sparkles, label: "Poruwa Ceremony", value: WEDDING.poruwaTime, sub: "Auspicious time" },
                ].map(({ icon: Icon, label, value, sub }) => (
                  <div key={label} className="bg-white rounded-2xl border border-theme-100 shadow-[0_15px_35px_-20px_rgba(122,92,0,0.3)] px-5 py-6 text-center">
                    <Icon className="w-6 h-6 text-theme-600 mx-auto mb-3" />
                    <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500 font-semibold">{label}</p>
                    <p className="font-cinzel text-lg text-theme-900 mt-2">{value}</p>
                    <p className="font-serif italic text-theme-700 mt-1">{sub}</p>
                  </div>
                ))}
              </motion.div>

              <a
                href={googleCalendarLink}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-3 rounded-full border border-theme-300 bg-white px-7 py-3.5 text-[12px] uppercase tracking-[0.25em] font-semibold text-theme-800 hover:bg-theme-50 transition-colors"
              >
                <CalendarPlus className="w-4 h-4" />
                Save the Date
              </a>
            </section>

            {/* ── Countdown ── */}
            <section className="cv-auto py-20 md:py-32 bg-theme-50/60 relative border-y border-theme-100/60 flex flex-col items-center overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square bg-theme-100 blur-[120px] rounded-full opacity-40 pointer-events-none" />
              <div className="w-full max-w-[1000px] px-4 flex flex-col items-center text-center relative z-10">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative w-full flex flex-col items-center">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-script text-[22vw] md:text-[180px] text-theme-200/40 whitespace-nowrap pointer-events-none select-none">
                    Forever
                  </div>
                  <SectionEyebrow>Counting down to the Poruwa</SectionEyebrow>
                  <h2 className="font-cinzel text-3xl md:text-5xl text-theme-900 mt-4 relative z-10 tracking-[0.12em]">
                    The Auspicious Moment
                  </h2>
                  <Ornament className="mt-6" />
                </motion.div>
                <CountdownTimer />
              </div>
            </section>

            {/* ── Venue ── */}
            <section className="cv-auto py-20 md:py-32 relative overflow-hidden">
              {/* Background image (public/2.jpg) */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${venueBackground})` }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-paper/90 via-paper/60 to-paper/85" aria-hidden="true" />

              <div className="container mx-auto px-5 max-w-6xl relative z-10">
                <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center md:items-start text-center md:text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-px bg-accent-500" />
                      <SectionEyebrow>The Venue</SectionEyebrow>
                      <div className="w-8 h-px bg-accent-500 md:hidden" />
                    </div>
                    <h2 className="font-cinzel text-4xl sm:text-5xl md:text-6xl text-theme-900 leading-[1.1] tracking-[0.06em] mt-5">
                      {WEDDING.venue.name}
                    </h2>
                    <p className="font-cinzel text-lg md:text-xl text-theme-800 tracking-[0.3em] uppercase mt-3">
                      {WEDDING.venue.city} · {WEDDING.venue.country}
                    </p>
                    <p className="font-serif text-xl md:text-2xl text-stone-700 leading-relaxed mt-6 max-w-md">
                      We can&apos;t wait to celebrate with you. Tap the map to get directions straight to the venue.
                    </p>
                  </motion.div>

                  {/* Directions card: opens Google Maps (no embedded map) */}
                  <motion.a
                    href={WEDDING.venue.mapsLink}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative block w-full max-w-[430px] mx-auto rounded-[2rem] bg-white/85 backdrop-blur-md border border-white shadow-[0_30px_60px_-20px_rgba(122,92,0,0.4)] p-3"
                    aria-label={`Open ${WEDDING.venue.name}, ${WEDDING.venue.city} in Google Maps`}
                  >
                    <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-theme-50 border border-theme-100">
                      {/* Stylised map illustration */}
                      <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full" aria-hidden="true">
                        <rect width="400" height="300" fill="#fffbea" />
                        <g fill="#fff3c4">
                          <rect x="18" y="18" width="110" height="70" rx="10" />
                          <rect x="160" y="18" width="90" height="70" rx="10" />
                          <rect x="282" y="18" width="100" height="70" rx="10" />
                          <rect x="18" y="122" width="110" height="88" rx="10" />
                          <rect x="282" y="122" width="100" height="88" rx="10" />
                          <rect x="18" y="242" width="110" height="45" rx="10" />
                          <rect x="160" y="242" width="222" height="45" rx="10" />
                        </g>
                        <circle cx="206" cy="180" r="26" fill="#ecf5d8" />
                        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M0 105 H400 M0 226 H400 M144 0 V300 M266 0 V300" stroke="#ffe680" strokeWidth="16" />
                          <path d="M0 105 H400 M0 226 H400 M144 0 V300 M266 0 V300" stroke="#ffffff" strokeWidth="10" />
                          <path
                            d="M40 300 L40 226 L144 226 L144 138 L236 138"
                            className="route-dash"
                            stroke="#d9a90a"
                            strokeWidth="4"
                            strokeDasharray="10 8"
                          />
                        </g>
                        <circle cx="40" cy="292" r="7" fill="#ffffff" stroke="#8a6a05" strokeWidth="3" />
                      </svg>

                      {/* Pin */}
                      <div className="absolute left-[59%] top-[46%] -translate-x-1/2 -translate-y-full flex flex-col items-center">
                        <span className="absolute bottom-[-6px] w-12 h-12 rounded-full bg-theme-400/40 animate-ping" />
                        <div className="relative w-12 h-12 rounded-full rounded-br-none rotate-45 bg-theme-500 border-[3px] border-white shadow-lg flex items-center justify-center mb-3 group-hover:-translate-y-1 transition-transform">
                          <MapPin className="-rotate-45 w-5 h-5 text-theme-900" />
                        </div>
                      </div>
                      <div className="absolute left-[59%] top-[50%] -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-3.5 py-1.5 shadow-md border border-theme-100 font-cinzel text-[11px] tracking-[0.15em] text-theme-900">
                        {WEDDING.venue.name}
                      </div>

                      <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-semibold text-theme-800 shadow-sm">
                        <ExternalLink className="w-3 h-3" /> Google Maps
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 px-3 pt-4 pb-2">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.35em] text-theme-700 font-semibold">Tap to open the map</p>
                        <p className="font-cinzel text-lg md:text-xl text-theme-900 mt-1">Get Directions</p>
                      </div>
                      <span className="shrink-0 w-12 h-12 rounded-full bg-theme-500 text-theme-900 flex items-center justify-center shadow-[0_10px_25px_-8px_rgba(245,197,24,0.9)] group-hover:bg-theme-400 group-hover:scale-110 transition-all">
                        <Navigation className="w-5 h-5" />
                      </span>
                    </div>
                  </motion.a>
                </div>
              </div>
            </section>

            {/* ── RSVP ── */}
            <section className="cv-auto py-20 md:py-32 text-theme-900 relative overflow-hidden flex flex-col items-center bg-theme-100">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${rsvpBackground})` }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-paper/70 via-paper/45 to-paper/70" aria-hidden="true" />
              <div className="absolute inset-0 opacity-10 paper-grain pointer-events-none" />

              <div className="container mx-auto px-4 max-w-2xl text-center relative z-10 w-full">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col items-center">
                  <SectionEyebrow>Will you join us?</SectionEyebrow>
                  <h2 className="font-cinzel text-4xl md:text-6xl text-theme-900 mt-4 tracking-[0.12em]">R.S.V.P</h2>
                  <Ornament className="my-6" />
                  <p className="font-serif text-lg md:text-xl text-theme-800 max-w-md mx-auto leading-relaxed mb-12">
                    Kindly let us know if you'll be able to celebrate with us.
                  </p>

                  <div className="w-full bg-white/85 backdrop-blur-md p-6 sm:p-8 md:p-12 rounded-[2rem] border border-theme-200 shadow-[0_25px_60px_-20px_rgba(122,92,0,0.35)]">
                    <form className="space-y-8 text-left" onSubmit={submitRSVP}>
                      <label className="block space-y-2">
                        <span className="text-xs md:text-sm uppercase tracking-[0.3em] font-semibold text-theme-700 ml-1">Full Name</span>
                        <input
                          type="text"
                          required
                          value={rsvpName}
                          onChange={(e) => setRsvpName(e.target.value)}
                          className="w-full bg-transparent border-b border-theme-700/30 px-1 py-3 text-theme-900 focus:outline-none focus:border-theme-500 transition-colors font-serif text-2xl"
                        />
                      </label>

                      <div className="space-y-3">
                        <span className="text-xs md:text-sm uppercase tracking-[0.3em] font-semibold text-theme-700 ml-1">Will you attend?</span>
                        <div className="grid grid-cols-2 gap-3">
                          {([
                            ["Yes", "Joyfully accept"],
                            ["No", "Regretfully decline"],
                          ] as const).map(([value, label]) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => setRsvpAttending(value)}
                              aria-pressed={rsvpAttending === value}
                              className={`rounded-2xl border px-3 py-4 font-serif text-lg md:text-xl transition-all ${
                                rsvpAttending === value
                                  ? "bg-theme-400 text-theme-900 border-theme-400 shadow-[0_8px_25px_-8px_rgba(245,197,24,0.7)]"
                                  : "border-theme-700/25 text-theme-800 hover:border-theme-500"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {rsvpAttending === "Yes" && (
                        <label className="block space-y-2">
                          <span className="text-xs md:text-sm uppercase tracking-[0.3em] font-semibold text-theme-700 ml-1">Number of Guests</span>
                          <div className="relative">
                            <select
                              value={rsvpGuests}
                              onChange={(e) => setRsvpGuests(e.target.value)}
                              className="w-full bg-transparent border-b border-theme-700/30 px-1 py-3 text-theme-900 focus:outline-none focus:border-theme-500 transition-colors font-serif text-2xl appearance-none cursor-pointer"
                            >
                              {["1", "2", "3", "4", "5", "6"].map((n) => (
                                <option key={n} value={n} className="bg-white text-theme-900">
                                  {n === "1" ? "1 Guest" : `${n} Guests`}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none w-2 h-2 border-r border-b border-theme-700 rotate-45" />
                          </div>
                        </label>
                      )}

                      <label className="block space-y-2">
                        <span className="text-xs md:text-sm uppercase tracking-[0.3em] font-semibold text-theme-700 ml-1">Phone (optional)</span>
                        <input
                          type="tel"
                          value={rsvpPhone}
                          onChange={(e) => setRsvpPhone(e.target.value)}
                          className="w-full bg-transparent border-b border-theme-700/30 px-1 py-3 text-theme-900 focus:outline-none focus:border-theme-500 transition-colors font-serif text-2xl"
                        />
                      </label>

                      <label className="block space-y-2">
                        <span className="text-xs md:text-sm uppercase tracking-[0.3em] font-semibold text-theme-700 ml-1">Notes (optional)</span>
                        <input
                          type="text"
                          value={rsvpNotes}
                          onChange={(e) => setRsvpNotes(e.target.value)}
                          className="w-full bg-transparent border-b border-theme-700/30 px-1 py-3 text-theme-900 focus:outline-none focus:border-theme-500 transition-colors font-serif text-2xl"
                        />
                      </label>

                      <button
                        type="submit"
                        disabled={rsvpStatus === "submitting" || rsvpStatus === "success"}
                        className="w-full mt-4 bg-theme-500 hover:bg-theme-400 text-theme-900 py-4 rounded-full font-semibold uppercase tracking-[0.3em] text-[12px] md:text-sm hover:shadow-[0_10px_30px_-8px_rgba(245,197,24,0.8)] transition-all duration-300 inline-flex justify-center items-center gap-3 disabled:opacity-60"
                      >
                        <Heart className="w-4 h-4" />
                        {statusLabel(rsvpStatus, "Send RSVP")}
                      </button>
                    </form>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* ── Wishes & footer ── */}
            <div className="relative bg-[#f0e5d6]">
              <section
                className="cv-auto pt-20 md:pt-32 pb-[min(66vw,600px)] relative flex flex-col items-center overflow-hidden bg-no-repeat bg-bottom bg-[length:min(100%,900px)_auto]"
                style={{ backgroundImage: `url(${wishesBackground})` }}
              >
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-paper to-transparent pointer-events-none" aria-hidden="true" />
                <div className="container mx-auto px-4 max-w-4xl text-center relative z-10 w-full">
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="flex flex-col items-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-theme-50 mb-6 border border-theme-200">
                      <Sparkles className="w-6 h-6 text-theme-600" />
                    </div>
                    <SectionEyebrow>Leave a blessing</SectionEyebrow>
                    <h2 className="font-script text-6xl md:text-8xl text-theme-800 mt-3 leading-none">Wishes</h2>
                    <Ornament className="my-6" />
                    <p className="font-serif text-lg md:text-2xl text-stone-600 leading-relaxed max-w-xl mx-auto mb-12 px-2">
                      Your presence is the greatest gift of all — but your warm wishes and blessings will stay in our hearts forever.
                    </p>

                    <div className="w-full max-w-2xl mx-auto bg-white p-6 sm:p-8 md:p-12 shadow-[0_30px_60px_-20px_rgba(122,92,0,0.25)] border border-theme-100 rounded-tr-[4rem] rounded-bl-[4rem] relative">
                      <div className="absolute inset-2 md:inset-3 border border-accent-300/60 rounded-tr-[3.5rem] rounded-bl-[3.5rem] pointer-events-none" />
                      <form className="space-y-7 text-left relative z-10" onSubmit={submitWish}>
                        <label className="block space-y-2">
                          <span className="text-xs md:text-sm uppercase tracking-[0.3em] font-semibold text-stone-500 ml-1">Your Name</span>
                          <input
                            type="text"
                            required
                            value={wishName}
                            onChange={(e) => setWishName(e.target.value)}
                            className="w-full bg-theme-50/50 border-b border-theme-200 px-4 py-3 text-theme-900 focus:outline-none focus:border-theme-400 focus:bg-white transition-all font-serif text-2xl rounded-t-lg"
                          />
                        </label>
                        <label className="block space-y-2">
                          <span className="text-xs md:text-sm uppercase tracking-[0.3em] font-semibold text-stone-500 ml-1">Your Wish</span>
                          <textarea
                            rows={4}
                            required
                            value={wishMessage}
                            onChange={(e) => setWishMessage(e.target.value)}
                            className="w-full bg-theme-50/50 border-b border-theme-200 px-4 py-3 text-theme-900 focus:outline-none focus:border-theme-400 focus:bg-white transition-all font-serif text-2xl resize-none rounded-t-lg"
                          />
                        </label>
                        <div className="pt-4 flex justify-center">
                          <button
                            type="submit"
                            disabled={wishStatus === "submitting" || wishStatus === "success"}
                            className="bg-theme-500 text-theme-900 px-10 py-4 rounded-full font-semibold uppercase tracking-[0.3em] text-[12px] hover:bg-theme-400 hover:shadow-xl hover:shadow-theme-900/20 transition-all duration-300 inline-flex items-center gap-3 disabled:opacity-60"
                          >
                            <Heart className="w-4 h-4" />
                            {statusLabel(wishStatus, "Send Wishes")}
                          </button>
                        </div>
                      </form>
                    </div>

                    <div className="mt-20 md:mt-28 flex flex-col items-center relative w-full">
                      <p className="text-[11px] md:text-[13px] uppercase tracking-[0.6em] text-theme-700 font-semibold relative z-10 bg-paper px-6 py-2 rounded-full border border-theme-100">
                        With love
                      </p>
                      <h3 className="font-cinzel text-4xl sm:text-5xl md:text-6xl text-theme-900 relative z-10 pt-6 tracking-[0.1em]">
                        {WEDDING.groom.name}
                        <span className="font-script text-theme-600 tracking-normal mx-3">&amp;</span>
                        {WEDDING.bride.name}
                      </h3>
                    </div>
                  </motion.div>
                </div>
              </section>

              <footer className="py-8 bg-paper border-t border-theme-200/40 text-center relative z-10">
                <p className="text-[11px] md:text-xs uppercase tracking-[0.4em] text-stone-400 font-semibold">
                  {COUPLE_NAMES} · {WEDDING.dateShort}
                </p>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} src={backgroundSong} loop preload="none" />

      {isOpened && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={toggleAudio}
          className="fixed bottom-5 right-5 z-50 bg-white/85 backdrop-blur-md p-3.5 rounded-full shadow-lg border border-theme-200 text-theme-800 hover:bg-theme-100 transition-all hover:scale-110 active:scale-95"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? <Volume2 size={22} /> : <VolumeX size={22} />}
        </motion.button>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow linear infinite; }
        @keyframes route-dash { to { stroke-dashoffset: -36; } }
        .route-dash { animation: route-dash 1.2s linear infinite; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #fffdf3; }
        ::-webkit-scrollbar-thumb { background: #f5c518; border-radius: 10px; }
      `,
        }}
      />
    </main>
  );
}
