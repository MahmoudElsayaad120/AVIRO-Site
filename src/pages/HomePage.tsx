import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { CompleteTheLookSection } from '../components/CompleteTheLookSection';
import { StoreLocatorModal } from '../components/StoreLocatorModal';
import { TrackOrderModal } from '../components/TrackOrderModal';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  RefreshCw,
  Star,
  ChevronLeft,
  ChevronRight,
  Flame,
  Clock,
  MapPin,
  Package,
  CheckCircle2,
  Banknote,
  Search,
} from 'lucide-react';
import { HeroSlide } from '../types';
import { siteMediaService, DEFAULT_HERO_SLIDES } from '../services/siteMediaService';

export const HomePage: React.FC = () => {
  const { products, categories } = useShop();

  // Tab state for Town Team style merchandising
  const [activeCatalogTab, setActiveCatalogTab] = useState<'bestsellers' | 'newarrivals'>('bestsellers');

  // Modals state
  const [isStoreLocatorOpen, setIsStoreLocatorOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);

  // Quick track order input
  const [trackQuery, setTrackQuery] = useState('');

  // Countdown timer for Flash Deals (Town Team style)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 38, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filtered lists for Town Team sections
  const bestSellers = products.filter((p) => p.isFeatured || (p.rating && p.rating >= 4.8)).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNewArrival || p.discount).slice(0, 8);
  const flashSaleItems = products.filter((p) => (p.discount && p.discount >= 20) || (p.originalPrice && p.originalPrice > p.price)).slice(0, 4);

  // Dynamic Hero Slider State connected to Admin Site Media Manager
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    const loaded = siteMediaService.getHeroSlides().filter((s) => s.isActive !== false);
    return loaded.length > 0 ? loaded : DEFAULT_HERO_SLIDES;
  });

  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Synchronize live with Admin Dashboard edits
  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        const active = e.detail.filter((s: HeroSlide) => s.isActive !== false);
        setHeroSlides(active.length > 0 ? active : e.detail);
      } else {
        const active = siteMediaService.getHeroSlides().filter((s) => s.isActive !== false);
        setHeroSlides(active.length > 0 ? active : DEFAULT_HERO_SLIDES);
      }
    };
    window.addEventListener('aviro-hero-slides-updated', handleUpdate);
    return () => window.removeEventListener('aviro-hero-slides-updated', handleUpdate);
  }, []);

  const slideCount = heroSlides.length || 1;
  const safeCurrentSlide = currentSlide % slideCount;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  };

  // Keyboard navigation for hero slider
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slideCount]);

  const activeSlide = heroSlides[safeCurrentSlide] || heroSlides[0] || DEFAULT_HERO_SLIDES[0];

  return (
    <div id="home-page" className="w-full bg-[#111111] text-white">
      {/* 1. HERO SLIDER SECTION */}
      <section
        id="hero-section"
        className="relative w-full h-[75vh] sm:h-[82vh] lg:h-[88vh] min-h-[520px] max-h-[920px] flex items-center overflow-hidden bg-[#0D0D0D] select-none"
      >
        {/* Background Slide Image & Gradient Layers */}
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === safeCurrentSlide ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={`${slide.brand} - ${slide.tagline}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-right sm:object-right-top filter brightness-[0.88] contrast-105"
            />
            {/* Cinematic subtle dark vignette & left-side fade for optimal typography contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/80 to-transparent w-full md:w-3/5 lg:w-1/2" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-[#0D0D0D]/30" />
          </div>
        ))}

        {/* Hero Left Content — Typography & CTA */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex items-center">
          <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col items-center sm:items-start text-center sm:text-left py-12">
            {/* Town Team Style Seasonal Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.25em] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              NEW SEASON COLLECTION 2026
            </div>

            {/* Brand Logo Display */}
            <h1 className="font-['Syne',sans-serif] text-6xl sm:text-7xl md:text-8xl lg:text-[104px] font-extrabold tracking-[0.05em] text-white leading-none mb-3 sm:mb-4 drop-shadow-sm select-none">
              {activeSlide.brand}
            </h1>

            {/* Tagline */}
            <h2 className="text-sm sm:text-base md:text-lg font-medium tracking-[0.32em] sm:tracking-[0.38em] uppercase text-white mb-2 sm:mb-3">
              {activeSlide.tagline}
            </h2>

            {/* Subtitle / Quality Promise */}
            <p className="text-xs sm:text-sm text-[#B3B3B3] font-normal tracking-wide mb-8 sm:mb-9 max-w-md">
              {activeSlide.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link
                id="btn-hero-shop-now"
                to={activeSlide.ctaLink}
                className="w-full sm:w-auto text-center px-9 sm:px-11 py-3.5 sm:py-4 bg-white hover:bg-[#E5E5E5] text-black text-xs font-bold uppercase tracking-[0.22em] transition-all hover:scale-[1.02] shadow-xl"
              >
                {activeSlide.ctaText}
              </Link>
              <a
                href="#complete-the-look"
                className="w-full sm:w-auto text-center px-6 py-3.5 sm:py-4 bg-transparent hover:bg-white/10 text-white text-xs font-bold uppercase tracking-[0.2em] border border-white/30 transition-colors"
              >
                COMPLETE THE LOOK
              </a>
            </div>
          </div>
        </div>

        {/* Previous Slide Arrow (<) */}
        <button
          id="btn-hero-prev"
          onClick={prevSlide}
          className="absolute left-3 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 text-white/60 hover:text-white transition-colors group focus:outline-none"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.5] group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Next Slide Arrow (>) */}
        <button
          id="btn-hero-next"
          onClick={nextSlide}
          className="absolute right-3 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 text-white/60 hover:text-white transition-colors group focus:outline-none"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.5] group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Pagination Dots (3 dots) */}
        <div
          id="hero-slider-dots"
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 sm:gap-3"
        >
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-300 rounded-full focus:outline-none ${
                idx === safeCurrentSlide
                  ? 'w-3 h-3 bg-white scale-110'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. TOWN TEAM 4-PILLAR TRUST & RETAIL SERVICES BAR */}
      <section className="bg-[#141414] border-b border-[#333333] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-[#2b2b2b]">
            <div className="flex items-center gap-3.5 py-2 lg:py-0 lg:px-4">
              <div className="w-10 h-10 rounded-full bg-[#202020] border border-[#333333] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-white">
                  Fast Express Shipping
                </div>
                <div className="text-[11px] text-[#808080]">
                  Free delivery over $150 / 1,000 EGP
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 py-2 lg:py-0 lg:px-4 pt-4 lg:pt-0">
              <div className="w-10 h-10 rounded-full bg-[#202020] border border-[#333333] flex items-center justify-center shrink-0">
                <Banknote className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-white">
                  Cash On Delivery / دفع عند الاستلام
                </div>
                <div className="text-[11px] text-[#808080]">
                  Inspect your parcel before paying
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 py-2 lg:py-0 lg:px-4 pt-4 lg:pt-0">
              <div className="w-10 h-10 rounded-full bg-[#202020] border border-[#333333] flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-white">
                  30-Day Easy Exchange / استبدال سهل
                </div>
                <div className="text-[11px] text-[#808080]">
                  At any branch or doorstep courier
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 py-2 lg:py-0 lg:px-4 pt-4 lg:pt-0">
              <div className="w-10 h-10 rounded-full bg-[#202020] border border-[#333333] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-white">
                  100% Egyptian Combed Cotton
                </div>
                <div className="text-[11px] text-[#808080]">
                  Heavyweight 280-580 GSM pre-shrunk
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TOWN TEAM CIRCULAR "SHOP BY CATEGORY / تسوق بالأقسام" */}
      <section className="py-16 bg-[#111111] border-b border-[#333333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.3em] block mb-1">
                EXPLORE DEPARTMENTS / تسوق بالقسم
              </span>
              <h2 className="font-['Syne',sans-serif] text-2xl sm:text-3xl font-extrabold uppercase tracking-wider text-white">
                SHOP BY CATEGORY
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-bold uppercase tracking-wider text-[#B3B3B3] hover:text-white flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Town Team Circular Icon Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6 text-center">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center"
              >
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#333333] group-hover:border-amber-400 transition-all p-1 bg-[#1C1C1C] shadow-md group-hover:scale-105">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#141414]">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top filter brightness-90 group-hover:brightness-105 transition-all duration-500"
                    />
                  </div>
                </div>
                <span className="mt-3 text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors uppercase tracking-wider">
                  {cat.name}
                </span>
                <span className="text-[10px] text-[#707070] font-mono mt-0.5">
                  {cat.itemCount || 4} Styles
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TOWN TEAM FLASH SALE & SPECIAL OFFERS WITH LIVE COUNTDOWN TIMER */}
      {flashSaleItems.length > 0 && (
        <section className="py-16 bg-[#161616] border-b border-[#333333] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-[0.3em]">
                    LIMITED TIME DEALS / عروض وخصومات حصرية
                  </span>
                </div>
                <h2 className="font-['Syne',sans-serif] text-2xl sm:text-3xl font-extrabold uppercase tracking-wider text-white">
                  TOWN TEAM SPECIAL OFFERS — UP TO 40% OFF
                </h2>
              </div>

              {/* Countdown Clocks */}
              <div className="flex items-center gap-2 bg-[#202020] border border-[#333333] p-2.5 px-4 shadow-inner">
                <Clock className="w-4 h-4 text-amber-400 mr-1" />
                <span className="text-xs text-[#808080] uppercase tracking-wider font-bold">
                  Ends In:
                </span>
                <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-white">
                  <span className="bg-[#111111] px-2 py-0.5 border border-[#383838]">
                    {String(timeLeft.hours).padStart(2, '0')}h
                  </span>
                  <span>:</span>
                  <span className="bg-[#111111] px-2 py-0.5 border border-[#383838]">
                    {String(timeLeft.minutes).padStart(2, '0')}m
                  </span>
                  <span>:</span>
                  <span className="bg-[#111111] px-2 py-0.5 border border-[#383838] text-rose-400">
                    {String(timeLeft.seconds).padStart(2, '0')}s
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {flashSaleItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. TOWN TEAM MERCHANDISING TABS: "BEST SELLERS / الأكثر مبيعاً" VS "NEW ARRIVALS / وصل حديثاً" */}
      <section className="py-20 bg-[#111111] border-b border-[#333333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            <div>
              <span className="text-[10px] font-bold text-[#808080] uppercase tracking-[0.3em] block mb-1">
                TOP SELECTIONS
              </span>
              <h2 className="font-['Syne',sans-serif] text-3xl sm:text-4xl font-extrabold uppercase tracking-wider text-white">
                FEATURED GARMENTS
              </h2>
            </div>

            {/* Town Team Style Merchandising Filter Tabs */}
            <div className="flex items-center bg-[#1C1C1C] border border-[#333333] p-1 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveCatalogTab('bestsellers')}
                className={`flex items-center gap-1.5 px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  activeCatalogTab === 'bestsellers'
                    ? 'bg-white text-black shadow-md'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Best Sellers / الأكثر مبيعاً</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCatalogTab('newarrivals')}
                className={`flex items-center gap-1.5 px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  activeCatalogTab === 'newarrivals'
                    ? 'bg-white text-black shadow-md'
                    : 'text-[#888888] hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>New In / وصل حديثاً</span>
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {(activeCatalogTab === 'bestsellers' ? bestSellers : newArrivals).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#202020] hover:bg-[#292929] text-white text-xs font-semibold uppercase tracking-widest border border-[#333333] transition-colors"
            >
              EXPLORE COMPLETE CATALOGUE ({products.length} PIECES)
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. COMPLETE THE LOOK / نسق طقمك (Town Team Signature Section) */}
      <CompleteTheLookSection />

      {/* 7. TOWN TEAM STORE LOCATOR & ORDER TRACKING INTERACTIVE WIDGET */}
      <section className="py-20 bg-[#161616] border-b border-[#333333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Store Locator Card */}
            <div className="bg-[#1F1F1F] border border-[#333333] p-8 flex flex-col justify-between hover:border-[#444444] transition-all">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">
                    OUR BRANCHES / فروعنا في مصر
                  </span>
                </div>
                <h3 className="font-['Syne',sans-serif] text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white mb-2">
                  FIND YOUR NEAREST STORE
                </h3>
                <p className="text-xs text-[#A0A0A0] leading-relaxed mb-6">
                  Experience AVIRO in person at our flagship stores across Cairo, Giza, Alexandria, and Mansoura. Try on fabrics, fit custom oversized cuts, or pick up your online order with zero delivery fee.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {['Nasr City (Citystars)', 'Mall of Arabia (6th Oct)', 'Mohandessin (Shehab)', 'Alexandria (San Stefano)', 'Zamalek (26th July)', 'Mansoura (Geish St)'].map((branch) => (
                    <div key={branch} className="text-[11px] text-[#808080] flex items-center gap-1.5 bg-[#161616] p-2 border border-[#2c2c2c]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="truncate">{branch}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsStoreLocatorOpen(true)}
                className="w-full py-3.5 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-[#E5E5E5] transition-all flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Open 40+ Branches Directory / دليل الفروع
              </button>
            </div>

            {/* Track Order Quick Strip */}
            <div className="bg-[#1F1F1F] border border-[#333333] p-8 flex flex-col justify-between hover:border-[#444444] transition-all">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">
                    SHIPMENT TRACKER / تتبع شحنتك
                  </span>
                </div>
                <h3 className="font-['Syne',sans-serif] text-2xl sm:text-3xl font-bold uppercase tracking-wider text-white mb-2">
                  TRACK YOUR ACTIVE ORDER
                </h3>
                <p className="text-xs text-[#A0A0A0] leading-relaxed mb-6">
                  Enter your Order ID (e.g., ORD-7821) or mobile phone number to get live real-time updates from our domestic courier partner.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={trackQuery}
                      onChange={(e) => setTrackQuery(e.target.value)}
                      placeholder="Enter Order ID or Mobile Number..."
                      className="w-full bg-[#141414] border border-[#333333] px-4 py-3 text-xs text-white placeholder-[#707070] focus:border-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setIsTrackOrderOpen(true)}
                      className="px-6 py-3 bg-[#2E2E2E] hover:bg-[#383838] text-white text-xs font-bold uppercase tracking-wider border border-[#444444] transition-colors shrink-0"
                    >
                      Track
                    </button>
                  </div>
                  <div className="text-[10px] text-[#707070]">
                    Need immediate assistance? Contact our WhatsApp hotline <strong>01080848292</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsTrackOrderOpen(true)}
                className="w-full py-3.5 bg-[#252525] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#333333] border border-[#383838] transition-all flex items-center justify-center gap-2"
              >
                <Package className="w-4 h-4" />
                Open Live Tracking Center / مركز التتبع
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SKILLS SECTION — MANUS TECHNICAL CAPABILITY SHOWCASE (PRESERVED AS REQUIRED) */}
      <section id="skills-section" className="py-20 bg-[#181818] border-b border-[#333333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-[#808080] uppercase tracking-[0.3em]">
                CRAFTSMANSHIP & SYSTEM
              </span>
              <h2 className="font-['Syne',sans-serif] text-3xl sm:text-4xl font-extrabold uppercase tracking-wider text-white">
                Skills
              </h2>
              <p className="text-sm text-[#B3B3B3] leading-relaxed">
                Every AVIRO garment is engineered through disciplined design principles and modern structural methods.
              </p>
            </div>

            {/* Manus Skill Card */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                id="skill-manus-card"
                className="bg-[#202020] border border-[#333333] p-6 hover:border-[#555555] transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-['Syne',sans-serif] text-xl font-bold uppercase tracking-wider text-white">
                    Manus
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 bg-[#111111] text-[#B3B3B3] border border-[#333333]">
                    SKILL
                  </span>
                </div>
                <p className="text-xs text-[#B3B3B3] leading-relaxed mb-4">
                  Architectural draping and precision fabric tensioning. Combines hand-finished seam integrity with contemporary oversized silhouettes for unmatched structure and longevity.
                </p>
                <div className="space-y-1.5 text-[11px] text-[#808080]">
                  <div className="flex justify-between">
                    <span>Yarn Count & Density</span>
                    <span className="text-white font-medium">580 GSM Custom Milled</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pattern Geometry</span>
                    <span className="text-white font-medium">Boxy Drop-Shoulder</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#202020] border border-[#333333] p-6 hover:border-[#555555] transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-['Syne',sans-serif] text-xl font-bold uppercase tracking-wider text-white">
                    API & Architecture
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 bg-[#111111] text-amber-300 border border-[#333333]">
                    .NET READY
                  </span>
                </div>
                <p className="text-xs text-[#B3B3B3] leading-relaxed mb-4">
                  Modular service layer architected for seamless ASP.NET Core Web API integration with clean DTO mapping, JWT token management, and RBAC authorization guards.
                </p>
                <div className="space-y-1.5 text-[11px] text-[#808080]">
                  <div className="flex justify-between">
                    <span>Endpoint Base</span>
                    <span className="text-white font-mono text-[10px]">VITE_API_BASE_URL</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Authorization</span>
                    <span className="text-white font-medium">Bearer JWT / RBAC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. REVIEWS HIGHLIGHTS */}
      <section className="py-20 bg-[#141414]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] font-bold text-[#808080] uppercase tracking-[0.3em] block mb-2">
              COMMUNITY TESTIMONIALS / آراء العملاء
            </span>
            <h2 className="font-['Syne',sans-serif] text-3xl font-extrabold uppercase tracking-wider text-white mb-3">
              WHAT OUR COMMUNITY SAYS
            </h2>
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-[#B3B3B3]">
              Rated <strong className="text-white">4.9 / 5</strong> based on verified purchase reviews across our stores and website
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1C1C1C] border border-[#333333] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 mb-3 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-[#B3B3B3] leading-relaxed italic mb-4">
                  "اشتريت طقم التي شيرت والبنطلون، الخامات ممتازة والتقفيل عالي جداً زي أكبر البراندات. خدمة التوصيل وصلت تاني يوم في القاهرة والدفع عند الاستلام بعد المعاينة."
                </p>
              </div>
              <div className="pt-3 border-t border-[#333333] flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Ahmed K. (Cairo)</span>
                <span className="text-[10px] text-emerald-400 font-mono uppercase">Verified Buyer</span>
              </div>
            </div>

            <div className="bg-[#1C1C1C] border border-[#333333] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 mb-3 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-[#B3B3B3] leading-relaxed italic mb-4">
                  "The Heavyweight hoodie is insane. The collar stays crisp and the boxy drop shoulder cut looks very high end. Easily comparable to international streetwear brands."
                </p>
              </div>
              <div className="pt-3 border-t border-[#333333] flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Marcus V. (Alexandria)</span>
                <span className="text-[10px] text-emerald-400 font-mono uppercase">Verified Buyer</span>
              </div>
            </div>

            <div className="bg-[#1C1C1C] border border-[#333333] p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 mb-3 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-[#B3B3B3] leading-relaxed italic mb-4">
                  "المقاسات مظبوطة جداً من S لحد 3XL، وبدلت مقاس في فرع سيتي ستارز بدون أي مصاريف في دقيقتين. أفضل تجربة شراء للملابس الرجالي."
                </p>
              </div>
              <div className="pt-3 border-t border-[#333333] flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Tariq S. (Giza)</span>
                <span className="text-[10px] text-emerald-400 font-mono uppercase">Verified Buyer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Modals on Homepage */}
      <StoreLocatorModal
        isOpen={isStoreLocatorOpen}
        onClose={() => setIsStoreLocatorOpen(false)}
      />
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
      />
    </div>
  );
};
