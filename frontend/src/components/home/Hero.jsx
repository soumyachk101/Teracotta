import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-cream-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="1" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-up">
            <span className="inline-block text-terracotta-500 font-medium tracking-wider text-sm uppercase">
              Handcrafted in Bishnupur
            </span>

            <h1 className="text-stone-900">
              Maati ki mahak,<br />
              <span className="text-terracotta-500">haath ki kala</span>
            </h1>

            <p className="text-lg text-stone-700 max-w-lg leading-relaxed">
              Discover authentic, GI-tagged terracotta crafts directly from the
              master artisans of Bankura. Each piece tells a 400-year-old story
              of earth, fire, and human hands.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
                Explore Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/about" className="btn-outlined">
                Our Story
              </Link>
            </div>

            <div className="flex items-center gap-12 pt-4">
              <div>
                <p className="text-4xl font-display font-bold text-terracotta-500">50+</p>
                <p className="text-stone-600 text-sm">Artisans</p>
              </div>
              <div>
                <p className="text-4xl font-display font-bold text-terracotta-500">400</p>
                <p className="text-stone-600 text-sm">Year Tradition</p>
              </div>
              <div>
                <p className="text-4xl font-display font-bold text-terracotta-500">100%</p>
                <p className="text-stone-600 text-sm">Authentic</p>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-up lg:animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="relative">
              {/* Hero Image */}
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-warm-lg border-4 border-white/60 bg-cream-200">
                <img
                  src="/images/hero_banner.png"
                  alt="Authentic Bishnupur Terracotta Pottery Workshop"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-warm p-4 border border-terracotta-100 animate-float">
                <p className="font-display text-xl font-bold text-terracotta-500">🌾 GI Tagged Craft</p>
                <p className="text-xs text-stone-600 font-medium">Bishnupur & Panchmura</p>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-warm p-4 border border-terracotta-100 animate-float" style={{ animationDelay: '1s' }}>
                <p className="font-display text-lg font-semibold text-stone-900">✨ 100% Hand-Fired</p>
                <p className="text-xs text-stone-600 font-medium">Direct from Master Artisans</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
