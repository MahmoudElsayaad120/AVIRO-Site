import React, { useState } from 'react';
import { X, MapPin, Phone, Clock, Search, ExternalLink, Navigation } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  city: string;
  address: string;
  mall?: string;
  phone: string;
  hours: string;
  googleMapsUrl: string;
}

const STORES: Store[] = [
  {
    id: 'store-cairo-mall-arabia',
    name: 'AVIRO Mall of Arabia Branch',
    city: 'Giza / 6th of October',
    mall: 'Mall of Arabia - Gate 1, Ground Floor',
    address: 'Juhayna Square, 6th of October City',
    phone: '+20 100 123 4567',
    hours: '10:00 AM - 11:30 PM (Daily)',
    googleMapsUrl: 'https://maps.google.com/?q=Mall+of+Arabia+Giza',
  },
  {
    id: 'store-cairo-citystars',
    name: 'AVIRO City Stars Branch',
    city: 'Cairo',
    mall: 'City Stars Mall - Level 2, Phase 1',
    address: 'Omar Ibn El Khattab St, Nasr City, Cairo',
    phone: '+20 100 234 5678',
    hours: '10:00 AM - 12:00 AM (Daily)',
    googleMapsUrl: 'https://maps.google.com/?q=City+Stars+Cairo',
  },
  {
    id: 'store-cairo-cfc',
    name: 'AVIRO Cairo Festival City Branch',
    city: 'New Cairo',
    mall: 'CFC Mall - First Floor, Fashion District',
    address: 'Ring Road, 5th Settlement, New Cairo',
    phone: '+20 100 345 6789',
    hours: '10:00 AM - 11:30 PM (Daily)',
    googleMapsUrl: 'https://maps.google.com/?q=Cairo+Festival+City',
  },
  {
    id: 'store-cairo-mohandessin',
    name: 'AVIRO Mohandessin Flagship',
    city: 'Giza',
    address: '42 Gameat El Dowal El Arabiya St, Mohandessin',
    phone: '+20 100 456 7890',
    hours: '10:00 AM - 11:00 PM (Daily)',
    googleMapsUrl: 'https://maps.google.com/?q=Gameat+El+Dowal+Mohandessin',
  },
  {
    id: 'store-cairo-maadi',
    name: 'AVIRO Maadi Branch',
    city: 'Cairo',
    address: 'Road 9, Degla Maadi, Cairo',
    phone: '+20 100 567 8901',
    hours: '10:00 AM - 11:00 PM (Daily)',
    googleMapsUrl: 'https://maps.google.com/?q=Road+9+Maadi',
  },
  {
    id: 'store-alex-sanstefano',
    name: 'AVIRO San Stefano Branch',
    city: 'Alexandria',
    mall: 'San Stefano Grand Plaza - Level 1',
    address: 'El Geish Road, San Stefano, Alexandria',
    phone: '+20 100 678 9012',
    hours: '10:00 AM - 11:30 PM (Daily)',
    googleMapsUrl: 'https://maps.google.com/?q=San+Stefano+Alexandria',
  },
  {
    id: 'store-alex-greenplaza',
    name: 'AVIRO Green Plaza Branch',
    city: 'Alexandria',
    mall: 'Green Plaza Mall - Ground Floor',
    address: 'Semouha, Alexandria',
    phone: '+20 100 789 0123',
    hours: '10:00 AM - 11:00 PM (Daily)',
    googleMapsUrl: 'https://maps.google.com/?q=Green+Plaza+Alexandria',
  },
  {
    id: 'store-mansoura',
    name: 'AVIRO Mansoura Branch',
    city: 'Mansoura',
    address: 'El Gomhouria Street, Next to University Gate',
    phone: '+20 100 890 1234',
    hours: '10:30 AM - 11:00 PM (Daily)',
    googleMapsUrl: 'https://maps.google.com/?q=Mansoura+Egypt',
  },
  {
    id: 'store-tanta',
    name: 'AVIRO Tanta Branch',
    city: 'Tanta',
    address: 'El Geish Street, In front of Tanta Stadium',
    phone: '+20 100 901 2345',
    hours: '10:30 AM - 11:00 PM (Daily)',
    googleMapsUrl: 'https://maps.google.com/?q=Tanta+Egypt',
  },
];

const CITIES = ['All Cities', 'Cairo', 'Giza', 'New Cairo', 'Alexandria', 'Mansoura', 'Tanta'];

interface StoreLocatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoreLocatorModal: React.FC<StoreLocatorModalProps> = ({ isOpen, onClose }) => {
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredStores = STORES.filter((store) => {
    const matchesCity =
      selectedCity === 'All Cities' ||
      store.city.toLowerCase().includes(selectedCity.toLowerCase());
    const matchesQuery =
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (store.mall && store.mall.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCity && matchesQuery;
  });

  return (
    <div
      id="store-locator-modal"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#181818] border border-[#333333] shadow-2xl text-white max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#333333] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              <h2 className="font-['Syne',sans-serif] text-xl sm:text-2xl font-bold uppercase tracking-wider text-white">
                AVIRO STORE LOCATOR / فروعنا
              </h2>
            </div>
            <p className="text-xs text-[#808080] mt-1">
              Visit any of our {STORES.length} official stores across Egypt to try on garments in person
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#808080] hover:text-white hover:bg-[#202020] rounded-full transition-colors"
            aria-label="Close Store Locator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Controls */}
        <div className="p-4 sm:p-5 bg-[#141414] border-b border-[#333333] flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#808080]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by branch name, mall, or street..."
              className="w-full bg-[#181818] border border-[#333333] pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#808080] focus:border-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors border ${
                  selectedCity === city
                    ? 'bg-white text-black border-white'
                    : 'bg-[#181818] text-[#808080] border-[#333333] hover:text-white hover:border-[#555555]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Store Cards List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStores.length === 0 ? (
            <div className="col-span-2 py-12 text-center text-[#808080]">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No branches found matching your search.</p>
              <button
                onClick={() => {
                  setSelectedCity('All Cities');
                  setSearchQuery('');
                }}
                className="mt-3 text-xs text-white underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredStores.map((store) => (
              <div
                key={store.id}
                className="bg-[#202020] border border-[#333333] p-5 hover:border-[#555555] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-['Syne',sans-serif] text-sm font-bold uppercase tracking-wider text-white">
                      {store.name}
                    </h3>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#111111] text-amber-300 border border-amber-400/30 shrink-0">
                      {store.city}
                    </span>
                  </div>

                  {store.mall && (
                    <div className="text-xs font-medium text-white mb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {store.mall}
                    </div>
                  )}

                  <p className="text-xs text-[#B3B3B3] mb-3 flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#808080] shrink-0 mt-0.5" />
                    <span>{store.address}</span>
                  </p>

                  <div className="space-y-1.5 text-xs text-[#808080] mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#808080]" />
                      <span>{store.hours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#808080]" />
                      <a href={`tel:${store.phone}`} className="hover:text-white transition-colors">
                        {store.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#333333] flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Open Today (Fittings Available)
                  </span>
                  <a
                    href={store.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-amber-300 transition-colors uppercase tracking-wider"
                  >
                    <Navigation className="w-3 h-3" />
                    Get Directions
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-[#111111] border-t border-[#333333] text-center text-xs text-[#808080]">
          Can't visit in person? Enjoy nationwide home delivery with <strong className="text-white">Cash on Delivery</strong> and 30-day in-store exchanges!
        </div>
      </div>
    </div>
  );
};
