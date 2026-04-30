import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Uplatnica QR — generiši NBS IPS QR online, besplatno i bez naloga';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BG = '#fdfcf8';
const FG = '#0f1a30';
const BRAND = '#1c9d5d';
const BRAND_SOFT = 'rgba(28, 157, 93, 0.14)';
const MUTED = '#5b6478';

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: `radial-gradient(circle at 85% 15%, ${BRAND_SOFT}, transparent 55%), ${BG}`,
        padding: 80,
        fontFamily: 'sans-serif',
        color: FG,
        position: 'relative',
      }}
    >
      {/* Top bar: brand + badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: FG,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <div style={{ display: 'flex', flex: 1, gap: 4 }}>
              <div style={{ flex: 1, background: BRAND, borderRadius: 4 }} />
              <div style={{ flex: 1, background: BRAND, borderRadius: 4 }} />
            </div>
            <div style={{ display: 'flex', flex: 1, gap: 4 }}>
              <div style={{ flex: 1, background: BRAND, borderRadius: 4 }} />
              <div style={{ flex: 1, background: 'transparent' }} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>
            Uplatnica<span style={{ color: BRAND }}>.</span>
          </span>
          <span
            style={{
              fontSize: 14,
              color: MUTED,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            NBS IPS QR
          </span>
        </div>
      </div>

      {/* Main headline */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          marginTop: 'auto',
          marginBottom: 28,
          maxWidth: 880,
        }}
      >
        <h1
          style={{
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: -2.5,
            lineHeight: 1.04,
            margin: 0,
          }}
        >
          Plati račun u Srbiji za <span style={{ color: BRAND }}>2 sekunde</span>.
        </h1>
        <p
          style={{
            fontSize: 28,
            color: MUTED,
            lineHeight: 1.35,
            margin: 0,
            maxWidth: 820,
          }}
        >
          Sačuvaj uplatnice. Generiši NBS IPS QR. Skeniraj sa svake srpske mBank aplikacije.
        </p>
      </div>

      {/* Footer chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {['Besplatno', 'Bez naloga', 'PWA · radi offline', 'Sve banke'].map((label) => (
          <div
            key={label}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 18px',
              borderRadius: 999,
              background: BRAND_SOFT,
              color: BRAND,
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>,
    { ...size }
  );
}
