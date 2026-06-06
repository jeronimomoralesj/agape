import { ImageResponse } from 'next/og';
import { dbConnect } from '@/lib/db';
import BlogPost from '@/models/BlogPost';
import { absoluteUrl } from '@/lib/seo';

// Blog-post share card: cover image with branded overlay
export const alt = 'Blog de Ágape — Reflexiones y fe';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface LeanPost {
  title: string;
  image?: string;
}

export default async function BlogOgImage({ params }: { params: { id: string } }) {
  let post: LeanPost | null = null;
  try {
    await dbConnect();
    post = (await BlogPost.findById(params.id)
      .select('title image')
      .lean()) as LeanPost | null;
  } catch {
    /* fall through to branded fallback */
  }

  const title = post?.title ?? 'Reflexiones y fe';
  const rawImage = post?.image;
  const imageSrc = rawImage
    ? rawImage.startsWith('data:')
      ? rawImage
      : absoluteUrl(rawImage)
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: 'linear-gradient(160deg, #E0F2FE 0%, #BAE2FB 100%)',
        }}
      >
        {imageSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt=""
            width={1200}
            height={630}
            style={{
              position: 'absolute',
              width: 1200,
              height: 630,
              objectFit: 'cover',
            }}
          />
        )}
        {/* readability veil */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: imageSrc
              ? 'linear-gradient(180deg, rgba(9,23,64,0.25) 0%, rgba(9,23,64,0.78) 100%)'
              : 'transparent',
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: 72,
            width: '100%',
          }}
        >
          <div
            style={{
              fontSize: 24,
              letterSpacing: 10,
              fontWeight: 700,
              color: imageSrc ? '#E8CD6F' : '#A8862A',
            }}
          >
            BLOG ÁGAPE
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.15,
              color: imageSrc ? '#FFFFFF' : '#16306F',
              marginTop: 16,
              maxHeight: 230,
              overflow: 'hidden',
            }}
          >
            {title.length > 80 ? `${title.slice(0, 80)}…` : title}
          </div>
          <div
            style={{
              fontSize: 24,
              fontStyle: 'italic',
              color: imageSrc ? 'rgba(224,242,254,0.85)' : 'rgba(22,48,111,0.7)',
              marginTop: 22,
            }}
          >
            Amar como Dios nos ama · Salmo 147:3
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
