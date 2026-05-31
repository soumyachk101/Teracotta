import { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });

    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <div className="section">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1>Contact Us</h1>
          <p className="text-stone-600">
            Have questions? We'd love to hear from you. Send us a message
            and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-cream-100 rounded-xl">
                <Mail className="h-6 w-6 text-terracotta-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-stone-600 text-sm">orders@mittikala.com</p>
                <p className="text-stone-600 text-sm">support@mittikala.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-cream-100 rounded-xl">
                <Phone className="h-6 w-6 text-terracotta-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Phone</h3>
                <p className="text-stone-600 text-sm">+91 98765 43210</p>
                <p className="text-stone-500 text-xs">Mon-Sat, 10am-6pm IST</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-cream-100 rounded-xl">
                <MapPin className="h-6 w-6 text-terracotta-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Address</h3>
                <p className="text-stone-600 text-sm">
                  Mitti Kala Studio<br />
                  Bishnupur, Bankura<br />
                  West Bengal 722122<br />
                  India
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-cream-100 rounded-xl">
                <Clock className="h-6 w-6 text-terracotta-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Business Hours</h3>
                <p className="text-stone-600 text-sm">
                  Monday - Saturday: 10:00 AM - 6:00 PM IST<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-cream-100 rounded-3xl p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="input"
                />
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white text-stone-900 placeholder-stone-500 text-sm focus:outline-none focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-400/20 transition-all duration-300 resize-none"
                />
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="btn-primary w-full md:w-auto"
                >
                  {status === 'loading' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
                </button>
                {status === 'success' && (
                  <p className="text-green-600 text-sm mt-3">
                    Thank you for your message! We'll get back to you soon.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
