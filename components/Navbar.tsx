"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { clearAuthenticatedEmployee } from '@/lib/employeeSession';

function SearchIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="M13 13l4 4" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 9a6 6 0 1112 0v4l1.5 2.5H4.5L6 13V9z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 19a2 2 0 004 0" strokeLinecap="round" />
    </svg>
  );
}

interface NavbarProps {
  role?: 'admin' | 'employee';
}

const Navbar: React.FC<NavbarProps> = ({ role = 'admin' }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = React.useState({
    name: 'User',
    secondary: '',
  });

  const employeeTitle = React.useMemo(() => {
    if (pathname === '/employee/payment-details') {
      return 'Payment Details';
    }

    if (pathname === '/employee/dashboard') {
      return 'Dashboard';
    }

    return 'Employee Portal';
  }, [pathname]);

  React.useEffect(() => {
    const storedName = window.localStorage.getItem('userName');
    const storedEmail = window.localStorage.getItem('userEmail');
    const storedRole = window.localStorage.getItem('userRole');

    setCurrentUser({
      name: storedName || 'User',
      secondary: storedEmail || storedRole || '',
    });
  }, []);

  const handleLogout = () => {
    clearAuthenticatedEmployee();
    router.push('/employee/login');
  };

  if (role === 'employee') {
    return (
      <nav className="flex items-center justify-between gap-5">
        <div className="min-w-0 flex-1 rounded-3xl border border-white/80 bg-white px-5 py-6 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
          <div className="truncate text-[15px] font-semibold tracking-[-0.02em] text-slate-800">{employeeTitle}</div>
        </div>

        <div className="flex items-center gap-3 rounded-[22px] border border-white/80 bg-white px-4 py-3 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-slate-500">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20a8 8 0 0116 0" strokeLinecap="round" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold text-slate-800">{currentUser.name}</div>
            <div className="text-[11px] text-slate-500">{currentUser.secondary}</div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="ml-2 rounded-lg bg-[#111827] px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-slate-800"
          >
            Logout
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-between gap-4 rounded-[22px] border border-white/70 bg-white/80 px-5 py-3 shadow-[0_10px_30px_rgba(88,136,177,0.12)] backdrop-blur">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex max-w-md flex-1 items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-slate-400 ring-1 ring-slate-200/70">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
        <div className="max-sm:hidden sm:flex sm:items-center rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
          <button className="rounded-xl bg-slate-50 p-2 text-slate-500 transition hover:text-blue-600" aria-label="Light mode">
            ☀
          </button>
          <button className="rounded-xl p-2 text-slate-500 transition hover:text-blue-600" aria-label="Dark mode">
            ☾
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600" aria-label="Notifications">
          <BellIcon />
        </button>
        <div className="max-sm:hidden sm:flex sm:items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-sm">
          <div className="h-11 w-11 overflow-hidden rounded-full bg-[radial-gradient(circle_at_top,#f6d365,#fda085)]" />
          <div className="leading-tight">
            <div className="text-sm font-bold text-slate-800">{currentUser.name}</div>
            <div className="text-xs text-slate-500">{currentUser.secondary}</div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
