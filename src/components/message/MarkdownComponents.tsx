import React from 'react';
import Image from 'next/image';
import type { Components } from 'react-markdown';
import { CopyButton } from '@/components/message/CopyButton';

export const MarkdownComponents: Components = {
  code(props) {
    const { className, children } = props;
    const inline = 'inline' in props ? props.inline : false;
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const codeText = String(children).replace(/\n$/, '');

    if (!inline) {
      return (
        <div className="my-6 relative">
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden">
            <div className="bg-zinc-800 px-4 py-2 border-b border-zinc-700 flex justify-between items-center">
              {language && (
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                  {language}
                </span>
              )}
              <CopyButton text={codeText} />
            </div>
            <pre className="p-4 overflow-x-auto">
              <span
                className={`text-zinc-100 font-mono text-sm leading-relaxed`}
                style={{
                  fontFamily:
                    'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                }}
              >
                {children}
              </span>
            </pre>
          </div>
        </div>
      );
    }

    return (
      <code
        className="text-zinc-200 px-2 py-1 rounded text-sm font-mono border border-zinc-700"
        {...props}
      >
        {children}
      </code>
    );
  },

  pre({ children }) {
    return <>{children}</>;
  },

  img(props) {
    const { src, alt } = props;
    return (
      <Image
        src={typeof src === 'string' ? src : ''}
        alt={typeof alt === 'string' ? alt : ''}
        width="800"
        height="600"
        className="mx-auto my-6 max-w-full h-auto rounded-lg border border-zinc-700 shadow-lg"
        unoptimized
      />
    );
  },

  blockquote({ children }) {
    return (
      <blockquote className="border-l-4 border-zinc-600 pl-6 my-6 italic text-zinc-300 bg-zinc-900/30 py-4 rounded-r">
        {children}
      </blockquote>
    );
  },

  h1({ children }) {
    return (
      <h1 className="text-3xl font-bold text-white mt-8 mb-4 border-b border-zinc-700 pb-3">
        {children}
      </h1>
    );
  },

  h2({ children }) {
    return (
      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
        {children}
      </h2>
    );
  },

  h3({ children }) {
    return (
      <h3 className="text-xl font-semibold text-white mt-6 mb-3">
        {children}
      </h3>
    );
  },

  p({ children }) {
    return <p className="text-zinc-200 leading-7 mb-4">{children}</p>;
  },

  ul({ children }) {
    return (
      <ul className="list-disc list-inside text-zinc-200 mb-4 space-y-1">
        {children}
      </ul>
    );
  },

  ol({ children }) {
    return (
      <ol className="list-decimal list-inside text-zinc-200 mb-4 space-y-1">
        {children}
      </ol>
    );
  },

  li({ children }) {
    return <li className="text-zinc-200 leading-6">{children}</li>;
  },

  a({ href, children }) {
    return (
      <a
        href={href}
        className="text-blue-400 hover:text-blue-300 underline transition-colors"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  },

  table({ children }) {
    return (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border-collapse border border-zinc-700">
          {children}
        </table>
      </div>
    );
  },

  thead({ children }) {
    return <thead className="bg-zinc-800">{children}</thead>;
  },

  th({ children }) {
    return (
      <th className="border border-zinc-700 px-4 py-2 text-left font-semibold text-zinc-200">
        {children}
      </th>
    );
  },

  td({ children }) {
    return (
      <td className="border border-zinc-700 px-4 py-2 text-zinc-200">
        {children}
      </td>
    );
  },
};
