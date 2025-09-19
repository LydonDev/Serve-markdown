import { NextResponse } from 'next/server';
import { getMessages } from '@/services/message-service';
import { watchMessages } from '@/lib/file-watcher';

watchMessages();

export async function GET() {
  try {
    const messages = await getMessages();
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}