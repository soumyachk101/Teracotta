import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import CartDrawer from '../cart/CartDrawer';
import { useUIStore } from '../../store/uiStore';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getItemCount } = useCartStore();
  const { user, isAuthenticated, logout } = useAuth();
  const cartItemCount = getItemCount();
  const { isCartDrawerOpen, openCartDrawer, closeCartDrawer } = useUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-warm py-3'
          : 'bg-cream-100 py-5'
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display text-2xl md:text-3xl font-bold text-stone-900">
          Mitti Kala
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-stone-700 hover:text-terracotta-500 transition-colors font-medium"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isSearchOpen ? (
            <form onSubmit={(e) => { e.preventDefault(); navigate(`/shop?q=${encodeURIComponent(searchQuery)}`); setIsSearchOpen(false); setSearchQuery(''); }} className="flex items-center gap-2">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search terracotta..."
                className="px-3 py-1.5 rounded-lg border border-cream-300 text-sm focus:outline-none focus:border-terracotta-400 w-48"
              />
              <button type="button" onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="p-1 text-stone-500 hover:text-stone-700">
                <X className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <button onClick={() => setIsSearchOpen(true)} className="p-2 hover:bg-cream-200 rounded-full transition-colors">
              <Search className="h-5 w-5 text-stone-700" />
            </button>
          )}

          {isAuthenticated ? (
            <div className="relative group">
              <button className="p-2 hover:bg-cream-200 rounded-full transition-colors">
                <User className="h-5 w-5 text-stone-700" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-warm-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-3 border-b border-cream-200">
                  <p className="font-medium text-stone-900">{user?.name}</p>
                  <p className="text-sm text-stone-500">{user?.email}</p>
                </div>
                <div className="p-2">
                  <Link
                    to="/orders"
                    className="block px-3 py-2 rounded-lg hover:bg-cream-100 text-stone-700 text-sm"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block px-3 py-2 rounded-lg hover:bg-cream-100 text-stone-700 text-sm"
                  >
                    Wishlist
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-cream-100 text-stone-700 text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="p-2 hover:bg-cream-200 rounded-full transition-colors"
            >
              <User className="h-5 w-5 text-stone-700" />
            </Link>
          )}

          <button
            onClick={openCartDrawer}
            className="relative p-2 hover:bg-cream-200 rounded-full transition-colors"
          >
            <ShoppingBag className="h-5 w-5 text-stone-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-terracotta-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={openCartDrawer}
            className="relative p-2"
          >
            <ShoppingBag className="h-5 w-5 text-stone-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-terracotta-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-stone-700" />
            ) : (
              <Menu className="h-6 w-6 text-stone-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-cream-200 mt-2">
          <nav className="container py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block py-2 text-stone-700 hover:text-terracotta-500 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-cream-200">
              {isAuthenticated ? (
                <>
                  <p className="text-sm text-stone-500 mb-2">{user?.email}</p>
                  <Link
                    to="/orders"
                    className="block py-2 text-stone-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    className="block py-2 text-stone-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block py-2 text-stone-700"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="block w-full btn-primary text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full btn-outlined text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
      <CartDrawer isOpen={isCartDrawerOpen} onClose={closeCartDrawer} />
    </header>
  );
}
