import React, { useState, useEffect } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Employee OTP',
};

export default function EmployeeOtpPage() {
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState('');
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setResendDisabled(false);
    }
  }, [timer]);

  const handleResend = () => {
    setTimer(60);
    setResendDisabled(true);
    setOtp('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock OTP validation
    if (otp === '123456') {
      alert('OTP Verified!');
    } else {
      alert('Invalid OTP. Try 123456.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Enter OTP</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">OTP</label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
              placeholder="123456"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Verify OTP</button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600 dark:text-gray-300">{timer > 0 ? `Resend OTP in ${timer}s` : 'You can resend OTP.'}</span>
          <button
            className="ml-2 text-blue-600 hover:underline disabled:opacity-50"
            disabled={resendDisabled}
            onClick={handleResend}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
}
