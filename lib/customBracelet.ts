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

export const CUSTOM_PRICE = 22000; // COP — fixed server-side

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

export const GOLD = '#D4AF37';
export const GOLD_LIGHT = '#E8CD6F';
export const GOLD_DEEP = '#A8862A';

/** Up to this many pepa colors can be combined in one bracelet */
export const MAX_BEAD_COLORS = 4;

export interface CustomConfig {
  /** Selected pepa colors, in order (alternated along the strand) */
  beadIds: string[];
  cordId: string;
}

export function findBead(id: string): BeadOption | undefined {
  return BEADS.find((b) => b.id === id);
}
export function findCord(id: string): CordOption | undefined {
  return CORDS.find((c) => c.id === id);
}

export function customProductId(config: CustomConfig): string {
  return `custom-${config.beadIds.join('.')}-${config.cordId}`;
}

export function customTitle(
  config: CustomConfig,
  /** Resolve a bead id to its name — defaults to the static palette, but the
   *  orders API passes a resolver backed by the admin-managed colors. */
  resolveBead: (id: string) => { name?: string } | undefined = findBead
): string {
  const beads = config.beadIds
    .map((id) => resolveBead(id)?.name)
    .filter(Boolean)
    .join(' + ');
  const cord = findCord(config.cordId);
  return `Pulsera Personalizada — Pepas ${beads} · Cordón ${cord?.name ?? ''}`;
}

/** Tiny inline SVG thumbnail for the cart (pepas + gold cross on sky blue). */
export function customCartImage(beadHexes: string[], cordHex: string): string {
  const positions = [
    [40, 10], [61, 19], [70, 40], [61, 61], [19, 61], [10, 40], [19, 19],
  ];
  const circles = positions
    .map(
      ([x, y], i) =>
        `<circle cx="${x}" cy="${y}" r="7" fill="${beadHexes[i % beadHexes.length] ?? '#EBD4BE'}"/>`
    )
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#E0F2FE"/><circle cx="40" cy="40" r="30" fill="none" stroke="${cordHex}" stroke-width="3"/>${circles}<rect x="37" y="56" width="6" height="20" rx="2" fill="${GOLD}"/><rect x="30" y="61" width="20" height="6" rx="2" fill="${GOLD}"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
