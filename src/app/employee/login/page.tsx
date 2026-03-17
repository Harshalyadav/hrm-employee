"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { findEmployeeByEmail, MOCK_OTP_CODE, setPendingEmployeeEmail } from '../../../lib/employeeSession';

function BrandMark() {
  return (
    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-lg font-bold text-white ring-1 ring-white/20">
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
    <div className="min-h-screen bg-[linear-gradient(180deg,#dcecff_0%,#edf4ff_55%,#f6f9ff_100%)] px-4 py-10 md:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_24px_70px_rgba(37,99,235,0.10)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden bg-[linear-gradient(160deg,#172554_0%,#2563eb_60%,#3b82f6_100%)] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <BrandMark />
            <div className="mt-8 inline-flex rounded-full bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-100 ring-1 ring-white/15">
              Employee Portal
            </div>
            <h1 className="mt-6 max-w-md text-4xl font-semibold tracking-[-0.04em] text-white">Secure access to payroll, payout history, and monthly bank details.</h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-blue-100/90">
              Sign in with your employee email and continue with a one-time password. No password reset flow is required for the demo portal.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AuthFeature label="Fast login" value="OTP-based sign in" />
            <AuthFeature label="Payroll view" value="Salary and incentive" />
            <AuthFeature label="Monthly payout" value="Cash or bank transfer" />
            <AuthFeature label="Demo OTP" value={MOCK_OTP_CODE} />
          </div>
        </section>

        <section className="flex items-center bg-white px-6 py-10 sm:px-10 lg:px-12">
          <div className="mx-auto w-full max-w-md">
            <div className="lg:hidden">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#111827] text-lg font-bold text-white">H</div>
              <div className="mt-5 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Employee Portal
              </div>
            </div>

            <div className="mt-6 lg:mt-0">
              <h2 className="text-[30px] font-semibold tracking-[-0.03em] text-slate-950">Employee Login</h2>
              <p className="mt-3 text-[14px] leading-7 text-slate-600">
                Enter your employee email address to receive a one-time password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-[13px] font-medium text-slate-700">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-[14px] text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-2 focus:ring-slate-200"
                  placeholder="john.doe@example.com"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">{error}</div> : null}

              <button type="submit" disabled={submitting} className="w-full rounded-2xl bg-blue-600 py-3.5 text-[13px] font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70">
                {submitting ? 'Preparing OTP...' : 'Send OTP'}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-[13px] text-slate-600">
              Demo OTP: <span className="font-semibold text-slate-900">{MOCK_OTP_CODE}</span>
            </div>

            <p className="mt-6 text-[12px] leading-6 text-slate-500">
              Only employees with a registered email can continue to OTP verification.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function AuthFeature({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 px-4 py-4 ring-1 ring-white/15 backdrop-blur-sm">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100">{label}</div>
      <div className="mt-2 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}