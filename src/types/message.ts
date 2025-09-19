export interface Message {
  id: string;
  slug: string;
  title: string;
  date: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  logo?: string;
  logoSize?: string;
}

export interface MessageMeta {
  id: string;
  slug: string;
  title: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  logo?: string;
}

export interface CreateMessageRequest {
  title: string;
  content: string;
  slug?: string;
  description?: string;
  logo?: string;
}

export interface UpdateMessageRequest {
  title?: string;
  content?: string;
  slug?: string;
  description?: string;
  logo?: string;
}

export interface MessagePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export interface MessageData extends Message {
  [key: string]: unknown;
}

export interface MarkdownComponentProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  src?: string;
  alt?: string;
  href?: string;
  [key: string]: unknown;
}


export interface ArticleHeaderProps {
  title: string;
  date: string;
}

export interface MarkdownContentProps {
  content: string;
}

export interface SocketMessage {
  type: 'create' | 'update' | 'delete';
  message?: Message;
  messageId?: string;
  slug?: string;
}