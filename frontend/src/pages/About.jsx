import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="section">
      <div className="container">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="mb-4">Our Story</h1>
          <p className="text-lg text-stone-600">
            Preserving a 400-year-old terracotta tradition, one handcrafted piece at a time.
          </p>
        </div>

        {/* Story Section */}
        <div id="artisans" className="grid lg:grid-cols-2 gap-12 items-center mb-20 scroll-mt-24">
          <div>
            <h2 className="text-3xl mb-4">Maati ki mahak, haath ki kala</h2>
            <p className="text-stone-700 mb-4 leading-relaxed">
              Mitti Kala was born from a simple observation: the master artisans of
              Bishnupur and Panchmura were selling their exquisite terracotta crafts
              through middlemen, earning barely enough to sustain their families. Meanwhile,
              buyers across India and the world struggled to find authentic, GI-tagged
              terracotta pieces.
            </p>
            <p className="text-stone-700 mb-4 leading-relaxed">
              We built this platform to bridge that gap. By connecting artisans directly
              with you, we ensure that 70%+ of every sale goes to the craftsperson who
              spent days shaping, drying, and firing each piece in their traditional kilns.
            </p>
            <p className="text-stone-700 leading-relaxed">
              Every purchase you make supports a 400-year-old craft tradition and provides
              sustainable income to the families who have kept this art alive through generations.
            </p>
          </div>
          <div className="aspect-square bg-gradient-to-br from-terracotta-100 to-cream-200 rounded-3xl flex items-center justify-center">
            {/* Placeholder for story image */}
            <div className="text-center text-stone-400">
              <svg className="w-24 h-24 mx-auto mb-4" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 72 L25 90 L35 60 L10 40 L40 40 Z" />
              </svg>
              <p>400 Years of Craftsmanship</p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div id="gi-tag" className="grid md:grid-cols-3 gap-8 mb-20 scroll-mt-24">
          <div className="card-section text-center">
            <h3 className="font-display text-xl font-semibold mb-3">Authentic GI-Tagged</h3>
            <p className="text-stone-600 text-sm">
              Every piece is certified authentic terracotta from Bishnupur, carrying the
              prestigious Geographical Indication tag.
            </p>
          </div>
          <div className="card-section text-center">
            <h3 className="font-display text-xl font-semibold mb-3">Fair Income</h3>
            <p className="text-stone-600 text-sm">
              Artisans receive 70%+ of the sale price. No middlemen, no exploitation,
              just fair compensation for their incredible skill.
            </p>
          </div>
          <div className="card-section text-center">
            <h3 className="font-display text-xl font-semibold mb-3">Handcrafted Quality</h3>
            <p className="text-stone-600 text-sm">
              Each piece is made by hand using traditional techniques. No mass production,
              no machines — just pure artisan craft.
            </p>
          </div>
        </div>

        {/* Sustainability */}
        <div id="sustainability" className="grid lg:grid-cols-2 gap-12 items-center mb-20 scroll-mt-24">
          <div className="aspect-square bg-gradient-to-br from-cream-200 to-terracotta-100 rounded-3xl flex items-center justify-center order-last lg:order-first">
            <div className="text-center text-stone-400">
              <svg className="w-24 h-24 mx-auto mb-4" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 15 C30 35, 20 55, 30 75 C40 90, 60 90, 70 75 C80 55, 70 35, 50 15 Z M50 40 L50 80" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
              <p>Earth to Earth</p>
            </div>
          </div>
          <div>
            <h2 className="text-3xl mb-4">Sustainability</h2>
            <p className="text-stone-700 mb-4 leading-relaxed">
              Terracotta is one of the most sustainable crafts on earth. Each piece begins
              as local river clay, shaped by hand and fired in traditional wood kilns —
              no plastics, no chemicals, no factory emissions.
            </p>
            <p className="text-stone-700 leading-relaxed">
              Our packaging uses recycled and biodegradable materials, and every piece is
              fully compostable at the end of its long life. When you buy terracotta, you
              buy something that returns to the earth it came from.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-cream-200 rounded-3xl p-12">
          <h2 className="mb-4">Explore Our Collection</h2>
          <p className="text-stone-600 mb-8">
            Discover terracotta crafts made with love, tradition, and centuries of skill.
          </p>
          <Link to="/shop" className="btn-primary">
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}
