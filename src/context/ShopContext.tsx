import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  CartItem,
  User,
  CategoryInfo,
  ClothingCategory,
  ClothingSize,
  ProductColor,
  UserRole,
  Currency,
} from '../types';
import {
  authService,
  productService,
  categoryService,
  cartService,
  wishlistService,
} from '../services';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ShopContextType {
  user: User | null;
  products: Product[];
  categories: CategoryInfo[];
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  wishlist: string[];
  wishlistCount: number;
  isLoading: boolean;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isChatbotOpen: boolean;
  setIsChatbotOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  sizeGuideCategory: ClothingCategory;
  openSizeGuide: (category?: ClothingCategory) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amount: number, overrideCurrency?: Currency) => string;
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  isSmartSizeFinderOpen: boolean;
  openSmartSizeFinder: (
    category?: ClothingCategory,
    onApply?: (size: ClothingSize) => void
  ) => void;
  closeSmartSizeFinder: () => void;
  smartSizeCategory: ClothingCategory;
  applySmartSize: (size: ClothingSize) => void;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  addToCart: (
    product: Product,
    size: ClothingSize,
    color: ProductColor,
    quantity?: number
  ) => Promise<void>;
  updateCartQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  login: (email: string, pass: string, role?: UserRole) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    pass: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  refreshProducts: () => Promise<void>;
  refreshCategories: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [sizeGuideCategory, setSizeGuideCategory] = useState<ClothingCategory>('T-Shirts');
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('aviro_currency');
    return (saved === 'USD' || saved === 'EGP') ? saved : 'EGP';
  });
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSmartSizeFinderOpen, setIsSmartSizeFinderOpen] = useState<boolean>(false);
  const [smartSizeCategory, setSmartSizeCategory] = useState<ClothingCategory>('T-Shirts');
  const [smartSizeOnApply, setSmartSizeOnApply] = useState<((size: ClothingSize) => void) | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const setCurrency = useCallback((newCur: Currency) => {
    setCurrencyState(newCur);
    localStorage.setItem('aviro_currency', newCur);
  }, []);

  const formatPrice = useCallback((amount: number, overrideCurrency?: Currency) => {
    const activeCur = overrideCurrency || currency;
    if (activeCur === 'EGP') {
      const egpAmount = Math.round(amount * 10);
      return `${egpAmount.toLocaleString()} ج.م`;
    }
    return `$${amount}`;
  }, [currency]);

  const openQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
  }, []);

  const closeQuickView = useCallback(() => {
    setQuickViewProduct(null);
  }, []);

  const openSmartSizeFinder = useCallback((
    category: ClothingCategory = 'T-Shirts',
    onApply?: (size: ClothingSize) => void
  ) => {
    setSmartSizeCategory(category);
    setSmartSizeOnApply(() => onApply || null);
    setIsSmartSizeFinderOpen(true);
  }, []);

  const closeSmartSizeFinder = useCallback(() => {
    setIsSmartSizeFinderOpen(false);
    setSmartSizeOnApply(null);
  }, []);

  const applySmartSize = useCallback((size: ClothingSize) => {
    if (smartSizeOnApply) {
      smartSizeOnApply(size);
    }
    closeSmartSizeFinder();
  }, [smartSizeOnApply, closeSmartSizeFinder]);

  const addToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = 't-' + Date.now() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshProducts = useCallback(async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products', err);
    }
  }, []);

  const refreshCategories = useCallback(async () => {
    try {
      const cats = await categoryService.getCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    let mounted = true;
    const initialize = async () => {
      setIsLoading(true);
      try {
        const [userData, prods, cats, cartData, wishData] = await Promise.all([
          authService.getCurrentUser(),
          productService.getProducts(),
          categoryService.getCategories(),
          cartService.getCart(),
          wishlistService.getWishlist(),
        ]);
        if (mounted) {
          setUser(userData);
          setProducts(prods);
          setCategories(cats);
          setCart(cartData);
          setWishlist(wishData);
        }
      } catch (e) {
        console.error('Initialization error', e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    initialize();
    return () => {
      mounted = false;
    };
  }, []);

  const addToCart = async (
    product: Product,
    size: ClothingSize,
    color: ProductColor,
    quantity = 1
  ) => {
    try {
      const updated = await cartService.addToCart(product, size, color, quantity);
      setCart(updated);
      addToast(`Added ${product.name} (${size}) to bag`, 'success');
      setIsCartDrawerOpen(true);
    } catch (err) {
      addToast('Could not add to cart', 'error');
    }
  };

  const updateCartQuantity = async (cartItemId: string, quantity: number) => {
    try {
      const updated = await cartService.updateCart(cartItemId, quantity);
      setCart(updated);
    } catch (err) {
      addToast('Could not update bag', 'error');
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      const updated = await cartService.removeFromCart(cartItemId);
      setCart(updated);
      addToast('Item removed from bag', 'info');
    } catch (err) {
      addToast('Could not remove item', 'error');
    }
  };

  const clearCart = async () => {
    await cartService.clearCart();
    setCart([]);
  };

  const toggleWishlist = async (productId: string) => {
    try {
      const added = await wishlistService.toggleWishlist(productId);
      const updated = await wishlistService.getWishlist();
      setWishlist(updated);
      if (added) {
        addToast('Saved to your wishlist', 'success');
      } else {
        addToast('Removed from wishlist', 'info');
      }
    } catch (err) {
      addToast('Could not update wishlist', 'error');
    }
  };

  const isInWishlist = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  const login = async (email: string, pass: string, role?: UserRole) => {
    const loggedUser = await authService.login(email, pass, role);
    setUser(loggedUser);
    addToast(`Welcome back, ${loggedUser.firstName}`, 'success');
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    pass: string
  ) => {
    const newUser = await authService.register(firstName, lastName, email, phone, pass);
    setUser(newUser);
    addToast(`Account created for ${newUser.firstName}`, 'success');
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    addToast('Signed out of AVIRO', 'info');
  };

  const switchRole = async (role: UserRole) => {
    const updated = await authService.switchRole(role);
    setUser(updated);
    addToast(`Role switched to: ${role}`, 'info');
  };

  const openSizeGuide = (category: ClothingCategory = 'T-Shirts') => {
    setSizeGuideCategory(category);
    setIsSizeGuideOpen(true);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <ShopContext.Provider
      value={{
        user,
        products,
        categories,
        cart,
        cartCount,
        cartSubtotal,
        wishlist,
        wishlistCount,
        isLoading,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isChatbotOpen,
        setIsChatbotOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        sizeGuideCategory,
        openSizeGuide,
        currency,
        setCurrency,
        formatPrice,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        isSmartSizeFinderOpen,
        openSmartSizeFinder,
        closeSmartSizeFinder,
        smartSizeCategory,
        applySmartSize,
        toasts,
        addToast,
        removeToast,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        login,
        register,
        logout,
        switchRole,
        refreshProducts,
        refreshCategories,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
