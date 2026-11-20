'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  Clock,
  Heart,
  MailOpen,
  MapPin,
  Music,
  Pause,
  Play,
} from 'lucide-react';
import { Cormorant_Garamond, Nunito } from 'next/font/google';

/* -------------------------------------------------------------------------- */
/*  DATA ACARA
/* -------------------------------------------------------------------------- */

const EVENT = {
  family: 'Raslan – Supeni',
  date: '[Hari, Tanggal Bulan Tahun]',
  time: '07.00 – selesai',
  placeName: 'Kediaman Keluarga Welly Sulis',
  address:
    'Jl. Semeru No.18, Kudu, Kec. Kertosono, Kabupaten Nganjuk, Jawa Timur 64315',
  mapsUrl: 'https://maps.app.goo.gl/S32VZZLMk4upDj8U6',
  music: '/musik.mp3',
  defaultGuest: 'Keluarga Tercinta',
} as const;

const RUNDOWN: ReadonlyArray<{ time: string; title: string; desc: string }> = [
  {
    time: '07.00',
    title: 'Kedatangan',
    desc: 'Tamu disambut hangat, bersalaman, dan menikmati hidangan pembuka.',
  },
  {
    time: '08.00',
    title: 'Pembukaan & Tilawah',
    desc: 'Acara dibuka dengan lantunan ayat suci Al-Qur’an.',
  },
  {
    time: '08.20',
    title: 'Sambutan Keluarga',
    desc: 'Sambutan dari sesepuh dan perwakilan keluarga besar.',
  },
  {
    time: '08.45',
    title: 'Saling Memaafkan',
    desc: 'Sungkeman dan bersalaman antar anggota keluarga.',
  },
  {
    time: '09.30',
    title: 'Doa & Makan Bersama',
    desc: 'Doa bersama, dilanjutkan santap hidangan khas Lebaran.',
  },
  {
    time: '10.30',
    title: 'Foto Keluarga & Silaturahmi',
    desc: 'Berfoto bersama dan berbincang santai hingga acara selesai.',
  },
];

/* -------------------------------------------------------------------------- */
/*  TOKEN VISUAL                                                              */
/* -------------------------------------------------------------------------- */

const GOLD = '#C8A45D';
const GOLD_SOFT = '#E9D5A1';
const EMERALD = '#143628';
const CREAM = '#FDF8EE';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const body = Nunito({
  subsets: ['latin'],
  display: 'swap',
});

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A45D]';

/* -------------------------------------------------------------------------- */
/*  VARIANTS                                                                  */
/* -------------------------------------------------------------------------- */

const coverParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.25 } },
};

const heroParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.22, delayChildren: 0.9 } },
};

const riseChild: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

const popChild: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 120, damping: 14 },
  },
};

const textParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.3, delayChildren: 0.2 } },
};

const textChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const cardVariants: Variants = {
  rest: { y: 0, rotate: 0, scale: 1 },
  hover: {
    y: -5,
    rotate: -0.6,
    scale: 1.01,
    transition: { type: 'spring', stiffness: 260, damping: 18 },
  },
  tap: { scale: 0.975, rotate: 0.4 },
};

const sheenVariants: Variants = {
  rest: { x: '-100%', opacity: 0 },
  hover: { x: '100%', opacity: 1, transition: { duration: 0.9, ease: 'easeInOut' } },
  tap: { x: '100%', opacity: 1, transition: { duration: 0.6 } },
};

const pinVariants: Variants = {
  rest: { y: 0 },
  hover: {
    y: [0, -4, 0],
    transition: { duration: 0.7, repeat: Infinity, ease: 'easeInOut' },
  },
};

const arrowVariants: Variants = {
  rest: { x: 0, y: 0 },
  hover: { x: 4, y: -4, transition: { type: 'spring', stiffness: 300, damping: 12 } },
};

const listParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
};

const listLine: Variants = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 1.4, ease: EASE } },
};

