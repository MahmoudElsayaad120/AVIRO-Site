import React from 'react';
import { useShop } from '../context/ShopContext';
import { Shield, User as UserIcon, Lock, KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RoleSwitcherBar: React.FC = () => {
  const { user, switchRole } = useShop();

  const currentRole = user?.role || 'Customer';

  return (
    <div
      id="dev-role-switcher"
      className="bg-[#181818] border-b border-[#333333] px-4 py-1.5 text-[11px] text-[#B3B3B3] flex items-center justify-between z-30"
    >
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 font-mono uppercase tracking-wider text-[#808080]">
          <KeyRound className="w-3 h-3 text-[#B3B3B3]" />
          ASP.NET Core Auth Preview
        </span>
        <span className="hidden sm:inline text-[#444444]">|</span>
        <span className="hidden sm:inline">
          Current Role:{' '}
          <strong className={currentRole === 'Admin' ? 'text-amber-400' : 'text-white'}>
            {currentRole}
          </strong>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] text-[#808080] uppercase tracking-wider hidden md:inline">
          Switch Identity:
        </span>
        <div className="flex items-center bg-[#111111] border border-[#333333] p-0.5">
          <button
            id="btn-switch-role-customer"
            onClick={() => switchRole('Customer')}
            className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors ${
              currentRole === 'Customer'
                ? 'bg-[#292929] text-white border border-[#444444]'
                : 'text-[#808080] hover:text-white'
            }`}
          >
            <UserIcon className="w-2.5 h-2.5" />
            Customer
          </button>
          <button
            id="btn-switch-role-admin"
            onClick={() => switchRole('Admin')}
            className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 transition-colors ${
              currentRole === 'Admin'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-[#808080] hover:text-white'
            }`}
          >
            <Shield className="w-2.5 h-2.5" />
            Admin
          </button>
        </div>

        {currentRole === 'Admin' ? (
          <Link
            id="link-admin-panel-top"
            to="/admin"
            className="px-2 py-0.5 bg-[#202020] hover:bg-white hover:text-black text-white text-[10px] font-bold uppercase tracking-wider border border-[#444444] transition-colors"
          >
            Open Admin
          </Link>
        ) : (
          <Link
            id="link-admin-panel-locked"
            to="/admin"
            className="px-2 py-0.5 text-[10px] text-[#808080] hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors"
            title="Access requires Admin Role"
          >
            <Lock className="w-2.5 h-2.5" />
            Admin (Protected)
          </Link>
        )}
      </div>
    </div>
  );
};
