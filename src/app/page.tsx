'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { useMessages } from '@/hooks/use-messages';
import { Message } from '@/types/message';
import { formatDate } from '@/lib/date-utils';

function formatDateLocal(dateString: string): string {
  return formatDate(dateString);
}

export default function Home(): React.JSX.Element {
  const { messages, isLoading, isError } = useMessages();

  const EmptyState = (): React.JSX.Element => (
    <div className="text-center py-12">
      <p className="text-vercel-gray text-lg mb-4">No messages yet</p>
      <p className="text-vercel-light-gray">I am probably dead</p>
    </div>
  );

  const LoadingState = (): React.JSX.Element => (
    <div className="mt-24 bg-zinc-950 flex items-center justify-center">
      <Image
        src="https://media.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif"
        alt="Loading..."
        width={24}
        height={24}
        className="w-6 h-6"
      />
    </div>
  );

const MessageCard = ({ message }: { message: Message }): React.JSX.Element => (
  <Link key={message.slug} href={`/message/${message.slug}`} className="block">
    <article className="border border-zinc-800/50 bg-zinc-900/25 rounded-2xl p-6 hover:bg-zinc-900/50 transition-colors">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold mb-2 hover:text-vercel-light-gray transition-colors">
            {message.title}
          </h2>
          {message.description && (
            <p
              className="text-zinc-400 text-sm mb-2 overflow-hidden text-ellipsis"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {message.description}
            </p>
          )}
          <p className="text-zinc-500 text-xs">{formatDateLocal(message.date)}</p>
        </div>

        {message.logo && (
          <div className="flex-shrink-0">
            <Image
              src={message.logo}
              alt={`${message.title} logo`}
              width={parseInt(message.logoSize || '48')}
              height={parseInt(message.logoSize || '48')}
              className="rounded-lg object-cover"
              style={{
                width: `${message.logoSize || '48'}px`,
                height: `${message.logoSize || '48'}px`
              }}
              unoptimized
            />
          </div>
        )}
      </div>
    </article>
  </Link>
);


  if (isError) {
    return (
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center py-12">
          <p className="text-red-400 text-lg">Failed to load messages</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-6 py-12 max-w-4xl">
      <header className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Hello I&apos;m Fraser 👋</h1>
        <p className="text-zinc-400 text-lg">Welcome to my messages.</p>
      </header>

      <section className="space-y-6">
        {isLoading ? (
          <LoadingState />
        ) : messages.length === 0 ? (
          <EmptyState />
        ) : (
          messages.map((message) => <MessageCard key={message.slug} message={message} />)
        )}
      </section>
    </main>
  );
}
