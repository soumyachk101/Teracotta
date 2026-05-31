import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { mockCategories } from '../../data/products';
import AnimateIn from '../shared/AnimateIn';

export default function CategoryGrid() {

  return (
    <section className="section">
      <div className="container">
        <div className="text-center mb-12">
          <h2>Shop by Category</h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Explore our curated collections of authentic terracotta crafts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCategories.slice(0, 6).map((category, index) => (
            <AnimateIn key={category.id} variant="fade-up" delay={index * 100}>
              <Link
                to={`/shop?category=${category.slug}`}
                className="group relative aspect-[4/3] rounded-3xl overflow-hidden shadow-warm hover:shadow-warm-lg transition-shadow duration-300"
              >
                {/* Placeholder background - replace with actual image */}
                <div className="absolute inset-0 bg-gradient-to-br from-terracotta-100 to-cream-200">
                  {/* Image would go here */}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/20 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h3 className="font-display text-2xl font-bold text-white mb-1">
                    {category.name}
                  </h3>
                  <p className="text-cream-100 text-sm mb-3">
                    {category.productCount} products
                  </p>
                  <div className="flex items-center gap-2 text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