const listItem: Variants = {
  hidden: { opacity: 0, x: 28 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};

const listDot: Variants = {
  hidden: { scale: 0 },
  show: { scale: 1, transition: { type: 'spring', stiffness: 260, damping: 14 } },
};

/* -------------------------------------------------------------------------- */
/*  ORNAMEN                                                                   */
/* -------------------------------------------------------------------------- */

function Float({
  children,
  className,
  amplitude = 6,
  duration = 5,
  delay = 0,
  tilt = 0,
}: {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
  delay?: number;
  tilt?: number;
}) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-amplitude, amplitude, -amplitude],
        rotate: [-tilt, tilt, -tilt],
      }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  );
}

function Sparkle({
  className,
  size = 14,
  delay = 0,
}: {
  className?: string;
  size?: number;
  delay?: number;
}) {
  return (
    <motion.span
      aria-hidden="true"
      className={`pointer-events-none absolute ${className ?? ''}`}
      animate={{ opacity: [0.25, 0.9, 0.25], scale: [0.8, 1.15, 0.8] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill={GOLD}>
        <path d="M12 0 L14.6 9.4 L24 12 L14.6 14.6 L12 24 L9.4 14.6 L0 12 L9.4 9.4 Z" />
      </svg>
    </motion.span>
  );
}

function RotatingStar({
  className,
  size = 80,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div className={`pointer-events-none ${className ?? ''}`} aria-hidden="true">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          <g stroke={GOLD} strokeWidth="1.2">
            <rect x="9" y="9" width="30" height="30" />
            <rect x="9" y="9" width="30" height="30" transform="rotate(45 24 24)" />
            <circle cx="24" cy="24" r="5" />
            <circle cx="24" cy="24" r="13" strokeOpacity="0.5" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}

function Crescent({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <mask id={`cres-${uid}`}>
          <rect width="100" height="100" fill="white" />
          <circle cx="64" cy="40" r="33" fill="black" />
        </mask>
        <linearGradient id={`cresg-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={GOLD_SOFT} />
          <stop offset="1" stopColor={GOLD} />
        </linearGradient>
      </defs>
      <circle
        cx="46"
        cy="52"
        r="38"
        fill={`url(#cresg-${uid})`}
        mask={`url(#cres-${uid})`}
      />
    </svg>
  );
}

function HangingLantern({
  className,
  delay = 0,
  swing = 5,
}: {
  className?: string;
  delay?: number;
  swing?: number;
}) {
  const uid = useId().replace(/:/g, '');
  const gradId = `lantern-${uid}`;
  return (
    <div className={`pointer-events-none ${className ?? ''}`} aria-hidden="true">
      <motion.div
        style={{ transformOrigin: '50% 0%' }}
        animate={{ rotate: [-swing, swing, -swing] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        <svg viewBox="0 0 60 120" className="block h-auto w-full overflow-visible">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F3E2B3" />
              <stop offset="1" stopColor={GOLD} />
            </linearGradient>
          </defs>
          <line x1="30" y1="0" x2="30" y2="15" stroke={GOLD} strokeWidth="1.5" />
          <circle cx="30" cy="18" r="3.5" fill="none" stroke={GOLD} strokeWidth="1.5" />
          <path d="M17 31 Q30 20 43 31 L41 36 H19 Z" fill={GOLD} />
          <motion.ellipse
            cx="30"
            cy="57"
            rx="21"
            ry="27"
            fill="#F3E2B3"
            animate={{ opacity: [0.1, 0.32, 0.1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay }}
          />
          <path
            d="M19 36 H41 Q47 57 41 79 H19 Q13 57 19 36 Z"
            fill={`url(#${gradId})`}
            fillOpacity="0.85"
            stroke={GOLD}
            strokeWidth="1.2"
          />
          <path
            d="M30 36 V79 M24.5 36 Q20 57 24.5 79 M35.5 36 Q40 57 35.5 79"
            fill="none"
            stroke={EMERALD}
            strokeOpacity="0.45"
            strokeWidth="1"
          />
          <rect x="17" y="79" width="26" height="6" rx="2" fill={GOLD} />
          <line x1="30" y1="85" x2="30" y2="102" stroke={GOLD} strokeWidth="1.5" />
          <path d="M26 102 H34 L32 116 H28 Z" fill={GOLD} />
        </svg>
      </motion.div>
    </div>
  );
}

function Divider({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 ${className ?? ''}`}
      aria-hidden="true"
    >
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#C8A45D]" />
      <span className="h-2 w-2 rotate-45 bg-[#C8A45D]" />
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#C8A45D]" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  SCROLL REVEAL                                                             */
/* -------------------------------------------------------------------------- */

type RevealFrom = 'up' | 'left' | 'right' | 'scale';

const hiddenState: Record<
  RevealFrom,
  { opacity: number; x?: number; y?: number; scale?: number }
> = {
  up: { opacity: 0, y: 32 },
  left: { opacity: 0, x: -36 },
  right: { opacity: 0, x: 36 },
  scale: { opacity: 0, scale: 0.92 },
};

function Reveal({
  children,
  className,
  delay = 0,
  from = 'up',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: RevealFrom;
}) {
  return (
    <motion.div
      className={className}
      initial={hiddenState[from]}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.85, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <Reveal className="text-center" from="scale">
      <h2 className={`${display.className} text-4xl font-semibold text-[#143628] md:text-5xl`}>
        {children}
      </h2>
      <Divider className="mt-4" />
    </Reveal>
  );
}

/* -------------------------------------------------------------------------- */
/*  COVER                                                                     */
/* -------------------------------------------------------------------------- */

function Cover({
  guestName,
  onOpen,
}: {
  guestName: string;
  onOpen: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50"
      exit={{ opacity: 0, transition: { duration: 0.3, delay: 1.25 } }}
    >
      {/* Dua daun gerbang yang membuka ke kiri dan kanan */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1/2 border-r border-[#C8A45D]/60 bg-[#143628]"
        exit={{ x: '-100%', transition: { duration: 1.2, ease: EASE } }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-1/2 border-l border-[#C8A45D]/60 bg-[#143628]"
        exit={{ x: '100%', transition: { duration: 1.2, ease: EASE } }}
      />

      {/* Isi cover */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center overflow-hidden px-6"
        exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.5 } }}
      >
        <div className="pointer-events-none absolute top-1/4 h-72 w-72 rounded-full bg-[#C8A45D]/15 blur-3xl" />

        <HangingLantern className="absolute left-5 top-0 w-12 md:left-[12%] md:w-16" delay={0} />
        <HangingLantern className="absolute right-8 top-0 w-9 md:right-[14%] md:w-12" delay={1.4} swing={6} />

        <Sparkle className="left-[22%] top-[14%]" size={12} delay={0.3} />
        <Sparkle className="right-[26%] top-[22%]" size={16} delay={1.1} />
        <Sparkle className="left-[12%] bottom-[24%]" size={14} delay={1.8} />
        <Sparkle className="right-[14%] bottom-[16%]" size={10} delay={0.7} />
        <RotatingStar className="absolute -left-10 bottom-10 opacity-30" size={120} />

        <motion.div
          variants={coverParent}
          initial="hidden"
          animate="show"
          className="relative flex w-full max-w-sm flex-col items-center text-center md:max-w-md"
        >
          <motion.div variants={riseChild}>
            <Float className="h-20 w-20" amplitude={6} duration={5}>
              <Crescent className="h-full w-full drop-shadow-[0_0_16px_rgba(200,164,93,0.45)]" />
            </Float>
          </motion.div>

          <motion.p
            variants={riseChild}
            className={`${display.className} mt-5 text-3xl font-semibold italic text-[#C8A45D] md:text-4xl`}
          >
            Selamat Hari Raya Idul Fitri
          </motion.p>
          <motion.p variants={riseChild} className="mt-1 text-sm text-[#FDF8EE]/75">
            Mohon maaf lahir dan batin
          </motion.p>

          <motion.div
            variants={riseChild}
            className="mt-9 w-full border-y border-[#C8A45D]/50 py-5"
          >
            <p className="text-sm text-[#FDF8EE]/70">Kepada Yth.</p>
            <p
              className={`${display.className} mt-1 break-words text-4xl font-semibold leading-tight text-[#FDF8EE] md:text-5xl`}
            >
              {guestName}
            </p>
          </motion.div>

          <motion.p
            variants={riseChild}
            className="mt-5 max-w-xs text-sm leading-relaxed text-[#FDF8EE]/75"
          >
            Anda diundang ke acara Halal bi Halal Bani {EVENT.family}.
          </motion.p>

          <motion.div variants={riseChild}>
            <motion.button
              type="button"
              onClick={onOpen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative mt-8 inline-flex items-center gap-2 rounded-full bg-[#C8A45D] px-7 py-3.5 font-bold text-[#143628] shadow-lg shadow-black/30 ${focusRing}`}
            >
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full border border-[#C8A45D]"
                animate={{ scale: [1, 1.4], opacity: [0.7, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              />
              <MailOpen size={18} aria-hidden="true" />
              Buka Undangan
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  HERO                                                                      */
/* -------------------------------------------------------------------------- */

function Hero({ isOpen }: { isOpen: boolean }) {
  return (
    <header className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[#143628] px-6 pb-28 pt-20 text-center">
      <div className="pointer-events-none absolute left-1/2 top-24 -ml-40 h-80 w-80 rounded-full bg-[#C8A45D]/10 blur-3xl" />

      <HangingLantern className="absolute left-4 top-0 w-10" delay={0} />
      <HangingLantern className="absolute right-6 top-0 w-8" delay={1.2} swing={6} />
      <HangingLantern className="absolute left-[16%] top-0 hidden w-9 md:block" delay={0.7} swing={4} />
      <HangingLantern className="absolute right-[18%] top-0 hidden w-11 md:block" delay={1.9} swing={5} />
      <HangingLantern className="absolute left-[32%] top-0 hidden w-7 lg:block" delay={2.6} swing={4} />
      <HangingLantern className="absolute right-[34%] top-0 hidden w-8 lg:block" delay={0.4} swing={5} />

      <Sparkle className="left-[24%] top-[12%]" size={12} delay={0} />
      <Sparkle className="right-[22%] top-[18%]" size={16} delay={0.9} />
      <Sparkle className="left-[8%] top-[48%]" size={10} delay={1.6} />
      <Sparkle className="right-[10%] top-[62%]" size={14} delay={0.4} />
      <Sparkle className="left-[16%] bottom-[22%]" size={12} delay={2.1} />
      <RotatingStar className="absolute -right-10 top-[44%] opacity-30 lg:right-[6%] lg:scale-150" size={110} />
      <RotatingStar className="absolute -left-12 bottom-[18%] opacity-25 lg:left-[6%] lg:scale-150" size={100} />

      <motion.div
        variants={heroParent}
        initial="hidden"
        animate={isOpen ? 'show' : 'hidden'}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div variants={popChild}>
          <Float className="h-24 w-24" amplitude={6} duration={5}>
            <Crescent className="h-full w-full drop-shadow-[0_0_18px_rgba(200,164,93,0.5)]" />
          </Float>
        </motion.div>

        <motion.p
          variants={riseChild}
          className={`${display.className} mt-6 text-lg italic text-[#E9D5A1] md:text-2xl`}
        >
          Taqabbalallahu minna wa minkum
        </motion.p>

        <motion.h1
          variants={riseChild}
          className={`${display.className} mt-3 text-[3.75rem] font-semibold leading-[0.95] text-[#FDF8EE] sm:text-7xl lg:text-8xl`}
        >
          Halalbi<br className="sm:hidden" />halal
        </motion.h1>

        <motion.p
          variants={riseChild}
          className={`${display.className} mt-3 text-2xl italic text-[#C8A45D] md:text-3xl lg:text-4xl`}
        >
          Hari Raya Idul Fitri
        </motion.p>

        <motion.div variants={riseChild} className="mt-6 w-full">
          <Divider />
        </motion.div>

        <motion.p
          variants={riseChild}
          className={`${display.className} mt-6 text-4xl italic text-[#FDF8EE]/80`}
        >
          Bani
        </motion.p>
        <motion.p
          variants={riseChild}
          className={`${display.className} text-4xl font-semibold text-[#FDF8EE] md:text-5xl lg:text-6xl`}
        >
          {EVENT.family}
        </motion.p>

        <motion.p
          variants={riseChild}
          className="mt-6 max-w-xs text-sm leading-relaxed text-[#FDF8EE]/80 md:max-w-md md:text-base"
        >
          Dengan penuh syukur, kami mengundang Anda untuk bersilaturahmi dan saling
          memaafkan di hari yang fitri.
        </motion.p>
      </motion.div>

      <div className="absolute inset-x-0 bottom-10 flex justify-center text-[#C8A45D]">
        <motion.div
          aria-hidden="true"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={26} />
        </motion.div>
      </div>

      <svg
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-5 w-full"
        focusable="false"
      >
        <defs>
          <pattern id="scallop-up" width="40" height="20" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="20" fill={CREAM} />
          </pattern>
        </defs>
        <rect width="100%" height="20" fill="url(#scallop-up)" />
      </svg>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  SALAM HANGAT                                                              */
/* -------------------------------------------------------------------------- */

function Greeting() {
  return (
    <section className="relative bg-[#FDF8EE] px-6 pb-16 pt-14">
      <SectionHeading>Salam Hangat Keluarga</SectionHeading>

      <Reveal from="up" delay={0.1} className="relative mx-auto mt-14 max-w-sm md:max-w-xl">
        <Float
          className="absolute -top-7 left-1/2 z-10 -ml-7 flex h-14 w-14 items-center justify-center rounded-full bg-[#FDF8EE]"
          amplitude={4}
          duration={4}
        >
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <g stroke={GOLD} strokeWidth="1.4">
              <rect x="9" y="9" width="30" height="30" />
              <rect x="9" y="9" width="30" height="30" transform="rotate(45 24 24)" />
              <circle cx="24" cy="24" r="5" fill={GOLD} />
            </g>
          </svg>
        </Float>

        <div className="rounded-b-3xl rounded-t-[10rem] border border-[#C8A45D]/60 bg-white/60 px-7 pb-9 pt-16 text-center shadow-sm md:rounded-t-[14rem] md:px-12 md:pb-12 md:pt-20">
          <motion.div
            variants={textParent}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="space-y-4 text-[15px] leading-relaxed text-[#143628]/90 md:text-lg"
          >
            <motion.p variants={textChild} className="font-semibold">
              Assalamu’alaikum Warahmatullahi Wabarakatuh
            </motion.p>
            <motion.p variants={textChild}>
              Setelah sebulan penuh menempa diri, kami bersyukur dipertemukan kembali
              dengan hari kemenangan. Sebagai wujud syukur, kami mengajak seluruh
              keluarga duduk bersama, saling bermaafan, dan mempererat tali silaturahmi.
            </motion.p>
            <motion.p variants={textChild}>
              Kehadiran dan doa Bapak/Ibu/Saudara/i akan melengkapi kebahagiaan kami di
              hari yang fitri ini.
            </motion.p>
            <motion.p
              variants={textChild}
              className={`${display.className} pt-2 text-2xl font-semibold italic text-[#8A6A25]`}
            >
              Mohon maaf lahir dan batin
            </motion.p>
          </motion.div>
        </div>
      </Reveal>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  WAKTU & LOKASI                                                            */
/* -------------------------------------------------------------------------- */

function InfoRow({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C8A45D]/60 bg-[#C8A45D]/10 text-[#C8A45D]">
        {icon}
      </span>
      <div className="min-w-0 text-left">
        <p className="text-sm text-[#C8A45D]">{title}</p>
        <p className="mt-0.5 break-words leading-snug text-[#FDF8EE]">{children}</p>
      </div>
    </div>
  );
}

function EventSection() {
  return (
    <section className="relative bg-[#FDF8EE] px-6 pb-16 pt-6 lg:px-10 lg:pt-14">
      <SectionHeading>Waktu &amp; Lokasi</SectionHeading>

      <Reveal from="scale" delay={0.1} className="mx-auto mt-10 w-full max-w-md">
        <motion.div
          variants={cardVariants}
          initial="rest"
          animate="rest"
          whileHover="hover"
          whileTap="tap"
          className="relative overflow-hidden rounded-3xl border border-[#C8A45D]/70 bg-[#143628] p-6 text-[#FDF8EE] shadow-xl shadow-[#143628]/25"
        >
          <motion.span
            aria-hidden="true"
            variants={sheenVariants}
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          />
          <RotatingStar className="absolute -right-8 -top-8 opacity-25" size={110} />

          <div className="relative space-y-5">
            <InfoRow icon={<CalendarDays size={18} aria-hidden="true" />} title="Hari & tanggal">
              <span className={`${display.className} text-2xl font-semibold`}>
                {EVENT.date}
              </span>
            </InfoRow>

            <InfoRow icon={<Clock size={18} aria-hidden="true" />} title="Waktu">
              <span className={`${display.className} text-2xl font-semibold`}>
                {EVENT.time}
              </span>
            </InfoRow>

            <InfoRow icon={<MapPin size={18} aria-hidden="true" />} title="Tempat">
              <span className="block font-semibold">{EVENT.placeName}</span>
              <span className="mt-1 block text-sm text-[#FDF8EE]/80">{EVENT.address}</span>
            </InfoRow>
          </div>

          <motion.a
            href={EVENT.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial="rest"
            animate="rest"
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
            className={`relative mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#C8A45D] px-6 py-3.5 font-bold text-[#143628] ${focusRing}`}
          >
            <motion.span variants={pinVariants} className="flex" aria-hidden="true">
              <MapPin size={18} />
            </motion.span>
            Buka di Google Maps
            <motion.span variants={arrowVariants} className="flex" aria-hidden="true">
              <ArrowUpRight size={18} />
            </motion.span>
          </motion.a>
        </motion.div>
      </Reveal>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  RUNDOWN                                                                   */
/* -------------------------------------------------------------------------- */

function Rundown() {
  return (
    <section className="relative bg-[#F6EEDB] px-6 pb-20 pt-14 lg:px-10">
      <SectionHeading>Susunan Acara</SectionHeading>

      <motion.ol
        variants={listParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="relative mx-auto mt-12 max-w-md pl-9"
      >
        <motion.span
          aria-hidden="true"
          variants={listLine}
          className="absolute bottom-2 left-[11px] top-2 w-px origin-top bg-gradient-to-b from-[#C8A45D] to-[#C8A45D]/20"
        />

        {RUNDOWN.map((item) => (
          <motion.li
            key={item.time}
            variants={listItem}
            className="relative pb-8 last:pb-0"
          >
            <motion.span
              aria-hidden="true"
              variants={listDot}
              className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-[#C8A45D] bg-[#FDF8EE]"
            />
            <p className="text-sm font-bold text-[#8A6A25]">{item.time} WIB</p>
            <h3
              className={`${display.className} text-2xl font-semibold leading-tight text-[#143628]`}
            >
              {item.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-[#143628]/75">{item.desc}</p>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  PENUTUP                                                                   */
/* -------------------------------------------------------------------------- */

function Closing() {
  return (
    <footer className="relative bg-[#143628] px-6 pb-32 pt-20 text-center text-[#FDF8EE]">
      <svg
        aria-hidden="true"
        className="absolute inset-x-0 -top-[19px] h-5 w-full"
        focusable="false"
      >
        <defs>
          <pattern id="scallop-down" width="40" height="20" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="0" r="20" fill={EMERALD} />
          </pattern>
        </defs>
        <rect width="100%" height="20" fill="url(#scallop-down)" />
      </svg>

      <HangingLantern className="absolute left-6 top-0 w-9" delay={0.6} swing={4} />
      <HangingLantern className="absolute right-8 top-0 w-7" delay={2} swing={5} />
      <Sparkle className="left-[30%] top-[12%]" size={12} delay={0.2} />
      <Sparkle className="right-[28%] top-[8%]" size={10} delay={1.4} />
      <Sparkle className="left-[10%] bottom-[30%]" size={14} delay={0.9} />
      <Sparkle className="right-[12%] bottom-[26%]" size={12} delay={1.9} />

      <Reveal from="up" className="relative flex flex-col items-center">
        <Float className="h-16 w-16" amplitude={5} duration={4.5}>
          <Crescent className="h-full w-full" />
        </Float>

        <p className={`${display.className} mt-6 text-lg italic text-[#E9D5A1] md:text-2xl`}>
          Wassalamu’alaikum Warahmatullahi Wabarakatuh
        </p>

        <h2
          className={`${display.className} mt-4 text-4xl font-semibold leading-tight text-[#FDF8EE] md:text-6xl`}
        >
          Mohon Maaf
          <br />
          Lahir &amp; Batin
        </h2>

        <motion.span
          aria-hidden="true"
          className="mt-5 text-[#C8A45D]"
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Heart size={22} fill="currentColor" />
        </motion.span>

        <Divider className="mt-6" />

        <p className="mt-6 text-sm text-[#FDF8EE]/75">Kami yang berbahagia,</p>
        <p className={`${display.className} mt-1 text-3xl font-semibold text-[#FDF8EE] md:text-5xl`}>
          Keluarga Besar
          <br />
          {EVENT.family}
        </p>
      </Reveal>
    </footer>
  );
}

/* -------------------------------------------------------------------------- */
/*  TOMBOL MUSIK                                                              */
/* -------------------------------------------------------------------------- */

function MusicButton({
  isPlaying,
  onToggle,
}: {
  isPlaying: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="pointer-events-none fixed bottom-0 right-0 z-40 p-4 md:p-6">
      <div className="flex justify-end">
        <motion.button
          type="button"
          onClick={onToggle}
          aria-label={isPlaying ? 'Jeda musik' : 'Putar musik'}
          aria-pressed={isPlaying}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 1.3 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={`pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full border border-[#C8A45D] bg-[#143628] text-[#C8A45D] shadow-lg shadow-black/30 ${focusRing}`}
        >
          {isPlaying && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full border border-[#C8A45D]"
              animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            />
          )}

          <span
            className="flex animate-spin motion-reduce:animate-none"
            style={{
              animationDuration: '7s',
              animationPlayState: isPlaying ? 'running' : 'paused',
            }}
          >
            <Music size={24} aria-hidden="true" />
          </span>

          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#C8A45D] text-[#143628]"
          >
            {isPlaying ? (
              <Pause size={11} fill="currentColor" />
            ) : (
              <Play size={11} fill="currentColor" />
            )}
          </span>
        </motion.button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  KOMPONEN UTAMA                                                            */
/* -------------------------------------------------------------------------- */

export default function UndanganClient() {
  const searchParams = useSearchParams();
  const guestName =
    (searchParams?.get('to') ?? '').trim().slice(0, 60) || EVENT.defaultGuest;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Kunci scroll selama cover masih menutup layar
  useEffect(() => {
    const previous = document.body.style.overflow;
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    window.scrollTo({ top: 0 });

    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.7;
      audio.play().catch(() => setIsPlaying(false));
    }
  };

  const handleToggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className={`${body.className} min-h-screen bg-[#0E2A1E] text-[#143628]`}>
        <audio
          ref={audioRef}
          src={EVENT.music}
          loop
          preload="auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        <AnimatePresence>
          {!isOpen && <Cover key="cover" guestName={guestName} onOpen={handleOpen} />}
        </AnimatePresence>

        <main className="relative w-full overflow-hidden bg-[#FDF8EE]">
          <Hero isOpen={isOpen} />
          <Greeting />
          <div className="lg:grid lg:grid-cols-2">
            <EventSection />
            <Rundown />
          </div>
          <Closing />
        </main>

        {isOpen && <MusicButton isPlaying={isPlaying} onToggle={handleToggleMusic} />}
      </div>
    </MotionConfig>
  );
}
