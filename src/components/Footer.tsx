import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import {
  ArrowRight,
  Check,
  Phone,
  MessageCircle,
  MapPin,
  Package,
  ShieldCheck,
  CreditCard,
  Truck,
} from 'lucide-react';
import { StoreLocatorModal } from './StoreLocatorModal';
import { TrackOrderModal } from './TrackOrderModal';

export const Footer: React.FC = () => {
  const { openSizeGuide, addToast } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isStoreLocatorOpen, setIsStoreLocatorOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      addToast('Thank you for subscribing! You will receive 10% off your next purchase.', 'success');
      setNewsletterEmail('');
    }
  };

  return (
    <>
      <footer
        id="main-footer"
        className="w-full bg-[#111111] border-t border-[#333333] text-white pt-16 pb-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-[#333333]">
            {/* Brand Intro & Newsletter (Town Team Retail Style) */}
            <div className="lg:col-span-2 space-y-4">
              <Link
                to="/"
                className="font-['Syne',sans-serif] text-3xl font-extrabold tracking-[0.25em] text-white block uppercase"
              >
                AVIRO
              </Link>
              <p className="text-sm text-[#B3B3B3] font-light max-w-sm">
                "Modern clothing for modern men."
              </p>
              <p className="text-xs text-[#808080] max-w-sm leading-relaxed">
                Egypt's premier masculine streetwear & smart casual brand. Inspired by retail craftsmanship, heavy GSM cotton, and structured oversized tailoring.
              </p>

              {/* Customer Care Hotline Box */}
              <div className="p-3 bg-[#181818] border border-[#333333] max-w-md flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#808080] tracking-wider block">
                    CUSTOMER SERVICE / خدمة العملاء
                  </span>
                  <a
                    href="tel:01080848292"
                    className="text-sm font-bold text-white hover:text-amber-300 transition-colors flex items-center gap-1.5 mt-0.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>01080848292 (9 AM - 11 PM)</span>
                  </a>
                </div>
                <a
                  href="https://wa.me/201080848292"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] text-xs font-bold border border-[#25D366]/30 transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Newsletter input */}
              <div className="pt-2 max-w-md">
                <span className="block text-[11px] font-semibold uppercase tracking-widest text-white mb-2">
                  JOIN AVIRO VIP CLUB (GET 10% OFF)
                </span>
                <form onSubmit={handleSubscribe} className="flex border border-[#333333] bg-[#181818]">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-transparent px-3.5 py-2.5 text-xs text-white placeholder-[#808080] focus:outline-none flex-1"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-white hover:bg-[#E5E5E5] text-black text-xs font-bold tracking-wider transition-colors flex items-center justify-center shrink-0"
                    aria-label="Subscribe"
                  >
                    {subscribed ? <Check className="w-4 h-4 text-emerald-800" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              </div>
            </div>

            {/* SHOP DEPARTMENTS */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-4">
                DEPARTMENTS / الأقسام
              </h4>
              <ul className="space-y-2.5 text-xs text-[#B3B3B3]">
                <li>
                  <Link to="/shop?category=T-Shirts" className="hover:text-white transition-colors">
                    T-Shirts / تي شيرت
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=Hoodies" className="hover:text-white transition-colors">
                    Hoodies / هوديز وسويت شيرت
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=Shirts" className="hover:text-white transition-colors">
                    Shirts / قمصان
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=Pants" className="hover:text-white transition-colors">
                    Pants / بناطيل
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=Jackets" className="hover:text-white transition-colors">
                    Jackets / جاكيتات
                  </Link>
                </li>
                <li>
                  <Link to="/shop?sort=discount" className="hover:text-amber-300 font-bold transition-colors text-amber-400">
                    Offers & Clearance / تخفيضات
                  </Link>
                </li>
              </ul>
            </div>

            {/* CUSTOMER CARE (Town Team style) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-4">
                HELP & SERVICES
              </h4>
              <ul className="space-y-2.5 text-xs text-[#B3B3B3]">
                <li>
                  <button
                    type="button"
                    onClick={() => setIsTrackOrderOpen(true)}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                  >
                    <Package className="w-3.5 h-3.5 text-amber-400" />
                    <span>Track Order / تتبع شحنتك</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsStoreLocatorOpen(true)}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Store Locator / فروعنا في مصر</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openSizeGuide('T-Shirts')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Size Guide / جدول المقاسات (S–3XL)
                  </button>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Exchange & Return Policy / سياسة الاستبدال
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Delivery Times / مواعيد الشحن
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    FAQ / الأسئلة الشائعة
                  </Link>
                </li>
              </ul>
            </div>

            {/* PAYMENT & CONNECT */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-4">
                PAYMENT & SOCIAL
              </h4>
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-[#808080] uppercase tracking-wider block mb-2">
                    Payment Options / طرق الدفع
                  </span>
                  <div className="space-y-1.5 text-xs text-[#B3B3B3]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Cash On Delivery (الدفع عند الاستلام)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-white" />
                      <span>Visa & Mastercard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>Meeza & ValU Installments</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] text-[#808080] uppercase tracking-wider block mb-1.5">
                    Follow Us
                  </span>
                  <div className="flex flex-col space-y-1.5 text-xs text-[#B3B3B3]">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      Instagram @aviro.brand
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      Facebook /avirobrand
                    </a>
                    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      TikTok @aviro_official
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom copyright & system info */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#808080]">
            <p>© {new Date().getFullYear()} AVIRO. All rights reserved. Men's clothing brand.</p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span>Dark Charcoal Aesthetic #111111</span>
              <span>•</span>
              <span>Sizes S to 3XL</span>
              <span>•</span>
              <span>40+ Branches Across Egypt</span>
              <span>•</span>
              <span className="text-[#B3B3B3]">ASP.NET Core API Ready</span>
            </div>
          </div>
        </div>
      </footer>

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
