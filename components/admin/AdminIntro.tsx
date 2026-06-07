'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Admin welcome lottery 🎰 — every time the dashboard loads, one of six
 * fullscreen cinematic intros plays at random:
 * Star Wars · Back to the Future · Spider-Man · Batman · Jurassic Park · Flamenco
 */

type Theme = 'starwars' | 'bttf' | 'spiderman' | 'batman' | 'jurassic' | 'flamenco';

const THEMES: Theme[] = ['starwars', 'bttf', 'spiderman', 'batman', 'jurassic', 'flamenco'];

const DURATION: Record<Theme, number> = {
  starwars: 9000,
  bttf: 8000,
  spiderman: 6500,
  batman: 7000,
  jurassic: 8000,
  flamenco: 7000,
};

// ───────────────────────── Star Wars ─────────────────────────

function StarWarsIntro() {
  const stars = useMemo(
    () =>
      Array.from({ length: 90 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.7 + 0.3,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {stars.map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
          }}
        />
      ))}

      {/* Opening line */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 3, times: [0, 0.2, 0.8, 1] }}
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-8 text-center font-serif text-2xl italic text-[#4BD5EE] sm:text-3xl"
      >
        Hace mucho tiempo, en una tienda muy, muy lejana…
      </motion.p>

      {/* Crawl */}
      <div className="absolute inset-0" style={{ perspective: '380px' }}>
        <motion.div
          initial={{ y: '90%', opacity: 0 }}
          animate={{ y: '-160%', opacity: [0, 1, 1, 1] }}
          transition={{ delay: 2.6, duration: 7, ease: 'linear' }}
          style={{ transformStyle: 'preserve-3d', rotateX: 28 }}
          className="mx-auto w-full max-w-xl text-center font-sans font-bold tracking-wide text-[#FFE81F]"
        >
          <p className="text-3xl sm:text-4xl">EPISODIO VII</p>
          <p className="mt-4 text-4xl sm:text-5xl">EL RETORNO DEL ADMIN</p>
          <p className="mt-8 text-xl leading-relaxed sm:text-2xl">
            Tiempos turbulentos para el inventario. Las pulseras esperan en la base de
            datos mientras los pedidos rebeldes se acumulan en el panel…
          </p>
          <p className="mt-6 text-xl leading-relaxed sm:text-2xl">
            Solo tú, maestro del dashboard, puedes restaurar el equilibrio del stock y
            llevar la paz a la galaxia Ágape.
          </p>
          <p className="mt-6 text-xl sm:text-2xl">Que la fe te acompañe. ✨</p>
        </motion.div>
      </div>
    </div>
  );
}

// ───────────────────────── Back to the Future ─────────────────────────

function TimeRow({ label, value, color, delay }: { label: string; value: string; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-lg border border-zinc-600 bg-zinc-900 px-4 py-2.5 sm:px-6 sm:py-3"
    >
      <p className="text-[0.55rem] font-bold uppercase tracking-[0.3em] text-zinc-400 sm:text-xs">
        {label}
      </p>
      <p className="font-mono text-xl font-bold sm:text-3xl" style={{ color, textShadow: `0 0 12px ${color}` }}>
        {value}
      </p>
    </motion.div>
  );
}

