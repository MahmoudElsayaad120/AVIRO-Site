import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    addToast,
  } = useShop();

  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null);

  const freeShippingThreshold = 150;
  const shippingCost = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : 15;
  const discountAmount = appliedDiscount ? Math.round((cartSubtotal * appliedDiscount.percent) / 100) : 0;
  const orderTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoCode.trim().toUpperCase();
    if (cleanCode === 'AVIRO10' || cleanCode === 'AVIRO') {
      setAppliedDiscount({ code: cleanCode, percent: 10 });
      addToast(`Promo code ${cleanCode} applied! 10% discount subtracted.`, 'success');
      setPromoCode('');
    } else if (cleanCode === 'VIP20') {
      setAppliedDiscount({ code: cleanCode, percent: 20 });
      addToast(`VIP promo code applied! 20% discount subtracted.`, 'success');
      setPromoCode('');
    } else {
      addToast('Invalid or expired promotional code. Try "AVIRO10"', 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#111111] text-white flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-md text-center space-y-4">
          <div className="w-16 h-16 bg-[#181818] border border-[#333333] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8 text-[#808080]" />
          </div>
          <h1 className="font-['Syne',sans-serif] text-3xl font-extrabold uppercase tracking-wider text-white">
            YOUR BAG IS EMPTY
          </h1>
          <p className="text-xs text-[#B3B3B3] leading-relaxed">
            There are no items currently in your shopping bag. Explore our newest drops crafted with heavyweight European textiles.
          </p>
          <div className="pt-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-[#E5E5E5] text-black text-xs font-bold uppercase tracking-widest transition-colors"
            >
              EXPLORE THE COLLECTION
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="cart-page" className="w-full bg-[#111111] text-white min-h-screen pb-24">
      {/* Header */}
      <div className="bg-[#181818] border-b border-[#333333] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] font-bold text-[#808080] uppercase tracking-[0.3em] block mb-1">
            SHOPPING BAG
          </span>
          <h1 className="font-['Syne',sans-serif] text-3xl sm:text-4xl font-extrabold uppercase tracking-wider text-white">
            YOUR BAG ({cartCount} {cartCount === 1 ? 'ITEM' : 'ITEMS'})
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#333333] text-xs text-[#808080] uppercase tracking-wider">
              <span>Garment</span>
              <div className="flex gap-12 sm:gap-20">
                <span className="hidden sm:inline">Quantity</span>
                <span>Subtotal</span>
              </div>
            </div>

            <div className="divide-y divide-[#333333]">
              {cart.map((item) => (
                <div key={item.id} className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Link
                      to={`/product/${item.productId}`}
                      className="w-20 sm:w-24 aspect-[3/4] bg-[#181818] border border-[#333333] overflow-hidden shrink-0"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </Link>

                    <div className="space-y-1">
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-sm font-semibold text-white hover:text-[#B3B3B3] transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <div className="flex items-center gap-3 text-xs text-[#B3B3B3]">
                        <span>Size: <strong className="text-white">{item.selectedSize}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-[#444444]"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          {item.selectedColor.name}
                        </span>
                      </div>
                      <p className="text-xs text-white font-medium sm:hidden pt-1">
                        ${item.price} each
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[11px] text-[#808080] hover:text-rose-400 flex items-center gap-1 pt-2 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Quantity and Line Total */}
                  <div className="flex items-center justify-between w-full sm:w-auto sm:gap-16 self-end sm:self-center">
                    <div className="flex items-center border border-[#333333] bg-[#181818]">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-[#808080] hover:text-white transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3.5 text-xs font-bold text-white min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-[#808080] hover:text-white transition-colors"
                        aria-label="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right font-bold text-base text-white min-w-[70px]">
                      ${item.price * item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-[#333333]">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#B3B3B3] hover:text-white uppercase tracking-wider transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                CONTINUE SHOPPING
              </Link>
              <button
                onClick={clearCart}
                className="text-xs text-[#808080] hover:text-rose-400 underline transition-colors"
              >
                Clear entire bag
              </button>
            </div>
          </div>

          {/* Right: Order Summary (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-[#181818] border border-[#333333] p-6 space-y-6">
              <h2 className="font-['Syne',sans-serif] text-base font-bold uppercase tracking-wider text-white border-b border-[#333333] pb-3">
                ORDER SUMMARY
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-[#B3B3B3]">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">${cartSubtotal}</span>
                </div>

                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({appliedDiscount.code})</span>
                    <span>-${discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#B3B3B3]">
                  <span>Shipping</span>
                  <span className="text-white font-medium">
                    {shippingCost === 0 ? 'COMPLIMENTARY' : `$${shippingCost}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-white pt-3 border-t border-[#333333]">
                  <span>Estimated Total</span>
                  <span>${orderTotal}</span>
                </div>
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="pt-2">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#808080] mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  Promotional Code
                </span>
                <div className="flex border border-[#333333] bg-[#111111]">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Try AVIRO10"
                    className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-[#808080] focus:outline-none uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#202020] hover:bg-[#292929] text-xs font-semibold uppercase tracking-wider text-white border-l border-[#333333] transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </form>

              {/* Proceed to Checkout Button */}
              <button
                id="btn-cart-page-checkout"
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-white hover:bg-[#E5E5E5] text-black text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                PROCEED TO CHECKOUT
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-3 border-t border-[#333333] space-y-2 text-[11px] text-[#808080]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                  <span>Encrypted 256-bit secure checkout</span>
                </div>
                <p>
                  Free exchanges within 30 days. Questions on sizing? Message our concierge assistant in the bottom right corner.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
