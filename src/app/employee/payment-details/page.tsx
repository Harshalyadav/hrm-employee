"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  return new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date(Number(year), Number(month) - 1));
}

function formatMonthCompact(value: string) {
  const [year, month] = value.split('-');
  return new Intl.DateTimeFormat('en-IN', { month: 'short', year: 'numeric' }).format(new Date(Number(year), Number(month) - 1));
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

function saveBankDetails(employeeId: string, month: string, details: BankDetails) {
  const current = readSavedBankDetails();
  current[`${employeeId}-${month}`] = details;
  window.localStorage.setItem(BANK_STORAGE_KEY, JSON.stringify(current));
}

function buildSalarySlip(employee: EmployeeRecord, record: PayrollRecord) {
  return [
    `Salary Slip - ${formatMonthLabel(record.month)}`,
    `Employee: ${employee.name}`,
    `Employee Code: ${employee.employeeCode}`,
    `Designation: ${employee.designation}`,
    `Monthly Salary: ${formatCurrency(record.salary || 0)}`,
    `Payroll Incentive: ${formatCurrency(record.incentives || 0)}`,
    `Total Payout: ${formatCurrency((record.salary || 0) + (record.incentives || 0))}`,
    `Payment Mode: ${record.paymentType === 'cash' ? 'Cash' : 'Bank Transfer'}`,
  ].join('\n');
}

function maskAccountNumber(value: string) {
  if (!value) {
    return 'Not set';
  }

  return `•••• ${value.slice(-4)}`;
}

export default function EmployeePaymentDetailsPage() {
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

  const totalPayout = (selectedPayroll?.salary || 0) + (selectedPayroll?.incentives || 0);

  const handleDownloadSlip = () => {
    if (!selectedPayroll) {
      return;
    }

    const blob = new Blob([buildSalarySlip(employee, selectedPayroll)], { type: 'text/plain;charset=utf-8' });
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
    setSaveMessage(`Payment details updated for ${formatMonthLabel(selectedPayroll.month)}.`);
  };

  return (
    <AdminShell role="employee">
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f8fbff_65%,#eef5ff_100%)] shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
          <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1.5fr)_320px] lg:px-8 lg:py-8">
            <div>
              <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-700">
                Payment Center
              </div>
              <h1 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-slate-950 lg:text-[32px]">Payment Details</h1>
              <p className="mt-3 max-w-2xl text-[13px] leading-6 text-slate-600 lg:text-[14px]">
                Review monthly payouts, transfer methods, and bank details in a cleaner layout with clearer figures and stronger status visibility.
              </p>

              <div className="mt-4 overflow-x-auto">
                <table className="min-w-85 text-[15px] border-separate border-spacing-y-2">
                  <tbody>
                    <tr>
                      <td className="font-medium text-slate-500 pr-4">Account Holder</td>
                      <td className="font-semibold text-slate-900">{employee.name}</td>
                    </tr>
                    <tr>
                      <td className="font-medium text-slate-500 pr-4">Employee Code</td>
                      <td className="font-semibold text-slate-900">{employee.employeeCode}</td>
                    </tr>
                    <tr>
                      <td className="font-medium text-slate-500 pr-4">Designation</td>
                      <td className="font-semibold text-slate-900">{employee.designation}</td>
                    </tr>
                    <tr>
                      <td className="font-medium text-slate-500 pr-4">Branch</td>
                      <td className="font-semibold text-slate-900">{employee.branch}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-3xl bg-[linear-gradient(135deg,#1d4ed8_0%,#2563eb_45%,#3b82f6_100%)] p-6 text-white shadow-[0_18px_40px_rgba(37,99,235,0.30)]">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-blue-100">Selected Month</div>
              <div className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{selectedPayroll ? formatMonthLabel(selectedPayroll.month) : 'No record'}</div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <MetricStrip label="Payment Mode" value={selectedPayroll?.paymentType === 'cash' ? 'Cash' : 'Bank Transfer'} />
                <MetricStrip label="Payout" value={formatCurrency(totalPayout)} />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)] lg:px-8">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">Monthly Payment Summary</h2>
                <p className="mt-1 text-[13px] text-slate-600">Choose a payroll month to review your payout breakdown and transfer details.</p>
              </div>
              <div className="flex gap-2 items-center mt-2 lg:mt-0">
                <select
                  value={selectedMonth}
                  onChange={(event) => setSelectedMonth(event.target.value)}
                  className="min-w-45 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-[13px] font-medium text-slate-800 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                >
                  {records.map((record) => (
                    <option key={record.month} value={record.month}>{formatMonthLabel(record.month)}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="rounded-lg bg-blue-600 px-3 py-2 text-[12px] font-semibold text-white transition hover:bg-blue-700"
                  disabled={records.length < 2 || !selectedMonth}
                  onClick={() => {
                    const idx = records.findIndex(r => r.month === selectedMonth);
                    if (idx > 0) {
                      const prev = records[idx - 1];
                      setBankForm(prev.bankDetails || { bankName: '', accountNumber: '', ifsc: '' });
                    }
                  }}
                >
                  Copy Previous Month
                </button>
              </div>
            </div>

          {selectedPayroll ? null : (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">No payment records are available for this employee.</div>
          )}
        </section>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
          <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)] lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">Bank And Payout Details</h2>
                <p className="mt-2 max-w-xl text-[13px] leading-6 text-slate-600">This section shows the destination of the salary payment for the currently selected month.</p>
              </div>
              <button
                type="button"
                onClick={handleDownloadSlip}
                disabled={!selectedPayroll}
                className="rounded-xl bg-blue-600 px-5 py-3 text-[12px] font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Download Salary Slip
              </button>
            </div>

            {selectedPayroll?.paymentType === 'cash' ? (
              <div className="mt-6 rounded-3xl border border-amber-200 bg-[linear-gradient(135deg,#fffbeb_0%,#fff7d6_100%)] p-6">
                <div className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-800">
                  Cash Payment
                </div>
                <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-amber-950">No bank account was used for this month.</h3>
                <p className="mt-3 text-[13px] leading-6 text-amber-900/80">
                  Salary for {formatMonthLabel(selectedPayroll.month)} was marked as cash. Choose another month to inspect transfer details.
                </p>
              </div>
            ) : selectedPayroll ? (
              <div className="mt-4 space-y-4">
                <div className="overflow-x-auto">
                  <table className="min-w-85 text-[15px] border-separate border-spacing-y-2">
                    <tbody>
                      <tr>
                        <td className="font-medium text-slate-500 pr-4">Account Holder</td>
                        <td className="font-semibold text-slate-900">{employee?.name || 'Not set'}</td>
                      </tr>
                      <tr>
                        <td className="font-medium text-slate-500 pr-4">Bank Name</td>
                        <td className="font-semibold text-slate-900">{bankForm.bankName || 'Not set'}</td>
                      </tr>
                      <tr>
                        <td className="font-medium text-slate-500 pr-4">Account Number</td>
                        <td className="font-semibold text-slate-900">{maskAccountNumber(bankForm.accountNumber)}</td>
                      </tr>
                      <tr>
                        <td className="font-medium text-slate-500 pr-4">IFSC Code</td>
                        <td className="font-semibold text-slate-900">{bankForm.ifsc || 'Not set'}</td>
                      </tr>
                      <tr>
                        <td className="font-medium text-slate-500 pr-4">Transfer Method</td>
                        <td className="font-semibold text-slate-900">Bank Transfer</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* <div className="flex justify-end">
                  <Link href="/employee/update-bank-details">
                    <button type="button" className="rounded-xl bg-blue-600 px-5 py-3 text-[12px] font-semibold text-white transition hover:bg-blue-700">
                      Update Bank Details
                    </button>
                  </Link>
                </div> */}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 text-sm text-slate-600">Select a payroll month to inspect bank details.</div>
            )}
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white px-6 py-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)] lg:px-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">Recent Payment Activity</h2>
                <p className="mt-2 text-[13px] leading-6 text-slate-600">Review recent payouts month by month and switch the selected statement directly from this panel.</p>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                {records.length} Months
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {records.map((record) => {
                const payout = (record.salary || 0) + (record.incentives || 0);
                const isSelected = record.month === selectedMonth;
                return (
                  <button
                    key={record.month}
                    type="button"
                    onClick={() => setSelectedMonth(record.month)}
                    className={`w-full rounded-3xl border px-5 py-5 text-left transition ${
                      isSelected
                        ? 'border-blue-200 bg-[linear-gradient(135deg,#f8fbff_0%,#eff6ff_100%)] shadow-[0_14px_30px_rgba(37,99,235,0.08)]'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-lg font-semibold tracking-[-0.02em] text-slate-950">{formatMonthCompact(record.month)}</div>
                        <div className="mt-1 text-sm text-slate-500">{record.paymentType === 'cash' ? 'Cash payout' : 'Bank transfer'}</div>
                        {record.bankDetails && (
                          <div className="mt-2 text-xs text-slate-700 flex flex-wrap gap-4">
                            <span><span className="font-medium text-slate-500">Bank:</span> <span className="font-semibold text-slate-900">{record.bankDetails.bankName}</span></span>
                            <span><span className="font-medium text-slate-500">Account:</span> <span className="font-semibold text-slate-900">{record.bankDetails.accountNumber ? `•••• ${record.bankDetails.accountNumber.slice(-4)}` : 'Not set'}</span></span>
                            <span><span className="font-medium text-slate-500">IFSC:</span> <span className="font-semibold text-slate-900">{record.bankDetails.ifsc}</span></span>
                          </div>
                        )}
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${record.paymentType === 'cash' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'}`}>
                        {record.paymentType === 'cash' ? 'Cash' : 'Processed'}
                      </span>
                    </div>

                    {/* MiniMetrics for Salary, Incentive, Total removed as per request */}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}

function HeroChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 shadow-sm">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</span>
      <span className="ml-2 text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function MetricStrip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/12 px-4 py-3 ring-1 ring-white/15 backdrop-blur-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

function SummaryCard({ label, value, tone }: { label: string; value: string; tone: 'blue' | 'slate' | 'emerald' | 'amber' }) {
  const tones = {
    blue: 'border-blue-100 bg-[linear-gradient(135deg,#f8fbff_0%,#eef5ff_100%)]',
    slate: 'border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)]',
    emerald: 'border-emerald-100 bg-[linear-gradient(135deg,#f3fcf7_0%,#ecfdf5_100%)]',
    amber: 'border-amber-100 bg-[linear-gradient(135deg,#fffaf0_0%,#fffbeb_100%)]',
  };

  return (
    <div className={`rounded-[22px] border px-5 py-5 shadow-sm ${tones[tone]}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-950">{value}</div>
    </div>
  );
}

function DetailCard({ label, value, accent }: { label: string; value: string; accent: 'blue' | 'slate' | 'emerald' | 'amber' }) {
  const accents = {
    blue: 'border-blue-100 bg-blue-50/70',
    slate: 'border-slate-200 bg-slate-50',
    emerald: 'border-emerald-100 bg-emerald-50/70',
    amber: 'border-amber-100 bg-amber-50/70',
  };

  return (
    <div className={`rounded-[22px] border px-5 py-5 ${accents[accent]}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-3 text-lg font-semibold text-slate-950">{value}</div>
    </div>
  );
}

function MiniMetric({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className={`mt-2 text-base ${strong ? 'font-semibold text-slate-950' : 'font-medium text-slate-700'}`}>{value}</div>
    </div>
  );
}

function PaymentInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
      />
    </div>
  );
}
