import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: 'All Products', href: '/shop' },
      { name: 'Bankura Horses', href: '/shop?category=horses' },
      { name: 'Terracotta Idols', href: '/shop?category=idols' },
      { name: 'Jewelry', href: '/shop?category=jewelry' },
    ],
    about: [
      { name: 'Our Story', href: '/about' },
      { name: 'Artisans', href: '/about#artisans' },
      { name: 'GI Tag', href: '/about#gi-tag' },
      { name: 'Sustainability', href: '/about#sustainability' },
    ],
    support: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQs', href: '/faq' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns & Refunds', href: '/returns' },
    ],
  };

  return (
    <footer className="bg-stone-900 text-cream-100">
      <div className="container section">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-3xl font-bold mb-4">Mitti Kala</h3>
            <p className="text-stone-300 mb-4 max-w-md">
              Preserving the 400-year-old terracotta craft tradition of Bishnupur.
              Every purchase directly supports master artisans of Bankura district.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-stone-300 hover:text-cream-100 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">About</h4>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-stone-300 hover:text-cream-100 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-stone-300 hover:text-cream-100 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-stone-800 mt-10 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-stone-300 text-sm">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>Bishnupur, Bankura, West Bengal 722122</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span>orders@mittikala.com</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-stone-800 mt-8 pt-8 text-center text-stone-400 text-sm">
          <p>&copy; {currentYear} Mitti Kala. All rights reserved.</p>
          <p className="mt-1">
            Built with love for the artisans of Bishnupur.
          </p>
        </div>
      </div>
    </footer>
  );
}
