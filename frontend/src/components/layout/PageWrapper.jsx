import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ErrorBoundary from '../shared/ErrorBoundary';
import SupportChat from '../shared/SupportChat';

function useScrollToHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // retry briefly: lazy-loaded page content may not be rendered yet
      let tries = 0;
      let id;
      const scroll = () => {
        const el = document.getElementById(hash.slice(1));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else if (tries++ < 60) id = requestAnimationFrame(scroll);
      };
      id = requestAnimationFrame(scroll);
      return () => cancelAnimationFrame(id);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
}

export default function PageWrapper({ children }) {
  useScrollToHash();
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
