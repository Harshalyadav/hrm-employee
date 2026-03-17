"use client";

import Link from 'next/link';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { clearAuthenticatedEmployee } from '@/lib/employeeSession';

interface SidebarProps {
  role: 'admin' | 'employee';
}

const icons: Record<string, React.ReactNode> = {
  Dashboard: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 10l8-6 8 6v9a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1v-9z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Employees: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" strokeLinecap="round" />
      <circle cx="9.5" cy="7" r="3" />
      <path d="M20 21v-2a4 4 0 00-3-3.87" strokeLinecap="round" />
      <path d="M16 4.13a3 3 0 010 5.74" strokeLinecap="round" />
    </svg>
  ),
  'Add Employee': (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  ),
  Portal: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 9h8M8 13h5" strokeLinecap="round" />
    </svg>
  ),
  'Payment Details': (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <path d="M7 12h10" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
};

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const pathname = usePathname();
  const router = useRouter();

  const adminLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/employees', label: 'Employees' },
    { href: '/employees/add', label: 'Add Employee' },
  ];

  const employeeLinks = [
    { href: '/employee/dashboard', label: 'Dashboard' },
    { href: '/employee/payment-details', label: 'Payment Details' },
  ];

  const links = role === 'admin' ? adminLinks : employeeLinks;

  const handleLogout = () => {
    clearAuthenticatedEmployee();
    router.push('/employee/login');
  };

  if (role === 'employee') {
    return (
      <aside className="fixed inset-y-4 left-2 z-40 flex w-64 flex-col overflow-hidden rounded-[26px] border border-white/80 bg-white shadow-[0_16px_40px_rgba(30,64,175,0.10)]">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
          <div>
            <div className="text-[13px] font-semibold tracking-[-0.02em] text-sky-500">My Hrms Cloud</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-400">Employee Portal</div>
          </div>
          <button type="button" className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Close navigation">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-5">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-medium transition ${
                  isActive
                    ? 'bg-[linear-gradient(135deg,#4da8e8_0%,#5bb5f1_100%)] text-white shadow-[0_10px_24px_rgba(91,181,241,0.25)]'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
                title={link.label}
              >
                <span className={`${isActive ? 'text-white' : 'text-slate-500'}`}>{icons[link.label]}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 px-4 py-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
            aria-label="Logout"
            type="button"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" strokeLinecap="round" />
              <path d="M10 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 12H3" strokeLinecap="round" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-20 flex-col items-center border-r border-slate-200 bg-white px-3 py-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
      <div className="grid h-12 w-12 place-items-center rounded-lg bg-[#111827] text-white">
        <span className="text-lg font-semibold">H</span>
      </div>
      <nav className="mt-6 flex flex-1 flex-col items-center gap-4">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`grid h-11 w-11 place-items-center rounded-lg border text-slate-600 transition ${
                isActive
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title={link.label}
            >
              {icons[link.label]}
            </Link>
          );
        })}
      </nav>
      <button onClick={handleLogout} className="grid h-11 w-11 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900" aria-label="Logout" type="button">
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" strokeLinecap="round" />
          <path d="M10 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 12H3" strokeLinecap="round" />
        </svg>
      </button>
    </aside>
  );
};

export default Sidebar;
