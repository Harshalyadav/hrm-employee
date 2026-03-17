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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#7ec9f5_0%,#bce8ff_42%,#f8fcff_100%)] px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.8),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(195,240,255,0.95),transparent_38%)]" />
      <div className="relative w-full max-w-lg rounded-[34px] border border-white/70 bg-white/86 p-8 shadow-[0_30px_90px_rgba(63,135,191,0.18)] backdrop-blur md:p-10">
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[linear-gradient(180deg,#1695ff,#2167ff)] text-2xl font-black text-white shadow-xl shadow-blue-300/40">
            O
          </div>
          <h1 className="mt-7 text-4xl font-black tracking-[-0.04em] text-slate-900">Verify OTP</h1>
          <p className="mt-3 text-sm text-slate-500">Enter the 6-digit code sent to <span className="font-semibold text-slate-700">{email || 'your email'}</span>.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-500">One-Time Password</label>
            <OTPInput value={otp} onChange={setOtp} length={6} />
          </div>

          {error && <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div>}

          <button type="submit" className="w-full rounded-2xl bg-[linear-gradient(180deg,#1695ff,#2167ff)] py-4 text-sm font-semibold text-white shadow-lg shadow-blue-200/60 transition hover:scale-[1.01]">
            Verify and Continue
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between rounded-3xl bg-slate-50 px-5 py-4 text-sm text-slate-500 ring-1 ring-slate-200/70">
          <span>{timer > 0 ? `Resend available in ${timer}s` : 'You can request a new OTP now.'}</span>
          <button type="button" onClick={handleResend} disabled={timer > 0} className="font-semibold text-blue-600 disabled:text-slate-300">
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
}