"use client";

import React from 'react';
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
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(Number(year), Number(month) - 1));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
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

function saveBankDetails(employeeId: string, month: string, details: BankDetails) {
  const current = readSavedBankDetails();
  current[`${employeeId}-${month}`] = details;
  window.localStorage.setItem(BANK_STORAGE_KEY, JSON.stringify(current));
}

export default function EmployeeDashboardPage() {
  const router = useRouter();
  const [employee, setEmployee] = React.useState<EmployeeRecord | null>(null);
  const [records, setRecords] = React.useState<PayrollRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = React.useState('');
  const [bankForm, setBankForm] = React.useState<BankDetails>({ bankName: '', accountNumber: '', ifsc: '' });
  const [saveMessage, setSaveMessage] = React.useState('');

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

    const payroll = (payrollSeed as PayrollRecord[]).filter((record) => record.employeeId === currentEmployee.id);
    const sortedPayroll = [...payroll].sort((left, right) => right.month.localeCompare(left.month));

    setEmployee(currentEmployee);
    setRecords(sortedPayroll);
    setSelectedMonth(sortedPayroll[0]?.month ?? '');
  }, [router]);

  const selectedPayroll = React.useMemo(() => records.find((record) => record.month === selectedMonth) ?? null, [records, selectedMonth]);

  React.useEffect(() => {
    if (!employee || !selectedPayroll) {
      return;
    }

    const saved = readSavedBankDetails()[`${employee.id}-${selectedPayroll.month}`];
    setBankForm(saved || selectedPayroll.bankDetails || { bankName: '', accountNumber: '', ifsc: '' });
    setSaveMessage('');
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
      `Payroll Incentive: ${formatCurrency(selectedPayroll.incentives || 0)}`,
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

  const handleSaveBankDetails = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedPayroll || selectedPayroll.paymentType !== 'bank') {
      return;
    }

    saveBankDetails(employee.id, selectedPayroll.month, bankForm);
    setSaveMessage(`Bank details updated for ${formatMonthLabel(selectedPayroll.month)}.`);
  };

  const monthlyDetails = records.map((record) => ({
    ...record,
    total: (record.salary || 0) + (record.incentives || 0),
  }));

  return (
    <AdminShell role="employee">
      <div id="portal" className="space-y-6">
        <section className="overflow-hidden rounded-[32px] border border-white/70 bg-white/90 shadow-[0_24px_70px_rgba(76,135,187,0.12)]">
          <div className="grid gap-6 px-7 py-7 md:grid-cols-[minmax(0,1.3fr)_280px] md:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-500">Employee Portal</p>
              <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-slate-900">Welcome back, {employee.name}</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-500">
                Review your employee information, payroll incentive, salary slips, monthly salary details, and payment method in one place.
              </p>
            </div>

            <div className="rounded-[28px] bg-[linear-gradient(135deg,#1f8dff,#2658ff)] px-6 py-6 text-white shadow-[0_18px_40px_rgba(37,102,255,0.28)]">
              <div className="text-sm font-semibold text-white/75">Current employee</div>
              <div className="mt-3 text-2xl font-black tracking-[-0.03em]">{employee.employeeCode}</div>
              <div className="mt-2 text-sm text-white/80">{employee.designation}</div>
              <div className="mt-1 text-sm text-white/80">{employee.branch}</div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,1fr)]">
          <section className="rounded-[30px] border border-white/70 bg-white/90 px-7 py-7 shadow-[0_20px_55px_rgba(76,135,187,0.10)] md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-900">Employee Information</h2>
                <p className="mt-1 text-sm text-slate-500">Core profile details provided by HR.</p>
              </div>
              <select
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 outline-none ring-2 ring-transparent transition focus:border-blue-300 focus:ring-blue-100"
              >
                {records.map((record) => (
                  <option key={record.month} value={record.month}>{formatMonthLabel(record.month)}</option>
                ))}
              </select>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {[
                ['Employee Code', employee.employeeCode],
                ['Date of Joining', employee.doj],
                ['Date of Birth', employee.dob],
                ['Branch', employee.branch],
                ['Designation', employee.designation],
                ['Email', employee.email],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[24px] border border-slate-100 bg-slate-50 px-5 py-5">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{label}</div>
                  <div className="mt-3 text-lg font-bold text-slate-900">{value}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[26px] border border-slate-100 bg-white">
              <div className="border-b border-slate-100 px-6 py-4">
                <h3 className="text-lg font-black tracking-[-0.02em] text-slate-900">Monthly Salary Details</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {monthlyDetails.map((record) => (
                  <div key={record.month} className="grid grid-cols-[1fr_110px_110px_120px] gap-4 px-6 py-4 text-sm">
                    <div className="font-semibold text-slate-700">{formatMonthLabel(record.month)}</div>
                    <div className="text-slate-500">{formatCurrency(record.salary || 0)}</div>
                    <div className="text-slate-500">{formatCurrency(record.incentives || 0)}</div>
                    <div className="font-black text-slate-900">{formatCurrency(record.total)}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-[30px] border border-white/70 bg-white/90 px-7 py-7 shadow-[0_20px_55px_rgba(76,135,187,0.10)] md:px-8">
              <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-900">Payroll Information</h2>
              <p className="mt-1 text-sm text-slate-500">Review incentive and salary slip information for the selected month.</p>

              {selectedPayroll ? (
                <div className="mt-6 space-y-4">
                  <div className="rounded-[24px] bg-slate-50 px-5 py-5 ring-1 ring-slate-200/70">
                    <div className="text-sm font-semibold text-slate-500">Payroll Incentive</div>
                    <div className="mt-2 text-4xl font-black tracking-[-0.04em] text-emerald-500">{formatCurrency(selectedPayroll.incentives || 0)}</div>
                  </div>
                  <div className="rounded-[24px] bg-slate-50 px-5 py-5 ring-1 ring-slate-200/70">
                    <div className="text-sm font-semibold text-slate-500">Monthly Salary</div>
                    <div className="mt-2 text-4xl font-black tracking-[-0.04em] text-blue-500">{formatCurrency(selectedPayroll.salary || 0)}</div>
                  </div>
                  <button type="button" onClick={handleDownloadSlip} className="w-full rounded-2xl bg-[linear-gradient(180deg,#1695ff,#2167ff)] py-4 text-sm font-semibold text-white shadow-lg shadow-blue-200/60 transition hover:scale-[1.01]">
                    Download Salary Slip
                  </button>
                </div>
              ) : (
                <div className="mt-6 rounded-[24px] bg-slate-50 px-5 py-5 text-sm text-slate-500 ring-1 ring-slate-200/70">No payroll records available yet.</div>
              )}
            </section>

            <section className="rounded-[30px] border border-white/70 bg-white/90 px-7 py-7 shadow-[0_20px_55px_rgba(76,135,187,0.10)] md:px-8">
              <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-900">Payment Details</h2>
              <p className="mt-1 text-sm text-slate-500">Bank details are shown only when salary is paid by bank transfer.</p>

              {selectedPayroll?.paymentType === 'cash' ? (
                <div className="mt-6 rounded-[24px] border border-amber-100 bg-amber-50 px-5 py-5 text-sm font-semibold text-amber-700">
                  Salary for {formatMonthLabel(selectedPayroll.month)} is marked as cash. No bank details are displayed.
                </div>
              ) : selectedPayroll ? (
                <div className="mt-6 space-y-5">
                  <div className="rounded-[24px] bg-slate-50 px-5 py-5 ring-1 ring-slate-200/70">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <InfoTile label="Bank Name" value={bankForm.bankName || 'Not set'} />
                      <InfoTile label="Account Number" value={bankForm.accountNumber || 'Not set'} />
                      <InfoTile label="IFSC" value={bankForm.ifsc || 'Not set'} />
                      <InfoTile label="Payment Method" value="Bank Transfer" />
                    </div>
                  </div>

                  <form onSubmit={handleSaveBankDetails} className="space-y-4 rounded-[24px] border border-slate-100 bg-white px-5 py-5">
                    <h3 className="text-lg font-black tracking-[-0.02em] text-slate-900">Update bank details for {formatMonthLabel(selectedPayroll.month)}</h3>
                    <div className="grid gap-4">
                      <DashboardInput label="Bank Name" value={bankForm.bankName} onChange={(value) => setBankForm((current) => ({ ...current, bankName: value }))} />
                      <DashboardInput label="Account Number" value={bankForm.accountNumber} onChange={(value) => setBankForm((current) => ({ ...current, accountNumber: value }))} />
                      <DashboardInput label="IFSC" value={bankForm.ifsc} onChange={(value) => setBankForm((current) => ({ ...current, ifsc: value }))} />
                    </div>
                    {saveMessage && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-600">{saveMessage}</div>}
                    <button type="submit" className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                      Save Monthly Bank Details
                    </button>
                  </form>
                </div>
              ) : (
                <div className="mt-6 rounded-[24px] bg-slate-50 px-5 py-5 text-sm text-slate-500 ring-1 ring-slate-200/70">Select a payroll month to review payment details.</div>
              )}
            </section>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{label}</div>
      <div className="mt-2 text-base font-bold text-slate-900">{value}</div>
    </div>
  );
}

function DashboardInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-500">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none ring-2 ring-transparent transition focus:border-blue-300 focus:ring-blue-100"
      />
    </div>
  );
}