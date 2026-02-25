'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Error caught:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-card border border-border rounded-lg p-8 text-center shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-destructive/20 rounded-lg">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h1>
              <p className="text-muted-foreground text-sm mb-6">
                {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
              </p>
              <Button
                onClick={this.resetError}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
