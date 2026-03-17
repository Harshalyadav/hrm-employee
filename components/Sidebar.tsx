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
  ];

  const links = role === 'admin' ? adminLinks : employeeLinks;

  const handleLogout = () => {
    clearAuthenticatedEmployee();
    router.push('/employee/login');
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-20 flex-col items-center border-r border-white/60 bg-[linear-gradient(180deg,#8fd2fa_0%,#c7efff_45%,#effaff_100%)] px-3 py-4 shadow-[8px_0_30px_rgba(72,124,167,0.12)]">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[linear-gradient(180deg,#1695ff,#2167ff)] text-white shadow-lg shadow-blue-300/40">
        <span className="text-lg font-bold">H</span>
      </div>
      <nav className="mt-6 flex flex-1 flex-col items-center gap-4">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`grid h-11 w-11 place-items-center rounded-2xl border text-slate-600 transition ${
                isActive
                  ? 'border-blue-200 bg-white text-blue-600 shadow-md shadow-blue-100'
                  : 'border-transparent bg-white/60 hover:border-white hover:bg-white hover:text-blue-600'
              }`}
              title={link.label}
            >
              {icons[link.label]}
            </Link>
          );
        })}
      </nav>
      <button onClick={handleLogout} className="grid h-11 w-11 place-items-center rounded-2xl border border-transparent bg-white/70 text-slate-500 transition hover:bg-white hover:text-blue-600" aria-label="Logout" type="button">
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
