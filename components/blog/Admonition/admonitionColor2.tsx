import React from 'react';
import LinkCard from './LinkCard';
import { FaRocket } from 'react-icons/fa';
import { PiNotePencilBold } from "react-icons/pi";
import { FaFire } from "react-icons/fa";
import { ImWarning } from "react-icons/im";
import { FaRegLightbulb } from "react-icons/fa6";
import { FaRegCommentDots } from "react-icons/fa";
import { AiOutlineExperiment } from "react-icons/ai";
import { FaQuoteLeft } from "react-icons/fa";
import { FaQuestion } from "react-icons/fa";


interface AdmonitionProps {
  title: string;
  children: any;
}


const OverviewAdmonition = ({ title, children }: AdmonitionProps) => {
  title = title || 'Overview';
  return (
    <div className="my-3 rounded-xl border bg-red-100 text-slate-600" >
      <div className="flex p-3 text-red-600">
        {FaRocket({ className: 'my-auto mr-2', size: 22 })}
        {title}
      </div>
      <div className="border-t-2 border-red-500"></div>
      <div className="p-4">{children}</div>
    </div>
  );
}
const NoteAdmonition = ({ title, children }: AdmonitionProps) => {
  title = title || 'Note';
  return (
    <div className="my-3 rounded-xl border bg-cyan-100 text-slate-600" >
      <div className="flex p-3 text-blue-600">
        {PiNotePencilBold({ className: 'my-auto mr-2', size: 22 })}
        {title}
      </div>
      <div className="border-t-2 border-blue-500"></div>
      <div className="p-4">{children}</div>
    </div>
  );
}
const ImportantAdmonition = ({ title, children }: AdmonitionProps) => {
  title = title || 'Important';
  return (
    <div className="my-3 rounded-xl border bg-yellow-100 text-slate-600" >
      <div className="flex p-3 text-orange-500">
        {FaFire({ className: 'my-auto mr-2', size: 20 })}
        {title}
      </div>
      <div className="border-t-2 border-orange-400"></div>
      <div className="p-4">{children}</div>
    </div>
  );
}
const TipAdmonition = ({ title, children }: AdmonitionProps) => {
  title = title || 'Tip';
  return (
    <div className="my-3 rounded-xl border bg-green-100 text-slate-600" >
      <div className="flex p-3 text-green-600">
        {FaRegLightbulb({ className: 'my-auto mr-2', size: 20 })}
        {title}
      </div>
      <div className="border-t-2 border-green-400"></div>
      <div className="p-4">{children}</div>
    </div>
  );
}
const WarningAdmonition = ({ title, children }: AdmonitionProps) => {
  title = title || 'Warning';
  return (
    <div className="my-3 rounded-xl border bg-red-100 text-slate-600" >
      <div className="flex p-3 text-red-500">
        {ImWarning({ className: 'my-auto mr-2', size: 20, color: '' })}
        {title}
      </div>
      <div className="border-t-2 border-red-500"></div>
      <div className="p-4">{children}</div>
    </div>
  );
}
const CommentAdmonition = ({ title, children }: AdmonitionProps) => {
  title = title || 'Comment';
  return (
    <div className="my-3 rounded-xl border bg-slate-100 text-slate-600" >
      <div className="flex p-3 text-slate-600">
        {FaRegCommentDots({ className: 'my-auto mr-2', size: 20, color: '' })}
        {title}
      </div>
      <div className="border-t-2 border-slate-400"></div>
      <div className="p-4">{children}</div>
    </div>
  );
}
const ExampleAdmonition = ({ title, children }: AdmonitionProps) => {
  title = title || 'Example';
  return (
    <div className="my-3 rounded-xl border bg-purple-100 text-slate-600" >
      <div className="flex p-3 text-purple-600">
        {AiOutlineExperiment({ className: 'my-auto mr-2', size: 22, color: '' })}
        {title}
      </div>
      <div className="border-t-2 border-purple-400"></div>
      <div className="p-4">{children}</div>
    </div>
  );
}
const QuoteAdmonition = ({ title, children }: AdmonitionProps) => {
  title = title || 'Quote';
  return (
    <div className="my-3 rounded-xl border bg-blue-100 italic text-slate-600" >
      <div className="flex p-3 text-blue-600">
        {FaQuoteLeft({ className: 'my-auto mr-2', size: 18, color: '' })}
        {title}
      </div>
      <div className="border-t-2 border-blue-500"></div>
      <div className="p-4">{children}</div>
    </div>
  );
}
const QuestionAdmonition = ({ title, children }: AdmonitionProps) => {
  title = title || 'Question';
  return (
    <div className="my-3 rounded-xl border bg-slate-100 text-slate-600" >
      <div className="flex p-3 text-slate-600">
        {FaQuestion({ className: 'my-auto mr-2', size: 18, color: '' })}
        {title}
      </div>
      <div className="border-t-2 border-slate-500"></div>
      <div className="p-4">{children}</div>
    </div>
  );
}

const SimpleAdmonition = ({ title, children }: AdmonitionProps) => {
  return (
    <div className="my-3 rounded-xl border bg-gray-50 text-slate-600">
      {title && (
        <>
          <div className="flex p-3 text-slate-600">
            {title}
          </div>
          <div className="border-t-2 border-slate-500"></div>
        </>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
};


// Add this new component to handle links
const LinkAdmonition = ({ children }: { children: React.ReactNode }) => {
  // Ensure we're passing the innermost text content
  const getTextContent = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(getTextContent).join('');
    if (React.isValidElement(node)) return getTextContent(node.props.children);
    return '';
  };

  // @ts-expect-error Async Server Components require TypeScript 5.1; this project uses 4.9.
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
