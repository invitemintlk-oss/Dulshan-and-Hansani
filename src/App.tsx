import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, Calendar, Clock, Volume2, VolumeX } from "lucide-react";

/**
 * Premium Sri Lankan Wedding Invitation Theme
 * Names: ඉසංකා සහ මදුසංක
 * Background: Cream/Sand
 * Accents: Green/Brown
 */

const mandalaImage = "/images/mandala_gold.png";
const brideGroomImage = "/images/10.png";

type InviteImageProps = React.ComponentProps<"img"> & {
  eager?: boolean;
};

function InviteImage({ eager = false, loading, decoding, ...props }: InviteImageProps) {
  return (
    <img
      loading={loading ?? (eager ? "eager" : "lazy")}
      decoding={decoding ?? "async"}
      {...props}
    />
  );
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

function FloatingPetals({ disabled = false }: { disabled?: boolean }) {
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [petals, setPetals] = useState<Array<{
    id: number;
    x: number;
    size: number;
    rotation: number;
    duration: number;
    delay: number;
    color: string;
    drift: number;
  }>>([]);

  useEffect(() => {
    if (disabled) {
      setPetals([]);
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    setIsLowPowerMode(reduceMotion || isMobile);

    if (reduceMotion) {
      setPetals([]);
      return;
    }

    const colors = ["#f1d6e8", "#e8bdd9", "#dd9ec8", "#fdf7fb"];
    const petalCount = isMobile ? 10 : 18;
    const newPetals = Array.from({ length: petalCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 7 + 7,
      rotation: Math.random() * 360,
      duration: Math.random() * 11 + 16,
      delay: Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      drift: Math.random() * 24 - 12,
    }));

    setPetals(newPetals);
  }, [disabled]);

  if (disabled) {
    return null;
  }

  return (
    <div className={`pointer-events-none fixed inset-0 overflow-hidden z-40 ${isLowPowerMode ? "opacity-70" : ""}`}>
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute drop-shadow-[0_2px_6px_rgba(243,167,205,0.5)]"
          style={{ color: petal.color }}
          initial={{
            x: `${petal.x}vw`,
            y: "-10vh",
            rotate: petal.rotation,
            opacity: 0,
          }}
          animate={{
            y: "110vh",
            x: `${petal.x + petal.drift}vw`,
            rotate: petal.rotation + (isLowPowerMode ? 360 : 720),
            opacity: [0, 0.9, 0.8, 0],
          }}
          transition={{
            duration: isLowPowerMode ? petal.duration * 1.2 : petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear",
          }}
        >
          <svg
            width={petal.size}
            height={petal.size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="drop-shadow-sm"
          >
            <path d="M12,2C12,2 10,6 10,10C10,14 12,22 12,22C12,22 14,14 14,10C14,6 12,2 12,2Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function CountdownTimer() {
  const targetDate = new Date("October 08, 2026 09:31:00").getTime();
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(targetDate - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const stats = [
    { label: "දින", value: days },
    { label: "පැය", value: hours },
    { label: "මිනිත්තු", value: minutes },
    { label: "තත්පර", value: seconds },
  ];

  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-8 justify-center w-full max-w-4xl mx-auto mt-8 md:mt-16 z-20 px-2">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15, type: "spring", stiffness: 80 }}
          className="relative group"
        >
          {/* Ornamental Frame container */}
          <div className="relative w-[4.5rem] h-[6.5rem] sm:w-20 sm:h-28 md:w-32 md:h-44 bg-white rounded-t-full shadow-[0_15px_35px_-10px_rgba(0,0,0,0.08)] border border-theme-100/60 flex flex-col items-center justify-center overflow-hidden transition-transform duration-700 group-hover:-translate-y-3">
            <div className="absolute top-0 right-0 opacity-[0.03] paper-grain w-full h-full pointer-events-none" />
            <div className="absolute inset-1.5 sm:inset-2 md:inset-3 border-[0.5px] border-theme-300/50 rounded-t-full pointer-events-none" />

            {/* The Number */}
            <span className="text-3xl sm:text-4xl md:text-6xl font-playball text-theme-800 leading-none relative z-10 drop-shadow-sm mt-3 sm:mt-4 md:mt-6 transition-transform duration-500 group-hover:scale-110">
              {Math.max(0, stat.value).toString().padStart(2, '0')}
            </span>

            {/* The Label */}
            <div className="w-full flex justify-center mt-2 sm:mt-3 md:mt-6 mb-1 sm:mb-2 relative z-10">
              <span className="text-[7px] sm:text-[8px] md:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] text-stone-500 font-bold px-2 sm:px-3 py-1 sm:py-1.5 bg-stone-50 rounded-full border border-theme-100/50 shadow-sm whitespace-nowrap">
                {stat.label}
              </span>
            </div>

            {/* Bottom decoration */}
            <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 w-[3px] h-[3px] sm:w-1 sm:h-1 md:w-1.5 md:h-1.5 rotate-45 bg-theme-300" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx4rkqwpnDcXT-GANciQBWS3Hg0td1IWMUo6jf-oQ71TpsyUDqKMuFIN2SeT2nDnkl_/exec";

export default function WeddingInvitation() {
  const [isOpened, setIsOpened] = useState(false);
  const [isLowPerformanceMode, setIsLowPerformanceMode] = useState(false);

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpGuests, setRsvpGuests] = useState("1");
  const [rsvpNotes, setRsvpNotes] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  // Wishes Form State
  const [wishName, setWishName] = useState("");
  const [wishMessage, setWishMessage] = useState("");
  const [wishStatus, setWishStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  // Audio State
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleOpenInvitation = () => {
    setIsOpened(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log("Audio autoplay prevented", e));
    }
  };

  const submitRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;
    setRsvpStatus("submitting");
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          type: "RSVP",
          name: rsvpName,
          guests: rsvpGuests,
          dietaryNotes: rsvpNotes,
        }),
      });
      setRsvpStatus("success");
      setRsvpName("");
      setRsvpGuests("1");
      setRsvpNotes("");
      setTimeout(() => setRsvpStatus("idle"), 3000);
    } catch (err) {
      setRsvpStatus("error");
      setTimeout(() => setRsvpStatus("idle"), 3000);
    }
  };

  const submitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishName.trim() || !wishMessage.trim()) return;
    setWishStatus("submitting");
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          type: "Wishes",
          name: wishName,
          message: wishMessage,
        }),
      });
      setWishStatus("success");
      setWishName("");
      setWishMessage("");
      setTimeout(() => setWishStatus("idle"), 3000);
    } catch (err) {
      setWishStatus("error");
      setTimeout(() => setWishStatus("idle"), 3000);
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
      const lowMemory = typeof getDeviceMemory() === "number" && getDeviceMemory()! <= 4;
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

  return (
    <main
      className={`h-[100dvh] w-full bg-[#fdfaf5] transition-all duration-1000 ${isOpened ? "overflow-y-auto overflow-x-hidden smooth-mobile-scroll" : "overflow-hidden flex items-center justify-center"
        } relative font-montserrat scroll-smooth`}
    >
      <MandalaFrame minimal={isLowPerformanceMode} />
      <FloatingPetals disabled={isLowPerformanceMode} />

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="envelope-stage"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 1.1,
              transition: { duration: 0.8, ease: "easeInOut" }
            }}
            className="flex flex-col items-center justify-center p-6 relative z-10 w-full"
          >
            {/* Title */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
              <span className="inline-block px-5 py-2 rounded-full bg-theme-50 border border-theme-200 text-[12px] uppercase tracking-[0.5em] text-theme-700 font-bold mb-6">
                සුබ මංගලම්
              </span>
              <h1 className="font-cinzel text-5xl md:text-6xl text-stone-800 mb-4 tracking-tight">
                ඉසංකා සහ මදුසංක
              </h1>
              <p className="text-stone-500 text-base tracking-[0.2em] font-light">2026 ඔක්තෝබර් 08</p>
            </motion.div>

            {/* Gatefold Envelope */}
            <div
              className="relative w-full max-w-[430px] aspect-[1/1.42] flex items-center justify-center group cursor-pointer perspective-1000"
              onClick={handleOpenInvitation}
            >
              <div className="absolute -inset-8 bg-[radial-gradient(circle,_rgba(243,167,205,0.35)_0%,_rgba(241,214,232,0.2)_45%,_transparent_75%)] blur-3xl opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#fffefb] via-[#fff9f2] to-[#fff6ee] rounded-[1.4rem] shadow-[0_28px_80px_-20px_rgba(82,38,66,0.35)] border border-theme-200/80 overflow-hidden" />
              <div className="absolute inset-[10px] rounded-[1.05rem] border border-theme-300/45 pointer-events-none" />
              <div className="absolute inset-0 opacity-[0.07] paper-grain-strong" />

              <motion.div
                initial={{ opacity: 0.15, x: -140 }}
                animate={{ opacity: [0.08, 0.2, 0.08], x: [-160, 260, -160] }}
                transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent blur-lg z-20 pointer-events-none"
              />

              <div className="absolute top-[-1px] left-1/2 -translate-x-1/2 w-[88%] h-[44%] bg-gradient-to-b from-theme-100/90 to-theme-50/60 clip-path-envelope z-10" />
              <div className="absolute top-[3px] left-1/2 -translate-x-1/2 w-[84%] h-[39%] border border-theme-300/45 clip-path-envelope z-10 opacity-60" />

              {/* Left Flap */}
              <motion.div
                className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-br from-[#3b2a36] via-[#4f3652] to-[#2a1d2d] z-30 shadow-[8px_0_28px_rgba(29,13,27,0.45)] origin-left flex items-center justify-end pr-4 overflow-hidden rounded-l-[1.2rem]"
                whileHover={{ rotateY: -14 }}
                transition={{ type: "spring", stiffness: 110, damping: 16 }}
              >
                <div className="absolute inset-0 opacity-20 paper-grain" />
                <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-theme-200 via-theme-400 to-theme-200" />
                <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-tr from-black/25 via-transparent to-white/10" />

                {/* Envelope Illustrations */}
                <InviteImage
                  src={mandalaImage}
                  className="absolute -top-20 md:-top-28 -left-20 md:-left-28 w-56 md:w-72 h-56 md:h-72 opacity-55 mix-blend-screen"
                  alt=""
                />
                <InviteImage
                  src={mandalaImage}
                  className="absolute -bottom-20 md:-bottom-28 -left-20 md:-left-28 w-56 md:w-72 h-56 md:h-72 opacity-50 mix-blend-screen -rotate-90"
                  alt=""
                />

                <div className="text-theme-100/35 rotate-90 whitespace-nowrap text-sm tracking-[0.55em] uppercase font-bold relative z-10">
                  ඉසංකා සහ මදුසංක
                </div>
              </motion.div>

              {/* Right Flap */}
              <motion.div
                className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-bl from-[#3b2a36] via-[#4f3652] to-[#2a1d2d] z-30 shadow-[-8px_0_28px_rgba(29,13,27,0.45)] origin-right flex items-center justify-start pl-4 overflow-hidden rounded-r-[1.2rem]"
                whileHover={{ rotateY: 14 }}
                transition={{ type: "spring", stiffness: 110, damping: 16 }}
              >
                <div className="absolute inset-0 opacity-20 paper-grain" />
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-theme-200 via-theme-400 to-theme-200" />
                <div className="absolute right-0 top-0 w-full h-full bg-gradient-to-tl from-black/25 via-transparent to-white/10" />

                {/* Envelope Illustrations */}
                <InviteImage
                  src={mandalaImage}
                  className="absolute -top-20 md:-top-28 -right-20 md:-right-28 w-56 md:w-72 h-56 md:h-72 opacity-55 mix-blend-screen rotate-90"
                  alt=""
                />
                <InviteImage
                  src={mandalaImage}
                  className="absolute -bottom-20 md:-bottom-28 -right-20 md:-right-28 w-56 md:w-72 h-56 md:h-72 opacity-50 mix-blend-screen rotate-180"
                  alt=""
                />
              </motion.div>

              {/* The Seal Button */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: -6 }}
                whileTap={{ scale: 0.9 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-28 h-28 rounded-full bg-gradient-to-br from-theme-200 via-[#fff5fb] to-theme-300 shadow-[0_20px_45px_-10px_rgba(131,63,105,0.65)] border-[5px] border-[#432f3f] flex items-center justify-center group-hover:shadow-theme-500/40"
              >
                <div className="absolute inset-1.5 rounded-full border border-theme-400/50" />
                <div className="absolute inset-3 rounded-full border border-theme-500/30" />
                <div className="text-center relative z-10">
                  <p className="font-cinzel text-[2.2rem] font-bold text-stone-800 leading-none">ඉ&ම</p>
                  <div className="h-px w-12 bg-stone-400 mx-auto my-1.5" />
                  <p className="text-[10px] uppercase tracking-[0.35em] font-bold text-stone-600">විවෘත කරන්න</p>
                </div>
              </motion.div>

              {/* Card Preview inside (Mandala) */}
              <div className="absolute inset-10 opacity-45 flex items-center justify-center z-10">
                <InviteImage src={mandalaImage} alt="" className={`w-full h-auto mix-blend-multiply ${isLowPerformanceMode ? "" : "animate-spin-slow"}`} style={{ animationDuration: '24s' }} />
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 text-[10px] uppercase tracking-[0.45em] text-theme-700/80 font-bold bg-white/70 backdrop-blur-md px-4 py-2 rounded-full border border-theme-200/80 shadow-sm">
                විවෘත කිරීමට මුද්‍රාව ස්පර්ශ කරන්න
              </div>
            </div>

            <p className="mt-8 text-[13px] uppercase tracking-[0.6em] text-stone-400 font-bold animate-pulse">
              විවෘත කිරීමට ස්පර්ශ කරන්න
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="website-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="website-shell relative z-20 w-full"
          >
            {/* Sticky Return Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setIsOpened(false)}
              className="fixed top-6 right-6 z-50 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-theme-100 text-theme-800 hover:bg-theme-50 transition-colors"
            >
              <div className="flex flex-col items-center">
                <div className="text-[10px] uppercase tracking-widest font-bold">වසන්න</div>
              </div>
            </motion.button>

            {/* Hero Section */}
            <section className="min-h-[100dvh] w-full flex items-center justify-center p-4 md:p-12 relative overflow-hidden bg-[#fdfaf5]">
              {/* Background texture */}
              <div className="absolute inset-0 opacity-[0.03] paper-grain" />

              {/* Large Watermark Monogram */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.03, scale: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-cinzel text-[40vw] text-theme-900 pointer-events-none whitespace-nowrap leading-none select-none z-0"
              >
                ඉ&ම
              </motion.div>

              {/* Central Premium Arch Card */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                className="relative z-10 w-full max-w-[420px] min-h-[500px] h-[85vh] md:h-[80vh] bg-[#ffffff] rounded-t-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-theme-100 flex flex-col items-center overflow-hidden p-6 pt-12 md:p-10 md:pt-16"
              >
                {/* Arch outline decoration */}
                <div className="absolute inset-3 sm:inset-5 border-[0.5px] border-theme-400/40 rounded-t-full pointer-events-none" />
                <div className="absolute inset-4 sm:inset-6 border border-theme-200/40 rounded-t-full pointer-events-none" />

                <motion.img
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 0.4 }}
                  transition={{ duration: 1.5, delay: 0.5, type: "spring" }}
                  src={mandalaImage}
                  className="w-24 h-24 md:w-32 md:h-32 object-contain mix-blend-multiply mb-6 drop-shadow-sm opacity-60"
                  alt=""
                />

                <div className="flex flex-col items-center text-center space-y-4 flex-1 w-full relative z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1 }}
                  >
                    <span className="block text-[10px] md:text-[12px] uppercase tracking-[0.4em] md:tracking-[0.6em] text-theme-700 font-bold mb-2">
                      කරුණාකර අප හා එක්වන්න
                    </span>
                  </motion.div>

                  <div className="space-y-0 py-4 flex-1 flex flex-col justify-center">
                    <motion.h1
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1, duration: 0.8 }}
                      className="font-playball text-[3.5rem] sm:text-[4rem] md:text-[5.5rem] text-stone-800 leading-[1.1] drop-shadow-sm"
                    >
                      ඉසංකා
                    </motion.h1>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2, duration: 0.5 }}
                      className="font-playball text-4xl md:text-6xl text-theme-500 italic font-light my-2 md:my-4 tracking-widest"
                    >
                      &
                    </motion.div>
                    <motion.h1
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4, duration: 0.8 }}
                      className="font-playball text-[3.5rem] sm:text-[4rem] md:text-[5.5rem] text-stone-800 leading-[1.1] drop-shadow-sm"
                    >
                      මදුසංක
                    </motion.h1>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8, duration: 1 }}
                    className="mt-auto pb-4 w-full flex flex-col items-center"
                  >
                    <div className="flex items-center justify-center gap-4 mb-6 opacity-70 w-full px-8">
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-theme-300 to-theme-400" />
                      <div className="w-1.5 h-1.5 rotate-45 bg-theme-500 shrink-0" />
                      <div className="h-px w-full bg-gradient-to-l from-transparent via-theme-300 to-theme-400" />
                    </div>
                    <div className="font-cinzel space-y-1">
                      <p className="text-base md:text-lg text-stone-700 tracking-[0.2em] md:tracking-[0.3em] font-bold">2026 ඔක්තෝබර් 08</p>
                      <p className="text-[10px] md:text-[11px] text-theme-600 tracking-[0.2em] uppercase font-bold">හිඟුරක්ගොඩ, ශ්‍රී ලංකාව</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 1 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20 group"
              >
                <span className="text-[10px] md:text-[11px] uppercase tracking-widest text-stone-400 font-bold group-hover:text-theme-600 transition-colors">ආරම්භය</span>
                <div className="w-px h-10 md:h-12 relative overflow-hidden bg-stone-200">
                  <motion.div
                    animate={{ y: [-40, 60] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-full h-8 bg-theme-500"
                  />
                </div>
              </motion.div>

            </section>

            {/* Wedding Details Section */}
            <section className="cv-auto py-24 md:py-32 w-full flex flex-col items-center px-4 relative">
              <div className="section-floral-overlay absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                {/* Top-left: left.png on mobile, mandala on desktop */}
                <InviteImage src="/images/left.png" className="block md:hidden absolute -left-4 -top-4 w-[200px] h-auto opacity-80 object-contain" alt="" loading="eager" />
                <InviteImage src={mandalaImage} className="hidden md:block absolute -left-10 top-8 w-[460px] h-auto mix-blend-multiply opacity-55 -rotate-[8deg]" alt="" />
                {/* Top-right: mandala on desktop only */}
                <InviteImage src={mandalaImage} className="hidden md:block absolute -right-10 top-2 w-[430px] h-auto mix-blend-multiply opacity-50 rotate-[12deg]" alt="" />
                {/* Bottom-left: mandala on desktop only */}
                <InviteImage src={mandalaImage} className="hidden md:block absolute -left-6 bottom-8 w-[420px] h-auto mix-blend-multiply opacity-40 rotate-[180deg]" alt="" />
                {/* Bottom-right: right.png on mobile, mandala on desktop */}
                <InviteImage src="/images/right.png" className="block md:hidden absolute -right-4 bottom-0 w-[200px] h-auto opacity-80 object-contain" alt="" loading="eager" />
                <InviteImage src={mandalaImage} className="hidden md:block absolute -right-8 bottom-14 w-[470px] h-auto mix-blend-multiply opacity-45 -rotate-[170deg]" alt="" />
              </div>

              <div className="max-w-[1000px] w-full flex flex-col items-center text-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center mb-8 md:mb-16"
                >
                  <div className="w-px h-16 md:h-24 bg-gradient-to-b from-transparent to-theme-400 mb-6 md:mb-10" />
                  <p className="text-theme-700 text-[11px] md:text-[14px] tracking-[0.4em] md:tracking-[0.6em] uppercase font-bold text-center leading-loose">
                    අපගේ විවාහ මංගල්‍යය සඳහා සහභාගී වන මෙන්<br className="hidden md:block" /> කාරුණිකව ආරාධනා කරමු.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative mb-10 md:mb-14"
                >
                  <div className="absolute -inset-3 md:-inset-4 rounded-[2rem] bg-theme-200/35 blur-xl" />
                  <div className="relative bg-white/90 p-2.5 md:p-3 rounded-[2rem] border border-theme-200 shadow-[0_20px_50px_-20px_rgba(131,63,105,0.45)]">
                    <InviteImage
                      src={brideGroomImage}
                      alt="Bride and groom wedding illustration"
                      loading="eager"
                      className="w-[200px] h-[240px] md:w-[270px] md:h-[320px] object-cover rounded-[1.6rem] border border-theme-100"
                    />
                  </div>
                </motion.div>

                <div className="relative w-full flex flex-col md:flex-row items-center justify-center md:items-stretch gap-6 md:gap-10 my-12 md:my-20 z-10 px-2 lg:px-8">

                  {/* Nimmi's Card */}
                  <motion.div
                    initial={{ opacity: 0, x: -30, y: 20 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true }}
                    className="relative bg-white w-full max-w-[320px] p-6 md:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-theme-100/50 rounded-tl-[100px] rounded-br-[100px] md:rounded-tl-[130px] md:rounded-br-[130px] overflow-hidden group flex flex-col justify-center text-center items-center"
                  >
                    <div className="absolute inset-2 border border-theme-200/50 rounded-tl-[90px] rounded-br-[90px] md:rounded-tl-[120px] md:rounded-br-[120px] pointer-events-none" />
                    <div className="absolute inset-0 opacity-[0.02] paper-grain pointer-events-none" />
                    <div className="relative z-10 space-y-4 py-8 md:py-12">
                      <div className="space-y-2">
                        <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold text-stone-400">ප්‍රියදර දියණිය</p>
                        <p className="text-sm md:text-base font-cinzel text-stone-600 tracking-wide leading-relaxed">K.H.G. පත්මසිරි මැතිතුමා<br />හා එම මැතිණිය</p>
                      </div>
                      <h3 className="text-6xl md:text-8xl font-playball text-theme-800 group-hover:scale-110 transition-transform duration-700 pt-6 drop-shadow-sm">ඉසංකා</h3>
                    </div>
                  </motion.div>

                  {/* Vertical Divider / AMPERSAND */}
                  <div className="flex flex-row md:flex-col items-center justify-center gap-4 py-4 md:py-0 relative z-20">
                    <div className="hidden md:block w-px h-32 bg-gradient-to-t from-theme-300 to-transparent" />
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                      className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-theme-500 to-theme-700 rounded-full flex items-center justify-center shadow-xl shadow-theme-900/20 border-4 border-[#fdfaf5]"
                    >
                      <span className="text-4xl md:text-6xl font-playball text-white md:-mt-1 drop-shadow-md">සහ</span>
                    </motion.div>
                    <div className="hidden md:block w-px h-32 bg-gradient-to-b from-theme-300 to-transparent" />
                  </div>

                  {/* Rishan's Card - Offset structurally on desktop */}
                  <motion.div
                    initial={{ opacity: 0, x: 30, y: 20 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="relative bg-white w-full max-w-[320px] p-6 md:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-theme-100/50 rounded-tr-[100px] rounded-bl-[100px] md:rounded-tr-[130px] md:rounded-bl-[130px] overflow-hidden group flex flex-col justify-center text-center items-center md:mt-24"
                  >
                    <div className="absolute inset-2 border border-theme-200/50 rounded-tr-[90px] rounded-bl-[90px] md:rounded-tr-[120px] md:rounded-bl-[120px] pointer-events-none" />
                    <div className="absolute inset-0 opacity-[0.02] paper-grain pointer-events-none" />
                    <div className="relative z-10 space-y-4 py-8 md:py-12">
                      <div className="space-y-2">
                        <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold text-stone-400">ප්‍රියදර පුතු</p>
                        <p className="text-sm md:text-base font-cinzel text-stone-600 tracking-wide leading-relaxed">L. ආනන්ද ලියනගේ මැතිතුමා<br />හා එම මැතිණිය</p>
                      </div>
                      <h3 className="text-6xl md:text-8xl font-playball text-theme-800 group-hover:scale-110 transition-transform duration-700 pt-6 drop-shadow-sm">මදුසංක</h3>
                    </div>
                  </motion.div>
                </div>

                {/* Date & Time Luxury Layout */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center space-y-10 mt-4 md:mt-16 w-full"
                >
                  <div className="w-1.5 h-1.5 rotate-45 bg-theme-300" />

                  <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-32 text-center w-full max-w-4xl px-4">
                    <div className="flex flex-col items-center flex-1">
                      <Calendar className="w-6 h-6 md:w-8 md:h-8 text-theme-500 mb-4 opacity-80" />
                      <p className="text-[11px] md:text-[12px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-stone-400 font-bold mb-3">දිනය</p>
                      <p className="font-cinzel text-2xl md:text-4xl text-theme-900 tracking-widest font-bold whitespace-nowrap">බ්‍රහස්පතින්දා, ඔක්. 08</p>
                      <p className="font-cinzel text-xl md:text-2xl text-theme-600 tracking-[0.3em] font-normal mt-2">2026</p>
                    </div>

                    <div className="hidden md:flex flex-col items-center gap-3">
                      <div className="w-px h-12 bg-theme-200" />
                      <div className="w-1.5 h-1.5 rounded-full bg-theme-400" />
                      <div className="w-px h-12 bg-theme-200" />
                    </div>

                    <div className="md:hidden flex flex-row items-center gap-3">
                      <div className="h-px w-10 bg-theme-200" />
                      <div className="w-1.5 h-1.5 rounded-full bg-theme-400" />
                      <div className="h-px w-10 bg-theme-200" />
                    </div>

                    <div className="flex flex-col items-center flex-1">
                      <Clock className="w-6 h-6 md:w-8 md:h-8 text-theme-500 mb-4 opacity-80" />
                      <p className="text-[11px] md:text-[12px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-stone-400 font-bold mb-3">වේලාව</p>
                      <p className="font-cinzel text-2xl md:text-4xl text-theme-900 tracking-widest font-bold whitespace-nowrap">පෙරවරු 09:00</p>
                      <p className="font-cinzel text-sm md:text-base text-theme-600 tracking-[0.2em] mt-3 uppercase">පස්වරු 04:00 දක්වා</p>
                    </div>
                  </div>

                  <div className="pt-8 w-full px-4">
                    <div className="relative inline-flex items-center justify-center w-full max-w-md mx-auto group">
                      <div className="absolute inset-0 bg-theme-100 blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                      <p className="relative text-theme-800 bg-white shadow-[0_4px_20px_-5px_rgba(0,0,0,0.05)] text-[11px] md:text-[13px] font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase px-6 lg:px-10 py-4 lg:py-5 rounded-full border border-theme-200 flex items-center justify-center gap-4 w-full md:w-auto">
                        <span className="w-1.5 h-1.5 rotate-45 bg-theme-500 shrink-0" />
                        <span className="whitespace-nowrap">පෝරුවේ නැකත පෙරවරු 9.31 ට</span>
                        <span className="w-1.5 h-1.5 rotate-45 bg-theme-500 shrink-0" />
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Countdown Section */}
            <section className="cv-auto py-24 md:py-36 bg-[#fffcf5] relative border-y border-theme-100/30 flex flex-col items-center overflow-hidden">
              {/* Premium Background Elements */}
              <div className="absolute inset-0 opacity-[0.03] paper-grain pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square bg-theme-100 blur-[120px] rounded-full opacity-30 pointer-events-none" />

              <div className="w-full max-w-[1000px] px-4 flex flex-col items-center text-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative w-full flex flex-col items-center"
                >
                  {/* Watermark text */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-playball text-[12vw] md:text-[142px] text-theme-100/50 whitespace-nowrap pointer-events-none z-0 select-none">
                    Forever
                  </div>

                  <div className="flex items-center gap-4 md:gap-8 justify-center relative z-10 w-full mb-6 mt-4 opacity-70">
                    <div className="h-px w-16 md:w-32 bg-gradient-to-r from-transparent to-theme-400" />
                    <div className="w-1.5 h-1.5 rotate-45 bg-theme-500 shrink-0" />
                    <div className="h-px w-16 md:w-32 bg-gradient-to-l from-transparent to-theme-400" />
                  </div>

                  <h2 className="font-cinzel text-4xl md:text-6xl text-theme-900 mb-8 relative z-10 tracking-widest font-bold drop-shadow-sm px-4 leading-[1.4]">
                    සුබ මොහොත <span className="font-playball text-theme-700 italic lowercase tracking-normal text-5xl md:text-8xl ml-2">එළඹෙන තුරු</span>
                  </h2>

                  <p className="text-[12px] md:text-[13px] uppercase tracking-[0.5em] text-theme-600 font-bold bg-white/80 backdrop-blur-sm px-8 py-3 rounded-full border border-theme-200/50 inline-flex items-center gap-3 shadow-[0_4px_15px_-5px_rgba(0,0,0,0.05)] relative z-10">
                    <span className="w-1 h-1 rounded-full bg-theme-400 animate-pulse" />
                    කාලය ගණනය කිරීම
                    <span className="w-1 h-1 rounded-full bg-theme-400 animate-pulse" />
                  </p>
                </motion.div>

                <CountdownTimer />
              </div>
            </section>

            {/* Venue Location Section */}
            <section className="cv-auto py-24 md:py-36 bg-[#fdfaf5] relative overflow-hidden">
              {/* Decorative Background */}
              <div className="absolute inset-0 opacity-5 paper-grain pointer-events-none" />
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-theme-200 blur-[150px] rounded-full opacity-20 pointer-events-none" />

              <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8 flex flex-col items-start"
                  >
                    <div className="flex flex-col items-start gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-px bg-theme-400" />
                        <span className="text-theme-600 font-bold uppercase tracking-[0.4em] text-[11px] md:text-[13px]">ස්ථානය</span>
                      </div>
                      <h2 className="font-playball text-[4rem] sm:text-[4.5rem] md:text-[6rem] text-theme-900 leading-[1] drop-shadow-sm ml-[-4px]">
                        ගෝල්ඩන් ෆ්ලවර් හෝටලය
                      </h2>
                    </div>

                    <div className="space-y-6 pt-4 relative">
                      <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-theme-300 to-transparent" />

                      <div className="pl-8 space-y-4">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-theme-100 absolute -left-5 top-0">
                          <MapPin className="w-4 h-4 text-theme-500" />
                        </div>
                        <p className="text-xl md:text-2xl text-stone-700 font-cinzel font-medium leading-relaxed tracking-wide">
                          හිඟුරක්ගොඩ.<br /> Sri Lanka.
                        </p>
                      </div>

                      <div className="pl-8 space-y-4 pt-4 text-stone-500 text-base md:text-lg tracking-wide font-light leading-relaxed">
                        අපගේ ජීවිතයේ මෙම සුවිශේෂී දිනය සැමරීමට ඔබගේ පැමිණීම ඉතා ගෞරවයෙන් අපේක්ෂා කරමු.
                      </div>
                    </div>

                    <div className="pt-8 w-full md:w-auto">
                      <button
                        onClick={() => window.open('https://maps.app.goo.gl/JFSiQV7KWp1KcikG9', '_blank')}
                        className="w-full md:w-auto flex items-center justify-center gap-4 bg-theme-800 text-white px-10 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[12px] md:text-sm hover:bg-theme-900 hover:shadow-xl hover:shadow-theme-900/20 transition-all duration-300 group"
                      >
                        <MapPin className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" />
                        මාර්ගය ලබාගන්න
                      </button>
                    </div>
                  </motion.div>

                  {/* Arched Map Container */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative w-full max-w-[450px] mx-auto aspect-[4/5] md:aspect-[3/4] rounded-t-full rounded-b-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border-[12px] border-white bg-theme-100 overflow-hidden group"
                  >
                    <div className="absolute inset-0 border border-theme-200 rounded-t-full rounded-b-[1.5rem] pointer-events-none z-10" />

                    {/* The Maps iframe */}
                    <div className="absolute inset-0 w-full h-full scale-[1.2] group-hover:scale-[1.15] transition-transform duration-[2s]">
                      <iframe
                        src="https://maps.google.com/maps?q=Golden%20Flower%20Hotel,%20Hingurakgoda&t=&z=14&ie=UTF8&iwloc=&output=embed"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full grayscale-[0.3] hover:grayscale-0 transition-all duration-1000"
                      />
                    </div>

                    {/* Elegant fade overlay at bottom */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/80 to-transparent h-32 pointer-events-none z-10 flex items-end justify-center pb-6">
                      <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold bg-white/90 px-5 py-2 rounded-full shadow-sm backdrop-blur-md inline-flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-theme-400 animate-pulse" />
                        සිතියමෙන් බලන්න
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* RSVP Section */}
            <section className="cv-auto py-24 md:py-36 bg-[#2c2a26] text-white relative overflow-hidden flex flex-col items-center">
              {/* Opulent dark background */}
              <div className="absolute inset-0 opacity-10 paper-grain pointer-events-none" />
              <div className="absolute top-0 right-0 w-[60vw] h-[60vw] max-w-[800px] bg-theme-800 blur-[150px] rounded-full opacity-30 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] max-w-[800px] bg-theme-900 blur-[150px] rounded-full opacity-40 pointer-events-none" />

              <div className="container mx-auto px-4 max-w-2xl text-center relative z-10 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center"
                >
                  <p className="text-[12px] md:text-[14px] uppercase tracking-[0.5em] md:tracking-[0.8em] text-theme-300 font-bold mb-6">Will You Join Us?</p>
                  <h2 className="font-playball text-[4rem] sm:text-[4.5rem] md:text-[6rem] text-white mb-6 drop-shadow-md">පැමිණීම තහවුරු කිරීම</h2>
                  <div className="flex items-center gap-4 justify-center w-full mb-8 opacity-60">
                    <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-theme-300" />
                    <div className="w-1.5 h-1.5 rotate-45 bg-white" />
                    <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-theme-300" />
                  </div>
                  <p className="text-stone-300 text-base md:text-lg max-w-md mx-auto leading-relaxed mb-16 tracking-wide font-light">
                    ඔබගේ පැමිණීම අපට මහත් සතුටකි. කරුණාකර ඔබගේ පැමිණීම තහවුරු කරන්න.
                  </p>

                  {/* Premium RSVP Form */}
                  <div className="w-full bg-white/5 backdrop-blur-md p-6 sm:p-8 md:p-12 rounded-[2rem] border border-white/10 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)]">
                    <form className="space-y-8 text-left" onSubmit={submitRSVP}>
                      <div className="space-y-3">
                        <label className="text-sm md:text-base uppercase tracking-[0.3em] font-bold text-theme-200 ml-2">සම්පූර්ණ නම</label>
                        <input
                          type="text"
                          required
                          value={rsvpName}
                          onChange={(e) => setRsvpName(e.target.value)}
                          //placeholder="සමන් සහ කමලා"
                          className="w-full bg-transparent border-b border-white/20 px-2 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-theme-300 transition-colors font-cinzel text-xl md:text-2xl tracking-wide"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm md:text-base uppercase tracking-[0.3em] font-bold text-theme-200 ml-2">අමුත්තන් ගණන</label>
                        <div className="relative">
                          <select
                            value={rsvpGuests}
                            onChange={(e) => setRsvpGuests(e.target.value)}
                            className="w-full bg-transparent border-b border-white/20 px-2 py-3 text-white focus:outline-none focus:border-theme-300 transition-colors font-cinzel text-xl md:text-2xl tracking-wide appearance-none cursor-pointer"
                          >
                            <option value="1" className="bg-[#2c2a26] text-white">1 Guest (Just Me)</option>
                            <option value="2" className="bg-[#2c2a26] text-white">2 අමුත්තන්</option>
                            <option value="3" className="bg-[#2c2a26] text-white">3 අමුත්තන්</option>
                            <option value="4" className="bg-[#2c2a26] text-white">4 අමුත්තන්</option>
                            <option value="0" className="bg-[#2c2a26] text-theme-300">කනගාටුවෙන් වුවද පැමිණිය නොහැක</option>
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <div className="w-2 h-2 border-r border-b border-theme-300 rotate-45 transform -translate-y-[25%]" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm md:text-base uppercase tracking-[0.3em] font-bold text-theme-200 ml-2">වෙනත් සටහන්</label>
                        <input
                          type="text"
                          value={rsvpNotes}
                          onChange={(e) => setRsvpNotes(e.target.value)}
                          //placeholder="ආසාත්මිකතා, නිර්මාංශික යනාදිය"
                          className="w-full bg-transparent border-b border-white/20 px-2 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-theme-300 transition-colors font-cinzel text-xl md:text-2xl tracking-wide"
                        />
                      </div>

                      <div className="pt-10">
                        <button
                          type="submit"
                          disabled={rsvpStatus === "submitting" || rsvpStatus === "success"}
                          className="w-full bg-theme-200 text-stone-900 py-5 rounded-full font-bold uppercase tracking-[0.3em] text-[12px] md:text-base hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 group inline-flex justify-center items-center gap-4 disabled:opacity-50"
                        >
                          <span className="w-1.5 h-1.5 bg-stone-900 rotate-45 group-hover:scale-150 transition-transform" />
                          {rsvpStatus === "submitting" ? "යවමින්..." : rsvpStatus === "success" ? "සාර්ථකව යවන ලදි" : "තහවුරු කිරීම යවන්න"}
                          <span className="w-1.5 h-1.5 bg-stone-900 rotate-45 group-hover:scale-150 transition-transform" />
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Wishing Section and Footer Wrapper */}
            <div className="relative bg-[#fdfaf5]">
              <div className="absolute inset-0 opacity-[0.03] paper-grain pointer-events-none" />

              <section className="cv-auto py-24 md:py-36 relative flex flex-col items-center overflow-hidden">
                <InviteImage src={mandalaImage} alt="" className="absolute top-0 right-0 w-[40vw] max-w-[500px] opacity-[0.04] mix-blend-multiply translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                <InviteImage src={mandalaImage} alt="" className="absolute bottom-16 left-1/2 w-[38vw] max-w-[360px] opacity-[0.08] mix-blend-multiply -translate-x-1/2 pointer-events-none" />

                <div className="container mx-auto px-4 max-w-4xl text-center relative z-10 w-full">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-theme-100/50 mb-8 mt-4 shadow-sm border border-theme-200/50">
                      <Sparkles className="w-8 h-8 text-theme-500" />
                    </div>

                    <h2 className="font-playball text-[4rem] sm:text-[4.5rem] md:text-[6rem] text-theme-800 mb-6 drop-shadow-sm leading-none">සුබ පැතුම්</h2>
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-theme-400 to-transparent mb-8" />

                    <p className="text-stone-500 text-base md:text-xl leading-relaxed max-w-xl mx-auto mb-16 font-light tracking-wide px-4">
                      ඔබගේ පැමිණීම අපට වටිනාම තෑග්ගයි. කෙසේ වෙතත්, ඔබගේ සුබ පැතුම් අපට මහත් සතුටක් ගෙන දෙනු ඇත!
                    </p>

                    {/* Premium Wishing Form */}
                    <div className="w-full max-w-2xl mx-auto bg-white p-6 sm:p-8 md:p-14 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-theme-100/50 rounded-tr-[4rem] rounded-bl-[4rem] relative group">
                      {/* Decorative internal lines */}
                      <div className="absolute inset-2 md:inset-4 border-[0.5px] border-theme-200/50 rounded-tr-[3.5rem] rounded-bl-[3.5rem] pointer-events-none transition-colors duration-700 group-hover:border-theme-300/80" />

                      <form className="space-y-8 text-left relative z-10" onSubmit={submitWish}>
                        <div className="space-y-3">
                          <label className="text-sm md:text-base uppercase tracking-[0.4em] font-bold text-stone-400 ml-2">ඔබගේ නම</label>
                          <input
                            type="text"
                            required
                            value={wishName}
                            onChange={(e) => setWishName(e.target.value)}
                            //placeholder="සමන්"
                            className="w-full bg-stone-50/50 border-b border-theme-200 px-4 py-4 text-theme-900 placeholder:text-stone-300 focus:outline-none focus:border-theme-400 focus:bg-white transition-all font-cinzel text-xl tracking-wide rounded-t-lg"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm md:text-base uppercase tracking-[0.4em] font-bold text-stone-400 ml-2">ඔබගේ පණිවිඩය</label>
                          <textarea
                            rows={4}
                            required
                            value={wishMessage}
                            onChange={(e) => setWishMessage(e.target.value)}
                            //placeholder="ඔබට සදාකාලික සතුටක් ප්‍රාර්ථනා කරමි..."
                            className="w-full bg-stone-50/50 border-b border-theme-200 px-4 py-4 text-theme-900 placeholder:text-stone-300 focus:outline-none focus:border-theme-400 focus:bg-white transition-all font-cinzel text-xl tracking-wide resize-none rounded-t-lg"
                          />
                        </div>
                        <div className="pt-6 flex justify-center">
                          <button
                            type="submit"
                            disabled={wishStatus === "submitting" || wishStatus === "success"}
                            className="bg-theme-800 text-white px-12 py-5 rounded-full font-bold uppercase tracking-[0.3em] text-[12px] hover:bg-theme-900 hover:shadow-xl hover:shadow-theme-900/20 transition-all duration-300 group/btn inline-flex items-center gap-4 disabled:opacity-50"
                          >
                            <span className="w-1.5 h-1.5 bg-white rotate-45 group-hover/btn:scale-150 transition-transform" />
                            {wishStatus === "submitting" ? "යවමින්..." : wishStatus === "success" ? "සාර්ථකව යවන ලදි" : "සුබ පැතුම් යවන්න"}
                            <span className="w-1.5 h-1.5 bg-white rotate-45 group-hover/btn:scale-150 transition-transform" />
                          </button>
                        </div>
                      </form>
                    </div>

                    <div className="mt-32 md:mt-48 space-y-6 flex flex-col items-center relative w-full">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-playball text-[22vw] md:text-[222px] text-theme-100/40 whitespace-nowrap pointer-events-none z-0 select-none">
                        ස්තූතියි
                      </div>
                      <p className="text-[11px] md:text-[13px] uppercase tracking-[0.8em] text-theme-600 font-bold relative z-10 bg-[#fdfaf5] px-6 py-2 rounded-full border border-theme-100/50 shadow-sm">ආදරයෙන්</p>
                      <h3 className="font-playball text-[3.7rem] sm:text-7xl md:text-9xl text-theme-900 relative z-10 drop-shadow-sm px-4 pt-4 leading-none">ඉසංකා සහ මදුසංක</h3>

                      <motion.img
                        initial={{ opacity: 0, y: 24, scale: 0.95 }}
                        whileInView={{ opacity: 0.9, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        src={mandalaImage}
                        alt=""
                        className="relative z-10 mt-8 w-40 h-40 md:w-56 md:h-56 object-contain mix-blend-multiply drop-shadow-[0_12px_24px_rgba(188,95,153,0.2)]"
                      />
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* Footer */}
              <footer className="py-12 border-t border-theme-200/30 text-center relative z-10 space-y-3">
                <p className="text-[10px] md:text-[12px] uppercase tracking-[0.5em] text-stone-400 font-bold">
                  © 2026 ඉසංකා සහ මදුසංක. <span className="hidden md:inline">|</span><br className="md:hidden block mt-2" /> සියලුම හිමිකම් ඇවිරිණි.
                </p>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} src="/paulyudin-wedding-485932.mp3" loop />
      
      {/* Floating Audio Toggle Button */}
      {isOpened && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={toggleAudio}
          className="fixed bottom-6 right-6 z-50 bg-white/80 backdrop-blur-md p-4 rounded-full shadow-lg border border-theme-200 text-theme-800 hover:bg-theme-100 transition-all hover:scale-110 active:scale-95"
          aria-label="Toggle music"
        >
          {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </motion.button>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow linear infinite;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #fdfaf5;
        }
        ::-webkit-scrollbar-thumb {
          background: #f3a7cd;
          border-radius: 10px;
        }
      `}} />
    </main>
  );
}
