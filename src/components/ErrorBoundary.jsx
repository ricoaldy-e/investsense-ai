import { Component } from 'react';
import SystemError from '../pages/SystemError';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
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
