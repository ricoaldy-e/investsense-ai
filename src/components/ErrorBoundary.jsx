import { Component } from 'react';
import SystemError from '../pages/SystemError';

/**
 * ErrorBoundary — React class component that catches JavaScript errors
 * in its child component tree and renders a fallback UI instead of
 * crashing the entire application to a blank white screen.
 * 
 * Usage:
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 * 
 * Must be a class component — React does not support error boundaries
 * with function components / hooks.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log to console in development — replace with monitoring service in production
    console.error('[InvestSense ErrorBoundary] Uncaught Exception:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return <SystemError onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
