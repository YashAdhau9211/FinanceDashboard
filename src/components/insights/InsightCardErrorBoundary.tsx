import React, { Component } from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  cardTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class InsightCardErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('InsightCard error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-white dark:bg-navy-800 rounded-lg p-6 shadow-sm border border-red-200 dark:border-red-700">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="text-red-500 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Unable to Load {this.props.cardTitle || 'Insight'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              An error occurred while loading this insight card.
            </p>
            <button
              onClick={this.handleRetry}
              className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors duration-200"
              aria-label="Retry loading insight"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default InsightCardErrorBoundary;
