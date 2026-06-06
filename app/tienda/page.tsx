import { redirect } from 'next/navigation';

// The shop now lives on the homepage — keep old links working.
export default function TiendaPage() {
  redirect('/');
}
