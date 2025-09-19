import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Message, CreateMessageRequest, UpdateMessageRequest } from '@/types/message';

const MESSAGES_DIRECTORY = path.join(process.cwd(), 'src', 'messages');

let broadcastFunction: ((data: any) => void) | null = null;

export function setBroadcastFunction(fn: (data: any) => void) {
  broadcastFunction = fn;
}

function broadcast(data: any) {
  if (broadcastFunction) {
    broadcastFunction(data);
  }
}

function ensureMessagesDirectoryExists(): void {
  if (!fs.existsSync(MESSAGES_DIRECTORY)) {
    fs.mkdirSync(MESSAGES_DIRECTORY, { recursive: true });
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

export async function parseMarkdownFile(fileName: string): Promise<Message | null> {
  if (fileName === 'base.md') return null;

  try {
    const fullPath = path.join(MESSAGES_DIRECTORY, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const fileStats = fs.statSync(fullPath);

    const slug = fileName.replace(/\.md$/, '');

    return {
      id: data.id || generateId(),
      slug,
      title: data.title || slug,
      date: data.date || fileStats.birthtime.toISOString(),
      content,
      createdAt: data.createdAt || fileStats.birthtime.toISOString(),
      updatedAt: data.updatedAt || fileStats.mtime.toISOString(),
      description: data.description || '',
      logo: data.logo || '',
      logoSize: data.logoSize || '48',
    };
  } catch (error) {
    console.error(`Error parsing file ${fileName}:`, error);
    return null;
  }
}

export async function getMessages(): Promise<Message[]> {
  ensureMessagesDirectoryExists();

  try {
    const fileNames = fs.readdirSync(MESSAGES_DIRECTORY);
    const markdownFiles = fileNames.filter(name => name.endsWith('.md'));

    const messages = await Promise.all(
      markdownFiles.map(parseMarkdownFile)
    );

    const validMessages = messages.filter((message): message is Message => message !== null);

    return validMessages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error reading messages directory:', error);
    return [];
  }
}

export async function getMessage(slugOrId: string): Promise<Message | null> {
  const messages = await getMessages();
  return messages.find(msg => msg.slug === slugOrId || msg.id === slugOrId) || null;
}

export async function createMessage(data: CreateMessageRequest): Promise<Message> {
  ensureMessagesDirectoryExists();

  const id = generateId();
  const slug = data.slug || generateSlug(data.title);
  const now = new Date().toISOString();

  const message: Message = {
    id,
    slug,
    title: data.title,
    date: now,
    content: data.content,
    createdAt: now,
    updatedAt: now,
    description: data.description || '',
    logo: data.logo || '',
  };

  const fileContent = matter.stringify(data.content, {
    id,
    title: data.title,
    date: now,
    createdAt: now,
    updatedAt: now,
    description: data.description || '',
    logo: data.logo || '',
  });

  const filePath = path.join(MESSAGES_DIRECTORY, `${slug}.md`);
  fs.writeFileSync(filePath, fileContent, 'utf8');

  broadcast({
    type: 'create',
    message,
  });

  return message;
}

export async function updateMessage(slugOrId: string, data: UpdateMessageRequest): Promise<Message | null> {
  const existingMessage = await getMessage(slugOrId);
  if (!existingMessage) return null;

  const updatedMessage: Message = {
    ...existingMessage,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  if (data.slug && data.slug !== existingMessage.slug) {
    const oldPath = path.join(MESSAGES_DIRECTORY, `${existingMessage.slug}.md`);

    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }

    updatedMessage.slug = data.slug;
  }

  const fileContent = matter.stringify(updatedMessage.content, {
    id: updatedMessage.id,
    title: updatedMessage.title,
    date: updatedMessage.date,
    createdAt: updatedMessage.createdAt,
    updatedAt: updatedMessage.updatedAt,
    description: updatedMessage.description || '',
    logo: updatedMessage.logo || '',
  });

  const filePath = path.join(MESSAGES_DIRECTORY, `${updatedMessage.slug}.md`);
  fs.writeFileSync(filePath, fileContent, 'utf8');

  broadcast({
    type: 'update',
    message: updatedMessage,
  });

  return updatedMessage;
}

export async function deleteMessage(slugOrId: string, skipBroadcast: boolean = false): Promise<boolean> {
  const message = await getMessage(slugOrId);
  if (!message) return false;

  const filePath = path.join(MESSAGES_DIRECTORY, `${message.slug}.md`);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    if (!skipBroadcast) {
      broadcast({
        type: 'delete',
        messageId: message.id,
        slug: message.slug,
      });
    }

    return true;
  } catch (error) {
    console.error('Error deleting message:', error);
    return false;
  }
}