import { HeroSlide } from '../types';

const HERO_SLIDES_STORAGE_KEY = 'aviro_hero_slides_v2';
const SITE_ASSETS_STORAGE_KEY = 'aviro_uploaded_media_v2';

export interface BrandAsset {
  id: string;
  name: string;
  url: string;
  category: 'model' | 'product' | 'lifestyle' | 'user-upload';
  description?: string;
  addedAt?: string;
}

export const BRAND_PRESET_IMAGES: BrandAsset[] = [
  {
    id: 'asset-hero-1',
    name: 'AVIRO Hero Editorial Model',
    url: '/images/products/aviro_hero_model_1788409973573.jpg',
    category: 'model',
    description: 'Cinematic brand editorial with black sunglasses and dark tone aesthetic',
  },
  {
    id: 'asset-burgundy-tee',
    name: 'AVIRO Burgundy Contrast Piped Tee',
    url: '/images/products/aviro-burgundy-piped.jpg',
    category: 'product',
    description: '300 GSM Heavyweight luxury cotton with contrast white piping lines',
  },
  {
    id: 'asset-built-diff',
    name: 'AVIRO Built Different Black Tee',
    url: '/images/products/aviro-built-different-black.jpg',
    category: 'product',
    description: 'Minimalist streetwear with crisp white chest lettering',
  },
  {
    id: 'asset-retro-charcoal',
    name: 'AVIRO 1970s Heritage Graphic Tee',
    url: '/images/products/aviro-retro-charcoal.jpg',
    category: 'product',
    description: 'Vintage washed charcoal flat-lay with retro yellow/green typography',
  },
  {
    id: 'asset-cobalt-urban',
    name: 'AVIRO 3D Cobalt Blue Streetwear Tee',
    url: '/images/products/aviro-cobalt-urban.jpg',
    category: 'product',
    description: 'Vibrant cobalt blue tee with dimensional orange lettering',
  },
  {
    id: 'asset-editorial-trio',
    name: 'Urban Streetwear Editorial Trio',
    url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=2000&q=90',
    category: 'lifestyle',
    description: 'Urban architecture lookbook scene with streetwear styling',
  },
  {
    id: 'asset-minimal-black',
    name: 'Minimalist Studio Lookbook',
    url: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=2000&q=90',
    category: 'lifestyle',
    description: 'Clean monochrome styling and architectural silhouette',
  },
];

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    image: '/images/products/aviro_hero_model_1788409973573.jpg',
    brand: 'AVIRO',
    tagline: 'DEFINE YOUR STYLE',
    subtitle: 'Premium Quality. Timeless Design.',
    ctaText: 'SHOP NOW',
    ctaLink: '/shop',
    isActive: true,
  },
  {
    id: 'slide-2',
    image: '/images/products/aviro-burgundy-piped.jpg',
    brand: 'AVIRO',
    tagline: 'CONTRAST PIPED DROP',
    subtitle: '300 GSM Combed Luxury Cotton with Engineered White Piping.',
    ctaText: 'EXPLORE DROP',
    ctaLink: '/product/p-aviro-burgundy-piped',
    isActive: true,
  },
  {
    id: 'slide-3',
    image: '/images/products/aviro-built-different-black.jpg',
    brand: 'AVIRO',
    tagline: 'BUILT DIFFERENT',
    subtitle: 'Minimalist Heavyweight Streetwear for the Uncompromising.',
    ctaText: 'SHOP THE TEE',
    ctaLink: '/product/p-aviro-built-different',
    isActive: true,
  },
  {
    id: 'slide-4',
    image: '/images/products/aviro-retro-charcoal.jpg',
    brand: 'AVIRO',
    tagline: 'HERITAGE COLLECTION',
    subtitle: 'Washed Charcoal 1970s Double-Line Typography & Daily Essentials.',
    ctaText: 'VIEW T-SHIRTS',
    ctaLink: '/shop?category=T-Shirts',
    isActive: true,
  },
];

/**
 * Compresses an image file client-side if needed and returns data URL
 */
export const readFileAsOptimizedDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Please select an image file (JPG, PNG, WebP).'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => resolve(reader.result as string);
      img.onload = () => {
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width / height > MAX_WIDTH / MAX_HEIGHT) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          } else {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimized = canvas.toDataURL('image/jpeg', 0.88);
            resolve(optimized);
            return;
          }
        }
        resolve(reader.result as string);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const siteMediaService = {
  getHeroSlides(): HeroSlide[] {
    const saved = localStorage.getItem(HERO_SLIDES_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (err) {
        console.error('Error parsing stored hero slides', err);
      }
    }
    localStorage.setItem(HERO_SLIDES_STORAGE_KEY, JSON.stringify(DEFAULT_HERO_SLIDES));
    return DEFAULT_HERO_SLIDES;
  },

  saveHeroSlides(slides: HeroSlide[]): void {
    localStorage.setItem(HERO_SLIDES_STORAGE_KEY, JSON.stringify(slides));
    window.dispatchEvent(new CustomEvent('aviro-hero-slides-updated', { detail: slides }));
  },

  updateHeroSlide(id: string | number, updates: Partial<HeroSlide>): HeroSlide[] {
    const current = this.getHeroSlides();
    const updated = current.map((slide) => {
      if (String(slide.id) === String(id)) {
        return { ...slide, ...updates };
      }
      return slide;
    });
    this.saveHeroSlides(updated);
    return updated;
  },

  addHeroSlide(newSlide: Omit<HeroSlide, 'id'>): HeroSlide[] {
    const current = this.getHeroSlides();
    const slide: HeroSlide = {
      ...newSlide,
      id: 'slide-' + Date.now(),
      isActive: newSlide.isActive !== false,
    };
    const updated = [...current, slide];
    this.saveHeroSlides(updated);
    return updated;
  },

  deleteHeroSlide(id: string | number): HeroSlide[] {
    const current = this.getHeroSlides();
    const updated = current.filter((s) => String(s.id) !== String(id));
    this.saveHeroSlides(updated);
    return updated;
  },

  resetHeroSlides(): HeroSlide[] {
    this.saveHeroSlides(DEFAULT_HERO_SLIDES);
    return DEFAULT_HERO_SLIDES;
  },

  getUserUploadedAssets(): BrandAsset[] {
    const saved = localStorage.getItem(SITE_ASSETS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  },

  saveUserUploadedAsset(asset: Omit<BrandAsset, 'id' | 'category' | 'addedAt'>): BrandAsset {
    const list = this.getUserUploadedAssets();
    const newAsset: BrandAsset = {
      ...asset,
      id: 'user-media-' + Date.now(),
      category: 'user-upload',
      addedAt: new Date().toISOString(),
    };
    const updated = [newAsset, ...list];
    localStorage.setItem(SITE_ASSETS_STORAGE_KEY, JSON.stringify(updated));
    return newAsset;
  },

  getAllAssets(): BrandAsset[] {
    const userUploaded = this.getUserUploadedAssets();
    return [...userUploaded, ...BRAND_PRESET_IMAGES];
  },
};
