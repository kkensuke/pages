"use client";

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { 
  vscDarkPlus,      // GitHub-like dark theme
  dracula,          // Popular dark theme
  atomDark,         // Atom editor dark theme
  oneDark,          // One Dark theme
  synthwave84,      // Retro/cyberpunk theme
  materialDark,     // Material design dark
  coldarkDark,      // Modern dark theme
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Copy, Check } from 'lucide-react';
import { Components } from 'react-markdown';

const Pre: Components['pre'] = ({ children, ...props }) => {
  const [isCopied, setIsCopied] = useState(false);
  
  if (!children || typeof children !== 'object' || !('type' in children)) {
    return <code {...props}>{children}</code>;
  }

  const { className = '', children: codeString ='' } = 'props' in children ? children.props : {};  
  const match = /language-(\w+)?(?:\[(.*)\])?/.exec(className || '');
  const language = match ? match[1] : 'plaintext';
  const propertiesString = match && match[2] ? match[2] : '';

  const properties = propertiesString.split(',').reduce((acc, prop) => {
    const [key, value] = prop.split('=');
    acc[key] = value || '';
    return acc;
  }, {} as Record<string, string>);

  const title = properties['title'] || '';
  const showLineNumbers = properties['showLineNumbers'] === 'true';
  const startingLineNumber = Number(properties['startingLineNumber']) || 1;

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="my-4 space-y-2">
      <div className="group overflow-hidden rounded-lg border border-slate-200 bg-slate-900">
        <div className="relative">
          <div>
            {title && (
              <div className="bg-slate-800 px-2 py-1 font-mono text-xs text-slate-300">
                {title}
              </div>
            )}
          </div>
          {/* <div className="absolute right-4 top-4 z-10 opacity-0 transition-opacity group-hover:opacity-100"> */}
          <div className={`absolute right-4 ${title ? 'top-8' : 'top-2.5'} z-10 opacity-0 transition-opacity group-hover:opacity-100`}>
            <CopyToClipboard text={String(codeString)} onCopy={handleCopy}>
              <button className="rounded-md bg-slate-700/50 p-2 text-slate-400 backdrop-blur-sm transition-colors hover:bg-slate-700 hover:text-slate-200">
                {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </CopyToClipboard>
          </div>
          <SyntaxHighlighter
            language={language}
            style={coldarkDark}
            showLineNumbers={showLineNumbers}
            startingLineNumber={startingLineNumber}
            customStyle={{
              margin: '0 1rem 0 0',
              borderRadius: 0,
              fontSize: '14px',
              padding: showLineNumbers ? '1rem 1rem 1rem 0.3rem' : '1rem',
            }}
            codeTagProps={{
              style: { fontFamily: 'ui-monospace, monospace' }
            }}
          >
            {String(codeString).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default Pre;
