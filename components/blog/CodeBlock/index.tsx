"use client";

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
      <div className="overflow-hidden rounded-md border border-border bg-card">
        <div className="relative">
          <div>
            {title && (
              <div className="bg-secondary px-4 py-2 pr-16 font-mono text-xs text-muted-foreground">
                {title}
              </div>
            )}
          </div>
          <div className="absolute right-2 top-2 z-10">
            <CopyToClipboard text={String(codeString)} onCopy={handleCopy}>
              <button type="button" aria-label={isCopied ? 'Copied' : 'Copy code'} className="flex h-11 w-11 items-center justify-center rounded-md bg-secondary text-primary hover:bg-accent">
                {isCopied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
              </button>
            </CopyToClipboard>
          </div>
          <SyntaxHighlighter
            language={language}
            style={coldarkDark}
            showLineNumbers={showLineNumbers}
            startingLineNumber={startingLineNumber}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              fontSize: '14px',
              padding: showLineNumbers ? '1rem 4rem 1rem 0.3rem' : '1rem 4rem 1rem 1rem',
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
