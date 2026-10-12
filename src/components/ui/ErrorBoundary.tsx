// src/components/ui/ErrorBoundary.tsx
'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}