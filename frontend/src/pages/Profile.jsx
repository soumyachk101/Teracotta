import { Link, Navigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, LogOut, Edit3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/product.service';

export default function Profile() {
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();

  const { data: profileData } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => authService.me(),
    enabled: isAuthenticated,
  });

  if (authLoading) {
    return (
      <div className="section">
        <div className="container flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta-500"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const displayUser = profileData || user;

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <div className="section">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-2">My Profile</h1>
          <p className="text-stone-600">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="card-section text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-terracotta-200 to-cream-300 flex items-center justify-center">
                {displayUser?.avatar ? (
                  <img
                    src={displayUser.avatar}
                    alt={displayUser.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-terracotta-500" />
                )}
              </div>
              <h2 className="font-display text-xl font-semibold text-stone-900 mb-1">
                {displayUser?.name || 'User'}
              </h2>
              <p className="text-sm text-stone-500 mb-4">{displayUser?.email}</p>
              <button className="btn-outlined w-full text-sm flex items-center justify-center gap-2">
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </button>
            </div>

            {/* Quick Links */}
            <div className="mt-6 space-y-2">
              <Link
                to="/orders"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream-100 transition-colors"
              >
                <Package className="h-5 w-5 text-terracotta-500" />
                <span className="text-stone-700">My Orders</span>
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream-100 transition-colors"
              >
                <svg className="h-5 w-5 text-terracotta-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-stone-700">Wishlist</span>
              </Link>
              <Link
                to="/addresses"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream-100 transition-colors"
              >
                <MapPin className="h-5 w-5 text-terracotta-500" />
                <span className="text-stone-700">Addresses</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors text-red-600"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="card-section">
              <h2 className="font-semibold text-lg mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <User className="h-5 w-5 text-stone-400" />
                  <div>
                    <p className="text-sm text-stone-500">Full Name</p>
                    <p className="font-medium text-stone-900">{displayUser?.name || 'Not set'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-stone-400" />
                  <div>
                    <p className="text-sm text-stone-500">Email Address</p>
                    <p className="font-medium text-stone-900">{displayUser?.email || 'Not set'}</p>
                    <p className="text-xs text-stone-400">
                      {displayUser?.emailVerified ? '✓ Verified' : 'Not verified'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="h-5 w-5 text-stone-400" />
                  <div>
                    <p className="text-sm text-stone-500">Phone Number</p>
                    <p className="font-medium text-stone-900">{displayUser?.phone || 'Not set'}</p>
                    <p className="text-xs text-stone-400">
                      {displayUser?.phoneVerified ? '✓ Verified' : 'Not verified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Total Orders', value: displayUser?.orderCount || 0 },
                { label: 'Wishlist Items', value: displayUser?.wishlistCount || 0 },
                { label: 'Reviews', value: displayUser?.reviewCount || 0 },
              ].map((stat) => (
                <div key={stat.label} className="card-section text-center">
                  <p className="text-3xl font-bold text-terracotta-500 mb-1">{stat.value}</p>
                  <p className="text-sm text-stone-600">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="card-section">
              <h2 className="font-semibold text-lg mb-4">Recent Activity</h2>
              <p className="text-stone-600 text-sm">
                Your account activity will appear here. Stay tuned for updates!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
