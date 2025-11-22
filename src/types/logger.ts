export type LogEventCategory = 'ACTION' | 'API' | 'NAVIGATION' | 'CHAT' | 'SYSTEM';

export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  msg: string;
  timestamp: string;
  [key: string]: any;
}
