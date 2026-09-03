import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
    formatPrice,
    currency,
  } = useShop();

  if (!isCartDrawerOpen) return null;

  const freeShippingThresholdUSD = 150;
  const freeShippingThresholdEGP = 1000;
  const isFree = currency === 'EGP' ? cartSubtotal * 10 >= freeShippingThresholdEGP : cartSubtotal >= freeShippingThresholdUSD;
  const remainingEGP = Math.max(0, freeShippingThresholdEGP - cartSubtotal * 10);
  const remainingUSD = Math.max(0, freeShippingThresholdUSD - cartSubtotal);
  const progressPercent = currency === 'EGP'
    ? Math.min(100, ((cartSubtotal * 10) / freeShippingThresholdEGP) * 100)
    : Math.min(100, (cartSubtotal / freeShippingThresholdUSD) * 100);

  const shippingCostUSD = cartSubtotal === 0 || isFree ? 0 : 15;
  const shippingCostEGP = cartSubtotal === 0 || isFree ? 0 : 60;
  const estimatedTotalUSD = cartSubtotal + (currency === 'EGP' ? shippingCostEGP / 10 : shippingCostUSD);

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setIsCartDrawerOpen(false)}
    >
      <div
        id="cart-drawer-panel"
        className="relative flex flex-col w-full max-w-md h-full bg-[#181818] border-l border-[#333333] shadow-2xl text-white animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#333333] bg-[#111111]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-white" />
            <h2 className="text-base font-bold uppercase tracking-wider font-['Syne',sans-serif]">
              YOUR BAG ({cartCount})
            </h2>
          </div>
          <button
            id="btn-close-cart-drawer"
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 text-[#808080] hover:text-white transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="px-5 py-3 bg-[#202020] border-b border-[#333333] text-xs">
          {!isFree && cartSubtotal > 0 ? (
            <p className="text-[#B3B3B3] mb-1.5">
              {currency === 'EGP' ? (
                <>أضف منتجات بقيمة <span className="text-white font-semibold">{remainingEGP} ج.م</span> إضافية للشحن المجاني</>
              ) : (
                <>Add <span className="text-white font-semibold">${remainingUSD}</span> more for complimentary shipping</>
              )}
            </p>
          ) : (
            <p className="text-white font-semibold mb-1.5 flex items-center gap-1.5">
              <span>✓</span> {currency === 'EGP' ? 'تم تفعيل الشحن المجاني للطلب' : 'Complimentary express shipping unlocked'}
            </p>
          )}
          <div className="w-full bg-[#111111] h-1.5 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-[#333333]/50">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag className="w-12 h-12 text-[#333333] mb-4" />
              <p className="text-base font-medium text-white mb-2">Your bag is empty</p>
              <p className="text-xs text-[#808080] max-w-xs mb-6">
                Discover our new arrivals crafted in Portugal and Italy from heavyweight luxury fabrics.
              </p>
              <button
                id="btn-cart-empty-shop"
                onClick={() => setIsCartDrawerOpen(false)}
                className="px-6 py-3 bg-[#202020] hover:bg-[#292929] text-white text-xs font-semibold uppercase tracking-widest border border-[#333333] transition-colors"
              >
                START SHOPPING
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} id={`cart-item-${item.id}`} className="pt-4 first:pt-0 flex gap-4">
                <Link
                  to={`/product/${item.productId}`}
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-20 aspect-[3/4] bg-[#202020] shrink-0 overflow-hidden border border-[#333333]"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/product/${item.productId}`}
                        onClick={() => setIsCartDrawerOpen(false)}
                        className="text-sm font-semibold text-white hover:text-[#B3B3B3] transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        id={`btn-remove-item-${item.id}`}
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#808080] hover:text-rose-400 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#B3B3B3] mt-1">
                      <span>Size: <strong className="text-white">{item.selectedSize}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-[#444444]"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        {item.selectedColor.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-[#333333] bg-[#202020]">
                      <button
                        id={`btn-qty-minus-${item.id}`}
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-[#808080] hover:text-white transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-semibold text-white min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        id={`btn-qty-plus-${item.id}`}
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-[#808080] hover:text-white transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-sm font-bold text-white">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Actions */}
        {cart.length > 0 && (
          <div className="p-5 bg-[#111111] border-t border-[#333333] space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#B3B3B3]">
                <span>Subtotal</span>
                <span className="text-white font-medium">{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-[#B3B3B3]">
                <span>Estimated Shipping</span>
                <span className="text-white font-medium">
                  {isFree
                    ? 'COMPLIMENTARY'
                    : (currency === 'EGP' ? `${shippingCostEGP} ج.م` : `$${shippingCostUSD}`)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#333333]">
                <span>Estimated Total</span>
                <span className="text-white font-bold">{formatPrice(estimatedTotalUSD)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                id="btn-drawer-checkout"
                to="/checkout"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full py-3.5 px-4 bg-white hover:bg-[#E5E5E5] text-black text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                PROCEED TO CHECKOUT
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex gap-2">
                <Link
                  id="btn-drawer-view-cart"
                  to="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-1/2 py-2.5 px-3 bg-[#202020] hover:bg-[#292929] text-[#B3B3B3] hover:text-white text-xs font-semibold uppercase tracking-wider border border-[#333333] text-center transition-colors"
                >
                  VIEW FULL BAG
                </Link>
                <button
                  id="btn-drawer-continue-shopping"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-1/2 py-2.5 px-3 bg-[#202020] hover:bg-[#292929] text-[#B3B3B3] hover:text-white text-xs font-semibold uppercase tracking-wider border border-[#333333] text-center transition-colors"
                >
                  CONTINUE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
