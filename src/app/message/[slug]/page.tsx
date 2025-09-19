'use client';

import { notFound } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import { MessagePageProps } from '@/types/message';
import { useMessage } from '@/hooks/use-messages';
import { BackLink } from '@/components/message/BackLink';
import { ArticleHeader } from '@/components/message/ArticleHeader';
import { MarkdownContent } from '@/components/message/MarkdownContent';

function MessagePageContent({ slug }: { slug: string }): React.JSX.Element {
  const { message, isLoading, isError } = useMessage(slug);

  if (isLoading) {
    return (
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
  }

  if (isError || !message) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <BackLink />

        <article className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-8 shadow-2xl">
          <ArticleHeader title={message.title} date={message.date} />
          <MarkdownContent content={message.content} />
        </article>
      </main>
    </div>
  );
}

export default function MessagePage({ params }: MessagePageProps): React.JSX.Element {
  const [slug, setSlug] = React.useState<string>('');

  React.useEffect(() => {
    params.then(({ slug }) => setSlug(slug));
  }, [params]);

  if (!slug) {
    return (
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
  }

  return <MessagePageContent slug={slug} />;
}