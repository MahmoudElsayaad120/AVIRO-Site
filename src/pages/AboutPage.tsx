import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Ruler, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div id="about-page" className="w-full bg-[#111111] text-white min-h-screen pb-24">
      {/* Editorial Header */}
      <section className="relative w-full py-24 sm:py-32 bg-[#181818] border-b border-[#333333] overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-[10px] font-bold text-[#808080] uppercase tracking-[0.35em] block mb-4">
            BRAND MANIFESTO
          </span>
          <h1 className="font-['Syne',sans-serif] text-4xl sm:text-6xl font-black uppercase tracking-wider text-white mb-6">
            WEAR YOUR IDENTITY
          </h1>
          <p className="text-base sm:text-lg text-[#D0D0D0] font-light leading-relaxed max-w-2xl mx-auto">
            AVIRO was conceived to eliminate the noise in contemporary menswear. We design for young men who demand structural presence, quiet confidence, and zero compromises in fabric weight.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-b border-[#333333]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <span className="text-[10px] font-mono text-[#808080] uppercase tracking-widest">
              PILLAR 01
            </span>
            <h3 className="font-['Syne',sans-serif] text-2xl font-bold uppercase tracking-wider text-white">
              ARCHITECTURAL SILHOUETTES
            </h3>
            <p className="text-xs text-[#B3B3B3] leading-relaxed">
              Every pattern begins with mathematical volume. We emphasize dropped shoulders, extended body drape, and structured collars that retain their stance without slouching.
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-mono text-[#808080] uppercase tracking-widest">
              PILLAR 02
            </span>
            <h3 className="font-['Syne',sans-serif] text-2xl font-bold uppercase tracking-wider text-white">
              EUROPEAN TEXTILE INTEGRITY
            </h3>
            <p className="text-xs text-[#B3B3B3] leading-relaxed">
              Our French terry, loopback cotton, and brushed woolens are custom milled in Guimarães, Portugal and Biella, Italy at weights between 280 GSM and 580 GSM.
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-mono text-[#808080] uppercase tracking-widest">
              PILLAR 03
            </span>
            <h3 className="font-['Syne',sans-serif] text-2xl font-bold uppercase tracking-wider text-white">
              DEDICATED MASCULINE SIZING
            </h3>
            <p className="text-xs text-[#B3B3B3] leading-relaxed">
              From S through 3XL, every dimension is independently graded for male anatomy. We never simply scale up length without recalibrating chest ease and bicep width.
            </p>
          </div>
        </div>
      </section>

      {/* Visual Editorial Collage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="aspect-[4/5] bg-[#181818] border border-[#333333] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=85"
              alt="AVIRO Workshop Pattern Cutting"
              className="w-full h-full object-cover filter brightness-90"
            />
          </div>

          <div className="space-y-6 md:pl-8">
            <span className="text-[10px] font-bold text-[#808080] uppercase tracking-[0.3em]">
              THE AVIRO STANDARD
            </span>
            <h2 className="font-['Syne',sans-serif] text-3xl sm:text-4xl font-extrabold uppercase tracking-wider text-white">
              DESIGNED TO OUTLAST SEASONS
            </h2>
            <p className="text-xs text-[#B3B3B3] leading-relaxed">
              We reject rapid trend cycles. An AVIRO piece is constructed with twin-needle reinforced hems, pre-shrunk organic yarns, and corrosion-resistant hardware so it enters your weekly uniform and remains there for years.
            </p>
            <div className="pt-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-[#E5E5E5] transition-colors"
              >
                DISCOVER THE COLLECTION
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
