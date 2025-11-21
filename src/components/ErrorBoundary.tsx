import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from "@sentry/nextjs";
import { logger } from '../services/logger';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 1. Log to Pino (Console/JSON)
    logger.error({ error, errorInfo }, 'Uncaught error in component');

    // 2. Send to Sentry
    Sentry.captureException(error);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 flex flex-col items-center text-center gap-3 animate-in fade-in duration-300">
          <div className="p-3 bg-red-500/20 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-200">Something went wrong</h3>
            <p className="text-sm text-red-300/80">The application encountered an error.</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-100 rounded-lg transition-colors flex items-center gap-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
