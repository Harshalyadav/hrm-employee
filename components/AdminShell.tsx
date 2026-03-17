"use client";

import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface AdminShellProps {
  children: React.ReactNode;
  role?: 'admin' | 'employee';
}

const AdminShell: React.FC<AdminShellProps> = ({ children, role = 'admin' }) => {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#7ec9f5_0%,#bce8ff_18%,#eaf7ff_42%,#f8fcff_100%)] text-slate-900">
      <Sidebar role={role} />
      <div className="min-h-screen pl-24 pr-4 py-4 md:pr-6">
        <Navbar />
        <main className="mt-4 rounded-[28px] border border-white/60 bg-shell/85 p-5 shadow-[0_20px_60px_rgba(73,138,196,0.18)] backdrop-blur md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminShell;
