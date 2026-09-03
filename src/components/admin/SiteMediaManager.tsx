import React, { useState, useEffect } from 'react';
import {
  HeroSlide,
  CategoryInfo,
} from '../../types';
import {
  siteMediaService,
  BRAND_PRESET_IMAGES,
  BrandAsset,
  readFileAsOptimizedDataUrl,
} from '../../services/siteMediaService';
import { categoryService } from '../../services/categoryService';
import {
  Plus,
  Trash2,
  Edit3,
  Check,
  Upload,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  ExternalLink,
  Sliders,
  Image as ImageIcon,
  Copy,
  Layers,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface SiteMediaManagerProps {
  categories: CategoryInfo[];
  onCategoriesUpdated: () => void;
  onToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  onNavigateToNewProductWithImage?: (imageUrl: string) => void;
}

export const SiteMediaManager: React.FC<SiteMediaManagerProps> = ({
  categories,
  onCategoriesUpdated,
  onToast,
  onNavigateToNewProductWithImage,
}) => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'hero' | 'categories' | 'library'>('hero');
  const [userAssets, setUserAssets] = useState<BrandAsset[]>([]);

  // Editing Slide State
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [slideBrand, setSlideBrand] = useState('AVIRO');
  const [slideTagline, setSlideTagline] = useState('');
  const [slideSubtitle, setSlideSubtitle] = useState('');
  const [slideImage, setSlideImage] = useState('');
  const [slideCtaText, setSlideCtaText] = useState('SHOP NOW');
  const [slideCtaLink, setSlideCtaLink] = useState('/shop');
  const [slideIsActive, setSlideIsActive] = useState(true);

  // Category Edit State
  const [editingCategory, setEditingCategory] = useState<CategoryInfo | null>(null);
  const [categoryImageUrl, setCategoryImageUrl] = useState('');

  // Uploading State
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadMediaData = () => {
    const currentSlides = siteMediaService.getHeroSlides();
    setSlides(currentSlides);
    setUserAssets(siteMediaService.getUserUploadedAssets());
  };

  useEffect(() => {
    loadMediaData();
  }, []);

  // Slide Operations
  const openNewSlideModal = () => {
    setEditingSlide(null);
    setSlideBrand('AVIRO');
    setSlideTagline('NEW DROP 2026');
    setSlideSubtitle('Heavyweight Luxury Streetwear & Clean Lines.');
    setSlideImage('/images/products/aviro-burgundy-piped.jpg');
    setSlideCtaText('EXPLORE DROP');
    setSlideCtaLink('/shop');
    setSlideIsActive(true);
    setIsSlideModalOpen(true);
  };

  const openEditSlideModal = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setSlideBrand(slide.brand || 'AVIRO');
    setSlideTagline(slide.tagline);
    setSlideSubtitle(slide.subtitle);
    setSlideImage(slide.image);
    setSlideCtaText(slide.ctaText);
    setSlideCtaLink(slide.ctaLink);
    setSlideIsActive(slide.isActive !== false);
    setIsSlideModalOpen(true);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideImage.trim()) {
      onToast('Please provide a banner image or upload one', 'error');
      return;
    }

    if (editingSlide) {
      siteMediaService.updateHeroSlide(editingSlide.id, {
        brand: slideBrand.trim() || 'AVIRO',
        tagline: slideTagline.trim(),
        subtitle: slideSubtitle.trim(),
        image: slideImage.trim(),
        ctaText: slideCtaText.trim() || 'SHOP NOW',
        ctaLink: slideCtaLink.trim() || '/shop',
        isActive: slideIsActive,
      });
      onToast('Hero slide updated successfully', 'success');
    } else {
      siteMediaService.addHeroSlide({
        brand: slideBrand.trim() || 'AVIRO',
        tagline: slideTagline.trim(),
        subtitle: slideSubtitle.trim(),
        image: slideImage.trim(),
        ctaText: slideCtaText.trim() || 'SHOP NOW',
        ctaLink: slideCtaLink.trim() || '/shop',
        isActive: slideIsActive,
      });
      onToast('New hero slide added to homepage', 'success');
    }

    setIsSlideModalOpen(false);
    loadMediaData();
  };

  const handleDeleteSlide = (id: string | number) => {
    if (slides.length <= 1) {
      onToast('You must keep at least one hero slide on the homepage', 'error');
      return;
    }
    if (window.confirm('Delete this banner slide from the homepage?')) {
      siteMediaService.deleteHeroSlide(id);
      loadMediaData();
      onToast('Slide deleted', 'info');
    }
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;

    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    siteMediaService.saveHeroSlides(updated);
    setSlides(updated);
    onToast('Slide order updated', 'success');
  };

  const handleResetSlides = () => {
    if (window.confirm('Reset homepage hero slider to the default AVIRO high-resolution brand banners?')) {
      siteMediaService.resetHeroSlides();
      loadMediaData();
      onToast('Hero slider reset to official brand defaults', 'info');
    }
  };

  // Image Upload for Slide or Library
  const handleUploadFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'slide' | 'category' | 'library'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const dataUrl = await readFileAsOptimizedDataUrl(file);

      if (target === 'slide') {
        setSlideImage(dataUrl);
        onToast('Image uploaded and set for banner', 'success');
      } else if (target === 'category') {
        setCategoryImageUrl(dataUrl);
        onToast('Image uploaded for category', 'success');
      } else {
        siteMediaService.saveUserUploadedAsset({
          name: file.name.replace(/\.[^/.]+$/, ''),
          url: dataUrl,
          description: `Uploaded on ${new Date().toLocaleDateString()}`,
        });
        loadMediaData();
        onToast('Image added to site media library', 'success');
      }
    } catch (err: any) {
      onToast(err.message || 'Failed to process image file', 'error');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // Category Banner Update
  const handleOpenCategoryEdit = (cat: CategoryInfo) => {
    setEditingCategory(cat);
    setCategoryImageUrl(cat.image);
  };

  const handleSaveCategoryBanner = async () => {
    if (!editingCategory || !categoryImageUrl.trim()) return;

    try {
      await categoryService.updateCategory(editingCategory.id, {
        image: categoryImageUrl.trim(),
      });
      onToast(`Updated cover image for ${editingCategory.name}`, 'success');
      onCategoriesUpdated();
      setEditingCategory(null);
    } catch (err) {
      onToast('Failed to update category cover image', 'error');
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    onToast('Image URL copied to clipboard', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const allMediaAssets = [...userAssets, ...BRAND_PRESET_IMAGES];

  return (
    <div id="site-media-manager" className="space-y-6">
      {/* Subtabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#333333] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-['Syne',sans-serif] text-lg font-bold uppercase tracking-wider text-white">
              SITE MEDIA & BANNER CONTROL
            </h2>
            <p className="text-xs text-[#808080]">
              Upload, replace, and customize homepage hero banners, category covers, and brand photography.
            </p>
          </div>
        </div>

        {/* Sub-tab selection */}
        <div className="flex items-center gap-1.5 bg-[#141414] p-1 border border-[#333333]">
          <button
            onClick={() => setActiveSubTab('hero')}
            className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'hero' ? 'bg-white text-black' : 'text-[#808080] hover:text-white'
            }`}
          >
            <Sliders className="w-3 h-3" />
            Hero Banners ({slides.length})
          </button>
          <button
            onClick={() => setActiveSubTab('categories')}
            className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'categories' ? 'bg-white text-black' : 'text-[#808080] hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" />
            Category Covers ({categories.length})
          </button>
          <button
            onClick={() => setActiveSubTab('library')}
            className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'library' ? 'bg-white text-black' : 'text-[#808080] hover:text-white'
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            Media Library ({allMediaAssets.length})
          </button>
        </div>
      </div>

      {/* 1. HERO BANNERS MANAGEMENT */}
      {activeSubTab === 'hero' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#181818] border border-[#333333] p-4">
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                HOMEPAGE HERO SLIDES CAROUSEL
              </span>
              <p className="text-[11px] text-[#808080] mt-0.5">
                These slides appear at the very top of the AVIRO home screen. Customers can scroll through them with arrows or swipe.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetSlides}
                className="px-3 py-2 bg-[#202020] hover:bg-[#282828] text-[#B3B3B3] hover:text-white border border-[#333333] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                title="Reset to brand default slides"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Defaults
              </button>
              <button
                onClick={openNewSlideModal}
                className="px-4 py-2 bg-white hover:bg-[#E5E5E5] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Hero Slide
              </button>
            </div>
          </div>

          {/* Slides List */}
          <div className="space-y-4">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="bg-[#181818] border border-[#333333] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group hover:border-[#555555] transition-all"
              >
                {/* Visual Preview */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="relative w-36 sm:w-48 aspect-[16/9] bg-black border border-[#333333] overflow-hidden shrink-0">
                    <img
                      src={slide.image}
                      alt={slide.tagline}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-2 left-2 text-left">
                      <span className="text-[11px] font-black text-white leading-none block font-['Syne',sans-serif]">
                        {slide.brand || 'AVIRO'}
                      </span>
                      <span className="text-[8px] font-bold tracking-widest text-amber-300 uppercase block">
                        {slide.tagline}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white font-['Syne',sans-serif]">
                        {slide.brand || 'AVIRO'} — {slide.tagline}
                      </span>
                      {slide.isActive !== false ? (
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono uppercase tracking-wider">
                          Live on Site
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[9px] font-mono uppercase tracking-wider">
                          Disabled
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#808080] line-clamp-1">{slide.subtitle}</p>
                    <div className="flex items-center gap-2 text-[10px] text-[#A0A0A0] font-mono pt-1">
                      <span>CTA: "{slide.ctaText}"</span>
                      <span>•</span>
                      <span>Link: {slide.ctaLink}</span>
                    </div>
                  </div>
                </div>

                {/* Actions & Reordering */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[#2b2b2b]">
                  {/* Move Up / Down */}
                  <div className="flex items-center bg-[#141414] border border-[#333333]">
                    <button
                      onClick={() => handleMoveSlide(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 text-[#808080] hover:text-white disabled:opacity-30 transition-colors"
                      title="Move slide up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveSlide(index, 'down')}
                      disabled={index === slides.length - 1}
                      className="p-1.5 text-[#808080] hover:text-white disabled:opacity-30 transition-colors"
                      title="Move slide down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => openEditSlideModal(slide)}
                    className="px-3 py-1.5 bg-[#222222] hover:bg-[#2c2c2c] text-white border border-[#333333] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Slide
                  </button>

                  <button
                    onClick={() => handleDeleteSlide(slide.id)}
                    className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. CATEGORY COVERS MANAGEMENT */}
      {activeSubTab === 'categories' && (
        <div className="space-y-6">
          <div className="bg-[#181818] border border-[#333333] p-4">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              CATEGORY HERO & CARD COVERS
            </span>
            <p className="text-[11px] text-[#808080] mt-0.5">
              Customize the imagery representing each collection across the shop category filter and home sections.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-[#181818] border border-[#333333] overflow-hidden group hover:border-[#666666] transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] bg-[#111111] overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-left">
                    <span className="text-sm font-bold text-white uppercase tracking-wider block font-['Syne',sans-serif]">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-[#A0A0A0]">
                      {cat.itemCount || 0} Garments Listed
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#141414] border-t border-[#333333] flex items-center justify-between">
                  <p className="text-[11px] text-[#808080] line-clamp-1 flex-1 pr-2">
                    {cat.description}
                  </p>
                  <button
                    onClick={() => handleOpenCategoryEdit(cat)}
                    className="px-3 py-1.5 bg-white text-black hover:bg-[#E5E5E5] text-[11px] font-bold uppercase tracking-wider transition-colors shrink-0"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MEDIA LIBRARY & QUICK UPLOADER */}
      {activeSubTab === 'library' && (
        <div className="space-y-6">
          {/* Direct File Upload Banner */}
          <div className="bg-[#181818] border border-[#333333] p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-[#202020] border border-[#333333] rounded-full flex items-center justify-center text-white mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                UPLOAD NEW ASSET TO SITE MEDIA LIBRARY
              </h3>
              <p className="text-xs text-[#808080] max-w-lg mx-auto mt-1">
                Upload your brand photos, model lookbooks, and product shots from your device. They will be saved to your media repository and can be attached to any product or banner with 1 click.
              </p>
            </div>

            <div>
              <label className="inline-flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-[#E5E5E5] text-black text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg transition-transform hover:scale-[1.02]">
                <Upload className="w-4 h-4" />
                <span>{isUploading ? 'Processing...' : 'Browse Image File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUploadFile(e, 'library')}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Media Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                ALL AVAILABLE MEDIA ASSETS ({allMediaAssets.length})
              </span>
              <span className="text-[11px] text-[#808080]">
                Click any card to copy URL or use instantly
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {allMediaAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="group bg-[#181818] border border-[#333333] hover:border-white transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] bg-black overflow-hidden">
                    <img
                      src={asset.url}
                      alt={asset.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                      <div className="flex flex-col gap-1.5">
                        <button
                          onClick={() => handleCopyUrl(asset.url, asset.id)}
                          className="w-full py-1.5 bg-white text-black text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow"
                        >
                          {copiedId === asset.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy URL
                            </>
                          )}
                        </button>
                        {onNavigateToNewProductWithImage && (
                          <button
                            onClick={() => onNavigateToNewProductWithImage(asset.url)}
                            className="w-full py-1.5 bg-[#252525] hover:bg-[#333333] text-white text-[10px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1 border border-[#444444]"
                          >
                            <Plus className="w-3 h-3" />
                            New Garment
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#141414] border-t border-[#262626]">
                    <span className="text-xs font-semibold text-white line-clamp-1 block">
                      {asset.name}
                    </span>
                    <span className="text-[10px] text-[#777777] uppercase tracking-wider block mt-0.5">
                      {asset.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT HERO SLIDE */}
      {isSlideModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsSlideModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-[#181818] border border-[#333333] p-6 shadow-2xl text-white space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#333333] pb-3">
              <h3 className="font-['Syne',sans-serif] text-base font-bold uppercase tracking-wider text-white">
                {editingSlide ? 'EDIT HOMEPAGE HERO SLIDE' : 'ADD NEW HOMEPAGE HERO SLIDE'}
              </h3>
              <button
                onClick={() => setIsSlideModalOpen(false)}
                className="text-[#808080] hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-4 text-xs">
              {/* Live Preview Banner Box */}
              <div>
                <label className="block text-[#808080] uppercase tracking-wider mb-1.5">
                  LIVE BANNER PREVIEW
                </label>
                <div className="relative w-full aspect-[21/9] bg-black border border-[#333333] overflow-hidden flex items-center p-6">
                  {slideImage ? (
                    <img
                      src={slideImage}
                      alt="Banner Preview"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover object-right filter brightness-90"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[#555555]">
                      No Image Selected
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

                  <div className="relative z-10 max-w-xs space-y-1 text-left">
                    <span className="font-['Syne',sans-serif] text-2xl font-black uppercase text-white block">
                      {slideBrand || 'AVIRO'}
                    </span>
                    <span className="text-[10px] font-bold tracking-[0.25em] text-amber-300 uppercase block">
                      {slideTagline || 'TAGLINE HERE'}
                    </span>
                    <p className="text-[10px] text-[#CCCCCC] line-clamp-2">
                      {slideSubtitle || 'Subtitle and description text.'}
                    </p>
                    <div className="pt-2">
                      <span className="inline-block px-3 py-1 bg-white text-black text-[9px] font-black uppercase tracking-widest">
                        {slideCtaText || 'SHOP NOW'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Selection Methods */}
              <div className="space-y-2 p-3.5 bg-[#141414] border border-[#333333]">
                <label className="block font-bold uppercase tracking-wider text-white">
                  Banner Background Image
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex-1 px-4 py-2.5 bg-[#222222] hover:bg-[#2a2a2a] border border-[#333333] text-center cursor-pointer flex items-center justify-center gap-2 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUploadFile(e, 'slide')}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="pt-1">
                  <span className="text-[10px] text-[#808080] block mb-1">
                    Or select from existing brand lookbook photos:
                  </span>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {BRAND_PRESET_IMAGES.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSlideImage(preset.url)}
                        className={`w-14 aspect-square border shrink-0 overflow-hidden relative ${
                          slideImage === preset.url ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-[#333333]'
                        }`}
                        title={preset.name}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-1">
                  <label className="block text-[10px] text-[#808080] uppercase tracking-wider mb-1">
                    Or paste direct image URL:
                  </label>
                  <input
                    type="url"
                    value={slideImage}
                    onChange={(e) => setSlideImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#111111] border border-[#333333] px-3 py-1.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Typography & Text Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#808080] uppercase tracking-wider mb-1">
                    Brand Name / Display Title
                  </label>
                  <input
                    type="text"
                    required
                    value={slideBrand}
                    onChange={(e) => setSlideBrand(e.target.value)}
                    placeholder="AVIRO"
                    className="w-full bg-[#111111] border border-[#333333] px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#808080] uppercase tracking-wider mb-1">
                    Tagline (e.g. DEFINE YOUR STYLE)
                  </label>
                  <input
                    type="text"
                    required
                    value={slideTagline}
                    onChange={(e) => setSlideTagline(e.target.value)}
                    placeholder="DEFINE YOUR STYLE"
                    className="w-full bg-[#111111] border border-[#333333] px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#808080] uppercase tracking-wider mb-1">
                  Subtitle / Quality Note
                </label>
                <input
                  type="text"
                  required
                  value={slideSubtitle}
                  onChange={(e) => setSlideSubtitle(e.target.value)}
                  placeholder="Premium Quality. Timeless Design."
                  className="w-full bg-[#111111] border border-[#333333] px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#808080] uppercase tracking-wider mb-1">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    required
                    value={slideCtaText}
                    onChange={(e) => setSlideCtaText(e.target.value)}
                    placeholder="SHOP NOW"
                    className="w-full bg-[#111111] border border-[#333333] px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#808080] uppercase tracking-wider mb-1">
                    CTA Button Destination Link
                  </label>
                  <input
                    type="text"
                    required
                    value={slideCtaLink}
                    onChange={(e) => setSlideCtaLink(e.target.value)}
                    placeholder="/shop"
                    className="w-full bg-[#111111] border border-[#333333] px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="slide-is-active"
                  checked={slideIsActive}
                  onChange={(e) => setSlideIsActive(e.target.checked)}
                  className="accent-white w-4 h-4 cursor-pointer"
                />
                <label htmlFor="slide-is-active" className="text-white font-medium cursor-pointer">
                  Activate this slide on the homepage immediately
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#333333]">
                <button
                  type="button"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="px-4 py-2 text-[#808080] hover:text-white uppercase tracking-wider font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-[#E5E5E5] transition-colors"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT CATEGORY COVER IMAGE */}
      {editingCategory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setEditingCategory(null)}
        >
          <div
            className="w-full max-w-lg bg-[#181818] border border-[#333333] p-6 shadow-2xl text-white space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#333333] pb-3">
              <h3 className="font-['Syne',sans-serif] text-base font-bold uppercase tracking-wider text-white">
                CHANGE COVER IMAGE FOR: {editingCategory.name}
              </h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="text-[#808080] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="relative aspect-[16/9] bg-black border border-[#333333] overflow-hidden">
                <img
                  src={categoryImageUrl}
                  alt={editingCategory.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div>
                <label className="block text-[#808080] uppercase tracking-wider mb-1">
                  Upload New File from Device:
                </label>
                <label className="w-full py-2.5 bg-[#222222] hover:bg-[#2c2c2c] border border-[#333333] text-center cursor-pointer flex items-center justify-center gap-2 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUploadFile(e, 'category')}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <span className="text-[10px] text-[#808080] block mb-1">
                  Or pick from brand presets:
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {BRAND_PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setCategoryImageUrl(preset.url)}
                      className={`w-12 aspect-square border shrink-0 overflow-hidden relative ${
                        categoryImageUrl === preset.url ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-[#333333]'
                      }`}
                      title={preset.name}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#808080] uppercase tracking-wider mb-1">
                  Or Direct Image URL:
                </label>
                <input
                  type="url"
                  value={categoryImageUrl}
                  onChange={(e) => setCategoryImageUrl(e.target.value)}
                  className="w-full bg-[#111111] border border-[#333333] px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#333333]">
                <button
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 text-[#808080] hover:text-white uppercase tracking-wider font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCategoryBanner}
                  className="px-5 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-[#E5E5E5] transition-colors"
                >
                  Save Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
