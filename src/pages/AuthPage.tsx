import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Lock, Mail, User, Shield, ArrowRight, Check } from 'lucide-react';
import { ClothingSize } from '../types';

const SIZES: ClothingSize[] = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

export const AuthPage: React.FC = () => {
  const { login, register, user, addToast } = useShop();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [preferredSize, setPreferredSize] = useState<ClothingSize>('L');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  if (user) {
    if (user.role === 'Admin') {
      navigate('/admin');
    } else {
      navigate('/account');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        addToast('Signed in successfully', 'success');
        navigate(email.includes('admin') ? '/admin' : '/account');
      } else {
        if (!firstName || !lastName) {
          addToast('Please provide your name', 'error');
          setLoading(false);
          return;
        }
        await register(firstName, lastName, email, '+1 (555) 019-2834', password);
        navigate('/account');
      }
    } catch (err: any) {
      addToast(err.message || 'Authentication error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoCustomer = async () => {
    setEmail('marcus.vance@example.com');
    setPassword('password123');
    await login('marcus.vance@example.com', 'password123');
    addToast('Logged in as Customer (Marcus Vance)', 'success');
    navigate('/account');
  };

  const handleQuickDemoAdmin = async () => {
    setEmail('admin@aviro.com');
    setPassword('admin123');
    await login('admin@aviro.com', 'admin123');
    addToast('Logged in as Admin (System Administrator)', 'success');
    navigate('/admin');
  };

  return (
    <div id="auth-page" className="w-full min-h-screen bg-[#111111] text-white flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            to="/"
            className="font-['Syne',sans-serif] text-3xl font-extrabold tracking-[0.25em] text-white uppercase inline-block mb-3"
          >
            AVIRO
          </Link>
          <h2 className="font-['Syne',sans-serif] text-xl font-bold uppercase tracking-wider text-white">
            {mode === 'login' ? 'SIGN IN TO YOUR ACCOUNT' : 'CREATE YOUR AVIRO ACCOUNT'}
          </h2>
          <p className="text-xs text-[#808080] mt-1">
            {mode === 'login'
              ? 'Access saved orders, wishlist, and priority drop notifications.'
              : 'Join AVIRO to access custom fits in sizes S to 3XL.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border border-[#333333] bg-[#181818] p-1">
          <button
            id="tab-auth-login"
            type="button"
            onClick={() => setMode('login')}
            className={`w-1/2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              mode === 'login'
                ? 'bg-white text-black'
                : 'text-[#808080] hover:text-white'
            }`}
          >
            SIGN IN
          </button>
          <button
            id="tab-auth-register"
            type="button"
            onClick={() => setMode('register')}
            className={`w-1/2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              mode === 'register'
                ? 'bg-white text-black'
                : 'text-[#808080] hover:text-white'
            }`}
          >
            CREATE ACCOUNT
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#181818] border border-[#333333] p-6 sm:p-8 space-y-5 shadow-2xl">
          {mode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#808080] mb-1">
                    First Name
                  </label>
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
                  <label className="block text-xs uppercase tracking-wider text-[#808080] mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Vance"
                    className="w-full bg-[#111111] border border-[#333333] px-3.5 py-2.5 text-xs text-white focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#808080] mb-1">
                  Default Size Preference (Men's)
                </label>
                <div className="grid grid-cols-6 gap-1">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setPreferredSize(s)}
                      className={`py-1.5 text-xs font-bold border transition-colors ${
                        preferredSize === s
                          ? 'bg-white text-black border-white'
                          : 'bg-[#111111] text-[#808080] border-[#333333]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#808080] mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#111111] border border-[#333333] pl-10 pr-3.5 py-2.5 text-xs text-white focus:border-white focus:outline-none"
              />
              <Mail className="w-4 h-4 text-[#808080] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#808080] mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#111111] border border-[#333333] pl-10 pr-3.5 py-2.5 text-xs text-white focus:border-white focus:outline-none"
              />
              <Lock className="w-4 h-4 text-[#808080] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            id="btn-auth-submit"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-white hover:bg-[#E5E5E5] text-black text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'PROCESSING...' : mode === 'login' ? 'SIGN IN' : 'COMPLETE REGISTRATION'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Login Credentials (Fast testing for reviewer/user) */}
        <div className="bg-[#181818] border border-[#333333] p-4 space-y-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#808080] block text-center">
            ONE-CLICK DEMO AUTHENTICATION
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="btn-quick-login-customer"
              type="button"
              onClick={handleQuickDemoCustomer}
              className="px-3 py-2 bg-[#202020] hover:bg-[#292929] border border-[#333333] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-[#B3B3B3]" />
              Login as Customer
            </button>
            <button
              id="btn-quick-login-admin"
              type="button"
              onClick={handleQuickDemoAdmin}
              className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              Login as Admin
            </button>
          </div>
          <p className="text-[10px] text-[#808080] text-center">
            Demo passwords: <span className="text-white font-mono">password123</span> / <span className="text-white font-mono">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
};
