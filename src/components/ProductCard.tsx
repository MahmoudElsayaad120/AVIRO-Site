import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product, ClothingSize, ProductColor } from '../types';
import { useShop } from '../context/ShopContext';
import { Heart, Plus, Check, Star, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist, addToCart, addToast, openQuickView, formatPrice } = useShop();
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0]);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [addedSize, setAddedSize] = useState<ClothingSize | null>(null);

  const isFavorite = isInWishlist(product.id);

  const handleQuickAddSize = async (size: ClothingSize, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product, size, selectedColor, 1);
      setAddedSize(size);
      setTimeout(() => setAddedSize(null), 1500);
      addToast(`Added ${product.name} (Size ${size}) to cart`, 'success');
    } catch {
      addToast('Failed to add item', 'error');
    }
  };

  const discountRate =
    product.discount ||
    (product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null);

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-[#1A1A1A] border border-[#333333] transition-all duration-300 hover:border-[#555555] hover:bg-[#1E1E1E] shadow-sm hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image & Town Team Badges */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#141414]">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges Container (Town Team style) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 pointer-events-none z-10">
          {discountRate && discountRate > 0 ? (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 tracking-wider uppercase shadow-md">
              -{discountRate}%
            </span>
          ) : null}
          {product.isNewArrival && (
            <span className="bg-white text-black text-[9px] font-extrabold px-2 py-0.5 tracking-wider uppercase">
              NEW
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-amber-400 text-black text-[9px] font-extrabold px-2 py-0.5 tracking-wider uppercase">
              HOT
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`btn-wishlist-${product.id}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 backdrop-blur-md transition-all duration-200 z-10 border ${
            isFavorite
              ? 'bg-white text-black border-white'
              : 'bg-[#111111]/80 text-[#B3B3B3] border-[#333333] hover:text-white hover:border-[#555555]'
          }`}
          aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-black text-black' : ''}`} />
        </button>

        {/* Quick View Button (Feature 5) */}
        <button
          id={`btn-quick-view-${product.id}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openQuickView(product);
          }}
          className="absolute top-11 right-2.5 p-2 bg-[#111111]/80 hover:bg-white hover:text-black text-[#B3B3B3] backdrop-blur-md transition-all duration-200 z-10 border border-[#333333] hover:border-[#555555]"
          title="معاينة سريعة / Quick View"
          aria-label="Quick View"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

        {/* Town Team Quick-Add Sizes Bar (Slides up smoothly on hover / mobile) */}
        <div className="absolute bottom-0 inset-x-0 p-2 z-20 transition-all duration-200 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 bg-[#111111]/95 backdrop-blur-md border-t border-[#333333]">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[9px] uppercase font-bold tracking-wider text-[#A0A0A0]">
              Quick Add Size:
            </span>
            <span className="text-[9px] text-emerald-400 font-mono">In Stock</span>
          </div>
          <div className="grid grid-cols-6 gap-1">
            {product.sizes.map((sz) => {
              const isAdded = addedSize === sz;
              return (
                <button
                  key={sz}
                  onClick={(e) => handleQuickAddSize(sz, e)}
                  className={`py-1 text-center text-[10px] font-bold uppercase transition-all border ${
                    isAdded
                      ? 'bg-emerald-500 text-black border-emerald-500'
                      : 'bg-[#222222] text-white hover:bg-white hover:text-black border-[#383838]'
                  }`}
                  title={`Add size ${sz} to cart`}
                >
                  {isAdded ? '✓' : sz}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex flex-col p-3.5 gap-2 flex-grow justify-between">
        <div>
          {/* Colors Swatches */}
          <div className="flex items-center gap-1.5 mb-1.5">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                className={`w-3 h-3 rounded-full border transition-all ${
                  selectedColor.name === color.name
                    ? 'border-white scale-125 ring-1 ring-white/50'
                    : 'border-[#444444] hover:scale-110'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-label={`Select color ${color.name}`}
              />
            ))}
            <span className="text-[9px] text-[#808080] ml-1 uppercase tracking-wider truncate max-w-[120px]">
              {selectedColor.name}
            </span>
          </div>

          <Link to={`/product/${product.id}`} className="block group/link">
            <h3 className="text-xs sm:text-sm font-semibold text-white group-hover/link:text-[#CCCCCC] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1">
            <div className="flex items-center text-amber-400">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-[10px] font-bold text-white">
              {product.rating ? product.rating.toFixed(1) : '5.0'}
            </span>
            <span className="text-[10px] text-[#808080]">
              ({product.reviewCount || 12})
            </span>
          </div>
        </div>

        {/* Town Team Price Block: High-contrast Bold Price + Slashed Original */}
        <div className="pt-2 border-t border-[#333333]/60 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-extrabold text-white tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#707070] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <span className="text-[9px] text-[#888888] tracking-wider uppercase font-mono">
            {product.category}
          </span>
        </div>
      </div>
    </div>
  );
};
