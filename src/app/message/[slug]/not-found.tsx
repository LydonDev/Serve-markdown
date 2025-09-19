import Link from 'next/link';
import React from 'react';

export default function NotFound(): React.JSX.Element {
  const NotFoundContent = (): React.JSX.Element => (
    <div className="text-center py-24">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-vercel-light-gray text-lg mb-8">
        Message not found
      </p>
      <Link
        href="/"
        className="bg-vercel-fg text-vercel-bg px-6 py-3 rounded-lg hover:bg-vercel-light-gray transition-colors inline-block"
      >
        Go back home
      </Link>
    </div>
  );

  return (
    <main className="container mx-auto px-6 py-12 max-w-4xl">
      <NotFoundContent />
    </main>
  );
}