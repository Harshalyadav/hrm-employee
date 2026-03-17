"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import OTPInput from '../../../../components/OTPInput';
import { clearPendingEmployeeEmail, findEmployeeByEmail, getPendingEmployeeEmail, MOCK_OTP_CODE, setAuthenticatedEmployee, setPendingEmployeeEmail } from '../../../lib/employeeSession';

export default function EmployeeOtpPage() {
  const router = useRouter();
  const [timer, setTimer] = React.useState(60);
  const [otp, setOtp] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const pendingEmail = getPendingEmployeeEmail();
    if (!pendingEmail) {
      router.replace('/employee/login');
      return;
    }

    setEmail(pendingEmail);
  }, [router]);

  React.useEffect(() => {
    if (timer <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => setTimer((current) => current - 1), 1000);
    return () => window.clearInterval(intervalId);
  }, [timer]);

  const handleResend = () => {
    if (!email) {
      return;
    }

    setPendingEmployeeEmail(email);
    setTimer(60);
    setOtp('');
    setError('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const employee = findEmployeeByEmail(email);

    if (!employee) {
      setError('Your employee session expired. Please log in again.');
      return;
    }

    if (otp !== MOCK_OTP_CODE) {
      setError(`Invalid OTP. Use ${MOCK_OTP_CODE} for the demo flow.`);
      return;
    }

    setAuthenticatedEmployee(employee);
    clearPendingEmployeeEmail();
    router.push('/employee/dashboard');
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#dcecff_0%,#edf4ff_55%,#f6f9ff_100%)] px-4 py-10 md:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_24px_70px_rgba(37,99,235,0.10)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden bg-[linear-gradient(160deg,#0f172a_0%,#1d4ed8_55%,#60a5fa_100%)] px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-lg font-bold text-white ring-1 ring-white/20">O</div>
            <div className="mt-8 inline-flex rounded-full bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-100 ring-1 ring-white/15">
              OTP Verification
            </div>
            <h1 className="mt-6 max-w-md text-4xl font-semibold tracking-[-0.04em] text-white">Verify the one-time code to continue into your employee workspace.</h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-blue-100/90">
              We sent a 6-digit OTP to <span className="font-semibold text-white">{email || 'your email'}</span>. Use the demo code shown below if you are testing locally.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AuthFeature label="Recipient" value={email || 'Pending email'} />
            <AuthFeature label="Demo OTP" value={MOCK_OTP_CODE} />
            <AuthFeature label="Session" value="Employee access" />
            <AuthFeature label="Resend timer" value={timer > 0 ? `${timer}s` : 'Ready'} />
          </div>
        </section>

        <section className="flex items-center bg-white px-6 py-10 sm:px-10 lg:px-12">
          <div className="mx-auto w-full max-w-md">
            <div className="lg:hidden">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#111827] text-lg font-bold text-white">O</div>
              <div className="mt-5 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                OTP Verification
              </div>
            </div>

            <div className="mt-6 lg:mt-0">
              <h2 className="text-[30px] font-semibold tracking-[-0.03em] text-slate-950">Enter OTP</h2>
              <p className="mt-3 text-[14px] leading-7 text-slate-600">
                Enter the 6-digit code sent to <span className="font-medium text-slate-800">{email || 'your email'}</span>.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-3">
                <label className="block text-[13px] font-medium text-slate-700">One-Time Password</label>
                <OTPInput value={otp} onChange={setOtp} length={6} />
              </div>

              {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700">{error}</div> : null}

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] text-slate-600">
                <span>{timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP available'}</span>
                <button type="button" onClick={handleResend} disabled={timer > 0} className="font-medium text-slate-900 disabled:text-slate-400">
                  Resend OTP
                </button>
              </div>

              <button type="submit" className="w-full rounded-2xl bg-[#111827] py-3.5 text-[13px] font-semibold text-white transition hover:bg-slate-800">
                Verify OTP
              </button>
            </form>
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
      <div className="mt-2 truncate text-sm font-semibold text-white">{value}</div>
    </div>
  );
}