function BttfIntro() {
  const [speed, setSpeed] = useState(0);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const interval = window.setInterval(() => {
      const t = (Date.now() - start - 2200) / 3000; // accelerate after panels
      if (t < 0) return;
      const next = Math.min(88, Math.round(t * 88));
      setSpeed(next);
      if (next >= 88) {
        setFlash(true);
        window.clearInterval(interval);
      }
    }, 50);
    return () => window.clearInterval(interval);
  }, []);

  const today = new Date();
  const fmt = (d: Date) =>
    d
      .toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      .toUpperCase();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 overflow-hidden bg-black px-6">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-mono text-xs uppercase tracking-[0.4em] text-zinc-400 sm:text-sm"
      >
        Circuitos de tiempo · Ágape Admin
      </motion.p>

      <div className="flex flex-col gap-3">
        <TimeRow label="Destino: tu dashboard" value={fmt(today)} color="#FF3B30" delay={0.3} />
        <TimeRow label="Tiempo presente" value={fmt(today)} color="#34C759" delay={0.7} />
        <TimeRow label="Última venta registrada" value="OCT 26 1985" color="#FFCC00" delay={1.1} />
      </div>

      {/* Speedometer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8 }}
        className="flex items-baseline gap-3"
      >
        <span
          className="font-mono text-7xl font-bold text-orange-400 sm:text-8xl"
          style={{ textShadow: '0 0 24px rgba(251,146,60,0.8)' }}
        >
          {speed}
        </span>
        <span className="font-mono text-2xl text-zinc-400">MPH</span>
      </motion.div>

      {/* fire trails */}
      <AnimatePresence>
        {speed >= 88 && (
          <>
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              className="absolute bottom-[22%] left-0 h-2 w-full origin-left bg-gradient-to-r from-orange-500 via-yellow-400 to-transparent"
            />
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.08 }}
              className="absolute bottom-[19%] left-0 h-2 w-full origin-left bg-gradient-to-r from-orange-500 via-yellow-400 to-transparent"
            />
            <motion.span
              initial={{ x: '-20vw' }}
              animate={{ x: '120vw' }}
              transition={{ duration: 0.7, ease: 'easeIn' }}
              className="absolute bottom-[17%] text-6xl"
            >
              🚗💨
            </motion.span>
          </>
        )}
      </AnimatePresence>

      {/* flash + plate */}
      <AnimatePresence>
        {flash && (
          <>
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="absolute inset-0 bg-white"
            />
            <motion.p
              initial={{ opacity: 0, scale: 2 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, type: 'spring', stiffness: 200 }}
              className="absolute bottom-16 rounded-lg border-4 border-zinc-300 bg-orange-100 px-6 py-2 font-mono text-3xl font-bold tracking-[0.2em] text-zinc-800 shadow-2xl"
            >
              OUTATIME
            </motion.p>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ───────────────────────── Spider-Man ─────────────────────────

function SpiderIntro() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-red-700 via-red-600 to-blue-800">
      {/* web corner */}
      <svg viewBox="0 0 200 200" className="absolute -left-6 -top-6 h-72 w-72 opacity-40">
        {[0, 1, 2, 3, 4].map((r) => (
          <path
            key={r}
            d={`M 0 ${30 + r * 35} Q ${50 + r * 28} ${42 + r * 32} ${30 + r * 35} 0`}
            fill="none"
            stroke="white"
            strokeWidth="1.5"
          />
        ))}
        {[15, 35, 55, 75].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line key={deg} x1="0" y1="0" x2={Math.cos(rad) * 220} y2={Math.sin(rad) * 220} stroke="white" strokeWidth="1.5" />
          );
        })}
      </svg>

      {/* spider drop */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2">
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: [0, 260, 200, 230] }}
          transition={{ duration: 2, times: [0, 0.55, 0.8, 1], ease: 'easeOut' }}
          className="mx-auto w-0.5 bg-white/80"
        />
        <motion.span
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: [-80, 180, 120, 150], opacity: 1 }}
          transition={{ duration: 2, times: [0, 0.55, 0.8, 1], ease: 'easeOut' }}
          className="absolute left-1/2 top-0 -translate-x-1/2 text-6xl"
          style={{ filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.4))' }}
        >
          🕷️
        </motion.span>
      </div>

      {/* THWIP bursts */}
      {[
        { x: '12%', y: '58%', delay: 2.0, rotate: -12 },
        { x: '68%', y: '30%', delay: 2.4, rotate: 8 },
      ].map((burst, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, rotate: burst.rotate - 30 }}
          animate={{ scale: [0, 1.3, 1], rotate: burst.rotate }}
          transition={{ delay: burst.delay, duration: 0.45, type: 'spring', stiffness: 300 }}
          className="absolute rounded-xl border-4 border-black bg-yellow-300 px-5 py-2 font-sans text-3xl font-black text-black shadow-[6px_6px_0_rgba(0,0,0,0.6)]"
          style={{ left: burst.x, top: burst.y }}
        >
          ¡THWIP!
        </motion.span>
      ))}

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.6 }}
        className="absolute inset-x-0 bottom-20 px-8 text-center font-serif text-2xl font-bold italic text-white drop-shadow-lg sm:text-3xl"
      >
        “Un gran inventario conlleva una gran responsabilidad”
      </motion.p>
    </div>
  );
}

// ───────────────────────── Batman ─────────────────────────

