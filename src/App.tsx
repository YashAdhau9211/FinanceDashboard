import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ToastContainer } from './components/Toast';
import { SkipLink } from './components/SkipLink';
import { BottomTabBar } from './components/BottomTabBar';

// Lazy load route components for code splitting
const Dashboard = lazy(() =>
  import('./pages/Dashboard').then((module) => ({ default: module.Dashboard }))
);
const Transactions = lazy(() =>
  import('./pages/Transactions').then((module) => ({ default: module.Transactions }))
);
const Insights = lazy(() =>
  import('./pages/Insights').then((module) => ({ default: module.Insights }))
);

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SkipLink />
      <ToastContainer />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/insights" element={<Insights />} />
        </Routes>
      </Suspense>
      <BottomTabBar />
    </BrowserRouter>
  );
}

export default App;
