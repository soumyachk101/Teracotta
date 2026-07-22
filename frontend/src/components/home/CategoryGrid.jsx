import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/product.service';
import { QUERY_KEYS } from '../../constants/queryKeys';
import { mockCategories } from '../../data/products';
import AnimateIn from '../shared/AnimateIn';

const CATEGORY_IMAGE_MAP = {
  horses: '/images/bankura_horse.png',
  idols: '/images/terracotta_ganesha.png',
  jewelry: '/images/terracotta_jewelry.png',
  panels: '/images/temple_tile.png',
  decor: '/images/terracotta_vase.png',
  planters: '/images/hero_banner.png',
};

export default function CategoryGrid() {
  const { data } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: async () => {
      try {
        const res = await productService.getCategories();
        return Array.isArray(res) && res.length > 0 ? res : mockCategories;
      } catch {
        return mockCategories;
      }
    },
  });

  const categories = data || mockCategories;

  return (
    <section className="section bg-cream-50/50">
      <div className="container">
        <div className="text-center mb-12">
          <span className="inline-block text-terracotta-500 font-semibold tracking-widest text-xs uppercase mb-2">
            Handcrafted Collections
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-stone-900">Shop by Category</h2>
          <p className="text-stone-600 max-w-2xl mx-auto mt-3 text-base">
            Explore our curated collections of authentic GI-tagged terracotta crafts directly from master artisans
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.slice(0, 6).map((category, index) => {
            const categoryImage = category.image || CATEGORY_IMAGE_MAP[category.slug] || '/images/bankura_horse.png';

            return (
              <AnimateIn key={category.id || category.slug} variant="fade-up" delay={index * 100} className="w-full">
                <Link
                  to={`/shop?category=${category.slug}`}
                  className="group relative block w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-warm hover:shadow-warm-lg transition-all duration-300 border border-stone-200/60 bg-cream-200"
                >
                  {/* Background Image */}
                  <img
                    src={categoryImage}
                    alt={category.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Dark Gradient Overlay for perfect text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-900/35 to-transparent pointer-events-none" />

                  {/* Card Text Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 z-10">
                    <h3 className="font-display text-2xl font-bold text-white mb-1 drop-shadow-md">
                      {category.name}
                    </h3>
                    <p className="text-cream-200/90 text-sm mb-3 font-medium">
                      {category.productCount ? `${category.productCount} products` : 'Handcrafted Craft'}
                    </p>
                    <div className="flex items-center gap-2 text-terracotta-300 font-semibold text-sm group-hover:text-white transition-colors duration-300">
                      <span>Explore Collection</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5 duration-300" />
                    </div>
                  </div>
                </Link>
              </AnimateIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
