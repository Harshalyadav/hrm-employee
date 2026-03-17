"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function BrandMark() {
  return (
    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[linear-gradient(180deg,#1695ff,#2167ff)] text-xl font-bold text-white shadow-xl shadow-blue-300/40">
      H
    </div>
  );
}

export default function AdminSignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    router.push('/login');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#7ec9f5_0%,#bce8ff_42%,#f8fcff_100%)] px-4 py-12">
      <div className="absolute inset-x-0 bottom-0 h-[45vh] bg-[radial-gradient(circle_at_center,#c9f6ff_0%,#e8f7ff_42%,transparent_70%)]" />
      <div className="relative w-full max-w-md rounded-4xl border border-white/70 bg-white/80 p-8 shadow-[0_30px_80px_rgba(63,135,191,0.18)] backdrop-blur md:p-10">
        <div className="flex flex-col items-center text-center">
          <BrandMark />
          <h1 className="mt-7 text-4xl font-extrabold tracking-tight text-slate-800">Create Account</h1>
          <p className="mt-3 text-sm text-slate-400">Set up your HRMS admin account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-9 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-500">Full Name</label>
            <input type="text" value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700 outline-none ring-2 ring-transparent transition focus:border-blue-300 focus:ring-blue-100" placeholder="Enter Here" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-500">Email</label>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700 outline-none ring-2 ring-transparent transition focus:border-blue-300 focus:ring-blue-100" placeholder="admin@example.com" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-500">Password</label>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700 outline-none ring-2 ring-transparent transition focus:border-blue-300 focus:ring-blue-100" placeholder="********" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-500">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700 outline-none ring-2 ring-transparent transition focus:border-blue-300 focus:ring-blue-100" placeholder="********" required />
          </div>
          {error && <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div>}
          <button type="submit" className="w-full rounded-2xl bg-[linear-gradient(180deg,#1695ff,#2167ff)] py-4 text-sm font-semibold text-white shadow-lg shadow-blue-200/60 transition hover:scale-[1.01]">Create Account</button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          <p>Already have an account?</p>
          <div className="mt-4">
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
