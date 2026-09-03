import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import {
  productService,
  orderService,
  reviewService,
  authService,
} from '../services';
import {
  Product,
  Order,
  Review,
  User,
  ClothingCategory,
  ClothingSize,
  OrderStatus,
} from '../types';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Star,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  SlidersHorizontal,
  DollarSign,
  ArrowUpRight,
  Shield,
  Lock,
  Eye,
  RefreshCw,
  Image as ImageIcon,
  Copy as CopyIcon,
  Sparkles,
  Layers,
} from 'lucide-react';
import { SiteMediaManager } from '../components/admin/SiteMediaManager';
import { ImageUploader } from '../components/admin/ImageUploader';

const CATEGORIES: ClothingCategory[] = [
  'T-Shirts',
  'Hoodies',
  'Shirts',
  'Pants',
  'Jackets',
  'Sweatpants',
];

const ALL_SIZES: ClothingSize[] = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

export const AdminDashboardPage: React.FC = () => {
  const { user, switchRole, addToast, refreshProducts, categories, refreshCategories } = useShop();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'media' | 'orders' | 'customers' | 'reviews'
  >('overview');

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & Search
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'in_stock' | 'low_stock'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'approved'>('all');

  // Modal / Form States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // New/Edit Product Form state with multi-image support
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ClothingCategory>('T-Shirts');
  const [formPrice, setFormPrice] = useState(120);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | undefined>(undefined);
  const [formStock, setFormStock] = useState(50);
  const [formDescription, setFormDescription] = useState('');
  const [formMaterial, setFormMaterial] = useState('100% Heavyweight Cotton');
  const [formFit, setFormFit] = useState('Boxy Drop-Shoulder Fit');
  const [formFabricWeight, setFormFabricWeight] = useState('280 GSM');
  const [formCountry, setFormCountry] = useState('Portugal');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formSizes, setFormSizes] = useState<ClothingSize[]>([...ALL_SIZES]);
  const [formIsFeatured, setFormIsFeatured] = useState<boolean>(false);
  const [formIsNewArrival, setFormIsNewArrival] = useState<boolean>(true);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [prodList, orderList, reviewList, custList] = await Promise.all([
        productService.getProducts(),
        orderService.getAllOrders(),
        reviewService.getAllReviews(),
        authService.getAllCustomers(),
      ]);
      setProducts(prodList);
      setOrders(orderList);
      setReviews(reviewList);
      setCustomers(custList);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Access Control Guard (Requirement #20 & #27)
  if (!user || user.role !== 'Admin') {
    return (
      <div className="min-h-[80vh] bg-[#111111] text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#181818] border border-[#333333] p-8 text-center space-y-5">
          <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-['Syne',sans-serif] text-2xl font-bold uppercase tracking-wider text-white">
              ACCESS RESTRICTED
            </h2>
            <p className="text-xs text-[#808080] mt-2 leading-relaxed">
              The AVIRO Admin Dashboard requires Administrator privileges. Customer accounts are not authorized to view internal inventory or moderation queues.
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => switchRole('Admin')}
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Switch to Admin Role Preview
            </button>
            <Link
              to="/login"
              className="w-full py-2.5 bg-[#202020] hover:bg-[#292929] text-white text-xs font-semibold uppercase tracking-wider border border-[#333333] block text-center transition-colors"
            >
              Sign In with Admin Credentials
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculated Stats (Requirement #27)
  const totalSales = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const lowStockProducts = products.filter((p) => p.stock < 20);
  const pendingReviews = reviews.filter((r) => !r.isApproved);

  // Product Actions
  const openNewProductModal = (initialImg?: string) => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('T-Shirts');
    setFormPrice(120);
    setFormOriginalPrice(undefined);
    setFormStock(50);
    setFormDescription('Heavyweight architectural drop-shoulder garment crafted in Portugal.');
    setFormMaterial('100% Organic Heavyweight Cotton');
    setFormFit('Boxy Drop-Shoulder Oversized Fit');
    setFormFabricWeight('300 GSM');
    setFormCountry('Portugal');
    setFormImages(initialImg ? [initialImg] : ['/images/products/aviro-burgundy-piped.jpg']);
    setFormSizes([...ALL_SIZES]);
    setFormIsFeatured(false);
    setFormIsNewArrival(true);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormPrice(product.price);
    setFormOriginalPrice(product.originalPrice);
    setFormStock(product.stock);
    setFormDescription(product.description);
    setFormMaterial(product.details.material);
    setFormFit(product.details.fit);
    setFormFabricWeight(product.details.fabricWeight);
    setFormCountry(product.details.countryOfOrigin);
    setFormImages([...(product.images || [])]);
    setFormSizes([...product.sizes]);
    setFormIsFeatured(!!product.isFeatured);
    setFormIsNewArrival(product.isNewArrival !== false);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formImages.length === 0) {
      addToast('Please enter product name and add at least one image', 'error');
      return;
    }

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, {
          name: formName,
          category: formCategory,
          price: formPrice,
          originalPrice: formOriginalPrice || undefined,
          stock: formStock,
          description: formDescription,
          sizes: formSizes,
          images: formImages,
          isFeatured: formIsFeatured,
          isNewArrival: formIsNewArrival,
          details: {
            material: formMaterial,
            fit: formFit,
            fabricWeight: formFabricWeight,
            countryOfOrigin: formCountry,
            careInstructions: editingProduct.details.careInstructions,
          },
        });
        addToast(`Updated garment: ${formName}`, 'success');
      } else {
        await productService.createProduct({
          name: formName,
          category: formCategory,
          price: formPrice,
          originalPrice: formOriginalPrice || undefined,
          stock: formStock,
          description: formDescription,
          sizes: formSizes,
          rating: 5.0,
          reviewCount: 0,
          isFeatured: formIsFeatured,
          isNewArrival: formIsNewArrival,
          colors: [
            { name: 'Black', hex: '#111111' },
            { name: 'Gray', hex: '#4A4A4A' },
          ],
          images: formImages,
          details: {
            material: formMaterial,
            fit: formFit,
            fabricWeight: formFabricWeight,
            countryOfOrigin: formCountry,
            careInstructions: 'Machine wash cold inside-out. Hang dry.',
          },
        });
        addToast(`Created new garment: ${formName}`, 'success');
      }
      setIsProductModalOpen(false);
      await loadAllData();
      await refreshProducts();
    } catch (err) {
      addToast('Failed to save product', 'error');
    }
  };

  const handleDuplicateProduct = async (product: Product) => {
    try {
      await productService.createProduct({
        ...product,
        name: `${product.name} (Duplicate)`,
        rating: 5.0,
        reviewCount: 0,
      });
      addToast(`Duplicated ${product.name}`, 'success');
      await loadAllData();
      await refreshProducts();
    } catch {
      addToast('Failed to duplicate garment', 'error');
    }
  };

  const handleQuickStockChange = async (productId: string, delta: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    const newStock = Math.max(0, prod.stock + delta);
    try {
      await productService.updateProduct(productId, { stock: newStock });
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
      );
      addToast(`Stock for ${prod.name}: ${newStock} units`, 'info');
      await refreshProducts();
    } catch {
      addToast('Failed to update stock', 'error');
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    const nextVal = !product.isFeatured;
    try {
      await productService.updateProduct(product.id, { isFeatured: nextVal });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isFeatured: nextVal } : p))
      );
      addToast(
        `${product.name} is now ${nextVal ? 'featured on homepage' : 'unfeatured'}`,
        'success'
      );
      await refreshProducts();
    } catch {
      addToast('Failed to toggle featured status', 'error');
    }
  };

  const handleDeleteProduct = async (productId: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      await productService.deleteProduct(productId);
      addToast(`Deleted ${name}`, 'info');
      await loadAllData();
      await refreshProducts();
    }
  };

  // Order Actions
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await orderService.updateOrderStatus(orderId, status);
    addToast(`Order ${orderId} updated to ${status}`, 'success');
    loadAllData();
  };

  // Review Actions
  const handleApproveReview = async (reviewId: string) => {
    await reviewService.approveReview(reviewId);
    addToast('Review approved and published', 'success');
    loadAllData();
  };

  const handleRejectReview = async (reviewId: string) => {
    await reviewService.deleteReview(reviewId);
    addToast('Review rejected and deleted', 'info');
    loadAllData();
  };

  // Filtered views
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory =
      productCategoryFilter === 'All' || p.category === productCategoryFilter;
    const matchesStock =
      productStockFilter === 'all' ||
      (productStockFilter === 'low_stock' ? p.stock < 15 : p.stock >= 15);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus =
      orderStatusFilter === 'All' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === 'pending') return !r.isApproved;
    if (reviewFilter === 'approved') return r.isApproved;
    return true;
  });

  return (
    <div id="admin-dashboard" className="w-full bg-[#111111] text-white min-h-screen pb-24">
      {/* Top Banner */}
      <div className="bg-[#181818] border-b border-[#333333] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-400">
                ADMINISTRATION CONSOLE
              </span>
              <h1 className="font-['Syne',sans-serif] text-2xl font-extrabold uppercase tracking-wider text-white">
                AVIRO HQ CONTROL
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              className="p-2 bg-[#202020] hover:bg-[#292929] border border-[#333333] text-[#B3B3B3] hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={openNewProductModal}
              className="px-4 py-2.5 bg-white hover:bg-[#E5E5E5] text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Garment
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#333333] mb-8 gap-6 overflow-x-auto text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3.5 flex items-center gap-2 whitespace-nowrap relative ${
              activeTab === 'overview' ? 'text-white' : 'text-[#808080] hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview
            {activeTab === 'overview' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white" />}
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3.5 flex items-center gap-2 whitespace-nowrap relative ${
              activeTab === 'products' ? 'text-white' : 'text-[#808080] hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            Products ({products.length})
            {activeTab === 'products' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white" />}
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`pb-3.5 flex items-center gap-2 whitespace-nowrap relative ${
              activeTab === 'media' ? 'text-white' : 'text-[#808080] hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-amber-400" />
            Media & Banners
            {activeTab === 'media' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-400" />}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3.5 flex items-center gap-2 whitespace-nowrap relative ${
              activeTab === 'orders' ? 'text-white' : 'text-[#808080] hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Orders ({orders.length})
            {activeTab === 'orders' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white" />}
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`pb-3.5 flex items-center gap-2 whitespace-nowrap relative ${
              activeTab === 'customers' ? 'text-white' : 'text-[#808080] hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Customers ({customers.length})
            {activeTab === 'customers' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white" />}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3.5 flex items-center gap-2 whitespace-nowrap relative ${
              activeTab === 'reviews' ? 'text-white' : 'text-[#808080] hover:text-white'
            }`}
          >
            <Star className="w-4 h-4" />
            Reviews ({reviews.length})
            {pendingReviews.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
            {activeTab === 'reviews' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white" />}
          </button>
        </div>

        {/* 27. TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#181818] border border-[#333333] p-5 space-y-2">
                <span className="text-[10px] font-bold text-[#808080] uppercase tracking-wider block">
                  TOTAL REVENUE
                </span>
                <div className="text-3xl font-extrabold text-white font-['Syne',sans-serif]">
                  ${totalSales.toLocaleString()}
                </div>
                <p className="text-[11px] text-emerald-400 font-medium">
                  +18.4% compared to previous drop
                </p>
              </div>

              <div className="bg-[#181818] border border-[#333333] p-5 space-y-2">
                <span className="text-[10px] font-bold text-[#808080] uppercase tracking-wider block">
                  TOTAL ORDERS
                </span>
                <div className="text-3xl font-extrabold text-white font-['Syne',sans-serif]">
                  {totalOrdersCount}
                </div>
                <p className="text-[11px] text-[#B3B3B3]">
                  {orders.filter((o) => o.status === 'Processing').length} in processing queue
                </p>
              </div>

              <div className="bg-[#181818] border border-[#333333] p-5 space-y-2">
                <span className="text-[10px] font-bold text-[#808080] uppercase tracking-wider block">
                  ACTIVE PRODUCTS
                </span>
                <div className="text-3xl font-extrabold text-white font-['Syne',sans-serif]">
                  {products.length}
                </div>
                <p className="text-[11px] text-[#B3B3B3]">
                  All sizes S–3XL maintained
                </p>
              </div>

              <div className="bg-[#181818] border border-[#333333] p-5 space-y-2">
                <span className="text-[10px] font-bold text-[#808080] uppercase tracking-wider block">
                  TOTAL CLIENTELE
                </span>
                <div className="text-3xl font-extrabold text-white font-['Syne',sans-serif]">
                  {customers.length}
                </div>
                <p className="text-[11px] text-[#B3B3B3]">
                  Verified customer accounts
                </p>
              </div>
            </div>

            {/* Low Stock Alerts & Pending Reviews */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Low Stock Card */}
              <div className="bg-[#181818] border border-[#333333] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#333333] pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      LOW INVENTORY ALERTS ({lowStockProducts.length})
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="text-[11px] text-[#B3B3B3] hover:text-white underline uppercase tracking-wider"
                  >
                    Manage Inventory
                  </button>
                </div>

                <div className="space-y-3">
                  {lowStockProducts.length === 0 ? (
                    <p className="text-xs text-[#808080]">Inventory levels healthy across all styles.</p>
                  ) : (
                    lowStockProducts.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between text-xs py-2 border-b border-[#333333]/50 last:border-none"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-8 h-10 object-cover bg-[#202020] border border-[#333333]"
                          />
                          <div>
                            <span className="font-semibold text-white block">{p.name}</span>
                            <span className="text-[10px] text-[#808080]">{p.category}</span>
                          </div>
                        </div>
                        <span className="font-mono text-amber-400 font-bold">
                          {p.stock} units remaining
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Pending Reviews Card */}
              <div className="bg-[#181818] border border-[#333333] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#333333] pb-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-white" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      PENDING REVIEWS MODERATION ({pendingReviews.length})
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-[11px] text-[#B3B3B3] hover:text-white underline uppercase tracking-wider"
                  >
                    Review Queue
                  </button>
                </div>

                <div className="space-y-3">
                  {pendingReviews.length === 0 ? (
                    <p className="text-xs text-[#808080]">No pending reviews awaiting approval.</p>
                  ) : (
                    pendingReviews.map((r) => (
                      <div
                        key={r.id}
                        className="p-3 bg-[#111111] border border-[#333333] space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{r.userName}</span>
                          <span className="text-[10px] text-[#808080]">{r.rating} / 5 Stars</span>
                        </div>
                        <p className="text-[#B3B3B3] line-clamp-1 italic">"{r.comment}"</p>
                        <div className="flex gap-2 justify-end pt-1">
                          <button
                            onClick={() => handleApproveReview(r.id)}
                            className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold uppercase tracking-wider hover:bg-emerald-500/20"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectReview(r.id)}
                            className="px-2.5 py-1 bg-rose-500/10 text-rose-300 border border-rose-500/30 text-[10px] font-semibold uppercase tracking-wider hover:bg-rose-500/20"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 28. TAB 2: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="relative flex-1 min-w-[200px] sm:w-64">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search garments..."
                    className="w-full bg-[#181818] border border-[#333333] pl-9 pr-3 py-2 text-xs text-white focus:border-white focus:outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-[#808080] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-[#181818] border border-[#333333] text-xs text-white px-3 py-2 uppercase tracking-wider focus:outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <select
                  value={productStockFilter}
                  onChange={(e) => setProductStockFilter(e.target.value as any)}
                  className="bg-[#181818] border border-[#333333] text-xs text-white px-3 py-2 uppercase tracking-wider focus:outline-none cursor-pointer"
                >
                  <option value="all">All Inventory</option>
                  <option value="in_stock">In Stock (15+)</option>
                  <option value="low_stock">Low Stock (&lt; 15)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('media')}
                  className="px-3 py-2 bg-[#202020] hover:bg-[#282828] border border-[#333333] text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 transition-colors"
                  title="Manage Site Photos and Banners"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Site Media
                </button>
                <button
                  onClick={() => openNewProductModal()}
                  className="px-4 py-2 bg-white hover:bg-[#E5E5E5] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow"
                >
                  <Plus className="w-4 h-4" />
                  Add Garment
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-[#181818] border border-[#333333] overflow-x-auto">
              <table className="w-full text-left text-xs text-[#B3B3B3]">
                <thead className="bg-[#111111] text-[#808080] uppercase tracking-wider border-b border-[#333333]">
                  <tr>
                    <th className="p-3.5">Garment & Photos</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Stock Management</th>
                    <th className="p-3.5">Sizes</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#333333]/60">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#808080]">
                        No garments match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#202020] transition-colors">
                        <td className="p-3.5 flex items-center gap-3">
                          <div className="relative w-12 aspect-[3/4] bg-[#202020] border border-[#333333] shrink-0 overflow-hidden">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover object-top"
                            />
                            {p.images.length > 1 && (
                              <span className="absolute bottom-0 right-0 bg-black/80 px-1 py-0.2 text-[8px] text-white font-mono">
                                +{p.images.length - 1}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white block">{p.name}</span>
                              {p.isFeatured && (
                                <span className="px-1.5 py-0.2 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] uppercase font-bold tracking-wider">
                                  Featured
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-[#808080] font-mono">ID: {p.id}</span>
                          </div>
                        </td>
                        <td className="p-3.5 font-medium">{p.category}</td>
                        <td className="p-3.5 text-white font-bold">
                          ${p.price}
                          {p.originalPrice && (
                            <span className="ml-1.5 text-[10px] text-[#666666] line-through font-normal">
                              ${p.originalPrice}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <div className="inline-flex items-center gap-1.5 bg-[#141414] border border-[#333333] px-1.5 py-1">
                            <button
                              onClick={() => handleQuickStockChange(p.id, -5)}
                              className="w-5 h-5 bg-[#202020] hover:bg-[#282828] text-white rounded text-[11px] font-bold flex items-center justify-center transition-colors"
                              title="Decrease stock by 5"
                            >
                              -
                            </button>
                            <span
                              className={`font-mono px-2 py-0.5 text-[10px] font-bold ${
                                p.stock < 15 ? 'text-rose-400' : 'text-emerald-400'
                              }`}
                            >
                              {p.stock}
                            </span>
                            <button
                              onClick={() => handleQuickStockChange(p.id, 5)}
                              className="w-5 h-5 bg-[#202020] hover:bg-[#282828] text-white rounded text-[11px] font-bold flex items-center justify-center transition-colors"
                              title="Increase stock by 5"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-3.5 text-[11px] text-[#808080]">{p.sizes.join(' ')}</td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleToggleFeatured(p)}
                            className={`p-1.5 transition-colors ${
                              p.isFeatured
                                ? 'text-amber-400 hover:text-amber-300'
                                : 'text-[#666666] hover:text-[#AAAAAA]'
                            }`}
                            title={p.isFeatured ? 'Remove from Featured' : 'Mark as Featured on Homepage'}
                          >
                            <Star className={`w-3.5 h-3.5 ${p.isFeatured ? 'fill-amber-400' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleDuplicateProduct(p)}
                            className="p-1.5 text-[#808080] hover:text-white transition-colors"
                            title="Duplicate Garment"
                          >
                            <CopyIcon className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditProductModal(p)}
                            className="p-1.5 text-[#808080] hover:text-white transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 text-[#808080] hover:text-rose-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: SITE MEDIA & BANNERS */}
        {activeTab === 'media' && (
          <SiteMediaManager
            categories={categories}
            onCategoriesUpdated={refreshCategories}
            onToast={addToast}
            onNavigateToNewProductWithImage={(imgUrl) => {
              openNewProductModal(imgUrl);
              setActiveTab('products');
            }}
          />
        )}

        {/* 29. TAB 3: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-72">
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by order ID or customer..."
                    className="w-full bg-[#181818] border border-[#333333] pl-9 pr-3 py-2 text-xs text-white focus:border-white focus:outline-none"
                  />
                  <Search className="w-3.5 h-3.5 text-[#808080] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-[#181818] border border-[#333333] text-xs text-white px-3 py-2 uppercase tracking-wider focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#181818] border border-[#333333] overflow-x-auto">
              <table className="w-full text-left text-xs text-[#B3B3B3]">
                <thead className="bg-[#111111] text-[#808080] uppercase tracking-wider border-b border-[#333333]">
                  <tr>
                    <th className="p-3.5">Order Ref</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Total</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#333333]/60">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#202020] transition-colors">
                      <td className="p-3.5 font-mono font-bold text-white">{o.id}</td>
                      <td className="p-3.5">
                        <span className="font-semibold text-white block">{o.customerName}</span>
                        <span className="text-[10px] text-[#808080]">{o.customerEmail}</span>
                      </td>
                      <td className="p-3.5">{o.createdAt}</td>
                      <td className="p-3.5 font-bold text-white">${o.totalAmount}</td>
                      <td className="p-3.5">
                        <select
                          value={o.status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)
                          }
                          className="bg-[#111111] border border-[#333333] text-[11px] text-white px-2 py-1 uppercase tracking-wider focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedOrderDetails(o)}
                          className="px-2.5 py-1 bg-[#202020] hover:bg-white hover:text-black text-white text-[10px] font-bold uppercase tracking-wider border border-[#333333] transition-colors"
                        >
                          View Items ({o.items.length})
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 30. TAB 4: CUSTOMER MANAGEMENT */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="bg-[#181818] border border-[#333333] overflow-x-auto">
              <table className="w-full text-left text-xs text-[#B3B3B3]">
                <thead className="bg-[#111111] text-[#808080] uppercase tracking-wider border-b border-[#333333]">
                  <tr>
                    <th className="p-3.5">Customer Name</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Size Preference</th>
                    <th className="p-3.5">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#333333]/60">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-[#202020] transition-colors">
                      <td className="p-3.5 font-bold text-white">
                        {c.firstName} {c.lastName}
                      </td>
                      <td className="p-3.5 font-mono">{c.email}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                            c.role === 'Admin'
                              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                              : 'bg-[#202020] text-[#B3B3B3]'
                          }`}
                        >
                          {c.role}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-white">
                        Size {c.preferredSize || 'L'}
                      </td>
                      <td className="p-3.5 text-[#808080]">
                        {c.address?.city || 'New York'}, {c.address?.country || 'USA'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 31. TAB 5: REVIEW MODERATION */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex gap-2 border-b border-[#333333] pb-3 text-xs">
              <button
                onClick={() => setReviewFilter('all')}
                className={`px-3 py-1 uppercase tracking-wider font-semibold ${
                  reviewFilter === 'all' ? 'bg-white text-black' : 'text-[#808080] hover:text-white'
                }`}
              >
                All Reviews ({reviews.length})
              </button>
              <button
                onClick={() => setReviewFilter('pending')}
                className={`px-3 py-1 uppercase tracking-wider font-semibold ${
                  reviewFilter === 'pending'
                    ? 'bg-amber-400 text-black'
                    : 'text-[#808080] hover:text-white'
                }`}
              >
                Pending Approval ({pendingReviews.length})
              </button>
              <button
                onClick={() => setReviewFilter('approved')}
                className={`px-3 py-1 uppercase tracking-wider font-semibold ${
                  reviewFilter === 'approved'
                    ? 'bg-white text-black'
                    : 'text-[#808080] hover:text-white'
                }`}
              >
                Approved ({reviews.filter((r) => r.isApproved).length})
              </button>
            </div>

            <div className="space-y-4">
              {filteredReviews.map((r) => (
                <div
                  key={r.id}
                  className="bg-[#181818] border border-[#333333] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white">{r.userName}</span>
                      <span className="text-[10px] text-[#808080]">Product: {r.productName}</span>
                      <span
                        className={`text-[9px] font-mono uppercase px-1.5 py-0.5 ${
                          r.isApproved
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {r.isApproved ? 'Approved & Public' : 'Pending Moderation'}
                      </span>
                    </div>
                    <div className="flex text-white">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < r.rating ? 'fill-white text-white' : 'text-[#444444]'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[#B3B3B3] italic">"{r.comment}"</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!r.isApproved ? (
                      <button
                        onClick={() => handleApproveReview(r.id)}
                        className="px-3 py-1.5 bg-emerald-500 text-black text-xs font-bold uppercase tracking-wider hover:bg-emerald-400 transition-colors"
                      >
                        Approve
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#808080]">Active</span>
                    )}
                    <button
                      onClick={() => handleRejectReview(r.id)}
                      className="px-3 py-1.5 bg-[#202020] hover:bg-rose-500/20 text-rose-300 border border-[#333333] hover:border-rose-500/40 text-xs font-semibold uppercase tracking-wider transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
          onClick={() => setIsProductModalOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#181818] border border-[#333333] p-6 sm:p-8 shadow-2xl text-white my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#333333] pb-3 mb-6">
              <div>
                <h2 className="font-['Syne',sans-serif] text-xl font-bold uppercase tracking-wider text-white">
                  {editingProduct ? 'EDIT GARMENT SPECIFICATION' : 'NEW GARMENT SPECIFICATION'}
                </h2>
                <p className="text-[11px] text-[#808080]">
                  Configure product details, lookbook images, sizing, and inventory.
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 text-[#808080] hover:text-white transition-colors text-lg font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6 text-xs">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#808080] uppercase tracking-wider mb-1">
                    Garment Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Architectural Heavyweight Overshirt"
                    className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2 text-white focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#808080] uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ClothingCategory)}
                    className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2 text-white focus:border-white focus:outline-none cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#808080] uppercase tracking-wider mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2 text-white focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#808080] uppercase tracking-wider mb-1">
                    Original Price ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formOriginalPrice || ''}
                    onChange={(e) =>
                      setFormOriginalPrice(e.target.value ? Number(e.target.value) : undefined)
                    }
                    placeholder="Optional (shows discount)"
                    className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2 text-white focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#808080] uppercase tracking-wider mb-1">
                    Stock Units *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2 text-white focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Advanced Image Uploader with Drag/Drop, Local File Upload, and Presets */}
              <div className="p-4 bg-[#141414] border border-[#333333] space-y-3">
                <ImageUploader
                  images={formImages}
                  onChange={setFormImages}
                  maxImages={6}
                  label="Garment Lookbook Images (First image is primary display)"
                />
              </div>

              {/* Live Preview Card */}
              {formImages.length > 0 && (
                <div className="p-3 bg-[#111111] border border-[#333333] flex items-center gap-4">
                  <div className="w-16 aspect-[3/4] bg-black border border-[#444444] shrink-0 overflow-hidden">
                    <img
                      src={formImages[0]}
                      alt="preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[9px] text-amber-400 font-mono uppercase tracking-wider block">
                      STORE CARD PREVIEW
                    </span>
                    <span className="text-xs font-bold text-white block truncate">
                      {formName || 'Untitled Garment'}
                    </span>
                    <div className="text-xs text-white font-mono flex items-center gap-2">
                      <span>${formPrice}</span>
                      {formOriginalPrice && (
                        <span className="line-through text-[#666666] text-[10px]">
                          ${formOriginalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#808080] block">
                      {formCategory} • {formStock} units available • {formImages.length} photo(s)
                    </span>
                  </div>
                </div>
              )}

              {/* Badges & Merchandising */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-[#111111] border border-[#333333]">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#E5E5E5]">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-amber-400 bg-black border-[#444444] rounded"
                  />
                  <span>Feature garment on Homepage showcase</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#E5E5E5]">
                  <input
                    type="checkbox"
                    checked={formIsNewArrival}
                    onChange={(e) => setFormIsNewArrival(e.target.checked)}
                    className="w-4 h-4 accent-white bg-black border-[#444444] rounded"
                  />
                  <span>Mark with "New Arrival" tag</span>
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[#808080] uppercase tracking-wider mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-[#111111] border border-[#333333] p-3 text-white focus:border-white focus:outline-none"
                />
              </div>

              {/* Technical Garment Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[#808080] uppercase tracking-wider mb-1">Material</label>
                  <input
                    type="text"
                    value={formMaterial}
                    onChange={(e) => setFormMaterial(e.target.value)}
                    className="w-full bg-[#111111] border border-[#333333] px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#808080] uppercase tracking-wider mb-1">Fit</label>
                  <input
                    type="text"
                    value={formFit}
                    onChange={(e) => setFormFit(e.target.value)}
                    className="w-full bg-[#111111] border border-[#333333] px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#808080] uppercase tracking-wider mb-1">Fabric Weight</label>
                  <input
                    type="text"
                    value={formFabricWeight}
                    onChange={(e) => setFormFabricWeight(e.target.value)}
                    className="w-full bg-[#111111] border border-[#333333] px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#808080] uppercase tracking-wider mb-1">Country</label>
                  <input
                    type="text"
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value)}
                    className="w-full bg-[#111111] border border-[#333333] px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Sizes Available */}
              <div>
                <label className="block text-[#808080] uppercase tracking-wider mb-1.5">
                  Available Sizing (Click to toggle)
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {ALL_SIZES.map((size) => {
                    const isSelected = formSizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setFormSizes(formSizes.filter((s) => s !== size));
                          } else {
                            setFormSizes([...formSizes, size]);
                          }
                        }}
                        className={`py-2 text-xs font-bold uppercase border transition-colors ${
                          isSelected
                            ? 'bg-white text-black border-white'
                            : 'bg-[#111111] text-[#808080] border-[#333333] hover:text-white'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#333333]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-[#808080] hover:text-white uppercase tracking-wider font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-[#E5E5E5] transition-colors"
                >
                  {editingProduct ? 'Update Garment' : 'Publish Garment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Drawer / Modal */}
      {selectedOrderDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedOrderDetails(null)}
        >
          <div
            className="w-full max-w-lg bg-[#181818] border border-[#333333] p-6 shadow-2xl text-white space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#333333] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#808080]">ORDER INSPECTION</span>
                <h3 className="font-mono text-base font-bold text-white">
                  {selectedOrderDetails.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-[#808080] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#111111] p-3 border border-[#333333] space-y-1">
                <p className="text-white font-bold">{selectedOrderDetails.customerName}</p>
                <p className="text-[#808080]">{selectedOrderDetails.customerEmail}</p>
                <p className="text-[#B3B3B3]">
                  {selectedOrderDetails.shippingAddress.street},{' '}
                  {selectedOrderDetails.shippingAddress.city},{' '}
                  {selectedOrderDetails.shippingAddress.country}
                </p>
                <p className="text-[10px] text-emerald-400 font-mono mt-1">
                  Payment: {selectedOrderDetails.paymentMethod} ({selectedOrderDetails.paymentStatus})
                </p>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-2 divide-y divide-[#333333]/50">
                {selectedOrderDetails.items.map((item) => (
                  <div key={item.id} className="pt-2 flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-10 aspect-[3/4] object-cover bg-[#202020]"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-white line-clamp-1">{item.product.name}</p>
                      <p className="text-[10px] text-[#808080]">
                        Size {item.selectedSize} • {item.selectedColor.name} • Qty {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-white">${item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#333333] flex justify-between font-bold text-sm text-white">
                <span>Total Amount:</span>
                <span>${selectedOrderDetails.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