function BatmanIntro() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-zinc-950">
      {/* drifting clouds */}
      {[
        { top: '12%', delay: 0, dur: 9 },
        { top: '30%', delay: 1, dur: 11 },
      ].map((cloud, i) => (
        <motion.div
          key={i}
          initial={{ x: '-30%' }}
          animate={{ x: '130%' }}
          transition={{ duration: cloud.dur, delay: cloud.delay, ease: 'linear' }}
          className="absolute h-24 w-72 rounded-full bg-zinc-700/30 blur-2xl"
          style={{ top: cloud.top }}
        />
      ))}

      {/* light beam */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="absolute bottom-0 left-1/2 h-[120%] w-40 origin-bottom -translate-x-1/2 sm:w-64"
        style={{
          background:
            'linear-gradient(to top, rgba(253,224,71,0.16), rgba(253,224,71,0.05) 70%, transparent)',
          clipPath: 'polygon(42% 100%, 58% 100%, 100% 0%, 0% 0%)',
        }}
      />

      {/* bat signal */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.4, type: 'spring', stiffness: 120, damping: 12 }}
        className="absolute left-1/2 top-[18%] flex h-40 w-64 -translate-x-1/2 items-center justify-center rounded-[50%] sm:h-48 sm:w-80"
        style={{
          background: 'radial-gradient(ellipse, rgba(253,224,71,0.95), rgba(253,224,71,0.55) 70%)',
          boxShadow: '0 0 80px 30px rgba(253,224,71,0.35)',
        }}
      >
        <span className="text-7xl sm:text-8xl" style={{ filter: 'brightness(0)' }}>
          🦇
        </span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1] }}
        transition={{ delay: 2.6, duration: 1 }}
        className="absolute inset-x-0 bottom-32 text-center font-mono text-sm uppercase tracking-[0.5em] text-yellow-200/80 sm:text-base"
      >
        na na na na na na na na…
      </motion.p>
      <motion.p
        initial={{ opacity: 0, scale: 3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3.6, type: 'spring', stiffness: 200 }}
        className="absolute inset-x-0 bottom-16 text-center font-sans text-5xl font-black text-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,0.6)] sm:text-6xl"
      >
        ¡ADMIN!
      </motion.p>
    </div>
  );
}

// ───────────────────────── Jurassic Park ─────────────────────────

function JurassicIntro() {
  return (
    <motion.div
      animate={{ x: [0, 0, -7, 7, -5, 5, 0] }}
      transition={{ delay: 3.4, duration: 1.1 }}
      className="absolute inset-0 overflow-hidden"
      style={{ background: 'radial-gradient(circle at 50% 40%, #14532d, #052e16 75%)' }}
    >
      {/* logo */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-1/2 top-1/2 flex h-64 w-64 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-[10px] border-red-600 bg-yellow-300 shadow-[0_0_60px_rgba(0,0,0,0.6)] sm:h-80 sm:w-80"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2.1, type: 'spring', stiffness: 150 }}
          className="text-8xl sm:text-9xl"
          style={{ filter: 'brightness(0)' }}
        >
          🦖
        </motion.span>
        <p className="mt-1 font-sans text-2xl font-black uppercase tracking-wide text-red-700 sm:text-3xl">
          Ágape Park
        </p>
      </motion.div>

      {/* gates */}
      {['left', 'right'].map((side) => (
        <motion.div
          key={side}
          initial={{ x: 0 }}
          animate={{ x: side === 'left' ? '-100%' : '100%' }}
          transition={{ delay: 1.2, duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
          className={`absolute inset-y-0 w-1/2 ${side === 'left' ? 'left-0 border-r-8' : 'right-0 border-l-8'} border-amber-950`}
          style={{
            background:
              'repeating-linear-gradient(90deg, #451a03 0px, #78350f 26px, #451a03 52px)',
          }}
        >
          <div className="absolute inset-6 border-4 border-amber-950/70" />
          <div
            className="absolute inset-6"
            style={{
              background:
                'linear-gradient(45deg, transparent 47%, #451a03 47%, #451a03 53%, transparent 53%), linear-gradient(-45deg, transparent 47%, #451a03 47%, #451a03 53%, transparent 53%)',
            }}
          />
        </motion.div>
      ))}

      {/* thuds */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0, 1, 0] }}
        transition={{ delay: 3.4, duration: 1.2, times: [0, 0.2, 0.45, 0.7, 1] }}
        className="absolute inset-x-0 top-10 text-center font-sans text-3xl font-black tracking-[0.3em] text-yellow-200/90"
      >
        *THUD* … *THUD*
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4.6, duration: 0.7 }}
        className="absolute inset-x-0 bottom-16 px-8 text-center font-serif text-xl italic text-yellow-100 sm:text-2xl"
      >
        “Tu inventario… encontró la manera.” 🌿
      </motion.p>
    </motion.div>
  );
}

// ───────────────────────── Flamenco ─────────────────────────

