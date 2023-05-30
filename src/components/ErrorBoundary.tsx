import React, { ErrorInfo, ReactNode } from 'react';
import ErrorPage from '../pages/_error';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage err={this.state.error} />;
    }

    return this.props.children;
  }
}
