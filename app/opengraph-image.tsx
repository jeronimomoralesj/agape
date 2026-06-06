import { ImageResponse } from 'next/og';

// Branded share card for WhatsApp / Instagram / Facebook / Twitter previews
export const alt = 'Ágape — Pulseras Católicas de Cristal y Oro | Colombia';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(160deg, #E0F2FE 0%, #BAE2FB 100%)',
          position: 'relative',
        }}
      >
        {/* gold ring accents */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 380,
            height: 380,
            borderRadius: 9999,
            border: '3px solid rgba(212,175,55,0.45)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            left: -150,
            width: 420,
            height: 420,
            borderRadius: 9999,
            border: '3px solid rgba(212,175,55,0.35)',
          }}
        />

        <div
          style={{
            fontSize: 26,
            letterSpacing: 14,
            color: '#0E7490',
            fontWeight: 700,
          }}
        >
          AMAR COMO DIOS NOS AMA
        </div>

        <div
          style={{
            fontSize: 190,
            fontWeight: 700,
            color: '#1E3A8A',
            letterSpacing: 6,
            marginTop: 8,
            lineHeight: 1,
          }}
        >
          ÁGAPE
        </div>

        <div
          style={{
            width: 220,
            height: 4,
            background: 'linear-gradient(90deg, rgba(212,175,55,0) 0%, #D4AF37 50%, rgba(212,175,55,0) 100%)',
            marginTop: 28,
            marginBottom: 28,
          }}
        />

        <div style={{ fontSize: 30, color: '#16306F', fontStyle: 'italic' }}>
          “Él sana a los de corazón herido y venda sus heridas”
        </div>
        <div
          style={{
            fontSize: 22,
            letterSpacing: 8,
            color: '#A8862A',
            fontWeight: 700,
            marginTop: 12,
          }}
        >
          SALMO 147:3 · PULSERAS DE CRISTAL Y ORO
        </div>
      </div>
    ),
    { ...size }
  );
}
