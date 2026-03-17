"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuthenticatedEmployee } from '../../../lib/employeeSession';
import { getEmployeeById } from '../../../lib/employeeStore';
import payrollSeed from '../../../../mock-data/payroll.json';
import PaymentInput from '../../../../components/PaymentInput';

function formatMonthLabel(value: string) {
  const [year, month] = value.split('-');
  return new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date(Number(year), Number(month) - 1));
}

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

type EmployeeRecord = {
  id: string;
  name: string;
  email: string;
  employeeCode: string;
  dob: string;
  doj: string;
  branch: string;
  designation: string;
  active: boolean;
};

export default function UpdateBankDetailsPage() {
  const router = useRouter();
  const [employee, setEmployee] = React.useState<EmployeeRecord | null>(null);
  const [records, setRecords] = React.useState<PayrollRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = React.useState<string>('');
  const [bankForm, setBankForm] = React.useState<BankDetails>({ bankName: '', accountNumber: '', ifsc: '' });
  const [saveMessage, setSaveMessage] = React.useState<string>('');

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
    const payroll = payrollSeed
      .filter((record) => record.employeeId === currentEmployee.id)
      .map((record) => ({
        ...record,
        paymentType: ((): 'bank' | 'cash' | undefined => {
          if (record.paymentType === 'bank' || record.paymentType === 'cash') return record.paymentType as 'bank' | 'cash';
          if (record.paymentType === 'Bank Transfer') return 'bank';
          if (record.paymentType === 'Cash') return 'cash';
          return undefined;
        })(),
      }));
    const sortedPayroll = [...payroll].sort((left, right) => right.month.localeCompare(left.month));
    setEmployee(currentEmployee);
    setRecords(sortedPayroll);
    setSelectedMonth(sortedPayroll[0]?.month ?? '');
  }, [router]);

  const selectedPayroll: PayrollRecord | null = React.useMemo(() => records.find((record) => record.month === selectedMonth) ?? null, [records, selectedMonth]);

  React.useEffect(() => {
    if (!employee || !selectedPayroll) return;
    setBankForm(selectedPayroll.bankDetails || { bankName: '', accountNumber: '', ifsc: '' });
    setSaveMessage('');
  }, [employee, selectedPayroll]);

  const handleSaveBankDetails = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaveMessage('Bank details updated!');
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#dcecff_0%,#edf4ff_55%,#f6f9ff_100%)] px-4 py-10 md:px-6">
      <div className="mx-auto w-full max-w-2xl rounded-4xl border border-white/70 bg-white shadow-[0_24px_70px_rgba(37,99,235,0.10)] p-8">
        <form onSubmit={handleSaveBankDetails} className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-slate-950">Update bank details</h3>
              <p className="mt-1 text-[13px] text-slate-600">Changes apply to {selectedPayroll ? formatMonthLabel(selectedPayroll.month) : ''} only.</p>
            </div>
            <Link href="/employee/payment-details" className="text-[12px] font-medium text-slate-600 transition hover:text-slate-900">
              Back to Payment Details
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <PaymentInput label="Bank Name" value={bankForm.bankName} onChange={(value) => setBankForm((current) => ({ ...current, bankName: value }))} />
            <PaymentInput label="Account Number" value={bankForm.accountNumber} onChange={(value) => setBankForm((current) => ({ ...current, accountNumber: value }))} />
            <div className="md:col-span-2">
              <PaymentInput label="IFSC Code" value={bankForm.ifsc} onChange={(value) => setBankForm((current) => ({ ...current, ifsc: value }))} />
            </div>
          </div>

          {saveMessage ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[12px] font-medium text-emerald-700">{saveMessage}</div> : null}

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="rounded-xl bg-blue-600 px-5 py-3 text-[12px] font-semibold text-white transition hover:bg-blue-700">
              Save Payment Details
            </button>
            <button type="button" className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-[12px] font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900">
              Download Current Slip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
