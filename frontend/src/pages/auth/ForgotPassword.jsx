import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authService } from '../../services/product.service';
import { cn } from '../../utils/cn';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="section min-h-[60vh] flex items-center justify-center">
        <div className="container max-w-md">
          <div className="card-section text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-display font-semibold mb-4">Check Your Email</h1>
            <p className="text-stone-600 mb-8">
              We've sent password reset instructions to <strong>{email}</strong>. Please check your inbox and follow the link to reset your password.
            </p>
            <Link to="/login" className="btn-primary">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section min-h-[60vh] flex items-center justify-center">
      <div className="container max-w-md">
        <div className="card-section py-8 px-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-terracotta-500 mb-6 transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-semibold mb-2">
              Forgot Password?
            </h1>
            <p className="text-stone-600 text-sm">
              No worries, we'll send you reset instructions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                'btn-primary w-full',
                loading && 'opacity-70 cursor-not-allowed'
              )}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-terracotta-500 hover:text-terracotta-600 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
