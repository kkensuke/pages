import React from 'react';

const DEFAULT_FAVICON_SIZE = 64;

interface LinkCardProps {
  children: React.ReactNode;
}

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
  const previewUrl = parsedUrl.hostname === 'github.com' && githubPath.length > 2
    ? `${parsedUrl.origin}/${githubPath[0]}/${githubPath[1]}`
    : url;

  const metaData = { title: '', description: '', imageUrl: '', domain: parsedUrl.hostname };
  try {
    const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(previewUrl)}`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(5000),
    });
    if (response.ok) {
      const result = await response.json();
      if (result.status === 'success' && result.data) {
        const data = result.data;
        metaData.title = typeof data.title === 'string' ? data.title : '';
        metaData.description = typeof data.description === 'string' ? data.description : '';
        metaData.imageUrl = typeof data.image?.url === 'string' ? data.image.url : '';
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
