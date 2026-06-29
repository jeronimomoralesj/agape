import type { Metadata } from 'next';
import NombresStudio from '@/components/personalizar/NombresStudio';
import JsonLd from '@/components/seo/JsonLd';
import { Reveal } from '@/components/motion/Reveal';
import { SITE_URL, breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Crea tu Collar de Nombres Personalizado',
  description:
    'Diseña un collar con los nombres de quienes amas: hasta 5 nombres en cuentas de letras, con pepas de colores y cuentas plateadas o doradas. Hecho a mano en Colombia.',
  alternates: { canonical: '/collar-nombres' },
};

export default function CollarNombresPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Tienda', url: SITE_URL },
          { name: 'Collar de Nombres', url: `${SITE_URL}/collar-nombres` },
        ])}
      />

      <Reveal className="text-center">
        <p className="section-eyebrow">Taller Ágape</p>
        <h1 className="mx-auto mt-4 max-w-2xl text-balance font-serif text-4xl font-bold leading-tight text-royal sm:text-5xl">
          Crea tu <span className="italic text-oro-deep">collar de nombres</span>
        </h1>
        <div className="gold-divider mt-6" />
        <p className="mx-auto mt-5 max-w-xl text-balance text-royal/65">
          Escribe los nombres de quienes llevas en el corazón — hasta cinco — y
          elige los colores de tus pepas. Lo tejemos a mano, letra por letra,
          como un abrazo que se lleva puesto.
        </p>
      </Reveal>

      <div className="mt-12">
        <NombresStudio />
      </div>
    </div>
  );
}
