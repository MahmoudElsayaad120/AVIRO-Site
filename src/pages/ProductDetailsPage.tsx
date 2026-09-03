import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { productService, reviewService } from '../services';
import { Product, ClothingSize, ProductColor, Review } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ReviewModal } from '../components/ReviewModal';
import {
  Heart,
  Plus,
  Minus,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  Check,
  ArrowLeft,
  MessageCircle,
  Sparkles,
} from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    openSizeGuide,
    addToast,
    formatPrice,
    openSmartSizeFinder,
    currency,
  } = useShop();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<ClothingSize | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'care'>('details');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);

    if (id) {
      productService.getProductById(id).then((p) => {
        setProduct(p);
        if (p) {
          setSelectedSize(p.sizes[0] || 'M');
          setSelectedColor(p.colors[0]);
          setSelectedImageIndex(0);
          setQuantity(1);

          // Load approved reviews
          reviewService.getProductReviews(p.id, true).then(setReviews);
        }
        setLoading(false);
      });
    }
  }, [id]);

  const loadReviews = () => {
    if (product) {
      reviewService.getProductReviews(product.id, true).then(setReviews);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#111111] text-white">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-white border-t-transparent animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-[#808080]">Loading Garment...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#111111] text-white px-4">
        <h2 className="text-2xl font-bold uppercase tracking-wider mb-2 font-['Syne',sans-serif]">
          Garment Not Found
        </h2>
        <p className="text-xs text-[#808080] mb-6">
          This piece may have been removed or is temporarily unavailable.
        </p>
        <Link
          to="/shop"
          className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-wider"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);

  // Related products (Requirement #12: 4 related men's products)
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const fallbackRelated =
    relatedProducts.length < 4
      ? [
          ...relatedProducts,
          ...products.filter((p) => p.id !== product.id && !relatedProducts.includes(p)),
        ].slice(0, 4)
      : relatedProducts;

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      addToast('Please select your size and color', 'error');
      return;
    }
    await addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = async () => {
    if (!selectedSize || !selectedColor) {
      addToast('Please select your size and color', 'error');
      return;
    }
    await addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const size = selectedSize || product.sizes[0] || 'M';
    const color = selectedColor?.name || product.colors[0]?.name || 'Standard';
    const totalFormatted = formatPrice(product.price * quantity);
    const msg = `مرحباً براند AVIRO،\nأود طلب هذا المنتج مباشرة عبر واتساب:\n- الموديل: ${product.name}\n- المقاس: ${size}\n- اللون: ${color}\n- الكمية: ${quantity}\n- السعر: ${totalFormatted}\n- كود القطعة: ${product.id}\n- رابط الموديل: ${window.location.href}\n\nبرجاء تأكيد الحجز وإرسال تفاصيل التوصيل.`;
    const url = `https://wa.me/201080848292?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div id="product-details-page" className="w-full bg-[#111111] text-white min-h-screen pb-24">
      {/* Breadcrumb Bar */}
      <div className="border-b border-[#333333] bg-[#181818]/60 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-[#808080]">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-white transition-colors">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-white truncate max-w-[200px] sm:max-w-none">{product.name}</span>
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          {/* Left: Gallery (6 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 sm:w-20 aspect-[3/4] bg-[#181818] border transition-all overflow-hidden shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-white'
                      : 'border-[#333333] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 aspect-[3/4] bg-[#181818] border border-[#333333] overflow-hidden relative group">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {product.discount && (
                <span className="absolute top-4 left-4 bg-[#111111]/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 uppercase tracking-wider border border-[#333333]">
                  -{product.discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Right: Product Buy Info (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-[#808080] uppercase tracking-[0.25em]">
                  {product.category}
                </span>

                <div className="flex items-center gap-1.5 text-xs">
                  <div className="flex text-white">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-white text-white'
                            : 'text-[#444444]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-white font-semibold">{product.rating}</span>
                  <span className="text-[#808080]">({reviews.length + product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Product Title */}
              <h1 className="font-['Syne',sans-serif] text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-white mb-3 leading-tight">
                {product.name}
              </h1>

              {/* Price & Discount */}
              <div className="flex items-baseline gap-3 pb-5 border-b border-[#333333]">
                <span className="text-2xl font-bold text-white tracking-tight">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-[#808080] line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="text-[11px] text-[#B3B3B3] uppercase tracking-wider ml-auto">
                  Taxes included
                </span>
              </div>

              {/* Short Description */}
              <p className="text-xs text-[#B3B3B3] leading-relaxed py-4">
                {product.description}
              </p>

              {/* Color Selector */}
              <div className="space-y-2 py-3 border-t border-[#333333]">
                <div className="flex justify-between text-xs">
                  <span className="text-[#808080] uppercase tracking-wider">Color</span>
                  <span className="text-white font-semibold">{selectedColor?.name}</span>
                </div>
                <div className="flex gap-2.5">
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
                      aria-label={`Select color ${color.name}`}
                    >
                      {selectedColor?.name === color.name && (
                        <Check
                          className={`w-3.5 h-3.5 ${
                            color.name === 'White' ? 'text-black' : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector (S / M / L / XL / XXL / 3XL) */}
              <div className="space-y-2 py-4 border-t border-[#333333]">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#808080] uppercase tracking-wider">
                    Select Size (Men's)
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      id="btn-open-smart-size-finder-pdp"
                      type="button"
                      onClick={() =>
                        openSmartSizeFinder(product.category, (size) => setSelectedSize(size))
                      }
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1 uppercase text-[11px] font-bold tracking-wider transition-colors"
                      title="احسب مقاسك من طولك ووزنك"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>اعرف مقاسك الذكي</span>
                    </button>
                    <span className="text-[#444444]">|</span>
                    <button
                      id="btn-open-size-guide-pdp"
                      onClick={() => openSizeGuide(product.category)}
                      className="text-[#B3B3B3] hover:text-white flex items-center gap-1 underline uppercase text-[11px] tracking-wider"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      Size Guide
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-xs font-bold uppercase tracking-wider border transition-all ${
                        selectedSize === size
                          ? 'bg-white text-black border-white'
                          : 'bg-[#181818] text-white border-[#333333] hover:border-[#555555]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock status indicator */}
              <div className="flex items-center gap-2 py-2 text-xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
                <span className="text-[#B3B3B3]">
                  {product.stock > 0
                    ? `In Stock (${product.stock} units ready to dispatch)`
                    : 'Currently Out of Stock'}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 py-3">
                <span className="text-xs text-[#808080] uppercase tracking-wider">
                  Quantity
                </span>
                <div className="flex items-center border border-[#333333] bg-[#181818]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-[#808080] hover:text-white transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-bold text-white min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 text-[#808080] hover:text-white transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4">
                <div className="flex gap-3">
                  <button
                    id="btn-pdp-add-to-cart"
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="flex-1 py-4 bg-white hover:bg-[#E5E5E5] text-black text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-40"
                  >
                    ADD TO BAG
                  </button>

                  <button
                    id="btn-pdp-wishlist"
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-4 border transition-colors ${
                      isFavorite
                        ? 'bg-[#202020] text-white border-white'
                        : 'bg-[#181818] text-[#808080] border-[#333333] hover:text-white hover:border-[#555555]'
                    }`}
                    aria-label="Add to wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white text-white' : ''}`} />
                  </button>
                </div>

                <button
                  id="btn-pdp-buy-now"
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="w-full py-3.5 bg-[#202020] hover:bg-[#292929] text-white text-xs font-bold uppercase tracking-widest border border-[#333333] transition-colors disabled:opacity-40"
                >
                  BUY NOW
                </button>

                {/* 1-Click WhatsApp Order Button (Feature 2) */}
                <button
                  id="btn-pdp-whatsapp-order"
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-black text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-emerald-900/30"
                >
                  <MessageCircle className="w-4 h-4 fill-black text-black" />
                  <span>اطلب عبر واتساب فوراً (01080848292)</span>
                </button>
              </div>

              {/* Value Props Micro Bar */}
              <div className="pt-6 border-t border-[#333333] grid grid-cols-2 gap-3 text-[11px] text-[#808080]">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-white shrink-0" />
                  <span>
                    {currency === 'EGP'
                      ? 'شحن مجاني للطلبات فوق 1,000 ج.م'
                      : 'Free shipping on orders over $150'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-white shrink-0" />
                  <span>30-day complimentary exchanges</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 11. PRODUCT INFORMATION TABS */}
        <section className="mt-20 pt-10 border-t border-[#333333]">
          <div className="flex border-b border-[#333333] gap-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors relative ${
                activeTab === 'details'
                  ? 'text-white'
                  : 'text-[#808080] hover:text-white'
              }`}
            >
              PRODUCT DETAILS
              {activeTab === 'details' && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors relative ${
                activeTab === 'shipping'
                  ? 'text-white'
                  : 'text-[#808080] hover:text-white'
              }`}
            >
              SHIPPING & RETURNS
              {activeTab === 'shipping' && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('care')}
              className={`pb-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors relative ${
                activeTab === 'care'
                  ? 'text-white'
                  : 'text-[#808080] hover:text-white'
              }`}
            >
              CARE & ORIGIN
              {activeTab === 'care' && (
                <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white" />
              )}
            </button>
          </div>

          <div className="py-8">
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-[#B3B3B3] leading-relaxed">
                <div>
                  <h4 className="text-white font-bold uppercase tracking-wider mb-2">Description</h4>
                  <p>{product.description}</p>
                </div>
                <div className="space-y-2 border-l border-[#333333] pl-0 md:pl-8">
                  <h4 className="text-white font-bold uppercase tracking-wider mb-2">Specifications</h4>
                  <div className="flex justify-between py-1 border-b border-[#333333]/40">
                    <span className="text-[#808080]">Material</span>
                    <span className="text-white font-medium">{product.details.material}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#333333]/40">
                    <span className="text-[#808080]">Fit Silhouette</span>
                    <span className="text-white font-medium">{product.details.fit}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#333333]/40">
                    <span className="text-[#808080]">Fabric Weight</span>
                    <span className="text-white font-medium">{product.details.fabricWeight}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#808080]">Sizing Run</span>
                    <span className="text-white font-medium">S / M / L / XL / XXL / 3XL</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-[#B3B3B3] leading-relaxed">
                <div>
                  <h4 className="text-white font-bold uppercase tracking-wider mb-2">Delivery Timelines</h4>
                  <p className="mb-3">
                    Orders placed before 2:00 PM EST ship same business day. All packages are insured and dispatched in signature matte charcoal AVIRO dust bags.
                  </p>
                  <ul className="space-y-1.5 list-disc list-inside text-[#808080]">
                    <li>Standard Domestic: 3–5 Business Days (Free over $150)</li>
                    <li>Express Air: 2–3 Business Days ($15)</li>
                    <li>Overnight Priority: Next Business Day ($25)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-wider mb-2">30-Day Returns Policy</h4>
                  <p>
                    If the fit is not ideal, return or exchange within 30 days of delivery. Items must remain unwashed and unworn with original tags attached. Prepaid return shipping labels are generated automatically inside your account portal.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-[#B3B3B3] leading-relaxed">
                <div>
                  <h4 className="text-white font-bold uppercase tracking-wider mb-2">Fabric Care</h4>
                  <p className="mb-2">{product.details.careInstructions}</p>
                  <p className="text-[#808080]">
                    Heavyweight French terry and organic cotton jerseys are best preserved by hanging dry in shaded airflow to prevent thermal fiber shrinkage.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-bold uppercase tracking-wider mb-2">Provenance</h4>
                  <p className="mb-2">
                    Milled and crafted in <strong className="text-white">{product.details.countryOfOrigin}</strong>.
                  </p>
                  <p className="text-[#808080]">
                    Strictly adhering to European ethical labor standards, REACH chemical safety compliance, and low-waste pattern cutting.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 18. CUSTOMER REVIEWS */}
        <section id="product-reviews" className="mt-16 pt-10 border-t border-[#333333]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[10px] font-bold text-[#808080] uppercase tracking-[0.25em] block mb-1">
                AUTHENTIC FEEDBACK
              </span>
              <h3 className="font-['Syne',sans-serif] text-2xl font-extrabold uppercase tracking-wider text-white">
                CUSTOMER REVIEWS
              </h3>
            </div>

            <button
              id="btn-write-review-open"
              onClick={() => setIsReviewModalOpen(true)}
              className="px-6 py-2.5 bg-white hover:bg-[#E5E5E5] text-black text-xs font-bold uppercase tracking-widest transition-colors self-start sm:self-auto"
            >
              WRITE A REVIEW
            </button>
          </div>

          {/* Average Rating Banner */}
          <div className="bg-[#181818] border border-[#333333] p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="font-['Syne',sans-serif] text-4xl font-black text-white">
                {product.rating} <span className="text-lg text-[#808080] font-normal">/ 5</span>
              </div>
              <div>
                <div className="flex text-white mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-white text-white'
                          : 'text-[#444444]'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-[#B3B3B3]">
                  Based on {reviews.length + product.reviewCount} reviews
                </p>
              </div>
            </div>

            <div className="text-xs text-[#808080] text-center sm:text-right">
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                <ShieldCheck className="w-4 h-4" /> 100% Verified Purchases
              </span>
              <p>Only verified customers who ordered this garment can submit reviews.</p>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="bg-[#181818] p-8 border border-[#333333] text-center">
                <p className="text-xs text-[#808080] mb-3">
                  No customer reviews published yet for this piece.
                </p>
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="text-xs text-white underline font-semibold uppercase tracking-wider"
                >
                  Be the first to review this garment
                </button>
              </div>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  id={`review-${rev.id}`}
                  className="bg-[#181818] border border-[#333333] p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-white tracking-wider">
                        {rev.userName}
                      </span>
                      {rev.verifiedPurchase && (
                        <span className="text-[10px] text-emerald-400 uppercase font-mono tracking-wider flex items-center gap-1">
                          <Check className="w-3 h-3" /> Verified Purchase
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#808080]">{rev.createdAt}</span>
                  </div>

                  <div className="flex text-white">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-white text-white' : 'text-[#444444]'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-[#B3B3B3] leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 12. RELATED PRODUCTS ("YOU MAY ALSO LIKE") */}
        <section className="mt-24 pt-10 border-t border-[#333333]">
          <div className="mb-8">
            <span className="text-[10px] font-bold text-[#808080] uppercase tracking-[0.25em] block mb-1">
              PAIR WITH YOUR LOOK
            </span>
            <h3 className="font-['Syne',sans-serif] text-2xl font-extrabold uppercase tracking-wider text-white">
              YOU MAY ALSO LIKE
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {fallbackRelated.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      </div>

      {/* Review Modal */}
      <ReviewModal
        product={product}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={loadReviews}
      />
    </div>
  );
};
