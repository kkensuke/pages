import React from 'react';

const DEFAULT_FAVICON_SIZE = 256;

interface LinkCardProps {
  children: React.ReactNode;
  image?: string;
}

type ImageKind = 'preview' | 'logo';

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
  try {
    const resolved = new URL(decodeHtml(value), baseUrl);
    return ['http:', 'https:'].includes(resolved.protocol) ? resolved.toString() : '';
  } catch {
    return '';
  }
};

// AMO returns { [lang]: text }, plus `_default` naming the fallback locale when `lang` has no translation.
const localized = (field?: Record<string, string | null> | null) =>
  (field && (field[field._default || ''] || Object.values(field)[0])) || '';

const isLogoLike = (value: string) => /logo|brand|favicon|app[-_]?icon|(?:^|[-_/])icon(?:[.\-_/]|$)/i.test(value);

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

  const path = parsedUrl.pathname.split('/').filter(Boolean);
  const githubRepo = parsedUrl.hostname === 'github.com' && path.length >= 2
    ? { owner: path[0], repo: path[1] }
    : null;
  // addons.mozilla.org serves a bot challenge page instead of HTML, so use its API: /<lang>/firefox/addon/<slug>/
  const amoSlug = parsedUrl.hostname === 'addons.mozilla.org' && path[2] === 'addon' ? path[3] : '';

  const metaData = {
    title: '',
    description: '',
    imageUrl: manualImageUrl,
    imageKind: (isLogoLike(manualImageUrl) ? 'logo' : 'preview') as ImageKind,
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
    } else if (amoSlug) {
      const response = await fetch(`https://addons.mozilla.org/api/v5/addons/addon/${encodeURIComponent(amoSlug)}/?lang=${encodeURIComponent(path[0])}`, {
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        metaData.title = localized(data.name);
        metaData.description = localized(data.summary);
        if (!manualImageUrl) {
          // Same choice as the og:image of the add-on page: first screenshot, else the icon.
          const preview = data.previews?.[0]?.image_url;
          metaData.imageUrl = preview || data.icons?.['128'] || data.icon_url || '';
          metaData.imageKind = preview ? 'preview' : 'logo';
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
        const title = getMeta(html, 'property', 'og:title')
          || getMeta(html, 'name', 'twitter:title')
          || html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]
          || '';
        const description = getMeta(html, 'property', 'og:description')
          || getMeta(html, 'name', 'description')
          || getMeta(html, 'name', 'twitter:description');
        const socialImage = getMeta(html, 'property', 'og:image')
          || getMeta(html, 'name', 'twitter:image');

        metaData.title = decodeHtml(title).trim();
        metaData.description = decodeHtml(description).trim();
        if (!manualImageUrl && socialImage) {
          metaData.imageUrl = resolveUrl(socialImage, response.url || url);
          metaData.imageKind = isLogoLike(socialImage) ? 'logo' : 'preview';
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
            <div className="mx-auto my-1 flex h-32 items-center justify-center rounded-sm p-2">
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