function FlamencoIntro() {
  const oles = [
    { x: '14%', y: '22%', delay: 1.2, rotate: -10 },
    { x: '70%', y: '18%', delay: 1.9, rotate: 8 },
    { x: '20%', y: '68%', delay: 2.6, rotate: -6 },
    { x: '72%', y: '64%', delay: 3.3, rotate: 12 },
  ];
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.18) 0 6px, transparent 7px), radial-gradient(circle at 75% 60%, rgba(255,255,255,0.18) 0 6px, transparent 7px), radial-gradient(circle at 45% 85%, rgba(255,255,255,0.18) 0 6px, transparent 7px), linear-gradient(150deg, #9f1239, #7f1d1d 60%, #581c87)',
        backgroundSize: '120px 120px, 160px 160px, 140px 140px, cover',
      }}
    >
      {/* dancer */}
      <motion.span
        initial={{ scale: 0, rotate: -20 }}
        animate={{
          scale: 1,
          rotate: [0, -8, 10, -6, 8, 0],
          y: [0, -18, 0, -14, 0],
        }}
        transition={{
          scale: { duration: 0.5, type: 'spring', stiffness: 180 },
          rotate: { delay: 0.5, duration: 3.2, repeat: 1, ease: 'easeInOut' },
          y: { delay: 0.5, duration: 1.6, repeat: 3, ease: 'easeInOut' },
        }}
        className="absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2 text-[9rem] drop-shadow-2xl sm:text-[11rem]"
      >
        💃
      </motion.span>

      {/* guitar + rose */}
      <motion.span
        initial={{ x: -120, opacity: 0, rotate: -30 }}
        animate={{ x: 0, opacity: 1, rotate: [-30, -10, -22] }}
        transition={{ delay: 0.8, duration: 1 }}
        className="absolute bottom-[24%] left-[12%] text-6xl sm:text-7xl"
      >
        🎸
      </motion.span>
      <motion.span
        initial={{ y: -150, opacity: 0 }}
        animate={{ y: 0, opacity: 1, rotate: [0, 12, -8, 0] }}
        transition={{ delay: 1.4, duration: 1.2, type: 'spring', stiffness: 90 }}
        className="absolute right-[14%] top-[20%] text-6xl sm:text-7xl"
      >
        🌹
      </motion.span>

      {/* castanets */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.4, 1, 0.4, 1] }}
        transition={{ delay: 1.0, duration: 2.4 }}
        className="absolute inset-x-0 top-10 text-center font-mono text-lg tracking-[0.4em] text-amber-200/90"
      >
        🥁 clack · clack · clack-clack-clack 🥁
      </motion.p>

      {/* OLÉ bursts */}
      {oles.map((ole, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, rotate: ole.rotate - 25, opacity: 0 }}
          animate={{ scale: [0, 1.4, 1], rotate: ole.rotate, opacity: 1 }}
          transition={{ delay: ole.delay, type: 'spring', stiffness: 260 }}
          className="absolute font-serif text-4xl font-black italic text-amber-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] sm:text-5xl"
          style={{ left: ole.x, top: ole.y }}
        >
          ¡OLÉ!
        </motion.span>
      ))}

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4, duration: 0.7 }}
        className="absolute inset-x-0 bottom-14 px-8 text-center font-serif text-2xl italic text-white sm:text-3xl"
      >
        El admin baila por sevillanas esta noche 💫
      </motion.p>
    </div>
  );
}

// ───────────────────────── Lottery shell ─────────────────────────

const THEME_COMPONENT: Record<Theme, () => JSX.Element> = {
  starwars: StarWarsIntro,
  bttf: BttfIntro,
  spiderman: SpiderIntro,
  batman: BatmanIntro,
  jurassic: JurassicIntro,
  flamenco: FlamencoIntro,
};

export default function AdminIntro() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [visible, setVisible] = useState(true);

  // Draw the lottery on mount (client-only to avoid hydration mismatch)
  useEffect(() => {
    const drawn = THEMES[Math.floor(Math.random() * THEMES.length)];
    setTheme(drawn);
    const timer = window.setTimeout(() => setVisible(false), DURATION[drawn]);
    return () => window.clearTimeout(timer);
  }, []);

  if (!theme) return null;
  const ThemeComponent = THEME_COMPONENT[theme];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="fixed inset-0 z-[100]"
          role="presentation"
        >
          <ThemeComponent />
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="absolute bottom-5 right-5 z-10 rounded-full border border-white/30 bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm transition-colors hover:bg-black/50 hover:text-white"
          >
            Saltar →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
