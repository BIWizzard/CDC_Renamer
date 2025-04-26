import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch JavaScript errors anywhere in child component tree
 * Displays a fallback UI instead of crashing the whole app
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
    
    // Here you could send error to a logging service
    // Example: logErrorToService(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="error-boundary-fallback">
          <div className="error-container">
            <h2>Something went wrong</h2>
            <p>The application encountered an unexpected error. Please try refreshing the page or restarting the application.</p>
            {process.env.NODE_ENV !== 'production' && (
              <details style={{ whiteSpace: 'pre-wrap' }}>
                <summary>Error Details</summary>
                <p>{this.state.error && this.state.error.toString()}</p>
                <p>Component Stack Error Details:</p>
                <p>{this.state.errorInfo && this.state.errorInfo.componentStack}</p>
              </details>
            )}
            <button
              className="button button-blue mt-4"
              onClick={() => window.location.reload()}
            >
              Refresh Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;