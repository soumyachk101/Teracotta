import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="section">
      <div className="container text-center py-20">
        <div className="w-32 h-32 mx-auto mb-6 text-terracotta-500">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="50" cy="50" r="45" />
            <path d="M30 50 L45 65 L70 35" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="text-6xl font-display font-bold text-terracotta-500 mb-4">404</h1>
        <h2 className="text-2xl mb-3">Page Not Found</h2>
        <p className="text-stone-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for seems to have drifted away like a clay pot in the kiln.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
