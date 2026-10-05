import React from 'react';

const DEFAULT_FAVICON_SIZE = 256;

interface LinkCardProps {
  children: React.ReactNode;
  image?: string;
}

type ImageKind = 'preview' | 'logo';
type CardImage = { url: string; kind: ImageKind; score: number };

const getAttribute = (tag: string, name: string) =>
  tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'))?.[2] || '';

const getMeta = (html: string, attribute: 'name' | 'property', value: string) => {
  const tag = (html.match(/<meta\b[^>]*>/gi) || [])
    .find(tag => getAttribute(tag, attribute).toLowerCase() === value.toLowerCase());
  return tag ? getAttribute(tag, 'content') : '';
};

const decodeHtml = (value: string) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const resolveUrl = (value: string, baseUrl: string) => {
  try { return new URL(decodeHtml(value), baseUrl).toString(); } catch { return ''; }
};

const isLogoLike = (value: string) => /logo|brand|favicon|app[-_]?icon|(?:^|[-_/])icon(?:[.\-_/]|$)/i.test(value);

const getBestSrcset = (tag: string) => {
  const srcset = getAttribute(tag, 'srcset') || getAttribute(tag, 'data-srcset');
  if (!srcset) return { url: '', size: 0 };

  return srcset.split(',').reduce((best, candidate) => {
    const [url, descriptor = ''] = candidate.trim().split(/\s+/);
    const match = descriptor.match(/^(\d+(?:\.\d+)?)(w|x)$/);
    const size = match ? Number(match[1]) * (match[2] === 'x' ? 512 : 1) : 0;
    return url && size > best.size ? { url, size } : best;
  }, { url: '', size: 0 });
};

