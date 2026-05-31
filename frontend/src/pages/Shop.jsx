import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../constants/queryKeys';
import { productService } from '../services/product.service';
import { cn } from '../utils/cn';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const categoryFilter = searchParams.get('category') || '';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, { category: categoryFilter, sortBy, page }],
    queryFn: () => productService.list({ category: categoryFilter, sortBy, page }),
  });

  const { data: categoryData } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: () => productService.getCategories(),
  });

  const categories = categoryData?.data || [];

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  const products = data?.products || [];
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="section">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="mb-1">Shop All</h1>
            <p className="text-stone-600">
              {data?.pagination?.total
                ? `${data.pagination.total} products`
                : 'Browse our collection'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile filter toggle */}
            <button
              className="md:hidden btn-outlined flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>

            <select
              value={sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="px-4 py-2 rounded-lg border border-cream-300 bg-white text-stone-700 text-sm focus:outline-none focus:border-terracotta-400"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside
            className={cn(
              'w-full md:w-64 flex-shrink-0',
              showFilters ? 'block' : 'hidden md:block'
            )}
          >
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="font-semibold text-stone-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => updateFilter('category', '')}
                    className={cn(
                      'block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                      !categoryFilter
                        ? 'bg-cream-200 text-terracotta-500 font-medium'
                        : 'text-stone-600 hover:bg-cream-100'
                    )}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateFilter('category', cat.slug)}
                      className={cn(
                        'block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                        categoryFilter === cat.slug
                          ? 'bg-cream-200 text-terracotta-500 font-medium'
                          : 'text-stone-600 hover:bg-cream-100'
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-stone-600">Something went wrong. Please try again.</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-stone-600">No products found.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      disabled={page <= 1}
                      onClick={() => updateFilter('page', String(page - 1))}
                      className="px-4 py-2 rounded-lg border border-cream-300 disabled:opacity-50 text-stone-700 hover:bg-cream-100"
                    >
                      Previous
                    </button>
                    <span className="text-stone-600">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => updateFilter('page', String(page + 1))}
                      className="px-4 py-2 rounded-lg border border-cream-300 disabled:opacity-50 text-stone-700 hover:bg-cream-100"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
