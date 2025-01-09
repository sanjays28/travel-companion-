import React, { Suspense } from 'react';
import './App.css';
import ItineraryImport from './components/itinerary/ItineraryImport';
import ItineraryView from './components/itinerary/ItineraryView';
import ExpenseTracker from './components/expense/ExpenseTracker';

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-4">
          <h2 className="text-xl font-semibold text-red-600">Something went wrong</h2>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 btn-primary"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

function App() {
  const handleImportSuccess = (data) => {
    console.log('Itinerary imported successfully:', data);
    // You can add additional handling here if needed
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Travel Management
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <ItineraryImport onImportSuccess={handleImportSuccess} />
            <div className="mt-6">
              <ItineraryView />
            </div>
          </div>
          <div>
            <ExpenseTracker />
          </div>
            </div>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;
