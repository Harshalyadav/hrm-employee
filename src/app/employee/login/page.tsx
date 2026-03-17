"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { findEmployeeByEmail, MOCK_OTP_CODE, setPendingEmployeeEmail } from '../../../lib/employeeSession';

function BrandMark() {
  return (
    <div className="grid h-16 w-16 place-items-center rounded-3xl bg-[linear-gradient(180deg,#1695ff,#2167ff)] text-2xl font-black text-white shadow-xl shadow-blue-300/40">
      H
    </div>
  );
}

export default function EmployeeLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    const employee = findEmployeeByEmail(email);
    if (!employee) {
      setError('We could not find an employee account for that email address.');
      setSubmitting(false);
      return;
    }

    setPendingEmployeeEmail(employee.email);
    setError('');
    router.push('/employee/otp');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#7ec9f5_0%,#bce8ff_42%,#f8fcff_100%)] px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.8),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(195,240,255,0.95),transparent_38%)]" />
      <div className="relative w-full max-w-lg rounded-[34px] border border-white/70 bg-white/86 p-8 shadow-[0_30px_90px_rgba(63,135,191,0.18)] backdrop-blur md:p-10">
        <div className="flex flex-col items-center text-center">
          <BrandMark />
          <h1 className="mt-7 text-4xl font-black tracking-[-0.04em] text-slate-900">Employee Login</h1>
          <p className="mt-3 max-w-sm text-sm text-slate-500">
            Enter your employee email to receive a one-time code. Passwords are not used in this portal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-500">Employee Email</label>
            <input
              id="email"
              type="email"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700 outline-none ring-2 ring-transparent transition focus:border-blue-300 focus:ring-blue-100"
              placeholder="john.doe@example.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          {error && <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div>}

          <button type="submit" disabled={submitting} className="w-full rounded-2xl bg-[linear-gradient(180deg,#1695ff,#2167ff)] py-4 text-sm font-semibold text-white shadow-lg shadow-blue-200/60 transition hover:scale-[1.01] disabled:opacity-70">
            {submitting ? 'Preparing OTP...' : 'Send OTP'}
          </button>
        </form>

        <div className="mt-8 rounded-3xl bg-slate-50 px-5 py-4 text-sm text-slate-500 ring-1 ring-slate-200/70">
          Demo OTP: <span className="font-black text-slate-800">{MOCK_OTP_CODE}</span>
        </div>
      </div>
    </div>
  );
}