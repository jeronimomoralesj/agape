import type { Metadata } from 'next';
import Link from 'next/link';
import { Cookie, Database, Eye, Lock, Mail, UserCheck } from 'lucide-react';
import { Reveal, StaggerGroup, StaggerItem } from '@/components/motion/Reveal';

export const metadata: Metadata = {
  title: 'Política de Privacidad y Tratamiento de Datos',
  description:
    'Política de privacidad de Ágape: qué datos personales recolectamos, para qué los usamos y cómo ejercer tus derechos de habeas data según la Ley 1581 de 2012.',
  alternates: { canonical: '/privacidad' },
};

const SECTIONS = [
  {
    icon: <Database className="h-5 w-5" strokeWidth={1.75} />,
    title: '1. Qué datos recolectamos',
    body: (
      <>
        <p>Solo pedimos los datos necesarios para entregar tu pedido:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong>Al comprar:</strong> nombre completo, correo electrónico, teléfono y
            dirección de envío.
          </li>
          <li>
            <strong>Al navegar:</strong> tu carrito se guarda únicamente en tu propio
            dispositivo (almacenamiento local del navegador) y un contador anónimo de
            visitas por producto, sin identificarte.
          </li>
        </ul>
        <p className="mt-3">
          No recolectamos datos sensibles, no usamos cookies publicitarias de terceros y
          no almacenamos información de tarjetas de pago.
        </p>
      </>
    ),
  },
  {
    icon: <Eye className="h-5 w-5" strokeWidth={1.75} />,
    title: '2. Para qué los usamos',
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Procesar, confirmar y entregar tu pedido.</li>
        <li>Contactarte por WhatsApp o correo sobre el estado de tu compra.</li>
        <li>Atender cambios, devoluciones y garantías.</li>
        <li>Cumplir obligaciones legales y contables.</li>
      </ul>
    ),
  },
  {
    icon: <Lock className="h-5 w-5" strokeWidth={1.75} />,
    title: '3. Cómo los protegemos',
    body: (
      <p>
        Tus datos se almacenan en bases de datos cifradas en tránsito y en reposo (MongoDB
        Atlas) con acceso restringido. <strong>Nunca vendemos, alquilamos ni compartimos</strong>{' '}
        tu información con terceros, salvo la transportadora encargada de entregar tu
        pedido (que recibe únicamente nombre, teléfono y dirección) o cuando una autoridad
        competente lo exija.
      </p>
    ),
  },
  {
    icon: <UserCheck className="h-5 w-5" strokeWidth={1.75} />,
    title: '4. Tus derechos (habeas data)',
    body: (
      <>
        <p>
          Conforme a la <strong>Ley 1581 de 2012</strong> y el Decreto 1377 de 2013, como
          titular de tus datos puedes en cualquier momento:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Conocer, actualizar y rectificar tus datos personales.</li>
          <li>Solicitar prueba de la autorización otorgada para su tratamiento.</li>
          <li>Ser informado sobre el uso que se les ha dado.</li>
          <li>Revocar la autorización y/o solicitar la supresión de tus datos.</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).</li>
        </ul>
      </>
    ),
  },
  {
    icon: <Cookie className="h-5 w-5" strokeWidth={1.75} />,
    title: '5. Almacenamiento local (carrito)',
    body: (
      <p>
        Usamos el almacenamiento local de tu navegador únicamente para recordar los
        productos de tu carrito entre visitas. Esta información vive en tu dispositivo,
        no se envía a nuestros servidores hasta que confirmas tu pedido y puedes borrarla
        en cualquier momento limpiando los datos de navegación.
      </p>
    ),
  },
  {
    icon: <Mail className="h-5 w-5" strokeWidth={1.75} />,
    title: '6. Cómo ejercer tus derechos',
    body: (
      <p>
        Escríbenos a <strong>hola@agape.com.co</strong> o por Instagram{' '}
        <strong>@agape.pulseras</strong> indicando tu solicitud (consulta, actualización,
        supresión o revocatoria). Respondemos consultas en máximo{' '}
        <strong>10 días hábiles</strong> y reclamos en máximo <strong>15 días hábiles</strong>,
        según los términos de ley. Responsable del tratamiento: Ágape, Colombia.
      </p>
    ),
  },
];

export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-14 sm:px-6">
      <Reveal className="text-center">
        <p className="section-eyebrow">Tu confianza es sagrada</p>
        <h1 className="mt-4 font-serif text-4xl font-bold text-royal sm:text-5xl">
          Política de Privacidad
        </h1>
        <div className="gold-divider mt-6" />
        <p className="mx-auto mt-5 max-w-xl text-balance text-royal/65">
          Tratamos tus datos personales con el mismo cuidado con el que elaboramos cada
          pulsera, cumpliendo la Ley 1581 de 2012 de protección de datos de Colombia.
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
        <p className="text-xs text-royal/50">
          Última actualización: junio de 2026 · Cualquier cambio a esta política será
          publicado en esta misma página.
        </p>
        <Link href="/" className="btn-gold mt-6">
          Volver a la tienda
        </Link>
      </Reveal>
    </div>
  );
}
