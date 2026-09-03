import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Ruler, Check } from 'lucide-react';
import { ClothingSize } from '../types';

interface SizeRow {
  size: ClothingSize;
  chestCm: string;
  chestIn: string;
  lengthCm: string;
  lengthIn: string;
  shoulderCm: string;
  shoulderIn: string;
  sleeveCm: string;
  sleeveIn: string;
}

const SIZE_TABLE: SizeRow[] = [
  { size: 'S', chestCm: '106 cm', chestIn: '41.7 in', lengthCm: '72 cm', lengthIn: '28.3 in', shoulderCm: '54 cm', shoulderIn: '21.2 in', sleeveCm: '23 cm', sleeveIn: '9.0 in' },
  { size: 'M', chestCm: '112 cm', chestIn: '44.0 in', lengthCm: '74 cm', lengthIn: '29.1 in', shoulderCm: '56 cm', shoulderIn: '22.0 in', sleeveCm: '24 cm', sleeveIn: '9.4 in' },
  { size: 'L', chestCm: '118 cm', chestIn: '46.4 in', lengthCm: '76 cm', lengthIn: '29.9 in', shoulderCm: '58 cm', shoulderIn: '22.8 in', sleeveCm: '25 cm', sleeveIn: '9.8 in' },
  { size: 'XL', chestCm: '124 cm', chestIn: '48.8 in', lengthCm: '78 cm', lengthIn: '30.7 in', shoulderCm: '60 cm', shoulderIn: '23.6 in', sleeveCm: '26 cm', sleeveIn: '10.2 in' },
  { size: 'XXL', chestCm: '130 cm', chestIn: '51.2 in', lengthCm: '80 cm', lengthIn: '31.5 in', shoulderCm: '62 cm', shoulderIn: '24.4 in', sleeveCm: '27 cm', sleeveIn: '10.6 in' },
  { size: '3XL', chestCm: '136 cm', chestIn: '53.5 in', lengthCm: '82 cm', lengthIn: '32.3 in', shoulderCm: '64 cm', shoulderIn: '25.2 in', sleeveCm: '28 cm', sleeveIn: '11.0 in' },
];

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen, sizeGuideCategory } = useShop();
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  if (!isSizeGuideOpen) return null;

  return (
    <div
      id="size-guide-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setIsSizeGuideOpen(false)}
    >
      <div
        id="size-guide-modal-content"
        className="relative w-full max-w-2xl bg-[#181818] border border-[#333333] p-6 md:p-8 shadow-2xl text-[#FFFFFF]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#333333] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <Ruler className="w-5 h-5 text-[#B3B3B3]" />
            <div>
              <h2 className="text-xl font-bold tracking-wider font-['Syne',sans-serif] uppercase">
                MEN'S SIZE GUIDE
              </h2>
              <p className="text-xs text-[#B3B3B3] uppercase tracking-wider">
                Category: {sizeGuideCategory} (Relaxed Streetwear Fit)
              </p>
            </div>
          </div>
          <button
            id="btn-close-size-guide"
            onClick={() => setIsSizeGuideOpen(false)}
            className="text-[#808080] hover:text-white transition-colors p-1"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit toggle */}
        <div className="flex items-center justify-between mb-6 bg-[#202020] p-2 border border-[#333333]">
          <span className="text-xs font-semibold text-[#B3B3B3] uppercase tracking-wider pl-2">
            Unit of Measurement
          </span>
          <div className="flex items-center gap-1">
            <button
              id="btn-unit-cm"
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                unit === 'cm'
                  ? 'bg-[#111111] text-white border border-[#333333]'
                  : 'text-[#808080] hover:text-white'
              }`}
            >
              Centimeters (cm)
            </button>
            <button
              id="btn-unit-in"
              onClick={() => setUnit('in')}
              className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                unit === 'in'
                  ? 'bg-[#111111] text-white border border-[#333333]'
                  : 'text-[#808080] hover:text-white'
              }`}
            >
              Inches (in)
            </button>
          </div>
        </div>

        {/* Measurements Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#333333] text-[11px] uppercase tracking-wider text-[#B3B3B3]">
                <th className="py-3 px-3 font-semibold">Size</th>
                <th className="py-3 px-3 font-semibold">Chest</th>
                <th className="py-3 px-3 font-semibold">Length</th>
                <th className="py-3 px-3 font-semibold">Shoulder</th>
                <th className="py-3 px-3 font-semibold">Sleeve</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333333]/60 text-sm">
              {SIZE_TABLE.map((row) => (
                <tr key={row.size} className="hover:bg-[#202020] transition-colors">
                  <td className="py-3 px-3 font-bold text-white tracking-wider">{row.size}</td>
                  <td className="py-3 px-3 text-[#B3B3B3]">{unit === 'cm' ? row.chestCm : row.chestIn}</td>
                  <td className="py-3 px-3 text-[#B3B3B3]">{unit === 'cm' ? row.lengthCm : row.lengthIn}</td>
                  <td className="py-3 px-3 text-[#B3B3B3]">{unit === 'cm' ? row.shoulderCm : row.shoulderIn}</td>
                  <td className="py-3 px-3 text-[#B3B3B3]">{unit === 'cm' ? row.sleeveCm : row.sleeveIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* How to measure tips */}
        <div className="mt-6 pt-4 border-t border-[#333333] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#808080]">
          <div>
            <strong className="block text-[#FFFFFF] mb-1 uppercase tracking-wider">1. Chest</strong>
            Measure around the fullest part of your chest, keeping the tape horizontal under your arms.
          </div>
          <div>
            <strong className="block text-[#FFFFFF] mb-1 uppercase tracking-wider">2. Length</strong>
            Measure from the highest point of your shoulder down to your desired hemline.
          </div>
          <div>
            <strong className="block text-[#FFFFFF] mb-1 uppercase tracking-wider">3. Fit Recommendation</strong>
            AVIRO items are tailored with a modern relaxed drop-shoulder cut. Order true to size for standard fit, or size up for extreme oversized look.
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            id="btn-size-guide-understand"
            onClick={() => setIsSizeGuideOpen(false)}
            className="px-6 py-2.5 bg-[#202020] hover:bg-[#292929] text-white text-xs font-semibold uppercase tracking-widest border border-[#333333] transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
