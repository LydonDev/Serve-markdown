import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { MarkdownContentProps } from '@/types/message';
import { MarkdownComponents } from './MarkdownComponents';

const MarkdownContentComponent = ({ content }: MarkdownContentProps): React.JSX.Element => (
  <div className="markdown-content">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={MarkdownComponents}
    >
      {content}
    </ReactMarkdown>
  </div>
);

MarkdownContentComponent.displayName = 'MarkdownContent';

export const MarkdownContent = memo(MarkdownContentComponent);