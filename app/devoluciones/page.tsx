import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, HeartHandshake, Mail, PackageCheck, RefreshCcw, ShieldCheck } from 'lucide-react';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/motion/Reveal';

export const metadata: Metadata = {
  title: 'Política de Cambios y Devoluciones',
  description:
    'Política de cambios y devoluciones de Ágape: derecho de retracto de 5 días hábiles, garantía de 30 días por defectos de fabricación y proceso simple por WhatsApp o correo.',
  alternates: { canonical: '/devoluciones' },
};

const SECTIONS = [
  {
    icon: <RefreshCcw className="h-5 w-5" strokeWidth={1.75} />,
    title: '1. Derecho de retracto (5 días hábiles)',
    body: (
      <>
        <p>
          De acuerdo con el Estatuto del Consumidor colombiano (Ley 1480 de 2011), puedes
          ejercer tu derecho de retracto dentro de los{' '}
          <strong>5 días hábiles siguientes a la entrega</strong> de tu pedido, sin
          necesidad de justificación.
        </p>
        <p className="mt-3">
          Para que el retracto sea válido, la pulsera debe estar <strong>sin uso</strong>,
          en perfecto estado y con su empaque original. El valor pagado se reembolsa en su
          totalidad; el costo del envío de retorno corre por cuenta del cliente.
        </p>
      </>
    ),
  },
  {
    icon: <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />,
    title: '2. Garantía por defectos (30 días)',
    body: (
      <>
        <p>
          Cada pulsera Ágape es ensamblada a mano y revisada antes de enviarse. Si aun así
          recibes una pieza con un <strong>defecto de fabricación</strong> (cristales
          sueltos, broche defectuoso, baño de oro con imperfecciones), tienes{' '}
          <strong>30 días calendario</strong> desde la entrega para solicitar el cambio.
        </p>
        <p className="mt-3">
          En estos casos <strong>Ágape asume todos los costos de envío</strong> y te
          enviamos una pieza nueva. Si no hay disponibilidad, reembolsamos el valor total.
        </p>
      </>
    ),
  },
  {
    icon: <PackageCheck className="h-5 w-5" strokeWidth={1.75} />,
    title: '3. Condiciones del producto',
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>La pulsera no debe presentar señales de uso, golpes ni alteraciones.</li>
        <li>Debe devolverse con su empaque original.</li>
        <li>
          El desgaste natural por el uso diario, el contacto con agua, perfumes o
          productos químicos no constituye defecto de fabricación.
        </li>
        <li>Las piezas personalizadas solo tienen cambio por defecto de fabricación.</li>
      </ul>
    ),
  },
  {
    icon: <Mail className="h-5 w-5" strokeWidth={1.75} />,
    title: '4. Cómo solicitar un cambio o devolución',
    body: (
      <>
        <p>Escríbenos dentro del plazo correspondiente con:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            Tu <strong>número de orden</strong> (lo recibiste al confirmar tu pedido, p.
            ej. <span className="font-mono text-sm">AGP-XXXXXX</span>).
          </li>
          <li>Fotos de la pieza y del empaque.</li>
          <li>El motivo de la solicitud.</li>
        </ul>
        <p className="mt-3">
          Canales: correo <strong>hola@agape.com.co</strong> o nuestro WhatsApp e
          Instagram <strong>@agape.pulseras</strong>. Respondemos en máximo 2 días
          hábiles con las instrucciones de envío.
        </p>
      </>
    ),
  },
  {
    icon: <Clock className="h-5 w-5" strokeWidth={1.75} />,
    title: '5. Reembolsos',
    body: (
      <p>
        Una vez recibida y verificada la pieza, procesamos el reembolso en un plazo máximo
        de <strong>10 días hábiles</strong>, por el mismo medio de pago utilizado en la
        compra o por transferencia bancaria si pagaste contra entrega.
      </p>
    ),
  },
];

export default function DevolucionesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-14 sm:px-6">
      <Reveal className="text-center">
        <p className="section-eyebrow">Compra con tranquilidad</p>
        <h1 className="mt-4 font-serif text-4xl font-bold text-royal sm:text-5xl">
          Cambios y Devoluciones
        </h1>
        <div className="gold-divider mt-6" />
        <p className="mx-auto mt-5 max-w-xl text-balance text-royal/65">
          Queremos que tu pulsera te acompañe por mucho tiempo. Si algo no salió como
          esperabas, lo resolvemos con amor y sin complicaciones.
        </p>
      </Reveal>

      <StaggerGroup className="mt-14 space-y-6">
        {SECTIONS.map((section) => (
          <StaggerItem key={section.title}>
            <section className="rounded-3xl border border-oro/20 bg-white/75 p-6 shadow-card sm:p-8">
              <h2 className="flex items-center gap-3 font-serif text-xl font-bold text-royal sm:text-2xl">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-oro/15 text-oro-deep">
                  {section.icon}
                </span>
                {section.title}
              </h2>
              <div className="mt-4 text-sm leading-relaxed text-royal/70 sm:text-base">
                {section.body}
              </div>
            </section>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <Reveal delay={0.1} className="mt-14 text-center">
        <div className="rounded-3xl border border-oro/25 bg-oro/10 p-8">
          <HeartHandshake className="mx-auto h-8 w-8 text-oro-deep" strokeWidth={1.5} />
          <p className="mt-4 font-serif text-lg italic text-royal">
            “Él sana a los de corazón herido y venda sus heridas” — Salmo 147:3
          </p>
          <p className="mt-2 text-sm text-royal/60">
            ¿Tienes dudas? Escríbenos a hola@agape.com.co — estamos para servirte.
          </p>
          <Link href="/" className="btn-gold mt-6">
            Volver a la tienda
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
