import React from 'react';

const DEFAULT_FAVICON_SIZE = 64;

interface LinkCardProps {
  children: React.ReactNode;
}

const getAttribute = (tag: string, name: string) =>
  tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1] || '';

const getMeta = (html: string, attribute: 'name' | 'property', value: string) =>
  (html.match(/<meta\b[^>]*>/gi) || [])
    .find(tag => getAttribute(tag, attribute).toLowerCase() === value.toLowerCase())
    ?.match(/\bcontent\s*=\s*["']([^"']*)["']/i)?.[1] || '';

const decodeHtml = (value: string) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const LinkCard = async ({ children }: LinkCardProps) => {
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

  const githubPath = parsedUrl.pathname.split('/').filter(Boolean);
  const githubRepo = parsedUrl.hostname === 'github.com' && githubPath.length >= 2
    ? { owner: githubPath[0], repo: githubPath[1] }
    : null;

  const metaData = { title: '', description: '', imageUrl: '', domain: parsedUrl.hostname };

  try {
    if (githubRepo) {
      const { owner, repo } = githubRepo;
      const repoUrl = `https://github.com/${owner}/${repo}`;
      metaData.title = `${owner}/${repo}`;
      metaData.imageUrl = `https://opengraph.githubassets.com/1/${owner}/${repo}`;

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

      const pageResponse = await fetch(repoUrl, {
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(5000),
      });

      if (pageResponse.ok) {
        const html = await pageResponse.text();
        const ogImageTag = html.match(/<meta(?=[^>]*property=["']og:image["'])[^>]*>/i)?.[0];
        const ogImage = ogImageTag?.match(/content=["']([^"']+)["']/i)?.[1];
        if (ogImage) metaData.imageUrl = ogImage.replace(/&amp;/g, '&');
      }
    } else {
      const response = await fetch(url, {
        headers: { Accept: 'text/html,application/xhtml+xml' },
        next: { revalidate: 86400 },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok && response.headers.get('content-type')?.includes('text/html')) {
        const html = await response.text();
        const baseUrl = response.url || url;
        const title = getMeta(html, 'property', 'og:title')
          || getMeta(html, 'name', 'twitter:title')
          || html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]
          || '';
        const description = getMeta(html, 'property', 'og:description')
          || getMeta(html, 'name', 'description')
          || getMeta(html, 'name', 'twitter:description');
        const image = getMeta(html, 'property', 'og:image')
          || getMeta(html, 'name', 'twitter:image');

        metaData.title = decodeHtml(title).trim();
        metaData.description = decodeHtml(description).trim();
        if (image) metaData.imageUrl = new URL(decodeHtml(image), baseUrl).toString();
      }
    }
  } catch (error) {
    console.warn(`Link preview unavailable: ${url}`, error instanceof Error ? error.message : error);
  }

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
          {metaData.imageUrl ? (
            <img
              src={metaData.imageUrl}
              alt="Preview"
              className="mx-auto my-1 h-32 rounded-sm border-slate-700 object-cover"
            />
          ) : (
            <img
              src={`https://www.google.com/s2/favicons?domain=${metaData.domain}&sz=${DEFAULT_FAVICON_SIZE}`}
              alt="favicon"
              className="my-1 h-32 rounded-sm border border-slate-700"
            />
          )}
        </div>
      </div>
    </a>
  );
};

export default LinkCard;
