import React from 'react';
import { ArticleHeaderProps } from '@/types/message';
import { formatDate } from '@/lib/date-utils';

export const ArticleHeader = ({ title, date }: ArticleHeaderProps): React.JSX.Element => (
  <header className="mb-12 pb-8 border-b border-zinc-800">
    <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
      {title}
    </h1>
    <div className="flex items-center gap-2 text-zinc-400">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <time dateTime={date} className="text-sm">
        {formatDate(date)}
      </time>
    </div>
  </header>
);