import {
  AppWindow, BookOpen, Captions, CaseSensitive, CodeXml, FileText,
  Globe, Grid3X3, Image, Laptop, Layers, Link, MessageSquareWarning,
  Orbit, Palette, PanelTop, Settings2, Shapes, Sigma, SquareFunction,
  SquareTerminal, Terminal, TextCursorInput,
} from 'lucide-react';

export const POST_ICONS = {
  'app-window': AppWindow,
  'book-open': BookOpen,
  captions: Captions,
  'case-sensitive': CaseSensitive,
  'code-xml': CodeXml,
  'file-text': FileText,
  globe: Globe,
  'grid-3x3': Grid3X3,
  image: Image,
  laptop: Laptop,
  layers: Layers,
  link: Link,
  'message-square-warning': MessageSquareWarning,
  orbit: Orbit,
  palette: Palette,
  'panel-top': PanelTop,
  'settings-2': Settings2,
  shapes: Shapes,
  sigma: Sigma,
  'square-function': SquareFunction,
  'square-terminal': SquareTerminal,
  terminal: Terminal,
  'text-cursor-input': TextCursorInput,
};

export type PostIconName = keyof typeof POST_ICONS;

export function parsePostIcon(value: unknown, fileName: string): PostIconName {
  if (value === undefined) return 'file-text';
  if (typeof value === 'string') {
    const name = value.trim();
    if (Object.prototype.hasOwnProperty.call(POST_ICONS, name)) return name as PostIconName;
  }
  console.warn(`${fileName}: unknown icon; using file-text.`, value);
  return 'file-text';
}
