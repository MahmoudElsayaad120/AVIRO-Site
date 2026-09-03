import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ClothingSize, Product } from '../types';
import { Sparkles, ShoppingBag, Check, ArrowRight } from 'lucide-react';

interface OutfitBundle {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  items: {
    role: string;
    product: Product;
  }[];
  discountPercent: number;
}

export const CompleteTheLookSection: React.FC = () => {
  const { products, addToCart, addToast } = useShop();

  // Pick pieces from products to form cohesive stylish outfits
  const tee = products.find((p) => p.category === 'T-Shirts') || products[0];
  const pant = products.find((p) => p.category === 'Pants') || products[1] || products[0];
  const jacket = products.find((p) => p.category === 'Jackets' || p.category === 'Hoodies') || products[2] || products[0];

  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: ClothingSize }>({
    top: 'L',
    bottom: 'L',
    outer: 'L',
  });
  const [isAddingAll, setIsAddingAll] = useState(false);

  if (!tee || !pant || !jacket) return null;

  const rawTotal = tee.price + pant.price + jacket.price;
  const bundleDiscount = 0.15; // 15% bundle discount
  const discountedTotal = Math.round(rawTotal * (1 - bundleDiscount));
  const savings = rawTotal - discountedTotal;

  const handleAddBundleToCart = async () => {
    setIsAddingAll(true);
    try {
      await addToCart(tee, selectedSizes.top || 'L', tee.colors[0], 1);
      await addToCart(pant, selectedSizes.bottom || 'L', pant.colors[0], 1);
      await addToCart(jacket, selectedSizes.outer || 'L', jacket.colors[0], 1);
      addToast('Complete Outfit added to bag with 15% Bundle Savings!', 'success');
    } catch {
      addToast('Failed to add outfit to cart', 'error');
    } finally {
      setIsAddingAll(false);
    }
  };

  const outfitItems = [
    { key: 'top', role: 'Upper Layer', product: tee },
    { key: 'bottom', role: 'Bottom', product: pant },
    { key: 'outer', role: 'Outerwear', product: jacket },
  ];

  return (
    <section id="complete-the-look" className="py-20 bg-[#141414] border-b border-[#333333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading like Town Team "شياكتك كاملة / Complete The Look" */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-[0.3em]">
                TOWN TEAM STYLE ARCHIVE / نسق طقمك الكامل
              </span>
            </div>
            <h2 className="font-['Syne',sans-serif] text-3xl sm:text-4xl font-extrabold uppercase tracking-wider text-white">
              COMPLETE THE LOOK
            </h2>
          </div>
          <p className="text-xs text-[#808080] max-w-sm mt-2 sm:mt-0">
            Hand-curated modern masculine outfits designed to balance proportion, texture, and street elegance.
          </p>
        </div>

        {/* Outfit Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Lookbook Feature Image */}
          <div className="lg:col-span-5 relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-auto min-h-[420px] bg-[#1a1a1a] border border-[#333333] overflow-hidden group">
            <img
              src="/images/products/aviro-burgundy-piped.jpg"
              alt="Complete AVIRO Outfit"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top filter brightness-[0.92] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-[#0E0E0E]/20" />

            <div className="absolute top-4 left-4 bg-amber-400 text-black px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-lg">
              SAVE 15% ON FULL BUNDLE
            </div>

            <div className="absolute bottom-6 inset-x-6">
              <span className="text-[10px] uppercase tracking-widest text-[#B3B3B3] font-mono block mb-1">
                OUTFIT #01 • SIGNATURE DRAPE
              </span>
              <h3 className="font-['Syne',sans-serif] text-2xl font-bold uppercase tracking-wider text-white">
                The Minimalist Urban Cut
              </h3>
              <p className="text-xs text-[#A0A0A0] mt-1">
                Contrast Piped Oversized Tee + Relaxed Trouser + Milled Outerwear
              </p>
            </div>
          </div>

          {/* Individual Items in the Look */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {outfitItems.map(({ key, role, product }) => (
                <div
                  key={key}
                  className="bg-[#1C1C1C] border border-[#333333] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#444444] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-20 bg-[#141414] border border-[#333333] overflow-hidden shrink-0">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-mono text-amber-400 block tracking-widest">
                        {role}
                      </span>
                      <Link
                        to={`/product/${product.id}`}
                        className="text-sm font-semibold text-white hover:text-[#B3B3B3] transition-colors line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <div className="text-xs font-bold text-white mt-1">
                        ${product.price}
                        {product.originalPrice && (
                          <span className="text-[#666666] line-through text-[10px] ml-1.5 font-normal">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Size selector pills */}
                  <div className="flex items-center gap-1.5 self-start sm:self-center">
                    <span className="text-[10px] text-[#808080] uppercase tracking-wider mr-1">Size:</span>
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSizes((prev) => ({ ...prev, [key]: sz }))}
                        className={`w-8 h-8 text-[11px] font-bold uppercase transition-colors border ${
                          selectedSizes[key] === sz
                            ? 'bg-white text-black border-white'
                            : 'bg-[#141414] text-[#888888] border-[#333333] hover:text-white'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bundle Pricing Card & Town Team 1-Click Buy Outfit */}
            <div className="p-6 bg-[#202020] border border-[#333333] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#808080] uppercase tracking-widest">
                    Total Outfit Price:
                  </span>
                  <span className="text-sm text-[#808080] line-through font-mono">
                    ${rawTotal}
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="font-['Syne',sans-serif] text-3xl font-extrabold text-white">
                    ${discountedTotal}
                  </span>
                  <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
                    You Save ${savings} (15% OFF)
                  </span>
                </div>
                <span className="text-[10px] text-[#808080] mt-1 block">
                  Includes 3 items with free express courier delivery
                </span>
              </div>

              <button
                onClick={handleAddBundleToCart}
                disabled={isAddingAll}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-[#E5E5E5] text-black text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-2xl hover:scale-[1.02] shrink-0"
              >
                {isAddingAll ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin text-black" />
                    Adding 3 Items...
                  </span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Add Full Look to Bag
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
