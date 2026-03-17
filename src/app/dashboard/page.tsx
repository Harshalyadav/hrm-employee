
"use client";
import React from 'react';
import AdminShell from '../../../components/AdminShell';
import payrollData from '../../../mock-data/payroll.json';
import { getEmployees } from '../../lib/employeeStore';

export default function AdminDashboardPage() {
  const [employees, setEmployees] = React.useState<any[] | null>(null);
  const [payroll] = React.useState(payrollData as Array<{ salary?: number }>);

  React.useEffect(() => {
    setEmployees(getEmployees());
  }, []);

  const isLoading = !employees || !payroll;
  const totalEmployees = employees?.length || 0;
  const activeEmployees = employees?.filter((e) => e.active).length || 0;
  const payrollSummary = payroll?.reduce((sum, p) => sum + (p.salary || 0), 0) || 0;

  return (
    <AdminShell>
      <div className="flex flex-col items-center">
        <div className="w-full max-w-5xl rounded-2xl bg-white/80 p-8 shadow-xl ring-1 ring-white/70 md:p-12">
            <h2 className="text-4xl font-extrabold mb-10 text-center tracking-tight text-gray-800 dark:text-gray-100">Admin Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full mb-8">
              <div className="bg-blue-100 dark:bg-blue-900 p-8 rounded-xl shadow-lg flex flex-col items-center transition hover:scale-105 hover:shadow-2xl border border-blue-200 dark:border-blue-800">
                <div className="text-2xl mb-2">👥</div>
                <div className="text-lg font-semibold mb-2">Total Employees</div>
                <div className="text-3xl font-extrabold mt-2">{isLoading ? <span className="animate-pulse">...</span> : totalEmployees}</div>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-8 rounded-xl shadow-lg flex flex-col items-center transition hover:scale-105 hover:shadow-2xl border border-green-200 dark:border-green-800">
                <div className="text-2xl mb-2">✅</div>
                <div className="text-lg font-semibold mb-2">Active Employees</div>
                <div className="text-3xl font-extrabold mt-2">{isLoading ? <span className="animate-pulse">...</span> : activeEmployees}</div>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-8 rounded-xl shadow-lg flex flex-col items-center transition hover:scale-105 hover:shadow-2xl border border-yellow-200 dark:border-yellow-800">
                <div className="text-2xl mb-2">💰</div>
                <div className="text-lg font-semibold mb-2">Payroll Summary</div>
                <div className="text-3xl font-extrabold mt-2">{isLoading ? <span className="animate-pulse">...</span> : `$${payrollSummary}`}</div>
              </div>
            </div>
        </div>
      </div>
    </AdminShell>
  );
}
