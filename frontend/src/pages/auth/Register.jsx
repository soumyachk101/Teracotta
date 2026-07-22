import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SEOHead from '../../components/shared/SEOHead';
import AnimateIn from '../../components/shared/AnimateIn';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (formData.name.trim().length < 2) newErrors.name = 'Full name must be at least 2 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters long';
    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone.trim())) newErrors.phone = 'Please enter a valid 10-digit mobile number';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Registration failed. Please try again.';
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEOHead 
        title="Create Account — Mitti Kala | Support Bishnupur Artisans"
        description="Join Mitti Kala to buy authentic GI-tagged terracotta crafts directly from Bankura master craftsmen."
      />

      <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-cream-50 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-terracotta-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="container max-w-5xl relative z-10">
          <AnimateIn variant="fade-up" duration={400}>
            <div className="grid lg:grid-cols-12 rounded-3xl overflow-hidden shadow-warm-lg bg-white border border-stone-200/60">
              
              {/* Left Column - Heritage Showcase (Desktop Only) */}
              <div className="hidden lg:flex lg:col-span-5 relative bg-stone-900 text-white p-10 flex-col justify-between overflow-hidden">
                <img
                  src="/images/artisan_crafting.png"
                  alt="Master Terracotta Artisan"
                  className="absolute inset-0 w-full h-full object-cover opacity-50 transform hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/50 to-transparent" />
                
                <div className="relative z-10">
                  <Link to="/" className="inline-flex items-center gap-2 text-xl font-display font-bold text-cream-100 tracking-wider">
                    <span className="w-8 h-8 rounded-full bg-terracotta-500 text-white flex items-center justify-center text-sm font-sans">🏺</span>
                    MITTI KALA
                  </Link>
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cream-200 text-xs font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-terracotta-400" />
                    Empower 50+ Rural Artisans
                  </div>
                  <h2 className="font-display text-3xl font-bold leading-tight text-cream-100">
                    Join Our Heritage Community
                  </h2>
                  
                  <ul className="space-y-2.5 text-xs text-stone-200">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-terracotta-400 flex-shrink-0" />
                      <span>Direct-from-artisan pricing with no middlemen</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-terracotta-400 flex-shrink-0" />
                      <span>Authentic GI-tagged Bankura terracotta certificate</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-terracotta-400 flex-shrink-0" />
                      <span>Exclusive access to limited edition craft drops</span>
                    </li>
                  </ul>
                  
                  <div className="pt-4 border-t border-white/10 flex items-center gap-3 text-xs text-stone-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Safe & Encrypted 1-Click Registration</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Form */}
              <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                  
                  <div className="mb-6">
                    <h1 className="font-display text-3xl font-bold text-stone-900 mb-2">
                      Create Account
                    </h1>
                    <p className="text-stone-600 text-sm">
                      Sign up to start collecting handcrafted terracotta art
                    </p>
                  </div>

                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl mb-6 text-sm flex items-center gap-2 animate-fade-in">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      {errors.general}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-cream-50/60 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20 transition-all duration-200 text-sm"
                          placeholder="Kartik Kumbhakar"
                        />
                      </div>
                      {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-cream-50/60 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20 transition-all duration-200 text-sm"
                          placeholder="name@example.com"
                        />
                      </div>
                      {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                        Mobile Number <span className="text-stone-400 font-normal uppercase">(Optional)</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-cream-50/60 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20 transition-all duration-200 text-sm"
                          placeholder="10-digit mobile number"
                        />
                      </div>
                      {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full pl-10 pr-11 py-3 bg-cream-50/60 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/20 transition-all duration-200 text-sm"
                          placeholder="At least 8 characters"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors p-1"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 shadow-warm font-medium mt-2"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Creating account...
                        </span>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Switch to Sign In */}
                  <div className="mt-6 pt-5 border-t border-stone-100 text-center">
                    <p className="text-stone-600 text-sm">
                      Already have an account?{' '}
                      <Link 
                        to="/login" 
                        className="text-terracotta-600 hover:text-terracotta-700 font-semibold inline-flex items-center gap-1 hover:underline"
                      >
                        Sign In
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