const getPageImage = (html: string): CardImage | null => {
  let best: CardImage | null = null;

  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    const srcset = getBestSrcset(tag);
    const src = srcset.url
      || getAttribute(tag, 'src')
      || getAttribute(tag, 'data-src')
      || getAttribute(tag, 'data-lazy-src');
    if (!src || /^(?:data:|blob:)/i.test(src)) continue;

    const text = `${src} ${getAttribute(tag, 'alt')} ${getAttribute(tag, 'class')} ${getAttribute(tag, 'id')}`.toLowerCase();
    if (/badge|shields\.io|tracking|tracker|analytics|pixel|1x1/.test(text)) continue;

    const width = Number.parseInt(getAttribute(tag, 'width'), 10) || 0;
    const height = Number.parseInt(getAttribute(tag, 'height'), 10) || 0;
    const size = Math.max(width, height, srcset.size);
    if (width && height && width <= 64 && height <= 64) continue;

    const kind: ImageKind = isLogoLike(text) ? 'logo' : 'preview';
    const semanticScore = /hero|banner|cover/.test(text) ? 4000
      : /screenshot|preview/.test(text) ? 3500
      : kind === 'logo' ? 3000
      : 0;
    const isSvg = src.split(/[?#]/)[0].toLowerCase().endsWith('.svg');
    if (!semanticScore && size < 256 && !isSvg) continue;

    const candidate = { url: src, kind, score: semanticScore + Math.min(size || (isSvg ? 512 : 0), 2000) };
    if (!best || candidate.score > best.score) best = candidate;
  }

  return best;
};

const getSiteIcon = (html: string): CardImage | null => {
  const links = html.match(/<link\b[^>]*>/gi) || [];

  const appleIcon = links.find(tag => getAttribute(tag, 'rel').toLowerCase().includes('apple-touch-icon'));
  if (appleIcon) return { url: getAttribute(appleIcon, 'href'), kind: 'logo', score: 0 };

  const icon = links
    .map(tag => {
      const rel = getAttribute(tag, 'rel').toLowerCase();
      const url = getAttribute(tag, 'href');
      if (!rel.split(/\s+/).includes('icon') || !url) return null;

      const size = Math.max(0, ...(getAttribute(tag, 'sizes').match(/\d+x\d+/gi) || [])
        .map(value => Number(value.split('x')[0])));
      const score = url.split(/[?#]/)[0].toLowerCase().endsWith('.svg') ? 1000 : size;
      return score >= 128 ? { url, kind: 'logo' as const, score } : null;
    })
    .filter((item): item is { url: string; kind: 'logo'; score: number } => item !== null)
    .sort((a, b) => b.score - a.score)[0];

  return icon || null;
};

const LinkCard = async ({ children, image }: LinkCardProps) => {
  const extractUrl = (children: React.ReactNode): string => {
    if (React.isValidElement(children)) {
      return children.props.children?.toString() || '';
    }
    return children?.toString() || '';
  };

  const url = extractUrl(children).trim();

  let parsedUrl: URL | undefined;
  try { parsedUrl = new URL(url); } catch {}
  if (!parsedUrl || !['http:', 'https:'].includes(parsedUrl.protocol)) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700 shadow-sm">
        Invalid URL format. Please provide a valid HTTP/HTTPS URL.
      </div>
    );
  }

  const manualImageUrl = image ? resolveUrl(image, url) : '';
  const manualImageKind: ImageKind = isLogoLike(image || '') ? 'logo' : 'preview';

  const githubPath = parsedUrl.pathname.split('/').filter(Boolean);
  const githubRepo = parsedUrl.hostname === 'github.com' && githubPath.length >= 2
    ? { owner: githubPath[0], repo: githubPath[1] }
    : null;

  const metaData = {
    title: '',
    description: '',
    imageUrl: manualImageUrl,
    imageKind: manualImageUrl ? manualImageKind : 'preview' as ImageKind,
    domain: parsedUrl.hostname,
  };

  try {
    if (githubRepo) {
      const { owner, repo } = githubRepo;
      const repoUrl = `https://github.com/${owner}/${repo}`;
      metaData.title = `${owner}/${repo}`;
      if (!manualImageUrl) metaData.imageUrl = `https://opengraph.githubassets.com/1/${owner}/${repo}`;

      const response = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, {
        headers: { Accept: 'application/vnd.github+json' },
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        metaData.title = typeof data.full_name === 'string' ? data.full_name : metaData.title;
        metaData.description = typeof data.description === 'string' ? data.description : '';
      }

      if (!manualImageUrl) {
        const pageResponse = await fetch(repoUrl, {
          next: { revalidate: 86400 },
          signal: AbortSignal.timeout(5000),
        });

        if (pageResponse.ok) {
          const ogImage = getMeta(await pageResponse.text(), 'property', 'og:image');
          if (ogImage) metaData.imageUrl = resolveUrl(ogImage, repoUrl) || metaData.imageUrl;
        }
      }
    } else {
      const response = await fetch(url, {
        headers: { Accept: 'text/html,application/xhtml+xml' },
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(5000),
      });

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && (contentType.includes('text/html') || contentType.includes('application/xhtml+xml'))) {
        const html = await response.text();
        const baseUrl = response.url || url;
        const title = getMeta(html, 'property', 'og:title')
          || getMeta(html, 'name', 'twitter:title')
          || html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]
          || '';
        const description = getMeta(html, 'property', 'og:description')
          || getMeta(html, 'name', 'description')
          || getMeta(html, 'name', 'twitter:description');
        const socialImage = getMeta(html, 'property', 'og:image')
          || getMeta(html, 'name', 'twitter:image');
        const selectedImage = manualImageUrl
          ? null
          : socialImage
            ? { url: socialImage, kind: isLogoLike(socialImage) ? 'logo' as const : 'preview' as const }
            : getPageImage(html) || getSiteIcon(html);

        metaData.title = decodeHtml(title).trim();
        metaData.description = decodeHtml(description).trim();
        if (selectedImage?.url) {
          metaData.imageUrl = resolveUrl(selectedImage.url, baseUrl);
          metaData.imageKind = selectedImage.kind;
        }
      }
    }
  } catch (error) {
    console.warn(`Link preview unavailable: ${url}`, error instanceof Error ? error.message : error);
  }

  const imageUrl = metaData.imageUrl
    || `https://www.google.com/s2/favicons?domain=${metaData.domain}&sz=${DEFAULT_FAVICON_SIZE}`;
  const imageKind: ImageKind = metaData.imageUrl ? metaData.imageKind : 'logo';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-4 block rounded-2xl border border-slate-700 bg-[#0f0f0f] px-4 no-underline transition-colors hover:border-slate-600 hover:bg-[#171717]"
    >
      <div className="flex items-center gap-2">
        <div className="flex-1 overflow-hidden">
          <p className="text-md truncate font-semibold text-slate-100">
            {metaData.title || metaData.domain}
          </p>
          <p className="truncate text-sm text-slate-400">
            {metaData.description || ''}
          </p>
        </div>

        <div className="w-2/5 flex-shrink-0">
          {imageKind === 'logo' ? (
            <div className="mx-auto my-1 flex h-32 items-center justify-center rounded-sm border border-slate-600 bg-white p-2">
              <img src={imageUrl} alt="Preview" className="h-full w-full object-contain" />
            </div>
          ) : (
            <img
              src={imageUrl}
              alt="Preview"
              className="mx-auto my-1 h-32 rounded-sm border-slate-700 object-cover"
            />
          )}
        </div>
      </div>
    </a>
  );
};

export default LinkCard;
