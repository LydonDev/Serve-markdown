import { NextRequest } from 'next/server';
import { setBroadcastFunction as setMessageServiceBroadcast } from '@/services/message-service';
import { setBroadcastFunction as setWatcherBroadcast, watchMessages } from '@/lib/file-watcher';

interface SSEClient {
  id: string;
  controller: ReadableStreamDefaultController;
}

const clients = new Set<SSEClient>();

function sendToAllClients(data: any) {
  const message = `data: ${JSON.stringify(data)}\n\n`;

  clients.forEach(client => {
    try {
      client.controller.enqueue(new TextEncoder().encode(message));
    } catch (error) {
      console.error('Error sending to client:', error);
      clients.delete(client);
    }
  });
}

setMessageServiceBroadcast(sendToAllClients);
setWatcherBroadcast(sendToAllClients);

watchMessages();

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const clientId = Math.random().toString(36).substr(2, 9);
      const client: SSEClient = { id: clientId, controller };

      clients.add(client);

      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected', clientId })}\n\n`));

      const cleanup = () => {
        clients.delete(client);
      };

      request.signal.addEventListener('abort', cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}