import React, { useState, useEffect } from 'react';
import { Truck, Tag, RefreshCw, MessageSquare, MapPin, Package, Phone } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface AnnouncementBarProps {
  onOpenStoreLocator: () => void;
  onOpenTrackOrder: () => void;
}

const MESSAGES = [
  {
    icon: Truck,
    text: 'شحن سريع ومجاني للطلبات فوق 1000 ج.م / Free Express Shipping on orders over $150',
  },
  {
    icon: Tag,
    text: 'استخدم كود: AVIRO10 للحصول على خصم 10% إضافي / Use code AVIRO10 for extra 10% OFF',
  },
  {
    icon: RefreshCw,
    text: 'استبدال واسترجاع مجاني وسهل خلال 30 يوماً / 30-Day Free In-Store & Online Exchanges',
  },
  {
    icon: MessageSquare,
    text: 'خدمة العملاء والطلب عبر واتساب 24/7 / Order directly on WhatsApp: 01080848292',
  },
];

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  onOpenStoreLocator,
  onOpenTrackOrder,
}) => {
  const { currency, setCurrency } = useShop();
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % MESSAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const activeMsg = MESSAGES[currentIdx];
  const Icon = activeMsg.icon;

  return (
    <div
      id="top-announcement-bar"
      className="w-full bg-[#0A0A0A] border-b border-[#262626] text-white text-[11px] py-2 px-4 sm:px-6 z-50 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left utility: Store Locator & Track Order (Town Team iconic header links) */}
        <div className="hidden lg:flex items-center gap-5 text-[#888888]">
          <button
            onClick={onOpenStoreLocator}
            className="hover:text-white flex items-center gap-1.5 transition-colors uppercase tracking-wider"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Store Locator / فروعنا</span>
          </button>
          <span className="text-[#333333]">•</span>
          <button
            onClick={onOpenTrackOrder}
            className="hover:text-white flex items-center gap-1.5 transition-colors uppercase tracking-wider"
          >
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>Track Order / تتبع شحنتك</span>
          </button>
        </div>

        {/* Center: Dynamic Announcement Ticker */}
        <div className="flex-1 flex items-center justify-center text-center overflow-hidden">
          <div className="inline-flex items-center gap-2 text-white font-medium animate-in fade-in slide-in-from-bottom-1 duration-300">
            <Icon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate tracking-wide">{activeMsg.text}</span>
          </div>
        </div>

        {/* Right utility: WhatsApp Hotline & Currency */}
        <div className="flex items-center gap-4 text-[#888888] shrink-0">
          <a
            href="https://wa.me/201080848292?text=Hello%20AVIRO,%20I%20have%20an%20inquiry"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 flex items-center gap-1 transition-colors text-[10px] sm:text-[11px]"
          >
            <Phone className="w-3 h-3 text-[#25D366]" />
            <span className="hidden sm:inline">WhatsApp: 01080848292</span>
            <span className="sm:hidden font-mono">WhatsApp</span>
          </a>
          <span className="text-[#333333] hidden sm:inline">•</span>
          <div className="flex items-center border border-[#333333] bg-[#141414] overflow-hidden text-[10px] font-mono">
            <button
              type="button"
              onClick={() => setCurrency('EGP')}
              className={`px-2 py-0.5 transition-colors ${
                currency === 'EGP'
                  ? 'bg-white text-black font-bold'
                  : 'text-[#888888] hover:text-white'
              }`}
              title="تغيير العملة إلى الجنيه المصري"
            >
              EGP (ج.م)
            </button>
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`px-2 py-0.5 transition-colors ${
                currency === 'USD'
                  ? 'bg-white text-black font-bold'
                  : 'text-[#888888] hover:text-white'
              }`}
              title="Switch currency to USD"
            >
              USD ($)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
