import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setStatus('success');
    setEmail('');

    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <section className="section bg-terracotta-500 text-white">
      <div className="container text-center max-w-2xl mx-auto">
        <h2 className="text-white mb-3">Join Our Community</h2>
        <p className="text-terracotta-100 mb-8">
          Subscribe to receive updates on new arrivals, artisan stories, and
          exclusive offers directly in your inbox.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-4 py-3 rounded-full text-stone-900 focus:outline-none focus:ring-2 focus:ring-terracotta-400 disabled:opacity-50"
            disabled={status === 'loading' || status === 'success'}
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="px-6 py-3 rounded-full bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
          </button>
        </form>

        {status === 'error' && (
          <p className="mt-3 text-sm text-red-200">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  );
}
