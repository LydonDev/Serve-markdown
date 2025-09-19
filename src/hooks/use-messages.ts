'use client';

import { useEffect, useState } from 'react';
import { Message } from '@/types/message';

interface SSEMessage {
  type: 'create' | 'update' | 'delete' | 'connected';
  message?: Message;
  messageId?: string;
  slug?: string;
  clientId?: string;
}

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchInitialMessages = async () => {
      try {
        const response = await fetch('/api/messages');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setMessages(data);
        setIsLoading(false);
      } catch {
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchInitialMessages();

    const eventSource = new EventSource('/api/events');

    eventSource.onmessage = (event) => {
      try {
        const sseMessage: SSEMessage = JSON.parse(event.data);

        if (sseMessage.type === 'connected') {
          console.log('Connection established');
          return;
        }

        setMessages(prev => {
          switch (sseMessage.type) {
            case 'create':
              if (sseMessage.message) {
                return [sseMessage.message, ...prev];
              }
              return prev;
            case 'update':
              if (sseMessage.message) {
                return prev.map(msg =>
                  msg.id === sseMessage.message!.id ? sseMessage.message! : msg
                );
              }
              return prev;
            case 'delete':
              if (sseMessage.messageId || sseMessage.slug) {
                return prev.filter(msg =>
                  msg.id !== sseMessage.messageId &&
                  msg.slug !== sseMessage.slug
                );
              }
              return prev;
            default:
              return prev;
          }
        });
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const mutate = async () => {
    try {
      const response = await fetch('/api/messages');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setMessages(data);
    } catch {
      setIsError(true);
    }
  };

  return {
    messages,
    isLoading,
    isError,
    mutate,
  };
}

export function useMessage(slugOrId: string) {
  const [message, setMessage] = useState<Message | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(!!slugOrId);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!slugOrId) {
      setIsLoading(false);
      return;
    }

    const fetchMessage = async () => {
      try {
        const response = await fetch(`/api/messages/${slugOrId}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setMessage(data);
        setIsLoading(false);
      } catch {
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchMessage();

    const eventSource = new EventSource('/api/events');

    eventSource.onmessage = (event) => {
      try {
        const sseMessage: SSEMessage = JSON.parse(event.data);

        if (sseMessage.type === 'update' && sseMessage.message) {
          if (sseMessage.message.id === slugOrId || sseMessage.message.slug === slugOrId) {
            setMessage(sseMessage.message);
          }
        } else if (sseMessage.type === 'delete') {
          if (sseMessage.messageId === slugOrId || sseMessage.slug === slugOrId) {
            setMessage(undefined);
            setIsError(true);
          }
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [slugOrId]);

  const mutate = async () => {
    if (!slugOrId) return;

    try {
      const response = await fetch(`/api/messages/${slugOrId}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setMessage(data);
    } catch {
      setIsError(true);
    }
  };

  return {
    message,
    isLoading,
    isError,
    mutate,
  };
}