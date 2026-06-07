/**
 * "Crea tu pulsera" — shared option catalog.
 * Imported by the configurator UI AND the orders API, so prices and
 * options are always validated server-side from this single source.
 */

export interface BeadOption {
  id: string;
  name: string;
  hex: string;
  /** true for translucent/light beads that need a visible rim */
  light?: boolean;
}

export interface CordOption {
  id: string;
  name: string;
  hex: string;
}

export interface CharmOption {
  id: string;
  name: string;
  description: string;
}

export const CUSTOM_PRICE = 85000; // COP — fixed server-side

export const BEADS: BeadOption[] = [
  { id: 'esmeralda', name: 'Esmeralda Profunda', hex: '#025928' },
  { id: 'peridoto', name: 'Verde Oliva Claro', hex: '#6BB343' },
  { id: 'selva', name: 'Verde Selva Viva', hex: '#0D7F25' },
  { id: 'celestial', name: 'Azul Celestial', hex: '#7A9FE6' },
  { id: 'nocturno', name: 'Misterio Nocturno', hex: '#1A1126' },
  { id: 'turquesa', name: 'Turquesa Profunda', hex: '#0D6E6B' },
  { id: 'onix', name: 'Ónix Facetado', hex: '#1C1616' },
  { id: 'cobre', name: 'Cobre Ahumado', hex: '#7E594B' },
  { id: 'nacar', name: 'Nácar Alabastro', hex: '#ECE2D0', light: true },
  { id: 'champana', name: 'Champaña Suave', hex: '#EBD4BE', light: true },
  { id: 'ambar', name: 'Ámbar Sagrado', hex: '#732911' },
  { id: 'opalina', name: 'Opalina Glacial', hex: '#D5E4EB', light: true },
  { id: 'cristal', name: 'Cristal Puro', hex: '#F0F3F5', light: true },
  { id: 'blanco', name: 'Blanco Macizo', hex: '#F9FAFA', light: true },
];

export const CORDS: CordOption[] = [
  { id: 'crema', name: 'Crema', hex: '#E3D5BC' },
  { id: 'rosa-viejo', name: 'Rosa Viejo', hex: '#B37D8E' },
  { id: 'verde-oliva', name: 'Verde Oliva', hex: '#536643' },
];

export const CHARMS: CharmOption[] = [
  {
    id: 'milagrosa',
    name: 'Virgen Milagrosa',
    description: 'Medalla ovalada de la Virgen con crucifijo colgante',
  },
  {
    id: 'benito',
    name: 'San Benito',
    description: 'Medalla redonda de San Benito con crucifijo colgante',
  },
  {
    id: 'corazon',
    name: 'Sagrado Corazón',
    description: 'Dije de corazón sagrado con crucifijo colgante',
  },
];

export const GOLD = '#D4AF37';
export const GOLD_LIGHT = '#E8CD6F';
export const GOLD_DEEP = '#A8862A';

export interface CustomConfig {
  beadId: string;
  cordId: string;
  charmId: string;
}

export function findBead(id: string): BeadOption | undefined {
  return BEADS.find((b) => b.id === id);
}
export function findCord(id: string): CordOption | undefined {
  return CORDS.find((c) => c.id === id);
}
export function findCharm(id: string): CharmOption | undefined {
  return CHARMS.find((c) => c.id === id);
}

export function customProductId(config: CustomConfig): string {
  return `custom-${config.beadId}-${config.cordId}-${config.charmId}`;
}

export function customTitle(config: CustomConfig): string {
  const bead = findBead(config.beadId);
  const cord = findCord(config.cordId);
  const charm = findCharm(config.charmId);
  return `Pulsera Personalizada — ${bead?.name ?? ''} · Cordón ${cord?.name ?? ''} · ${charm?.name ?? ''}`;
}

/** Tiny inline SVG thumbnail for the cart (bead + gold cross on sky blue). */
export function customCartImage(beadHex: string, cordHex: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#E0F2FE"/><circle cx="40" cy="40" r="30" fill="none" stroke="${cordHex}" stroke-width="3"/><circle cx="40" cy="10" r="7" fill="${beadHex}"/><circle cx="61" cy="19" r="7" fill="${beadHex}"/><circle cx="70" cy="40" r="7" fill="${beadHex}"/><circle cx="61" cy="61" r="7" fill="${beadHex}"/><circle cx="19" cy="61" r="7" fill="${beadHex}"/><circle cx="10" cy="40" r="7" fill="${beadHex}"/><circle cx="19" cy="19" r="7" fill="${beadHex}"/><rect x="37" y="56" width="6" height="20" rx="2" fill="${GOLD}"/><rect x="30" y="61" width="20" height="6" rx="2" fill="${GOLD}"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
