import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Employee Login',
};

export default function EmployeeLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Employee Login</h2>
        <form>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input type="email" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring" placeholder="employee@example.com" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Send OTP</button>
        </form>
      </div>
    </div>
  );
}
