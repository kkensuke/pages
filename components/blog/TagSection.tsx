import React from 'react';
import Link from 'next/link';
import { Bookmark } from 'lucide-react';
import type { BlogLanguage } from '@/lib/blog/localization';

type TagSectionProps = {
  tags: string[];
  activeTag?: string;
  language?: BlogLanguage;
};

const TagSection = ({ tags, activeTag, language = 'ja' }: TagSectionProps) => {
  if (!tags || tags.length === 0) return null;

  // URLエンコードされている文字（日本語など）を元の文字に戻し、比較用に小文字にする
  const decodedActiveTag = activeTag ? decodeURIComponent(activeTag).toLowerCase() : undefined;
  const languageQuery = language === 'en' ? '?lang=en' : '';

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {tags.map((tag: string) => {
        // タグが一致するか判定（大文字小文字を区別しない）
        const isActive = decodedActiveTag ? tag.toLowerCase() === decodedActiveTag : false;

        return (
          <Link
            key={tag}
            href={isActive ? `/blog${languageQuery}` : `/blog/tags/${tag}${languageQuery}`}
            // 共通のスタイル
            className={`group flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-all hover:shadow-md ${
              // アクティブなら水色、そうでないならグレー（どちらか片方だけ付与する）
              isActive 
                ? 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Bookmark size={14} className="opacity-60 group-hover:opacity-100" />
            {tag}
          </Link>
        );
      })}
    </div>
  );
};

export default TagSection;
