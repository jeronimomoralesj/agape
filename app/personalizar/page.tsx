import type { Metadata } from 'next';
import BraceletStudio from '@/components/personalizar/BraceletStudio';
import JsonLd from '@/components/seo/JsonLd';
import { Reveal } from '@/components/motion/Reveal';
import { SITE_URL, breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Crea tu Pulsera Personalizada',
  description:
    'Diseña tu propia pulsera católica: elige el color del cristal, el cordón ajustable y el dije central (Virgen Milagrosa, San Benito o Sagrado Corazón). Hecha a mano en Colombia.',
  alternates: { canonical: '/personalizar' },
};

export default function PersonalizarPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Tienda', url: SITE_URL },
          { name: 'Crea tu pulsera', url: `${SITE_URL}/personalizar` },
        ])}
      />

      <Reveal className="text-center">
        <p className="section-eyebrow">Taller Ágape</p>
        <h1 className="mx-auto mt-4 max-w-2xl text-balance font-serif text-4xl font-bold leading-tight text-royal sm:text-5xl">
          Crea tu propia <span className="italic text-oro-deep">pulsera</span>
        </h1>
        <div className="gold-divider mt-6" />
        <p className="mx-auto mt-5 max-w-xl text-balance text-royal/65">
          Elige cada detalle — el cristal, el cordón y el dije — y nosotros la ensamblamos
          a mano, cuenta a cuenta, como una oración hecha solo para ti.
        </p>
      </Reveal>

      <div className="mt-12">
        <BraceletStudio />
      </div>
    </div>
  );
}
