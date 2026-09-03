import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { orderService } from '../services';
import { Order, PaymentMethod } from '../types';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Smartphone,
  Zap,
  Copy,
  Check,
  MessageCircle,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, user, clearCart, addToast, formatPrice, currency } = useShop();
  const navigate = useNavigate();

  // Form State
  const [email, setEmail] = useState(user?.email || '');
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '01080848292');
  const [address, setAddress] = useState(user?.addresses?.[0]?.street || '');
  const [city, setCity] = useState(user?.addresses?.[0]?.city || 'Cairo');
  const [postalCode, setPostalCode] = useState(user?.addresses?.[0]?.postalCode || '11511');
  const [country, setCountry] = useState(user?.addresses?.[0]?.country || 'Egypt');

  // Shipping & Payment Options
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'instapay' | 'vodafone_cash' | 'card'>('cod');
  const [instapayRef, setInstapayRef] = useState('');
  const [walletSenderPhone, setWalletSenderPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  // Completed Order State
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Dynamic Shipping & Totals
  const isFreeShipping =
    currency === 'EGP' ? cartSubtotal * 10 >= 1000 : cartSubtotal >= 150;
  
  const shippingFeeNumeric =
    shippingMethod === 'express'
      ? (currency === 'EGP' ? 120 : 25)
      : (isFreeShipping ? 0 : (currency === 'EGP' ? 60 : 15));

  // In USD terms for internal order storage
  const shippingCostUSD =
    shippingMethod === 'express' ? 25 : cartSubtotal >= 150 ? 0 : 15;
  const orderTotalUSD = cartSubtotal + shippingCostUSD;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    addToast(`تم نسخ ${label} بنجاح: ${text}`, 'success');
    setTimeout(() => setCopiedItem(null), 2500);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      addToast('Your bag is empty', 'error');
      return;
    }

    if (!address || !city || !postalCode || !firstName || !lastName || !email) {
      addToast('Please fill out all required delivery fields', 'error');
      return;
    }

    let resolvedPaymentMethod: PaymentMethod = 'Cash on Delivery';
    if (paymentMethod === 'card') resolvedPaymentMethod = 'Credit / Debit Card';
    else if (paymentMethod === 'instapay') resolvedPaymentMethod = 'InstaPay';
    else if (paymentMethod === 'vodafone_cash') resolvedPaymentMethod = 'Vodafone Cash / Smart Wallet';

    setIsProcessing(true);
    try {
      const order = await orderService.createOrder({
        userId: user?.id || 'guest-' + Date.now(),
        customerName: `${firstName} ${lastName}`,
        customerEmail: email,
        customerPhone: phone || '01080848292',
        items: cart,
        totalAmount: orderTotalUSD,
        total: orderTotalUSD,
        shippingAddress: {
          id: 'addr-' + Date.now(),
          fullName: `${firstName} ${lastName}`,
          street: address,
          city,
          postalCode,
          country,
        },
        paymentMethod: resolvedPaymentMethod,
      });

      setCompletedOrder(order);
      await clearCart();
      addToast('Order confirmed successfully!', 'success');
    } catch (err) {
      addToast('Failed to process order', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Order Confirmation Screen
  if (completedOrder) {
    return (
      <div className="min-h-[75vh] bg-[#111111] text-white flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full bg-[#181818] border border-[#333333] p-8 sm:p-10 space-y-6 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto text-white">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#808080] block mb-1">
              DISPATCH ASSIGNED
            </span>
            <h1 className="font-['Syne',sans-serif] text-3xl font-extrabold uppercase tracking-wider text-white">
              THANK YOU FOR YOUR ORDER
            </h1>
            <p className="text-xs text-[#B3B3B3] mt-2">
              A confirmation email has been dispatched to <strong className="text-white">{completedOrder.customerEmail}</strong>.
            </p>
          </div>

          <div className="bg-[#111111] border border-[#333333] p-5 text-left space-y-3 text-xs">
            <div className="flex justify-between border-b border-[#333333]/60 pb-2">
              <span className="text-[#808080]">Order Reference</span>
              <span className="text-white font-mono font-bold">{completedOrder.id}</span>
            </div>
            <div className="flex justify-between border-b border-[#333333]/60 pb-2">
              <span className="text-[#808080]">Estimated Delivery</span>
              <span className="text-white">2–4 Business Days (التوصيل لجميع المحافظات)</span>
            </div>
            <div className="flex justify-between border-b border-[#333333]/60 pb-2">
              <span className="text-[#808080]">Payment Method</span>
              <span className="text-white font-bold">{completedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between border-b border-[#333333]/60 pb-2">
              <span className="text-[#808080]">Payment Status</span>
              <span className="text-emerald-400 uppercase font-mono text-[10px]">
                {completedOrder.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-[#808080]">Total Amount</span>
              <span className="text-white font-bold text-sm">{formatPrice(completedOrder.totalAmount)}</span>
            </div>
          </div>

          {(completedOrder.paymentMethod === 'InstaPay' || completedOrder.paymentMethod === 'Vodafone Cash / Smart Wallet') && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 text-left space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>خطوة أخيرة لتأكيد الشحن فوراً</span>
              </div>
              <p className="text-[11px] text-[#CCCCCC] leading-relaxed">
                يرجى إرسال إشعار التحويل (سكرين شوت) على رقم واتساب خدمة العملاء <strong>01080848292</strong> مع ذكر كود الطلب (<span className="font-mono text-white font-bold">{completedOrder.id}</span>).
              </p>
              <a
                href={`https://wa.me/201080848292?text=${encodeURIComponent(`مرحباً براند AVIRO،\nلقد قمت بإتمام الطلب كود: ${completedOrder.id}\nطريقة الدفع: ${completedOrder.paymentMethod}\nالمبلغ: ${formatPrice(completedOrder.totalAmount)}\nمرفق لقطة الشاشة الخاصة بالتحويل لتأكيد الشحن.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all mt-1"
              >
                <MessageCircle className="w-4 h-4 fill-black text-black" />
                <span>إرسال إشعار الدفع عبر واتساب (01080848292)</span>
              </a>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/account"
              className="w-full sm:w-1/2 py-3 px-4 bg-white hover:bg-[#E5E5E5] text-black text-xs font-bold uppercase tracking-wider text-center transition-colors"
            >
              VIEW ORDER IN ACCOUNT
            </Link>
            <Link
              to="/shop"
              className="w-full sm:w-1/2 py-3 px-4 bg-[#202020] hover:bg-[#292929] text-white text-xs font-semibold uppercase tracking-wider border border-[#333333] text-center transition-colors"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#111111] text-white flex flex-col items-center justify-center px-4 py-16">
        <h2 className="font-['Syne',sans-serif] text-2xl font-bold uppercase tracking-wider mb-2">
          Your bag is empty
        </h2>
        <p className="text-xs text-[#808080] mb-6">
          Add garments to your bag before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-wider"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div id="checkout-page" className="w-full bg-[#111111] text-white min-h-screen pb-24">
      {/* Checkout Header */}
      <div className="bg-[#181818] border-b border-[#333333] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#808080] uppercase tracking-[0.3em] block mb-1">
              SECURE CHECKOUT
            </span>
            <h1 className="font-['Syne',sans-serif] text-2xl sm:text-3xl font-extrabold uppercase tracking-wider text-white">
              DELIVERY & PAYMENT
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#808080]">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>256-Bit Encrypted</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Customer Info, Delivery, Shipping & Payment (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Customer Info */}
            <div className="bg-[#181818] border border-[#333333] p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 border-b border-[#333333] pb-3">
                <span className="w-5 h-5 rounded-full bg-white text-black text-[10px] flex items-center justify-center font-bold">1</span>
                CUSTOMER CONTACT
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#808080] mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2.5 text-xs text-white focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#808080] mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2.5 text-xs text-white focus:border-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="bg-[#181818] border border-[#333333] p-6 space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 border-b border-[#333333] pb-3">
                <span className="w-5 h-5 rounded-full bg-white text-black text-[10px] flex items-center justify-center font-bold">2</span>
                SHIPPING ADDRESS
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#808080] mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Marcus"
                    className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2.5 text-xs text-white focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#808080] mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Vance"
                    className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2.5 text-xs text-white focus:border-white focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-[#808080] mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="742 Fashion Ave, Apt 4B"
                    className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2.5 text-xs text-white focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#808080] mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New York"
                    className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2.5 text-xs text-white focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#808080] mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="10001"
                    className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2.5 text-xs text-white focus:border-white focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-[#808080] mb-1">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2.5 text-xs text-white focus:border-white focus:outline-none cursor-pointer"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Shipping Method */}
            <div className="bg-[#181818] border border-[#333333] p-6 space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 border-b border-[#333333] pb-3">
                <span className="w-5 h-5 rounded-full bg-white text-black text-[10px] flex items-center justify-center font-bold">3</span>
                SHIPPING METHOD
              </h2>

              <label className="flex items-center justify-between p-3.5 border border-[#333333] bg-[#111111] cursor-pointer hover:border-[#555555] transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                    className="accent-white"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {currency === 'EGP' ? 'شحن قياسي لكافة المحافظات' : 'Standard Courier Delivery'}
                    </span>
                    <span className="text-[11px] text-[#808080]">
                      {currency === 'EGP' ? 'توصيل لباب البيت خلال 2–4 أيام عمل' : '3–5 Business Days'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-white">
                  {isFreeShipping ? 'مجاني / FREE' : (currency === 'EGP' ? '60 ج.م' : '$15')}
                </span>
              </label>

              <label className="flex items-center justify-between p-3.5 border border-[#333333] bg-[#111111] cursor-pointer hover:border-[#555555] transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                    className="accent-white"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {currency === 'EGP' ? 'شحن فوري سريع VIP' : 'Express Priority Delivery'}
                    </span>
                    <span className="text-[11px] text-[#808080]">
                      {currency === 'EGP' ? 'توصيل خلال 24–48 ساعة مع تتبع فوري' : '1–2 Business Days with signature'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-white">
                  {currency === 'EGP' ? '120 ج.م' : '$25'}
                </span>
              </label>
            </div>

            {/* Step 4: Payment Method (Feature 3: Local Payment Methods) */}
            <div className="bg-[#181818] border border-[#333333] p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-[#333333] pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white text-black text-[10px] flex items-center justify-center font-bold">4</span>
                  طريقة الدفع / PAYMENT METHOD
                </h2>
                <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  100% آمن وموثق
                </span>
              </div>

              {/* 4 Methods Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 border text-left transition-all flex flex-col justify-between ${
                    paymentMethod === 'cod'
                      ? 'border-white bg-[#202020] ring-1 ring-white/50'
                      : 'border-[#333333] bg-[#111111] text-[#808080] hover:border-[#555555]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <Banknote className="w-5 h-5 text-white" />
                    {paymentMethod === 'cod' && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    الدفع عند الاستلام (COD)
                  </span>
                  <span className="text-[10px] text-[#808080] mt-1">
                    معاينة القطعة والتأكد من المقاس قبل الدفع
                  </span>
                </button>

                {/* 2. InstaPay */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('instapay')}
                  className={`p-4 border text-left transition-all flex flex-col justify-between ${
                    paymentMethod === 'instapay'
                      ? 'border-amber-400 bg-amber-950/20 ring-1 ring-amber-400/50'
                      : 'border-[#333333] bg-[#111111] text-[#808080] hover:border-[#555555]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.5 rounded">
                      لحظي 0% عمولة
                    </span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    إنستاباي (InstaPay)
                  </span>
                  <span className="text-[10px] text-[#808080] mt-1">
                    تحويل بنكي فوري من أي بنك مصري
                  </span>
                </button>

                {/* 3. Vodafone Cash & Wallets */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('vodafone_cash')}
                  className={`p-4 border text-left transition-all flex flex-col justify-between ${
                    paymentMethod === 'vodafone_cash'
                      ? 'border-rose-500 bg-rose-950/20 ring-1 ring-rose-500/50'
                      : 'border-[#333333] bg-[#111111] text-[#808080] hover:border-[#555555]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <Smartphone className="w-5 h-5 text-rose-400" />
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-1.5 py-0.5 rounded">
                      محافظ المحمول
                    </span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    فودافون كاش ومحافظ كاش
                  </span>
                  <span className="text-[10px] text-[#808080] mt-1">
                    فودافون، أورنج، اتصالات، WE والمحافظ الذكية
                  </span>
                </button>

                {/* 4. Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 border text-left transition-all flex flex-col justify-between ${
                    paymentMethod === 'card'
                      ? 'border-white bg-[#202020] ring-1 ring-white/50'
                      : 'border-[#333333] bg-[#111111] text-[#808080] hover:border-[#555555]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <CreditCard className="w-5 h-5 text-white" />
                    {paymentMethod === 'card' && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    بطاقة بنكية / Visa & Meeza
                  </span>
                  <span className="text-[10px] text-[#808080] mt-1">
                    دفع إلكتروني مباشر مشفر
                  </span>
                </button>
              </div>

              {/* Dynamic Details Box for Selected Payment Method */}
              {paymentMethod === 'cod' && (
                <div className="p-3.5 bg-[#111111] border border-[#333333] text-xs text-[#B3B3B3] space-y-1">
                  <p className="font-semibold text-white">✓ خدمة الدفع عند الاستلام مفعلة</p>
                  <p className="text-[11px] leading-relaxed">
                    ستدفع للمندوب نقداً أو بالفيزا عند وصول الشحنة. يمكنك فتح البوليسة والتأكد من جودة الخامات والمقاسات بالكامل.
                  </p>
                </div>
              )}

              {paymentMethod === 'instapay' && (
                <div className="p-4 bg-amber-950/30 border border-amber-500/30 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">بيانات التحويل عبر تطبيق InstaPay:</span>
                    <span className="text-[10px] text-[#808080]">اضغط لنسخ الحساب</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#111111] p-2.5 border border-amber-500/30 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#808080] block">عنوان الدفع اللحظي (IPA)</span>
                        <span className="font-mono text-white font-bold">aviro.egypt@instapay</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('aviro.egypt@instapay', 'عنوان IPA')}
                        className="p-1.5 text-amber-400 hover:text-white"
                        title="نسخ عنوان IPA"
                      >
                        {copiedItem === 'عنوان IPA' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="bg-[#111111] p-2.5 border border-amber-500/30 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#808080] block">أو رقم الموبايل المسجل</span>
                        <span className="font-mono text-white font-bold">01080848292</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('01080848292', 'رقم الهاتف')}
                        className="p-1.5 text-amber-400 hover:text-white"
                        title="نسخ رقم الهاتف"
                      >
                        {copiedItem === 'رقم الهاتف' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#CCCCCC] mb-1">
                      اسم حسابك في إنستاباي أو رقم العملية (اختياري للتحقق السريع)
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: ahmed@instapay أو آخر 4 أرقام من التحويل"
                      value={instapayRef}
                      onChange={(e) => setInstapayRef(e.target.value)}
                      className="w-full bg-[#111111] border border-[#333333] px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'vodafone_cash' && (
                <div className="p-4 bg-rose-950/30 border border-rose-500/30 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-300">بيانات تحويل كاش (Vodafone / Smart Wallets):</span>
                    <span className="text-[10px] text-[#808080]">اضغط لنسخ الرقم</span>
                  </div>

                  <div className="bg-[#111111] p-3 border border-rose-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#808080] block">رقم المحفظة المعتمد للتحويل</span>
                      <span className="font-mono text-white font-bold text-sm tracking-widest">01080848292</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('01080848292', 'رقم المحفظة')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      {copiedItem === 'رقم المحفظة' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedItem === 'رقم المحفظة' ? 'تم النسخ' : 'نسخ الرقم'}</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#CCCCCC] mb-1">
                      رقم المحفظة المُحوّل منها (لتأكيد العملية فوراً)
                    </label>
                    <input
                      type="tel"
                      placeholder="010XXXXXXXX"
                      value={walletSenderPhone}
                      onChange={(e) => setWalletSenderPhone(e.target.value)}
                      className="w-full bg-[#111111] border border-[#333333] px-3 py-2 text-xs text-white focus:border-rose-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3 pt-3 border-t border-[#333333]">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#808080] mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2.5 text-xs text-white focus:border-white focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#808080] mb-1">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2.5 text-xs text-white focus:border-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#808080] mb-1">CVC</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2.5 text-xs text-white focus:border-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Summary Breakdown (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-[#181818] border border-[#333333] p-6 space-y-6 sticky top-24">
              <h2 className="font-['Syne',sans-serif] text-base font-bold uppercase tracking-wider text-white border-b border-[#333333] pb-3">
                ملخص الطلب / ORDER REVIEW ({cart.length})
              </h2>

              {/* Items Scrollable preview */}
              <div className="max-h-72 overflow-y-auto space-y-3 divide-y divide-[#333333]/50 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-14 aspect-[3/4] object-cover bg-[#202020] border border-[#333333]"
                    />
                    <div className="flex-1 text-xs">
                      <h4 className="font-semibold text-white line-clamp-1">{item.product.name}</h4>
                      <p className="text-[#808080] text-[11px] mt-0.5">
                        Size: <strong className="text-white">{item.selectedSize}</strong> • {item.selectedColor.name}
                      </p>
                      <div className="flex justify-between mt-1 text-[#B3B3B3]">
                        <span>Qty {item.quantity}</span>
                        <span className="font-bold text-white">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost Totals */}
              <div className="space-y-2 text-xs pt-4 border-t border-[#333333]">
                <div className="flex justify-between text-[#B3B3B3]">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-[#B3B3B3]">
                  <span>Shipping</span>
                  <span className="text-white">
                    {shippingFeeNumeric === 0
                      ? 'مجاني / COMPLIMENTARY'
                      : (currency === 'EGP' ? `${shippingFeeNumeric} ج.م` : `$${shippingCostUSD}`)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-[#333333]">
                  <span>Total Amount</span>
                  <span className="text-emerald-400">
                    {formatPrice(cartSubtotal + (currency === 'EGP' ? shippingFeeNumeric / 10 : shippingCostUSD))}
                  </span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                id="btn-place-order"
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-white hover:bg-[#E5E5E5] text-black text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg"
              >
                {isProcessing
                  ? 'جاري تأكيد الطلب...'
                  : `تأكيد الطلب (${formatPrice(cartSubtotal + (currency === 'EGP' ? shippingFeeNumeric / 10 : shippingCostUSD))})`}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-[#808080] text-center space-y-1">
                <p>معاينة مجانية واستبدال متاح خلال 14 يوماً.</p>
                <p>خدمة العملاء متوفرة عبر واتساب على مدار الساعة: 01080848292</p>
                <p>30-day returns accepted on all garments. By placing your order you agree to AVIRO terms.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
