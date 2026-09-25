import React from 'react';
import LinkCard from './LinkCard';

interface AdmonitionProps {
  title: string;
  children: React.ReactNode;
}

const OverviewAdmonition = ({ title, children }: AdmonitionProps) => {
  title = title || 'Overview';
  return (
    <div className="my-3 rounded-xl border border-l-[3px] border-[#26354a] border-l-[#4f46e5] bg-[#0c1320] text-[#d7dde8]">
      <div className="flex rounded-xl bg-[#111b2b] p-3 text-[#a5b4fc]">
        <svg className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        {title}
      </div>
      <div className="border-t border-[#37346c]"></div>
      <div className="p-4">{children}</div>
    </div>
  );
}

const NoteAdmonition = ({ title, children }: AdmonitionProps) => {
  title = title || 'Note';
  return (
    <div className="my-3 rounded-xl border border-l-[3px] border-[#26354a] border-l-[#0284c7] bg-[#0c1320] text-[#d7dde8]">
      <div className="flex rounded-xl bg-[#111b2b] p-3 text-[#38bdf8]">
        <svg className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        {title}
      </div>
      <div className="border-t border-[#155173]"></div>
      <div className="p-4">{children}</div>
    </div>
  );
}

const ImportantAdmonition = ({ title, children }: AdmonitionProps) => {
  title = title || 'Important';
  return (
    <div className="my-3 rounded-xl border border-l-[3px] border-[#26354a] border-l-[#b45309] bg-[#0c1320] text-[#d7dde8]">
      <div className="flex rounded-xl bg-[#111b2b] p-3 text-[#f59e0b]">
        <svg className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        {title}
      </div>
      <div className="border-t border-[#6f3b0c]"></div>
      <div className="p-4">{children}</div>
    </div>
  );
}

const TipAdmonition = ({ title, children }: AdmonitionProps) => {
  title = title || 'Tip';
  return (
    <div className="my-3 rounded-xl border border-l-[3px] border-[#26354a] border-l-[#047857] bg-[#0c1320] text-[#d7dde8]">
      <div className="flex rounded-xl bg-[#111b2b] p-3 text-[#34d399]">
        <svg className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        {title}
      </div>
      <div className="border-t border-[#075840]"></div>
      <div className="p-4">{children}</div>
    </div>
  );
}

const WarningAdmonition = ({ title, children }: AdmonitionProps) => {
  title = title || 'Warning';
  return (
    <div className="my-3 rounded-xl border border-l-[3px] border-[#26354a] border-l-[#be123c] bg-[#0c1320] text-[#d7dde8]">
      <div className="flex rounded-xl bg-[#111b2b] p-3 text-[#fb7185]">
        <svg className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {title}
      </div>
      <div className="border-t border-[#751a32]"></div>
      <div className="p-4">{children}</div>
    </div>
  );
}

const CommentAdmonition = ({ title, children }: AdmonitionProps) => {
  title = title || 'Comment';
  return (
    <div className="my-3 rounded-xl border border-l-[3px] border-[#26354a] border-l-[#475569] bg-[#0c1320] text-[#d7dde8]">
      <div className="flex rounded-xl bg-[#111b2b] p-3 text-[#a8b3c4]">
        <svg className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {title}
      </div>
      <div className="border-t border-[#35445a]"></div>
      <div className="p-4">{children}</div>
    </div>
  );
}

const ExampleAdmonition = ({ title, children }: AdmonitionProps) => {
  title = title || 'Example';
  return (
    <div className="my-3 rounded-xl border border-l-[3px] border-[#26354a] border-l-[#7e22ce] bg-[#0c1320] text-[#d7dde8]">
      <div className="flex rounded-xl bg-[#111b2b] p-3 text-[#c084fc]">
        <svg className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
        {title}
      </div>
      <div className="border-t border-[#512069]"></div>
      <div className="p-4">{children}</div>
    </div>
  );
}

const QuoteAdmonition = ({ title, children }: AdmonitionProps) => {
  title = title || 'Quote';
  return (
    <div className="my-3 rounded-xl border border-l-[3px] border-[#26354a] border-l-[#0f766e] bg-[#0c1320] italic text-[#d7dde8]">
      <div className="flex rounded-xl bg-[#111b2b] p-3 text-[#5eead4]">
        <svg className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        {title}
      </div>
      <div className="border-t border-[#0d514d]"></div>
      <div className="p-4">{children}</div>
    </div>
  );
}

const QuestionAdmonition = ({ title, children }: AdmonitionProps) => {
  title = title || 'Question';
  return (
    <div className="my-3 rounded-xl border border-l-[3px] border-[#26354a] border-l-[#0e7490] bg-[#0c1320] text-[#d7dde8]">
      <div className="flex rounded-xl bg-[#111b2b] p-3 text-[#67e8f9]">
        <svg className="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {title}
      </div>
      <div className="border-t border-[#11546a]"></div>
      <div className="p-4">{children}</div>
    </div>
  );
}

const SimpleAdmonition = ({ title, children }: AdmonitionProps) => {
  return (
    <div className="my-3 rounded-xl border border-[#304059] bg-[#0c1320] text-[#d7dde8]">
      {title && (
        <>
          <div className="flex rounded-xl bg-[#101927] p-3 text-[#d8e0eb]">
            {title}
          </div>
          <div className="border-t border-[#3b4d66]"></div>
        </>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

const LinkAdmonition = ({ children }: { children: React.ReactNode }) => {
  // Ensure we're passing the innermost text content
  const getTextContent = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(getTextContent).join('');
    if (React.isValidElement(node)) return getTextContent(node.props.children);
    return '';
  };

  return <LinkCard>{getTextContent(children)}</LinkCard>;
};

const AdmonitionComponents = {
  overview: OverviewAdmonition,
  note: NoteAdmonition,
  important: ImportantAdmonition,
  tip: TipAdmonition,
  warning: WarningAdmonition,
  comment: CommentAdmonition,
  example: ExampleAdmonition,
  quote: QuoteAdmonition,
  question: QuestionAdmonition,
  simple: SimpleAdmonition,
  linkcard: LinkAdmonition,
}

export default AdmonitionComponents;
