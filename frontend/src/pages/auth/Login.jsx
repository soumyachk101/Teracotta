import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SEOHead from '../../components/shared/SEOHead';
import AnimateIn from '../../components/shared/AnimateIn';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEOHead 
        title="Sign In — Mitti Kala | Authentic Bishnupur Terracotta"
        description="Sign in to your Mitti Kala account to manage orders, wishlist, and support Bankura artisans."
      />

      <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-cream-50 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-terracotta-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="container max-w-5xl relative z-10">
          <AnimateIn variant="fade-up" duration={400}>
            <div className="grid lg:grid-cols-12 rounded-3xl overflow-hidden shadow-warm-lg bg-white border border-stone-200/60">
              
              {/* Left Column - Heritage Showcase (Desktop Only) */}
              <div className="hidden lg:flex lg:col-span-5 relative bg-stone-900 text-white p-10 flex-col justify-between overflow-hidden">
                <img
                  src="/images/hero_banner.png"
                  alt="Bishnupur Terracotta Workshop"
                  className="absolute inset-0 w-full h-full object-cover opacity-45 transform hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent" />
                
                <div className="relative z-10">
                  <Link to="/" className="inline-flex items-center gap-2 text-xl font-display font-bold text-cream-100 tracking-wider">
                    <span className="w-8 h-8 rounded-full bg-terracotta-500 text-white flex items-center justify-center text-sm font-sans">🏺</span>
                    MITTI KALA
                  </Link>
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cream-200 text-xs font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-terracotta-400" />
                    400-Year GI Tagged Heritage
                  </div>
                  <h2 className="font-display text-3xl font-bold leading-tight text-cream-100">
                    Welcome Back to Artisan Luxury
                  </h2>
                  <p className="text-stone-300 text-sm leading-relaxed">
                    Log in to continue supporting master craftsmen from Panchmura and Bishnupur directly.
                  </p>
                  
                  <div className="pt-4 border-t border-white/10 flex items-center gap-3 text-xs text-stone-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Verified Authenticity & Direct Artisan Support</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Form */}
              <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                  
                  <div className="mb-8">
                    <h1 className="font-display text-3xl font-bold text-stone-900 mb-2">
                      Sign In
                    </h1>
                    <p className="text-stone-600 text-sm">
                      Enter your details to access your account & orders
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6 text-sm flex items-center gap-2 animate-fade-in">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Email Input */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-cream-50/60 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20 transition-all duration-200 text-sm"
                          placeholder="name@example.com"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                          Password
                        </label>
                        <Link 
                          to="/forgot-password" 
                          className="text-xs font-medium text-terracotta-600 hover:text-terracotta-700 transition-colors"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-10 pr-11 py-3 bg-cream-50/60 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20 transition-all duration-200 text-sm"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors p-1"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember me */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        id="remember-me"
                        type="checkbox"
                        className="w-4 h-4 rounded border-stone-300 text-terracotta-600 focus:ring-terracotta-500/30 accent-terracotta-500"
                      />
                      <label htmlFor="remember-me" className="text-xs text-stone-600 cursor-pointer select-none">
                        Keep me signed in on this device
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 shadow-warm font-medium"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Signing in...
                        </span>
                      ) : (
                        <>
                          Sign In to Account
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Switch to Register */}
                  <div className="mt-8 pt-6 border-t border-stone-100 text-center">
                    <p className="text-stone-600 text-sm">
                      New to Mitti Kala?{' '}
                      <Link 
                        to="/register" 
                        className="text-terracotta-600 hover:text-terracotta-700 font-semibold inline-flex items-center gap-1 hover:underline"
                      >
                        Create an Account
                      </Link>
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </AnimateIn>
        </div>
      </div>
    </>
  );
}
