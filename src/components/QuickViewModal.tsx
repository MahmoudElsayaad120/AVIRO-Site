import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, Check, ShoppingBag, MessageCircle, Ruler, Sparkles, Truck, RotateCcw } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ClothingSize, ProductColor } from '../types';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    closeQuickView,
    addToCart,
    formatPrice,
    openSmartSizeFinder,
  } = useShop();

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<ClothingSize>('M');
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImageIndex(0);
      setSelectedSize(quickViewProduct.sizes[0] || 'M');
      setSelectedColor(quickViewProduct.colors[0] || null);
      setQuantity(1);
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;

  const handleAddToCart = async () => {
    if (!selectedColor) return;
    await addToCart(product, selectedSize, selectedColor, quantity);
    closeQuickView();
  };

  const handleWhatsAppOrder = () => {
    const formattedTotal = formatPrice(product.price * quantity);
    const colorName = selectedColor?.name || 'Default';
    const messageText = `مرحباً براند AVIRO،\nأود طلب هذا المنتج عبر المتجر الإلكتروني:\n- الموديل: ${product.name}\n- المقاس: ${selectedSize}\n- اللون: ${colorName}\n- الكمية: ${quantity}\n- السعر: ${formattedTotal}\n- كود القطعة: ${product.id}\n\nبرجاء تأكيد توفر المقاس وإرسال بيانات الشحن والتوصيل.`;
    
    const waUrl = `https://wa.me/201080848292?text=${encodeURIComponent(messageText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      id="quick-view-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={closeQuickView}
    >
      <div
        id="quick-view-modal-container"
        className="relative w-full max-w-4xl bg-[#141414] border border-[#333333] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-white animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 p-2 bg-[#111111]/80 hover:bg-white hover:text-black rounded-full border border-[#333333] transition-colors"
          aria-label="Close Quick View"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Images */}
          <div className="p-5 sm:p-6 bg-[#111111] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#333333]">
            <div className="aspect-[3/4] w-full overflow-hidden bg-[#181818] border border-[#333333] mb-3 relative">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 bg-black/80 backdrop-blur-md text-[10px] uppercase font-mono tracking-widest text-[#AAAAAA] border border-[#333333]">
                QUICK PREVIEW
              </span>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 aspect-square border overflow-hidden transition-all ${
                      selectedImageIndex === idx
                        ? 'border-white ring-1 ring-white/50'
                        : 'border-[#333333] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Fast Buy Options */}
          <div className="p-5 sm:p-8 flex flex-col justify-between space-y-5 bg-[#141414]">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                <span className="font-mono text-[10px] text-[#888888] uppercase tracking-widest">
                  AVIRO / {product.category}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-white font-bold">{product.rating}</span>
                  <span className="text-[#888888]">({product.reviewCount || 18})</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="font-['Syne',sans-serif] text-xl sm:text-2xl font-extrabold uppercase text-white tracking-wide leading-tight mb-3">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3 pb-3 border-b border-[#333333]">
                <span className="text-2xl font-extrabold text-white">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[#777777] line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 ml-auto font-mono">
                  شامل الضريبة
                </span>
              </div>

              {/* Fabric Specs */}
              <p className="text-xs text-[#B3B3B3] leading-relaxed mt-3 line-clamp-2">
                {product.description}
              </p>

              {/* Color Selection */}
              <div className="mt-4 pt-3 border-t border-[#333333]/60 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#888888] uppercase tracking-wider text-[11px]">اللون / Color</span>
                  <span className="text-white font-semibold">{selectedColor?.name}</span>
                </div>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                        selectedColor?.name === color.name
                          ? 'border-white scale-110 ring-2 ring-white/30'
                          : 'border-[#444444] hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {selectedColor?.name === color.name && (
                        <Check
                          className={`w-3.5 h-3.5 ${
                            color.name === 'White' || color.name === 'Off-White'
                              ? 'text-black'
                              : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection + Smart Size Finder trigger */}
              <div className="mt-4 pt-3 border-t border-[#333333]/60 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#888888] uppercase tracking-wider text-[11px]">
                    المقاس / Size
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      openSmartSizeFinder(product.category, (size) => setSelectedSize(size))
                    }
                    className="text-amber-400 hover:text-amber-300 text-[11px] font-bold flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>اعرف مقاسك من طولك ووزنك</span>
                  </button>
                </div>

                <div className="grid grid-cols-6 gap-1.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 text-xs font-bold uppercase border transition-all ${
                        selectedSize === size
                          ? 'bg-white text-black border-white'
                          : 'bg-[#181818] text-white border-[#333333] hover:border-[#666666]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#333333]/60">
                <span className="text-[11px] text-[#888888] uppercase tracking-wider">
                  الكمية
                </span>
                <div className="flex items-center border border-[#333333] bg-[#111111]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 text-xs text-[#888888] hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-white font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-1 text-xs text-[#888888] hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons: Add to Bag, WhatsApp 1-Click Order, View Page */}
            <div className="space-y-2 pt-4 border-t border-[#333333]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="py-3 bg-white hover:bg-[#E5E5E5] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>إضافة إلى السلة</span>
                </button>

                {/* 1-Click WhatsApp Order */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="py-3 bg-[#25D366] hover:bg-[#20bd5a] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <MessageCircle className="w-4 h-4 fill-black" />
                  <span>اطلب عبر واتساب</span>
                </button>
              </div>

              <Link
                to={`/product/${product.id}`}
                onClick={closeQuickView}
                className="block text-center py-2.5 bg-[#1C1C1C] hover:bg-[#252525] text-[#AAAAAA] hover:text-white text-[11px] font-bold uppercase tracking-wider border border-[#333333] transition-colors"
              >
                عرض كل التفاصيل والخامات والتقييمات ←
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
