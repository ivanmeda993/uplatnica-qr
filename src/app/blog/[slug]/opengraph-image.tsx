import { ImageResponse } from 'next/og';

import { getPostBySlug } from '@/lib/blog/posts';

export const alt = 'Uplatnica QR — članak';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const BG = '#fdfcf8';
const FG = '#0f1a30';
const BRAND = '#1c9d5d';
const BRAND_SOFT = 'rgba(28, 157, 93, 0.14)';
const MUTED = '#5b6478';

interface PageProps {
  params: { slug: string };
}

export default async function BlogOgImage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);
  const title = post?.title ?? 'Članak';
  const category = post?.category ?? 'Vodič';

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: `radial-gradient(circle at 90% 10%, ${BRAND_SOFT}, transparent 60%), ${BG}`,
        padding: 80,
        fontFamily: 'sans-serif',
        color: FG,
      }}
    >
      {/* Top */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: FG,
            display: 'flex',
            padding: 8,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 4 }}>
            <div style={{ display: 'flex', flex: 1, gap: 4 }}>
              <div style={{ flex: 1, background: BRAND, borderRadius: 3 }} />
              <div style={{ flex: 1, background: BRAND, borderRadius: 3 }} />
            </div>
            <div style={{ display: 'flex', flex: 1, gap: 4 }}>
              <div style={{ flex: 1, background: BRAND, borderRadius: 3 }} />
              <div style={{ flex: 1, background: 'transparent' }} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 22, fontWeight: 700 }}>
            Uplatnica<span style={{ color: BRAND }}>.</span>
          </span>
          <span style={{ fontSize: 12, color: MUTED, letterSpacing: 1.5 }}>
            {category.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          display: 'flex',
          marginTop: 'auto',
          marginBottom: 24,
        }}
      >
        <h1
          style={{
            fontSize: title.length > 60 ? 58 : 72,
            fontWeight: 700,
            letterSpacing: -1.5,
            lineHeight: 1.08,
            margin: 0,
            maxWidth: 1000,
          }}
        >
          {title}
        </h1>
      </div>

      {/* Footer chip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 22px',
          borderRadius: 999,
          background: BRAND_SOFT,
          color: BRAND,
          fontSize: 18,
          fontWeight: 600,
          alignSelf: 'flex-start',
        }}
      >
        uplatnica-qr · blog
      </div>
    </div>,
    { ...size }
  );
}
