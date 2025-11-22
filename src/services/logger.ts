// Universal Logger (Console-based)
// Replaces Pino to avoid build issues with Next.js/Turbopack and thread-stream.

const isDev = process.env.NODE_ENV === 'development';

import { LogEntry } from '@/src/types/logger';
import { APP_CONFIG } from '@/src/config/app-config';

// Master Toggle for Logging
// Set to true to enable console logging and server-side shipping (for non-errors).
// Errors are ALWAYS logged.
export const ENABLE_LOGGING = APP_CONFIG.ENABLE_LOGGING;

const log = (level: 'debug' | 'info' | 'warn' | 'error', msg: string, data?: object) => {
  // 1. Filtering: Skip non-errors if logging is disabled
  if (level !== 'error' && !ENABLE_LOGGING) {
    return;
  }

  const timestamp = new Date().toISOString();
  const entry: LogEntry = {
    level,
    msg,
    timestamp,
    ...data,
  };

  // 2. Console Output
  if (isDev) {
    // In dev, print readable logs
    const color = level === 'error' ? '\x1b[31m' : level === 'warn' ? '\x1b[33m' : '\x1b[32m';
    const reset = '\x1b[0m';
    console[level](`${color}[${level.toUpperCase()}]${reset} ${msg}`, data || '');
  } else {
    // In prod, print JSON for observability tools
    console[level](JSON.stringify(entry));
  }

  // 3. Server Shipping (Client-side only)
  // Only if enabled (or if it's an error) and running in the browser
  if (typeof window !== 'undefined' && (ENABLE_LOGGING || level === 'error')) {
    // Fire and forget log ingestion
    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
      keepalive: true, // Ensure log sends even if page unloads
    }).catch(() => {
      // Ignore logging errors to prevent loops
    });
  }
};

export const logger = {
  debug: (msg: string, data?: object) => log('debug', msg, data),
  info: (msg: string, data?: object) => log('info', msg, data),
  warn: (msg: string, data?: object) => log('warn', msg, data),
  error: (msg: string, error?: any, data?: object) => log('error', msg, { ...data, err: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined }),

  // Structured Logging Helpers
  action: (actionName: string, details?: object) => 
    logger.info(`User Action: ${actionName}`, { category: 'ACTION', action: actionName, ...details }),
  
  navigation: (path: string, method: 'push' | 'replace' | 'load' = 'load') => 
    logger.info(`Navigated to ${path}`, { category: 'NAVIGATION', path, method }),
  
  api: (endpoint: string, method: string, status: number, duration?: number, details?: object) => 
    logger.info(`API ${method} ${endpoint} ${status}`, { category: 'API', endpoint, method, status, duration, ...details }),
  
  chat: (event: 'message_sent' | 'response_received' | 'error' | 'chat_cleared', details?: object) => 
    logger.info(`Chat: ${event}`, { category: 'CHAT', event, ...details }),
};
