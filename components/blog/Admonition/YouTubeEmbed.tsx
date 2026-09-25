'use client';

import React from 'react';
import { FaYoutube } from 'react-icons/fa';

// YouTube Component
interface YouTubeProps {
  videoId: string;
  title?: string;
  embed?: boolean;
}

export const YouTubeEmbed: React.FC<YouTubeProps> = ({ videoId, title = '', embed = false }) => {
  if (embed) {
    return (
      <div className="relative my-4 w-full overflow-hidden rounded-lg bg-slate-100 pt-[56.25%]">
        <iframe
          className="absolute left-0 top-0 h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title || 'YouTube video player'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <a
      href={`https://www.youtube.com/watch?v=${videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-red-500 hover:text-red-600"
    >
      {FaYoutube({ className: 'h-[0.9em]', size: 16 })}
      <span>{title || 'Watch on YouTube'}</span>
    </a>
  );
};

// Export additional client components here if needed...