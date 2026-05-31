import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '../product/ProductCard';
import { ProductCardSkeleton } from '../ui/Skeleton';
import { productService } from '../../services/product.service';
import { QUERY_KEYS } from '../../constants/queryKeys';
import { mockProducts } from '../../data/products';

export default function FeaturedProducts() {
  const { data, isLoading: loading } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS_FEATURED],
    queryFn: async () => {
      try {
        const res = await productService.getFeatured();
        return res?.products || res || [];
      } catch {
        return mockProducts.slice(0, 4);
      }
    },
  });

  const products = data || [];

  return (
    <section className="section bg-cream-100">
      <div className="container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="mb-2">Featured Collection</h2>
            <p className="text-stone-600">
              Handpicked pieces from our most loved artisans
            </p>
          </div>
          <Link
            to="/shop"
            className="hidden md:inline-flex items-center gap-2 text-terracotta-500 hover:text-terracotta-600 font-medium"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
