import React from 'react';
import Link from 'next/link';

export const BackLink = (): React.JSX.Element => (
  <div className="mb-8">
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors text-sm font-medium group"
    >
      <span className="group-hover:-translate-x-1 transition-transform">←</span>
      Back to messages
    </Link>
  </div>
);