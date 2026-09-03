import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';

export const WishlistPage: React.FC = () => {
  const {
    products,
    wishlist,
    wishlistCount,
    toggleWishlist,
    addToCart,
    addToast,
  } = useShop();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveToCart = async (product: Product) => {
    const defaultSize = product.sizes[0] || 'M';
    const defaultColor = product.colors[0];
    await addToCart(product, defaultSize, defaultColor, 1);
    await toggleWishlist(product.id);
  };

  const handleClearAll = async () => {
    for (const id of wishlist) {
      await toggleWishlist(id);
    }
    addToast('Wishlist cleared', 'info');
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#111111] text-white flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-[#181818] border border-[#333333] flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-[#808080]" />
          </div>
          <h1 className="font-['Syne',sans-serif] text-3xl font-extrabold uppercase tracking-wider text-white">
            YOUR WISHLIST IS EMPTY
          </h1>
          <p className="text-xs text-[#B3B3B3] leading-relaxed">
            Keep track of garments you love. Tap the heart icon on any piece to save it for your next wardrobe drop.
          </p>
          <div className="pt-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-[#E5E5E5] text-black text-xs font-bold uppercase tracking-widest transition-colors"
            >
              EXPLORE MEN'S COLLECTION
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="wishlist-page" className="w-full bg-[#111111] text-white min-h-screen pb-24">
      {/* Header */}
      <div className="bg-[#181818] border-b border-[#333333] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#808080] uppercase tracking-[0.3em] block mb-1">
              SAVED PIECES
            </span>
            <h1 className="font-['Syne',sans-serif] text-3xl sm:text-4xl font-extrabold uppercase tracking-wider text-white">
              MY WISHLIST ({wishlistCount})
            </h1>
          </div>

          <button
            onClick={handleClearAll}
            className="text-xs text-[#808080] hover:text-rose-400 underline uppercase tracking-wider self-start sm:self-auto transition-colors"
          >
            Clear Wishlist
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <div
              key={product.id}
              className="bg-[#181818] border border-[#333333] overflow-hidden flex flex-col justify-between group hover:border-[#555555] transition-all"
            >
              <div className="relative aspect-[3/4] bg-[#202020] overflow-hidden">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 bg-[#111111]/80 hover:bg-[#111111] text-[#808080] hover:text-rose-400 transition-colors border border-[#333333]"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-[#808080] uppercase tracking-widest block mb-1">
                    {product.category}
                  </span>
                  <Link
                    to={`/product/${product.id}`}
                    className="text-sm font-semibold text-white hover:text-[#B3B3B3] transition-colors line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-white">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-[#808080] line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#808080] mt-1">
                    Sizes: {product.sizes.join(', ')}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#333333]">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="w-full py-2.5 bg-white hover:bg-[#E5E5E5] text-black text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    MOVE TO BAG
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
