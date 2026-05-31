import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ErrorBoundary from '../shared/ErrorBoundary';
import SupportChat from '../shared/SupportChat';

export default function PageWrapper({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <ErrorBoundary>
          {children || <Outlet />}
        </ErrorBoundary>
      </main>
      <Footer />
      <SupportChat />
    </div>
  );
}
