import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { ClothingCategory, ClothingSize } from '../types';
import { Search, SlidersHorizontal, X, ArrowUpDown, Check } from 'lucide-react';

const CATEGORIES: ClothingCategory[] = [
  'T-Shirts',
  'Hoodies',
  'Shirts',
  'Pants',
  'Jackets',
  'Sweatpants',
];

const SIZES: ClothingSize[] = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

const COLORS = [
  { name: 'Black', hex: '#111111' },
  { name: 'White', hex: '#F4F4F4' },
  { name: 'Gray', hex: '#4A4A4A' },
  { name: 'Beige', hex: '#C2B69D' },
  { name: 'Brown', hex: '#3E2C22' },
  { name: 'Navy', hex: '#1B2430' },
];

const PRICE_RANGES = ['Under $50', '$50–$100', '$100–$150', '$150+'];

export const ShopPage: React.FC = () => {
  const { products } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL State
  const initialCategory = searchParams.get('category') as ClothingCategory | null;
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'featured';

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('All');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortOption, setSortOption] = useState<string>(initialSort);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Synchronize when searchParams change
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const s = searchParams.get('search');
    if (s !== null) setSearchQuery(s);
    const sort = searchParams.get('sort');
    if (sort) setSortOption(sort);
  }, [searchParams]);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedSize('All');
    setSelectedColor('All');
    setSelectedPriceRange('All');
    setSelectedAvailability('All');
    setSearchQuery('');
    setSortOption('featured');
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedSize !== 'All' ||
    selectedColor !== 'All' ||
    selectedPriceRange !== 'All' ||
    selectedAvailability !== 'All' ||
    searchQuery.trim().length > 0;

  // Filter Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Size
    if (selectedSize !== 'All') {
      result = result.filter((p) => p.sizes.includes(selectedSize as ClothingSize));
    }

    // Color
    if (selectedColor !== 'All') {
      result = result.filter((p) =>
        p.colors.some((c) => c.name.toLowerCase() === selectedColor.toLowerCase())
      );
    }

    // Price Range
    if (selectedPriceRange !== 'All') {
      if (selectedPriceRange === 'Under $50') {
        result = result.filter((p) => p.price < 50);
      } else if (selectedPriceRange === '$50–$100') {
        result = result.filter((p) => p.price >= 50 && p.price <= 100);
      } else if (selectedPriceRange === '$100–$150') {
        result = result.filter((p) => p.price > 100 && p.price <= 150);
      } else if (selectedPriceRange === '$150+') {
        result = result.filter((p) => p.price > 150);
      }
    }

    // Availability
    if (selectedAvailability !== 'All') {
      if (selectedAvailability === 'In Stock') {
        result = result.filter((p) => p.stock > 0);
      } else if (selectedAvailability === 'Out of Stock') {
        result = result.filter((p) => p.stock <= 0);
      }
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortOption === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOption === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [
    products,
    selectedCategory,
    selectedSize,
    selectedColor,
    selectedPriceRange,
    selectedAvailability,
    searchQuery,
    sortOption,
  ]);

  return (
    <div id="shop-page" className="w-full bg-[#111111] text-white min-h-screen pb-24">
      {/* Page Header */}
      <div className="bg-[#181818] border-b border-[#333333] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] font-bold text-[#808080] uppercase tracking-[0.3em] block mb-2">
            MEN'S COLLECTION
          </span>
          <h1 className="font-['Syne',sans-serif] text-4xl sm:text-5xl font-extrabold uppercase tracking-wider text-white">
            SHOP AVIRO
          </h1>
          <p className="text-xs sm:text-sm text-[#B3B3B3] max-w-xl mt-2 font-light">
            Engineered streetwear and luxury menswear essentials. Available in sizes S through 3XL.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Top Control Bar: Search, Mobile Filter Trigger, Sort */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#333333]">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <input
              id="input-shop-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products or fabrics..."
              className="w-full bg-[#181818] border border-[#333333] pl-9 pr-4 py-2.5 text-xs text-white placeholder-[#808080] focus:border-white focus:outline-none transition-colors"
            />
            <Search className="w-4 h-4 text-[#808080] absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#808080] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            {/* Mobile Filter Toggle */}
            <button
              id="btn-toggle-filters-mobile"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-[#181818] border border-[#333333] text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#202020] transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters {hasActiveFilters && '•'}
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#808080] uppercase tracking-wider hidden sm:inline">
                Sort By:
              </span>
              <div className="relative">
                <select
                  id="select-shop-sort"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-[#181818] border border-[#333333] text-white text-xs px-3.5 py-2.5 focus:border-white focus:outline-none cursor-pointer uppercase tracking-wider"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest Drops</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Customer Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 py-4 border-b border-[#333333]/60 text-xs">
            <span className="text-[#808080] text-[11px] uppercase tracking-wider mr-1">
              Active Filters:
            </span>
            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#181818] border border-[#333333] text-white">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('All')}>
                  <X className="w-3 h-3 text-[#808080] hover:text-white" />
                </button>
              </span>
            )}
            {selectedSize !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#181818] border border-[#333333] text-white">
                Size: {selectedSize}
                <button onClick={() => setSelectedSize('All')}>
                  <X className="w-3 h-3 text-[#808080] hover:text-white" />
                </button>
              </span>
            )}
            {selectedColor !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#181818] border border-[#333333] text-white">
                Color: {selectedColor}
                <button onClick={() => setSelectedColor('All')}>
                  <X className="w-3 h-3 text-[#808080] hover:text-white" />
                </button>
              </span>
            )}
            {selectedPriceRange !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#181818] border border-[#333333] text-white">
                Price: {selectedPriceRange}
                <button onClick={() => setSelectedPriceRange('All')}>
                  <X className="w-3 h-3 text-[#808080] hover:text-white" />
                </button>
              </span>
            )}
            {selectedAvailability !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#181818] border border-[#333333] text-white">
                {selectedAvailability}
                <button onClick={() => setSelectedAvailability('All')}>
                  <X className="w-3 h-3 text-[#808080] hover:text-white" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#181818] border border-[#333333] text-white">
                "{searchQuery}"
                <button onClick={() => setSearchQuery('')}>
                  <X className="w-3 h-3 text-[#808080] hover:text-white" />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-[11px] font-semibold text-[#808080] hover:text-white underline ml-2 uppercase tracking-wider"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Grid with Sidebar Filter Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-6">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-8 pr-6 border-r border-[#333333]/60">
            {/* Category Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-3">
                CATEGORY
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full text-left text-xs py-1 transition-colors flex items-center justify-between ${
                    selectedCategory === 'All'
                      ? 'text-white font-bold'
                      : 'text-[#B3B3B3] hover:text-white'
                  }`}
                >
                  <span>All Garments</span>
                  <span className="text-[10px] text-[#808080]">{products.length}</span>
                </button>
                {CATEGORIES.map((cat) => {
                  const count = products.filter((p) => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left text-xs py-1 transition-colors flex items-center justify-between ${
                        selectedCategory === cat
                          ? 'text-white font-bold'
                          : 'text-[#B3B3B3] hover:text-white'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className="text-[10px] text-[#808080]">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Filter (S to 3XL) */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-3">
                SIZE
              </h3>
              <div className="grid grid-cols-3 gap-1.5">
                {['All', ...SIZES].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-xs font-semibold uppercase tracking-wider border transition-colors ${
                      selectedSize === size
                        ? 'bg-white text-black border-white'
                        : 'bg-[#181818] text-[#B3B3B3] border-[#333333] hover:border-[#555555] hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-3">
                COLOR
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedColor('All')}
                  className={`text-xs py-0.5 block ${
                    selectedColor === 'All' ? 'text-white font-bold' : 'text-[#B3B3B3] hover:text-white'
                  }`}
                >
                  All Colors
                </button>
                <div className="flex flex-wrap gap-2 pt-1">
                  {COLORS.map((col) => (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(col.name)}
                      className={`flex items-center gap-2 px-2.5 py-1.5 bg-[#181818] border transition-all text-xs ${
                        selectedColor === col.name
                          ? 'border-white text-white'
                          : 'border-[#333333] text-[#B3B3B3] hover:border-[#555555]'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-[#444444]"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-3">
                PRICE
              </h3>
              <div className="space-y-1.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[#B3B3B3] hover:text-white">
                  <input
                    type="radio"
                    name="price"
                    checked={selectedPriceRange === 'All'}
                    onChange={() => setSelectedPriceRange('All')}
                    className="accent-white"
                  />
                  <span>All Prices</span>
                </label>
                {PRICE_RANGES.map((range) => (
                  <label key={range} className="flex items-center gap-2 cursor-pointer text-[#B3B3B3] hover:text-white">
                    <input
                      type="radio"
                      name="price"
                      checked={selectedPriceRange === range}
                      onChange={() => setSelectedPriceRange(range)}
                      className="accent-white"
                    />
                    <span>{range}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-3">
                AVAILABILITY
              </h3>
              <div className="space-y-1.5 text-xs text-[#B3B3B3]">
                {['All', 'In Stock', 'Out of Stock'].map((avail) => (
                  <label key={avail} className="flex items-center gap-2 cursor-pointer hover:text-white">
                    <input
                      type="radio"
                      name="availability"
                      checked={selectedAvailability === avail}
                      onChange={() => setSelectedAvailability(avail)}
                      className="accent-white"
                    />
                    <span>{avail}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid: Desktop 4, Tablet 3, Mobile 2 */}
          <main className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6 text-xs text-[#808080]">
              <span>
                Showing <strong className="text-white">{filteredProducts.length}</strong> items
              </span>
              <span>AVIRO Men's Sizing S — 3XL</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-[#181818] border border-[#333333] p-12 text-center my-8">
                <p className="text-base font-medium text-white mb-2">No garments matched your filters</p>
                <p className="text-xs text-[#808080] max-w-sm mx-auto mb-6">
                  Try adjusting your size, color, or price filters to discover other pieces in the collection.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-[#E5E5E5] transition-colors"
                >
                  RESET ALL FILTERS
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <div
            className="w-4/5 max-w-md h-full bg-[#181818] border-r border-[#333333] p-6 overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#333333]">
              <span className="text-sm font-bold uppercase tracking-widest text-white">
                FILTERS
              </span>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="text-[#808080] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Category</h4>
              <div className="space-y-1">
                {['All', ...CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`block w-full text-left text-xs py-1.5 ${
                      selectedCategory === cat ? 'text-white font-bold' : 'text-[#B3B3B3]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Sizes */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Size</h4>
              <div className="grid grid-cols-3 gap-1.5">
                {['All', ...SIZES].map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`py-2 text-xs font-semibold uppercase ${
                      selectedSize === size
                        ? 'bg-white text-black'
                        : 'bg-[#202020] text-[#B3B3B3] border border-[#333333]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                clearAllFilters();
                setIsMobileFilterOpen(false);
              }}
              className="w-full py-3 bg-[#202020] text-xs font-semibold uppercase tracking-wider border border-[#333333] text-white"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
