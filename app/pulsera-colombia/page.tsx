import type { Metadata } from 'next';
import ColombiaStudio from '@/components/personalizar/ColombiaStudio';
import JsonLd from '@/components/seo/JsonLd';
import { Reveal } from '@/components/motion/Reveal';
import { SITE_URL, breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Pulsera Colombia — Edición Limitada Mundial 2026',
  description:
    'Pulsera tricolor con la bandera de Colombia (amarillo, azul y rojo) y pepitas separadoras blancas o negras. Con Virgen Milagrosa y crucifijo, hecha a mano. Edición limitada hasta el final del Mundial 2026.',
  alternates: { canonical: '/pulsera-colombia' },
};

export default function PulseraColombiaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Tienda', url: SITE_URL },
          { name: 'Pulsera Colombia', url: `${SITE_URL}/pulsera-colombia` },
        ])}
      />

      <Reveal className="text-center">
        <p className="section-eyebrow">Edición limitada · Mundial 2026</p>
        <h1 className="mx-auto mt-4 max-w-2xl text-balance font-serif text-4xl font-bold leading-tight text-royal sm:text-5xl">
          Pulsera <span className="italic text-oro-deep">Colombia</span> 🇨🇴
        </h1>
        <div className="gold-divider mt-6" />
        <p className="mx-auto mt-5 max-w-xl text-balance text-royal/65">
          Lleva la bandera puesta: amarillo, azul y rojo, con pepitas separadoras
          blancas o negras a tu gusto. La ensamblamos a mano con la Virgen
          Milagrosa y su crucifijo. Solo hasta el final del Mundial 2026.
        </p>
      </Reveal>

      <div className="mt-12">
        <ColombiaStudio />
      </div>
    </div>
  );
}
