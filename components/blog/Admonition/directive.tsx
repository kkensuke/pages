import { visit } from 'unist-util-visit';
import { h } from 'hastscript';
import { YouTubeEmbed } from './YouTubeEmbed';
import KeyboardButtonWithSymbol from './KeyboardButton';
import ArtBlock from '../Art/ArtBlock';

// Define directive handlers for different types of text directives
const directiveHandlers = {
  // Inline directives (single colon)
  textDirective: {
    youtube: (node: any) => {
      // Inline YouTube is always a link, never an embed
      const videoId = node.attributes?.id || '';
      const title = node.children[0]?.value || '';
      return h('youtube-embed', { 
        videoId,
        title,
        embed: 'false'
      });
    },
    btn: (node: any) => {
      const keyName = node.children[0]?.value || '';
      return h('keyboard-button', { keyName });
    },
  },
  
  // Block directives (double colon)
  leafDirective: {
    youtube: (node: any) => {
      // Block YouTube is always an embed
      const videoId = node.attributes?.id || '';
      const title = node.children[0]?.value || '';
      return h('youtube-embed', { 
        videoId,
        title,
        embed: 'true'
      });
    },

    // ── Art block ──────────────────────────────────────────────────────────
    // Usage: ::art{type="wave" color="blue" height="160px"}
    //
    // type  : wave | grid | mandala | flow | mosaic   (default: wave)
    // color : blue | purple | green | amber | rose | teal | slate | indigo
    //         (default: blue)
    // height: any CSS height string, e.g. "200px"     (default: 160px)
    art: (node: any) => {
      const type   = node.attributes?.type   || 'wave';
      const color  = node.attributes?.color  || 'blue';
      const height = node.attributes?.height || '160px';
      return h('art-block', { type, color, height });
    },
  }
};

export function remarkTextDirectives() {
  return (tree: any) => {
    visit(tree, (node) => {
      // Handle different directive types
      if (node.type === 'textDirective' || node.type === 'leafDirective') {
        const handlers = directiveHandlers[node.type as 'textDirective' | 'leafDirective'];
        const handler = handlers?.[node.name as keyof typeof handlers];
        
        if (handler) {
          const result = handler(node);
          node.data = node.data || {};
          node.data.hName = result.tagName;
          node.data.hProperties = result.properties;
        }
      }
    });
  };
}

export const TextDirectiveComponents = {
  'youtube-embed': ({ 
    videoId, 
    title, 
    embed
  }: { 
    videoId: string; 
    title: string;
    embed: string;
  }) => {
    return (
      <YouTubeEmbed 
        videoId={videoId} 
        title={title}
        embed={embed === 'true'}
      />
    );
  },

  'keyboard-button': ({ keyName }: { keyName: string }) => {
    return <KeyboardButtonWithSymbol keyName={keyName} />;
  },

  // ── Art block renderer ───────────────────────────────────────────────────
  'art-block': ({
    type,
    color,
    height,
  }: {
    type?:   string;
    color?:  string;
    height?: string;
  }) => {
    return <ArtBlock type={type} color={color} height={height} />;
  },
};
