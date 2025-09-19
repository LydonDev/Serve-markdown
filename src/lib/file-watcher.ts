import fs from 'fs';
import path from 'path';
import chokidar, { FSWatcher } from 'chokidar';
import chalk from 'chalk';
import { parseMarkdownFile } from '../services/message-service';

let broadcastFunction: ((data: any) => void) | null = null;

export function setBroadcastFunction(fn: (data: any) => void) {
  broadcastFunction = fn;
}

function broadcast(data: any) {
  if (broadcastFunction) {
    broadcastFunction(data);
  }
}

interface WatcherState {
  processedFiles: Set<string>;
  watcher: FSWatcher | null;
}

const MESSAGES_DIR = path.join(process.cwd(), 'src/messages');
const STABILITY_THRESHOLD = 200;
const POLL_INTERVAL = 100;

const BASE_TEMPLATE_PATH = path.join(MESSAGES_DIR, 'base.md');

function generateDefaultContent(fileName: string, timestamp: string): string {
  const cleanFileName = fileName.endsWith('.md') ? fileName.slice(0, -3) : fileName;

  try {
    if (fs.existsSync(BASE_TEMPLATE_PATH)) {
      const templateContent = fs.readFileSync(BASE_TEMPLATE_PATH, 'utf8');
      return templateContent
        .replace(/{{TITLE}}/g, cleanFileName)
        .replace(/{{DATE}}/g, timestamp);
    }
  } catch {
    console.error(chalk.yellow('Warning: Could not read base template, using fallback'));
  }

  return `---
title: "${cleanFileName}"
date: "${timestamp}"
description: "A new message"
logo: ""
logoSize: "48"
---

# ${cleanFileName}

Your message content goes here.
`;
}

function isMarkdownFile(filePath: string): boolean {
  return filePath.endsWith('.md');
}

function logError(message: string, fileName: string): void {
  console.error(chalk.red(message), chalk.bold(fileName));
}

const watcherState: WatcherState = {
  processedFiles: new Set<string>(),
  watcher: null
};

function handleFileAddition(filePath: string): void {
  if (!isMarkdownFile(filePath)) return;
  if (watcherState.processedFiles.has(filePath)) return;

  watcherState.processedFiles.add(filePath);
  const fileName = path.basename(filePath);
  const timestamp = new Date().toISOString();


  fs.readFile(filePath, 'utf-8', async (err, data) => {
    if (err || !data?.trim()) {
      const defaultContent = generateDefaultContent(fileName, timestamp);

      fs.writeFile(filePath, defaultContent, 'utf-8', async (writeErr) => {
        if (writeErr) {
          logError('Error writing file:', fileName);
        } else {

          setTimeout(async () => {
            const message = await parseMarkdownFile(fileName);
            if (message) {
              broadcast({
                type: 'create',
                message,
              });
            }
          }, 100);
        }
      });
    } else {
      const message = await parseMarkdownFile(fileName);
      if (message) {
        broadcast({
          type: 'create',
          message,
        });
      }
    }
  });
}

function handleFileDeletion(filePath: string): void {
  if (!isMarkdownFile(filePath)) return;

  const fileName = path.basename(filePath);
  const slug = fileName.replace(/\.md$/, '');


  watcherState.processedFiles.delete(filePath);

  broadcast({
    type: 'delete',
    slug,
  });
}

export function watchMessages(): void {
  if (watcherState.watcher) {
    return;
  }


  watcherState.watcher = chokidar.watch(MESSAGES_DIR, {
    persistent: true,
    ignoreInitial: true,
    depth: 0,
    awaitWriteFinish: {
      stabilityThreshold: STABILITY_THRESHOLD,
      pollInterval: POLL_INTERVAL
    }
  });

  watcherState.watcher.on('add', (filePath) => {
    handleFileAddition(filePath);
  });

  watcherState.watcher.on('unlink', (filePath) => {
    handleFileDeletion(filePath);
  });

  watcherState.watcher.on('error', (error) => {
    console.error('Watcher error:', error);
  });

}

export function stopWatchingMessages(): void {
  if (watcherState.watcher) {
    watcherState.watcher.close();
    watcherState.watcher = null;
    watcherState.processedFiles.clear();
    console.log(chalk.green('File watcher stopped'));
  }
}