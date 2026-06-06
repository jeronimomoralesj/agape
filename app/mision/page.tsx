import type { Metadata } from 'next';
import Link from 'next/link';
import { Flame, HandHeart, Sparkles } from 'lucide-react';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/motion/Reveal';

export const metadata: Metadata = {
  title: 'Nuestra Misión — Paz para el corazón',
  description:
    'La misión de Ágape: ayudar a cada persona a encontrar la paz en su corazón y llevar la Palabra de Dios al mundo, una pulsera a la vez. Amar como Dios nos ama.',
  alternates: { canonical: '/mision' },
};

const PILLARS = [
  {
    icon: <HandHeart className="h-6 w-6" strokeWidth={1.5} />,
    title: 'Sanar',
    text: 'Creemos que todo corazón herido puede volver a latir en paz. Cada pulsera nace como un pequeño recordatorio, tibio sobre la piel, de que no caminas solo: hay un Amor que sostiene, que venda heridas y que nunca se cansa de esperar.',
  },
  {
    icon: <Flame className="h-6 w-6" strokeWidth={1.5} />,
    title: 'Anunciar',
    text: 'Queremos llevar la Palabra de Dios a donde las palabras no siempre llegan: a la muñeca que escribe, que trabaja, que saluda, que consuela. Que cada cristal sea una chispa que encienda conversaciones sobre la fe y siembre luz en lo cotidiano.',
  },
  {
    icon: <Sparkles className="h-6 w-6" strokeWidth={1.5} />,
    title: 'Acompañar',
    text: 'El rosario es un camino que se recorre cuenta a cuenta, día a día. Nuestras piezas guardan ese ritmo de oración para que llevarlas sea, en sí mismo, una manera silenciosa de rezar: en el bus, en la espera, en la alegría y en la tormenta.',
  },
];

export default function MisionPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-14 sm:px-6">
      {/* Hero */}
      <Reveal className="text-center">
        <p className="section-eyebrow">Nuestra misión</p>
        <h1 className="mx-auto mt-4 max-w-2xl text-balance font-serif text-4xl font-bold leading-tight text-royal sm:text-5xl">
          Paz para el corazón,{' '}
          <span className="italic text-oro-deep">luz para el camino</span>
        </h1>
        <div className="gold-divider mt-7" />
      </Reveal>

      {/* Manifesto */}
      <Reveal delay={0.1}>
        <div className="mx-auto mt-10 max-w-2xl space-y-6 text-center font-serif text-lg leading-relaxed text-royal/80 sm:text-xl">
          <p>
            Ágape existe por una certeza sencilla y enorme:{' '}
            <strong className="text-royal">
              toda persona merece encontrar la paz en su corazón
            </strong>
            . En un mundo que corre, que grita, que exige, nosotros elegimos lo pequeño:
            un hilo, unos cristales, una cruz — y la oración que cabe en una muñeca.
          </p>
          <p>
            Nuestra misión es doble, como las dos manos que se juntan para orar: ayudar a
            sanar los corazones heridos y{' '}
            <strong className="text-royal">esparcir la Palabra de Dios</strong> con
            belleza, con dulzura, sin imponerla — dejándola brillar.
          </p>
          <p className="italic text-royal/60">
            Porque amar como Dios nos ama no es un eslogan: es un oficio que se aprende
            todos los días, cuenta a cuenta, persona a persona.
          </p>
        </div>
      </Reveal>

      {/* Pillars */}
      <StaggerGroup className="mt-16 grid gap-6 sm:grid-cols-3">
        {PILLARS.map((pillar) => (
          <StaggerItem key={pillar.title}>
            <div className="flex h-full flex-col items-center rounded-3xl border border-oro/20 bg-white/75 p-8 text-center shadow-card">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-oro-light to-oro text-royal-ink shadow-aura-soft">
                {pillar.icon}
              </span>
              <h2 className="mt-5 font-serif text-2xl font-bold text-royal">
                {pillar.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-royal/70">{pillar.text}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* Verse band */}
      <Reveal delay={0.1}>
        <div className="relative mt-16 overflow-hidden rounded-[2.5rem] bg-royal-radial px-8 py-14 text-center text-cielo-100 sm:px-16">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-oro to-transparent" />
          <div className="pointer-events-none absolute -top-20 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-oro/15 blur-3xl" />
          <p className="relative font-serif text-2xl italic leading-relaxed sm:text-3xl">
            “Él sana a los de corazón herido
            <span className="block">y venda sus heridas”</span>
          </p>
          <p className="relative mt-5 text-xs font-semibold uppercase tracking-[0.4em] text-oro-light">
            Salmo 147:3
          </p>
        </div>
      </Reveal>

      {/* Promise + CTA */}
      <Reveal delay={0.1} className="mt-16 text-center">
        <p className="mx-auto max-w-xl text-balance leading-relaxed text-royal/70">
          Si una de nuestras pulseras llega a tus manos, recibirás algo más que una joya:
          recibirás una oración hecha objeto, un abrazo que se puede llevar puesto. Y si
          algún día alguien te pregunta por ella, habrás cumplido nuestra misión contigo:
          la Palabra habrá viajado un corazón más lejos.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/" className="btn-gold">
            Conocer la colección
          </Link>
          <Link href="/#guia-rosario" className="btn-ghost">
            Aprender a rezar el Rosario
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
