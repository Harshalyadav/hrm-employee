"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AdminShell from '../../../../components/AdminShell';
import payrollSeed from '../../../../mock-data/payroll.json';
import { EmployeeRecord, getEmployeeById } from '../../../lib/employeeStore';
import { getAuthenticatedEmployee } from '../../../lib/employeeSession';

type BankDetails = {
  bankName: string;
  accountNumber: string;
  ifsc: string;
};

type PayrollRecord = {
  employeeId: string;
  month: string;
  salary?: number;
  incentives?: number;
  paymentType?: 'cash' | 'bank';
  bankDetails?: BankDetails;
};

const BANK_STORAGE_KEY = 'hrms-employee-bank-details';

function formatMonthLabel(value: string) {
  const [year, month] = value.split('-');
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(Number(year), Number(month) - 1));
}

function formatDate(value: string) {
  if (!value) {
    return '-';
  }

  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function readSavedBankDetails() {
  if (typeof window === 'undefined') {
    return {} as Record<string, BankDetails>;
  }

  const raw = window.localStorage.getItem(BANK_STORAGE_KEY);
  if (!raw) {
    return {} as Record<string, BankDetails>;
  }

  try {
    return JSON.parse(raw) as Record<string, BankDetails>;
  } catch {
    return {} as Record<string, BankDetails>;
  }
}

function maskAccountNumber(value: string) {
  if (!value) {
    return 'Not available';
  }

  return `****${value.slice(-4)}`;
}

export default function EmployeeDashboardPage() {
  const router = useRouter();
  const [employee, setEmployee] = React.useState<EmployeeRecord | null>(null);
  const [records, setRecords] = React.useState<PayrollRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = React.useState('');
  const [bankDetails, setBankDetails] = React.useState<BankDetails | null>(null);

  React.useEffect(() => {
    const session = getAuthenticatedEmployee();
    if (!session) {
      router.replace('/employee/login');
      return;
    }

    const currentEmployee = getEmployeeById(session.id);
    if (!currentEmployee) {
      router.replace('/employee/login');
      return;
    }

    const payroll = (payrollSeed as PayrollRecord[])
      .filter((record) => record.employeeId === currentEmployee.id)
      .sort((left, right) => right.month.localeCompare(left.month));

    setEmployee(currentEmployee);
    setRecords(payroll);
    setSelectedMonth(payroll[0]?.month ?? '');
  }, [router]);

  const selectedPayroll = React.useMemo(
    () => records.find((record) => record.month === selectedMonth) ?? null,
    [records, selectedMonth],
  );

  React.useEffect(() => {
    if (!employee || !selectedPayroll) {
      setBankDetails(null);
      return;
    }

    const saved = readSavedBankDetails()[`${employee.id}-${selectedPayroll.month}`];
    setBankDetails(saved || selectedPayroll.bankDetails || null);
  }, [employee, selectedPayroll]);

  if (!employee) {
    return null;
  }

  const handleDownloadSlip = () => {
    if (!selectedPayroll) {
      return;
    }

    const slip = [
      `Salary Slip - ${formatMonthLabel(selectedPayroll.month)}`,
      `Employee: ${employee.name}`,
      `Employee Code: ${employee.employeeCode}`,
      `Designation: ${employee.designation}`,
      `Monthly Salary: ${formatCurrency(selectedPayroll.salary || 0)}`,
      `Incentive: ${formatCurrency(selectedPayroll.incentives || 0)}`,
      `Payment Mode: ${selectedPayroll.paymentType === 'cash' ? 'Cash' : 'Bank Transfer'}`,
    ].join('\n');

    const blob = new Blob([slip], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${employee.employeeCode}-${selectedPayroll.month}-salary-slip.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminShell role="employee">
      <div className="space-y-6">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
          <h1 className="text-2xl font-semibold text-slate-900">Employee Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">Review employee information, payroll data, and monthly payment details.</p>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            <h2 className="text-lg font-semibold text-slate-900">Employee Information</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <InfoRow label="Code" value={employee.employeeCode} />
              <InfoRow label="Date of Joining" value={formatDate(employee.doj)} />
              <InfoRow label="Date of Birth" value={formatDate(employee.dob)} />
              <InfoRow label="Branch" value={employee.branch} />
              <InfoRow label="Designation" value={employee.designation} />
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            <h2 className="text-lg font-semibold text-slate-900">Payroll Information</h2>
            <div className="mt-4 rounded-lg bg-slate-50 p-4">
              <div className="text-sm text-slate-500">Incentive</div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">{formatCurrency(selectedPayroll?.incentives || 0)}</div>
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
              <div className="grid grid-cols-2 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                <div>Month</div>
                <div>Salary</div>
              </div>
              <div className="divide-y divide-slate-200">
                {records.map((record) => (
                  <div key={record.month} className="grid grid-cols-2 px-4 py-3 text-sm text-slate-700">
                    <div>{formatMonthLabel(record.month)}</div>
                    <div>{formatCurrency(record.salary || 0)}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadSlip}
              className="mt-4 w-full rounded-lg bg-[#111827] py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Download Salary Slip
            </button>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">Payment Details</h2>
              <Link href="/employee/payment-details" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Full View
              </Link>
            </div>

            <div className="mt-4">
              <label htmlFor="payment-month" className="mb-2 block text-sm font-medium text-slate-700">Month Dropdown</label>
              <select
                id="payment-month"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
              >
                {records.map((record) => (
                  <option key={record.month} value={record.month}>{formatMonthLabel(record.month)}</option>
                ))}
              </select>
            </div>

            {selectedPayroll?.paymentType === 'cash' ? (
              <div className="mt-4 rounded-lg bg-emerald-50 px-4 py-4 text-sm font-medium text-emerald-700">
                Paid in Cash
              </div>
            ) : selectedPayroll ? (
              <div className="mt-4 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <InfoRow label="Bank" value={bankDetails?.bankName || 'Not available'} />
                <InfoRow label="Account" value={maskAccountNumber(bankDetails?.accountNumber || '')} />
                <InfoRow label="IFSC" value={bankDetails?.ifsc || 'Not available'} />
              </div>
            ) : (
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                Select a month to view payment details.
              </div>
            )}
          </section>
        </div>
      </div>
    </AdminShell>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-900">{value}</span>
    </div>
  );
}
