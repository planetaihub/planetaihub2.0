export type PlayableVideoSource =
  | { kind: 'youtube'; embedUrl: string; videoId: string }
  | { kind: 'vimeo'; embedUrl: string; videoId: string }
  | { kind: 'html5'; src: string };

/**
 * Extracts a privacy-enhanced YouTube embed URL, Vimeo embed URL, or direct HTML5 video URL
 * from a user- or employer-provided video URL string.
 */
export function parsePlayableVideoSource(
  rawUrl: string
): PlayableVideoSource | null {
  const trimmed = rawUrl.trim();
  if (!trimmed || !/^https?:\/\//i.test(trimmed)) return null;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./i, '').toLowerCase();

    if (
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'youtube-nocookie.com'
    ) {
      let videoId = parsed.searchParams.get('v') || '';
      if (!videoId && parsed.pathname.startsWith('/embed/')) {
        videoId = parsed.pathname.replace('/embed/', '').split('/')[0];
      }
      if (!videoId && parsed.pathname.startsWith('/shorts/')) {
        videoId = parsed.pathname.replace('/shorts/', '').split('/')[0];
      }
      if (videoId && /^[a-zA-Z0-9_-]{6,20}$/.test(videoId)) {
        return {
          kind: 'youtube',
          videoId,
          embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`,
        };
      }
    }

    if (host === 'youtu.be') {
      const videoId = parsed.pathname.replace(/^\//, '').split('/')[0];
      if (videoId && /^[a-zA-Z0-9_-]{6,20}$/.test(videoId)) {
        return {
          kind: 'youtube',
          videoId,
          embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`,
        };
      }
    }

    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const match = parsed.pathname.match(/\/(\d+)/);
      if (match?.[1]) {
        return {
          kind: 'vimeo',
          videoId: match[1],
          embedUrl: `https://player.vimeo.com/video/${match[1]}`,
        };
      }
    }

    if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(parsed.pathname)) {
      return {
        kind: 'html5',
        src: trimmed,
      };
    }

    // Allow generic direct video streams (e.g. CDN video URLs without extension)
    if (
      parsed.pathname.includes('/video') ||
      parsed.searchParams.has('mime')
    ) {
      return {
        kind: 'html5',
        src: trimmed,
      };
    }
  } catch {
    return null;
  }

  return null;
}
