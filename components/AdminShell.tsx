"use client";

import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface AdminShellProps {
  children: React.ReactNode;
  role?: 'admin' | 'employee';
}

const AdminShell: React.FC<AdminShellProps> = ({ children, role = 'admin' }) => {
  if (role === 'employee') {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#dcecff_0%,#ecf4ff_48%,#f5f8ff_100%)] text-slate-900">
        <Sidebar role={role} />
        <div className="min-h-screen pl-71 pr-6 py-6">
          <Navbar role={role} />
          <main className="mt-6">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900">
      <Sidebar role={role} />
      <div className="min-h-screen pl-24 pr-4 py-4 md:pr-6">
        <Navbar role={role} />
        <main className="mt-4 rounded-lg border border-slate-200 bg-shell p-5 shadow-[0_2px_8px_rgba(15,23,42,0.06)] md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminShell;
