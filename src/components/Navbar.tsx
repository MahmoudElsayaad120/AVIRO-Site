import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Search,
  Menu,
  X,
  Shield,
  ChevronDown,
  MapPin,
  Package,
  Flame,
  Tag,
} from 'lucide-react';
import { AnnouncementBar } from './AnnouncementBar';
import { StoreLocatorModal } from './StoreLocatorModal';
import { TrackOrderModal } from './TrackOrderModal';

export const Navbar: React.FC = () => {
  const {
    cartCount,
    wishlistCount,
    user,
    setIsCartDrawerOpen,
    categories,
    cartSubtotal,
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCollectionsOpen, setIsCollectionsOpen] = useState<boolean>(false);
  const [isStoreLocatorOpen, setIsStoreLocatorOpen] = useState<boolean>(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Announcement Ticker Bar (Town Team Signature) */}
      <AnnouncementBar
        onOpenStoreLocator={() => setIsStoreLocatorOpen(true)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
      />

      <header
        id="main-navbar"
        className="sticky top-0 z-40 w-full bg-[#111111]/95 backdrop-blur-md border-b border-[#333333] transition-colors shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#B3B3B3] hover:text-white transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              id="brand-logo"
              className="font-['Syne',sans-serif] text-2xl sm:text-3xl font-extrabold tracking-[0.25em] text-white hover:text-[#B3B3B3] transition-colors uppercase select-none"
            >
              AVIRO
            </Link>
          </div>

          {/* Desktop Navigation Links (Town Team E-commerce Architecture) */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-8">
            <Link
              to="/"
              id="nav-link-home"
              className={`text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                isActive('/') && location.pathname === '/'
                  ? 'text-white border-b-2 border-white pb-1'
                  : 'text-[#B3B3B3] hover:text-white'
              }`}
            >
              HOME
            </Link>

            {/* New In / وصل حديثاً */}
            <Link
              to="/shop?sort=newest"
              id="nav-link-new"
              className="relative text-xs font-semibold uppercase tracking-[0.2em] text-[#B3B3B3] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <span>NEW IN</span>
              <span className="text-[9px] font-extrabold bg-white text-black px-1.5 py-0.2 tracking-normal rounded-xs">
                NEW
              </span>
            </Link>

            {/* Best Sellers / الأكثر مبيعاً */}
            <Link
              to="/shop?sort=popular"
              id="nav-link-bestsellers"
              className="relative text-xs font-semibold uppercase tracking-[0.2em] text-[#B3B3B3] hover:text-white transition-colors flex items-center gap-1"
            >
              <span>BEST SELLERS</span>
              <Flame className="w-3.5 h-3.5 text-amber-400" />
            </Link>

            {/* Collections / Garments Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCollectionsOpen(true)}
              onMouseLeave={() => setIsCollectionsOpen(false)}
            >
              <button
                id="nav-collections-trigger"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B3B3B3] hover:text-white transition-colors flex items-center gap-1.5 py-2"
              >
                CATEGORIES
                <ChevronDown className={`w-3 h-3 transition-transform ${isCollectionsOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCollectionsOpen && (
                <div
                  id="nav-collections-menu"
                  className="absolute top-full left-0 w-72 bg-[#181818] border border-[#333333] shadow-2xl py-3 animate-in fade-in slide-in-from-top-2 duration-150 z-50"
                >
                  <div className="px-4 py-1.5 text-[10px] uppercase font-bold tracking-widest text-[#808080] border-b border-[#282828] mb-1">
                    MEN'S ESSENTIAL SILHOUETTES (S–3XL)
                  </div>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/shop?category=${encodeURIComponent(cat.name)}`}
                      onClick={() => setIsCollectionsOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-xs text-[#B3B3B3] hover:text-white hover:bg-[#222222] transition-colors"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-[#707070] font-mono">
                        {cat.itemCount || 4} pieces
                      </span>
                    </Link>
                  ))}
                  <div className="border-t border-[#333333] mt-2 pt-2 px-4">
                    <Link
                      to="/shop"
                      onClick={() => setIsCollectionsOpen(false)}
                      className="block py-1 text-xs font-semibold text-white hover:underline uppercase tracking-wider"
                    >
                      View All Garments →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Offers & Deals / عروض وخصومات (Town Team highlight) */}
            <Link
              to="/shop?sort=discount"
              id="nav-link-offers"
              className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 border border-amber-500/30"
            >
              <Tag className="w-3 h-3 text-amber-400" />
              <span>OFFERS / خصومات</span>
            </Link>

            {/* Complete The Look / نسق طقمك */}
            <a
              href="#complete-the-look"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B3B3B3] hover:text-white transition-colors"
              onClick={(e) => {
                if (location.pathname !== '/') {
                  e.preventDefault();
                  navigate('/#complete-the-look');
                }
              }}
            >
              OUTFITS
            </a>

            {/* Branches / فروعنا */}
            <button
              type="button"
              onClick={() => setIsStoreLocatorOpen(true)}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B3B3B3] hover:text-white transition-colors flex items-center gap-1"
            >
              <MapPin className="w-3.5 h-3.5 text-[#888888]" />
              <span>STORES</span>
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Trigger */}
            <button
              id="btn-nav-search"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#CCCCCC] hover:text-white transition-colors"
              aria-label="Open Search"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
            </button>

            {/* Track Order trigger (Icon on desktop) */}
            <button
              onClick={() => setIsTrackOrderOpen(true)}
              className="p-2 text-[#CCCCCC] hover:text-white transition-colors hidden sm:flex items-center"
              aria-label="Track Order"
              title="Track Order / تتبع شحنتك"
            >
              <Package className="w-5 h-5 stroke-[1.75]" />
            </button>

            {/* User Account / Admin */}
            <Link
              id="btn-nav-account"
              to={user?.role === 'Admin' ? '/admin' : '/account'}
              className="p-2 text-[#CCCCCC] hover:text-white transition-colors relative flex items-center"
              aria-label="User Account"
            >
              {user?.role === 'Admin' ? (
                <div className="flex items-center gap-1.5">
                  <Shield className="w-5 h-5 text-amber-400 stroke-[1.75]" />
                  <span className="hidden xl:inline text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-amber-500/10 px-1.5 py-0.5 border border-amber-500/20">
                    Admin
                  </span>
                </div>
              ) : (
                <UserIcon className="w-5 h-5 stroke-[1.75]" />
              )}
            </Link>

            {/* Wishlist Icon */}
            <Link
              id="btn-nav-wishlist"
              to="/wishlist"
              className="p-2 text-[#CCCCCC] hover:text-white transition-colors relative hidden sm:flex items-center"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.75]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-white text-black text-[9px] font-bold flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Trigger with Subtotal preview */}
            <button
              id="btn-nav-cart"
              onClick={() => setIsCartDrawerOpen(true)}
              className="p-2 text-[#CCCCCC] hover:text-white transition-colors relative flex items-center gap-2"
              aria-label="Open Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black text-[9px] font-bold flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
              {cartCount > 0 && (
                <span className="hidden md:inline font-mono text-xs font-bold text-white">
                  ${cartSubtotal}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Interactive Search Overlay Modal */}
      {isSearchOpen && (
        <div
          id="search-overlay-modal"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 flex items-start justify-center pt-20 px-4"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-[#181818] border border-[#333333] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#333333] mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B3B3B3] font-['Syne',sans-serif]">
                SEARCH GARMENTS / ابحث عن منتج
              </span>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-[#808080] hover:text-white p-1"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search oversized tees, cargo pants, heavyweight hoodies, shirts..."
                className="w-full bg-[#111111] border border-[#333333] px-4 py-3.5 pr-12 text-sm text-white placeholder-[#808080] focus:border-white focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#808080] hover:text-white p-1"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="text-[#808080] self-center mr-1">Popular Searches:</span>
              {['Contrast Piped', 'Heavyweight Hoodie', 'Cargo Pants', 'Jackets', 'Oversized Tee'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    navigate(`/shop?search=${encodeURIComponent(term)}`);
                    setIsSearchOpen(false);
                  }}
                  className="px-2.5 py-1 bg-[#202020] hover:bg-[#292929] text-[#B3B3B3] hover:text-white border border-[#333333] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="fixed inset-0 z-50 lg:hidden bg-black/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-4/5 max-w-sm h-full bg-[#111111] border-r border-[#333333] p-6 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#333333] mb-6">
                <span className="font-['Syne',sans-serif] text-2xl font-extrabold tracking-[0.25em] text-white">
                  AVIRO
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-[#808080] hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-semibold uppercase tracking-widest text-white hover:text-[#B3B3B3]"
                >
                  HOME
                </Link>
                <Link
                  to="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-semibold uppercase tracking-widest text-white hover:text-[#B3B3B3]"
                >
                  SHOP ALL GARMENTS
                </Link>
                <Link
                  to="/shop?sort=newest"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between text-sm font-semibold uppercase tracking-widest text-white hover:text-[#B3B3B3]"
                >
                  <span>NEW ARRIVALS</span>
                  <span className="text-[10px] bg-white text-black px-1.5 py-0.5 font-bold">NEW</span>
                </Link>
                <Link
                  to="/shop?sort=discount"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between text-sm font-bold uppercase tracking-widest text-amber-300 hover:text-amber-200"
                >
                  <span>SPECIAL OFFERS / عروض</span>
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                </Link>

                <div className="pt-2 pb-2">
                  <span className="text-[10px] font-bold text-[#808080] uppercase tracking-widest block mb-2">
                    CATEGORIES / الأقسام
                  </span>
                  <div className="pl-3 space-y-2 border-l border-[#333333]">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/shop?category=${encodeURIComponent(cat.name)}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-xs text-[#B3B3B3] hover:text-white"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsStoreLocatorOpen(true);
                  }}
                  className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-white hover:text-[#B3B3B3] w-full text-left"
                >
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>STORE LOCATOR / فروعنا</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsTrackOrderOpen(true);
                  }}
                  className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-white hover:text-[#B3B3B3] w-full text-left"
                >
                  <Package className="w-4 h-4 text-amber-400" />
                  <span>TRACK ORDER / تتبع شحنتك</span>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#333333] space-y-3">
              <Link
                to={user?.role === 'Admin' ? '/admin' : '/account'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white"
              >
                <UserIcon className="w-4 h-4" />
                {user ? `Account (${user.firstName})` : 'Sign In'}
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-white"
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>Wishlist</span>
                </div>
                {wishlistCount > 0 && (
                  <span className="text-[10px] font-bold text-black bg-white px-1.5 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Global Modals: Store Locator & Track Order */}
      <StoreLocatorModal
        isOpen={isStoreLocatorOpen}
        onClose={() => setIsStoreLocatorOpen(false)}
      />
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
      />
    </>
  );
};
