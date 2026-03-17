"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { findEmployeeByEmail, MOCK_OTP_CODE, setPendingEmployeeEmail } from '../../../lib/employeeSession';

function BrandMark() {
  return (
    <div className="grid h-14 w-14 place-items-center rounded-lg bg-[#111827] text-xl font-bold text-white">
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
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-[0_2px_8px_rgba(15,23,42,0.08)] md:p-10">
        <div className="flex flex-col items-center text-center">
          <BrandMark />
          <h1 className="mt-6 text-3xl font-semibold text-slate-900">Employee Login</h1>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Enter your employee email to receive a one-time password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email Input</label>
            <input
              id="email"
              type="email"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              placeholder="Enter Email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          {error && <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

          <button type="submit" disabled={submitting} className="w-full rounded-lg bg-[#111827] py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70">
            {submitting ? 'Preparing OTP...' : 'Send OTP Button'}
          </button>
        </form>

        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Demo OTP: <span className="font-semibold text-slate-900">{MOCK_OTP_CODE}</span>
        </div>
      </div>
    </div>
  );
}