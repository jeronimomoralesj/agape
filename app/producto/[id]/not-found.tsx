import Link from 'next/link';

export default function ProductoNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-6 text-center">
      <p className="section-eyebrow">404</p>
      <h1 className="font-serif text-4xl font-bold text-royal">
        Esta pieza ya no está disponible
      </h1>
      <p className="max-w-md text-royal/65">
        Puede que se haya agotado o retirado de la colección. Te invitamos a descubrir
        las demás pulseras.
      </p>
      <Link href="/tienda" className="btn-gold mt-2">
        Volver a la tienda
      </Link>
    </div>
  );
}
