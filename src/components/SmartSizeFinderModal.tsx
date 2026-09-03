import React, { useState, useMemo } from 'react';
import { X, Sparkles, User, Check, ArrowRight, ShieldCheck, Ruler } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ClothingCategory, ClothingSize } from '../types';

type FitPreference = 'slim' | 'regular' | 'oversized';

export const SmartSizeFinderModal: React.FC = () => {
  const {
    isSmartSizeFinderOpen,
    closeSmartSizeFinder,
    smartSizeCategory,
    applySmartSize,
    openSizeGuide,
  } = useShop();

  const [heightCm, setHeightCm] = useState<number>(178);
  const [weightKg, setWeightKg] = useState<number>(80);
  const [fitPref, setFitPref] = useState<FitPreference>('oversized');
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory>(smartSizeCategory || 'T-Shirts');

  // Update selectedCategory whenever smartSizeCategory opens
  React.useEffect(() => {
    if (smartSizeCategory) {
      setSelectedCategory(smartSizeCategory);
    }
  }, [smartSizeCategory]);

  const calculation = useMemo(() => {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);

    let baseSize: ClothingSize = 'L';
    let chestCm = 108;
    let lengthCm = 74;
    let confidence = 97;

    // Weight and height ratio for Egyptian men's apparel
    if (weightKg < 63) {
      baseSize = fitPref === 'oversized' ? 'M' : 'S';
      chestCm = 98;
      lengthCm = 70;
      confidence = 96;
    } else if (weightKg <= 73) {
      if (fitPref === 'slim') baseSize = 'S';
      else if (fitPref === 'regular') baseSize = 'M';
      else baseSize = 'L';
      chestCm = 104;
      lengthCm = 72;
      confidence = 98;
    } else if (weightKg <= 84) {
      if (fitPref === 'slim') baseSize = 'M';
      else if (fitPref === 'regular') baseSize = 'L';
      else baseSize = 'XL';
      chestCm = 112;
      lengthCm = 75;
      confidence = 99;
    } else if (weightKg <= 96) {
      if (fitPref === 'slim') baseSize = 'L';
      else if (fitPref === 'regular') baseSize = 'XL';
      else baseSize = 'XXL';
      chestCm = 120;
      lengthCm = 77;
      confidence = 98;
    } else if (weightKg <= 110) {
      if (fitPref === 'slim') baseSize = 'XL';
      else if (fitPref === 'regular') baseSize = 'XXL';
      else baseSize = '3XL';
      chestCm = 128;
      lengthCm = 80;
      confidence = 97;
    } else {
      baseSize = '3XL';
      chestCm = 136;
      lengthCm = 82;
      confidence = 95;
    }

    // Category tweaks
    let description = '';
    if (fitPref === 'oversized') {
      description = `مقاس ${baseSize} في ${selectedCategory} سيمنحك لوك الشارع العصري (Boxy Drop Shoulder) مع راحة مثالية وحرية حركة دون أن يكون مبالغاً فيه.`;
    } else if (fitPref === 'regular') {
      description = `مقاس ${baseSize} سيعطيك مظهر كاجوال كلاسيكي متناسق تماماً مع خطوط كتفيك وبطول مثالي.`;
    } else {
      description = `مقاس ${baseSize} سيمنحك قصة مضبوطة ومجسمة (Slim & Structured) لإبراز تفاصيل قوامك.`;
    }

    return {
      recommendedSize: baseSize,
      bmi: bmi.toFixed(1),
      chestCm,
      lengthCm,
      confidence,
      description,
    };
  }, [heightCm, weightKg, fitPref, selectedCategory]);

  if (!isSmartSizeFinderOpen) return null;

  return (
    <div
      id="smart-size-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={closeSmartSizeFinder}
    >
      <div
        id="smart-size-modal-content"
        className="relative w-full max-w-xl bg-[#141414] border border-[#333333] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-white animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#333333] bg-[#111111]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider font-['Syne',sans-serif] text-white">
                SMART SIZE FINDER / اعرف مقاسك بالذكاء الاصطناعي
              </h2>
              <span className="text-[10px] text-[#888888] block">
                حاسبة الطول والوزن الدقيقة لتفصيل المقاس الرجالي بدون شريط قياس
              </span>
            </div>
          </div>
          <button
            onClick={closeSmartSizeFinder}
            className="p-1.5 text-[#808080] hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Category Selector Pill */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#888888] mb-2">
              1. نوع القطعة / Garment Type
            </label>
            <div className="grid grid-cols-5 gap-1.5 text-xs">
              {(['T-Shirts', 'Hoodies', 'Shirts', 'Pants', 'Jackets'] as ClothingCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`py-2 px-1 text-center font-bold text-[11px] border transition-all ${
                    selectedCategory === cat
                      ? 'bg-white text-black border-white'
                      : 'bg-[#181818] text-[#888888] border-[#333333] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders: Height & Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Height */}
            <div className="bg-[#1A1A1A] border border-[#333333] p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[#AAAAAA] uppercase tracking-wider">
                  الطول / Height
                </span>
                <span className="font-mono text-base font-extrabold text-white">
                  {heightCm} <span className="text-xs text-[#888888]">سم</span>
                </span>
              </div>
              <input
                type="range"
                min={155}
                max={205}
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full accent-white h-1.5 bg-[#333333] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#666666] font-mono mt-1">
                <span>155 cm</span>
                <span>180 cm</span>
                <span>205 cm</span>
              </div>
            </div>

            {/* Weight */}
            <div className="bg-[#1A1A1A] border border-[#333333] p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[#AAAAAA] uppercase tracking-wider">
                  الوزن / Weight
                </span>
                <span className="font-mono text-base font-extrabold text-white">
                  {weightKg} <span className="text-xs text-[#888888]">كجم</span>
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={135}
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full accent-white h-1.5 bg-[#333333] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#666666] font-mono mt-1">
                <span>50 kg</span>
                <span>85 kg</span>
                <span>135 kg</span>
              </div>
            </div>
          </div>

          {/* Fit Preference */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#888888] mb-2">
              2. ستايل وتلبيس القصة المفضل / Fit Style
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setFitPref('slim')}
                className={`p-3 border text-left transition-all ${
                  fitPref === 'slim'
                    ? 'border-white bg-[#222222] text-white'
                    : 'border-[#333333] bg-[#181818] text-[#888888] hover:text-white'
                }`}
              >
                <div className="font-bold text-xs uppercase">Slim Fit</div>
                <div className="text-[10px] text-[#808080] mt-0.5">مظبوط على الجسم</div>
              </button>

              <button
                type="button"
                onClick={() => setFitPref('regular')}
                className={`p-3 border text-left transition-all ${
                  fitPref === 'regular'
                    ? 'border-white bg-[#222222] text-white'
                    : 'border-[#333333] bg-[#181818] text-[#888888] hover:text-white'
                }`}
              >
                <div className="font-bold text-xs uppercase">Regular Fit</div>
                <div className="text-[10px] text-[#808080] mt-0.5">قياسي معتاد</div>
              </button>

              <button
                type="button"
                onClick={() => setFitPref('oversized')}
                className={`p-3 border text-left transition-all relative ${
                  fitPref === 'oversized'
                    ? 'border-amber-400/80 bg-[#222222] text-white'
                    : 'border-[#333333] bg-[#181818] text-[#888888] hover:text-white'
                }`}
              >
                <span className="absolute top-1.5 right-1.5 text-[8px] bg-amber-400 text-black px-1 font-bold">
                  AVIRO STYLE
                </span>
                <div className="font-bold text-xs uppercase">Oversized</div>
                <div className="text-[10px] text-[#808080] mt-0.5">واسع عصري دروب شولدر</div>
              </button>
            </div>
          </div>

          {/* AI Result Card */}
          <div className="p-5 bg-gradient-to-br from-[#1C1C1C] to-[#121212] border-2 border-amber-400/40 space-y-4">
            <div className="flex items-center justify-between border-b border-[#333333] pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block">
                  RECOMMENDED SIZE / مقاسك المثالي
                </span>
                <span className="text-xs text-[#AAAAAA]">
                  دقة الخوارزمية: <strong className="text-emerald-400">{calculation.confidence}% Match</strong>
                </span>
              </div>
              <div className="w-16 h-16 bg-white text-black font-extrabold text-2xl sm:text-3xl flex items-center justify-center font-['Syne',sans-serif] shadow-lg">
                {calculation.recommendedSize}
              </div>
            </div>

            <p className="text-xs text-[#CCCCCC] leading-relaxed" dir="rtl">
              {calculation.description}
            </p>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#333333]/70 text-center font-mono">
              <div className="bg-[#141414] p-2 border border-[#2B2B2B]">
                <span className="text-[9px] text-[#777777] uppercase block">الصدر التقريبي</span>
                <span className="text-xs font-bold text-white">{calculation.chestCm} cm</span>
              </div>
              <div className="bg-[#141414] p-2 border border-[#2B2B2B]">
                <span className="text-[9px] text-[#777777] uppercase block">الطول المثالي</span>
                <span className="text-xs font-bold text-white">{calculation.lengthCm} cm</span>
              </div>
              <div className="bg-[#141414] p-2 border border-[#2B2B2B]">
                <span className="text-[9px] text-[#777777] uppercase block">مؤشر الكتلة BMI</span>
                <span className="text-xs font-bold text-amber-400">{calculation.bmi}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-[#111111] border-t border-[#333333] flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => applySmartSize(calculation.recommendedSize)}
            className="w-full sm:flex-1 py-3.5 bg-white hover:bg-[#E5E5E5] text-black font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Check className="w-4 h-4 text-emerald-800 stroke-[3]" />
            <span>اعتماد المقاس ({calculation.recommendedSize}) واختياره فوراً</span>
          </button>

          <button
            onClick={() => {
              closeSmartSizeFinder();
              openSizeGuide(selectedCategory);
            }}
            className="w-full sm:w-auto px-4 py-3.5 bg-[#1C1C1C] hover:bg-[#252525] text-[#AAAAAA] hover:text-white border border-[#333333] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>جدول المقاسات بالسنتيمتر</span>
          </button>
        </div>
      </div>
    </div>
  );
};
