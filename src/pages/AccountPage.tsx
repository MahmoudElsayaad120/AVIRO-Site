import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { orderService } from '../services';
import { Order, ClothingSize } from '../types';
import {
  User as UserIcon,
  Package,
  MapPin,
  LogOut,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

const SIZES: ClothingSize[] = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

export const AccountPage: React.FC = () => {
  const { user, logout, addToast } = useShop();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedSize, setSelectedSize] = useState<ClothingSize>(user?.preferredSize || 'L');
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'address'>('orders');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    orderService.getUserOrders(user.id).then(setOrders);
  }, [user, navigate]);

  if (!user) return null;

  const handleSaveSize = () => {
    addToast(`Preferred sizing updated to ${selectedSize}`, 'success');
  };

  const handleLogout = () => {
    logout();
    addToast('Signed out of AVIRO', 'info');
    navigate('/');
  };

  return (
    <div id="account-page" className="w-full bg-[#111111] text-white min-h-screen pb-24">
      {/* Account Header */}
      <div className="bg-[#181818] border-b border-[#333333] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#202020] border border-[#333333] flex items-center justify-center font-bold text-lg font-['Syne',sans-serif]">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#808080]">
                {user.role} Account
              </span>
              <h1 className="font-['Syne',sans-serif] text-2xl sm:text-3xl font-extrabold uppercase tracking-wider text-white">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-xs text-[#B3B3B3]">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'Admin' && (
              <Link
                to="/admin"
                className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                Go to Admin Portal
              </Link>
            )}
            <button
              id="btn-account-logout"
              onClick={handleLogout}
              className="px-4 py-2 bg-[#202020] hover:bg-[#292929] text-white border border-[#333333] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#333333] mb-8 gap-8 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 flex items-center gap-2 transition-colors relative ${
              activeTab === 'orders' ? 'text-white' : 'text-[#808080] hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            Order History ({orders.length})
            {activeTab === 'orders' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white" />}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 flex items-center gap-2 transition-colors relative ${
              activeTab === 'profile' ? 'text-white' : 'text-[#808080] hover:text-white'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            Profile & Sizing
            {activeTab === 'profile' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white" />}
          </button>
          <button
            onClick={() => setActiveTab('address')}
            className={`pb-3 flex items-center gap-2 transition-colors relative ${
              activeTab === 'address' ? 'text-white' : 'text-[#808080] hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Addresses
            {activeTab === 'address' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white" />}
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-[#181818] border border-[#333333] p-12 text-center">
                <Package className="w-10 h-10 text-[#808080] mx-auto mb-3" />
                <p className="text-sm font-semibold text-white mb-1">No orders yet</p>
                <p className="text-xs text-[#808080] mb-4">
                  When you order AVIRO garments, tracking numbers and invoices will be displayed here.
                </p>
                <Link
                  to="/shop"
                  className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider inline-block"
                >
                  START SHOPPING
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  id={`order-card-${order.id}`}
                  className="bg-[#181818] border border-[#333333] p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#333333] gap-2 text-xs">
                    <div>
                      <span className="text-[#808080] uppercase tracking-wider block text-[10px]">Order ID</span>
                      <span className="font-mono font-bold text-white text-sm">{order.id}</span>
                    </div>
                    <div>
                      <span className="text-[#808080] uppercase tracking-wider block text-[10px]">Date Placed</span>
                      <span className="text-white">{order.createdAt}</span>
                    </div>
                    <div>
                      <span className="text-[#808080] uppercase tracking-wider block text-[10px]">Status</span>
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-mono uppercase font-bold border ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : order.status === 'Shipped'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#808080] uppercase tracking-wider block text-[10px]">Total</span>
                      <span className="font-bold text-white text-sm">${order.totalAmount}</span>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 text-xs">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-12 aspect-[3/4] object-cover bg-[#202020] border border-[#333333]"
                        />
                        <div className="flex-1">
                          <Link
                            to={`/product/${item.productId}`}
                            className="font-semibold text-white hover:underline line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-[#808080] text-[11px]">
                            Size: <strong className="text-white">{item.selectedSize}</strong> • {item.selectedColor.name} • Qty {item.quantity}
                          </p>
                        </div>
                        <span className="font-semibold text-white">
                          ${item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.trackingNumber && (
                    <div className="pt-3 border-t border-[#333333] flex items-center justify-between text-xs text-[#808080]">
                      <span>Tracking: <strong className="text-white font-mono">{order.trackingNumber}</strong></span>
                      <span className="text-emerald-400">In Transit with Courier</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Profile & Sizing */}
        {activeTab === 'profile' && (
          <div className="max-w-xl bg-[#181818] border border-[#333333] p-6 space-y-6">
            <h3 className="font-['Syne',sans-serif] text-base font-bold uppercase tracking-wider text-white border-b border-[#333333] pb-3">
              PERSONAL DETAILS
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[#808080] uppercase tracking-wider block mb-1">First Name</label>
                <div className="p-3 bg-[#111111] border border-[#333333] text-white">{user.firstName}</div>
              </div>
              <div>
                <label className="text-[#808080] uppercase tracking-wider block mb-1">Last Name</label>
                <div className="p-3 bg-[#111111] border border-[#333333] text-white">{user.lastName}</div>
              </div>
              <div className="col-span-2">
                <label className="text-[#808080] uppercase tracking-wider block mb-1">Email</label>
                <div className="p-3 bg-[#111111] border border-[#333333] text-white">{user.email}</div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#333333]">
              <label className="text-xs uppercase font-bold tracking-wider text-white block mb-2">
                Preferred Garment Size (S to 3XL)
              </label>
              <div className="grid grid-cols-6 gap-2 mb-4">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${
                      selectedSize === size
                        ? 'bg-white text-black border-white'
                        : 'bg-[#111111] text-[#808080] border-[#333333]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSaveSize}
                className="px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Address */}
        {activeTab === 'address' && (
          <div className="max-w-xl bg-[#181818] border border-[#333333] p-6 space-y-4">
            <h3 className="font-['Syne',sans-serif] text-base font-bold uppercase tracking-wider text-white border-b border-[#333333] pb-3">
              PRIMARY SHIPPING DESTINATION
            </h3>
            <div className="text-xs text-[#B3B3B3] space-y-1">
              <p className="text-white font-bold">{user.firstName} {user.lastName}</p>
              <p>{user.addresses?.[0]?.street || '742 Fashion Avenue'}</p>
              <p>{user.addresses?.[0]?.city || 'New York'}, {user.addresses?.[0]?.postalCode || '10001'}</p>
              <p>{user.addresses?.[0]?.country || 'United States'}</p>
              <p className="text-[#808080] pt-2">{user.phone || '+1 (555) 019-2834'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
