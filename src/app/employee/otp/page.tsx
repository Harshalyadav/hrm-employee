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
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-[0_2px_8px_rgba(15,23,42,0.08)] md:p-10">
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-[#111827] text-xl font-bold text-white">
            O
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-slate-900">Enter OTP</h1>
          <p className="mt-2 text-sm text-slate-500">Enter the 6-digit code sent to <span className="font-medium text-slate-700">{email || 'your email'}</span>.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">OTP Verification</label>
            <OTPInput value={otp} onChange={setOtp} length={6} />
          </div>

          {error && <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span>{timer > 0 ? `Resend OTP (${timer}s)` : 'Resend OTP available'}</span>
            <button type="button" onClick={handleResend} disabled={timer > 0} className="font-medium text-slate-900 disabled:text-slate-400">
              Resend OTP
            </button>
          </div>

          <button type="submit" className="w-full rounded-lg bg-[#111827] py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}