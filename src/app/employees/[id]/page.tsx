"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '../../../../components/AdminShell';
import { EmployeeRecord, getEmployeeById, removeEmployee } from '../../../lib/employeeStore';

const detailTabs = [
  'Personal Details',
  'Contact Details',
  'Permanent Address',
  'Employment Details',
  'Documents',
];

export default function EmployeeDetailsPage({ params }: { params: { id: string } }) {
  const [employee, setEmployee] = useState<EmployeeRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentEmployee = getEmployeeById(params.id);
    setEmployee(currentEmployee);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <AdminShell>
        <div className="rounded-[28px] bg-white/90 p-10 text-center text-lg text-slate-500 shadow-sm ring-1 ring-white/70">Loading employee details...</div>
      </AdminShell>
    );
  }

  if (!employee) {
    return (
      <AdminShell>
        <div className="rounded-[28px] bg-white/90 p-10 text-center text-lg text-rose-500 shadow-sm ring-1 ring-white/70">Employee not found.</div>
      </AdminShell>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Delete this employee record?')) {
      removeEmployee(employee.id);
      router.push('/employees');
    }
  };

  return (
    <AdminShell>
      <section className="rounded-[28px] bg-white/88 shadow-sm ring-1 ring-white/70">
        <header className="flex flex-col gap-4 border-b border-slate-200/70 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-7">
          <div>
            <div className="text-3xl font-extrabold tracking-tight text-slate-800">{employee.name}</div>
            <div className="mt-2 text-sm text-slate-500">Employee overview and personal records</div>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600" onClick={() => router.push(`/employees/add?id=${employee.id}`)}>Edit</button>
            <button className="rounded-xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-500" onClick={handleDelete}>Delete</button>
          </div>
        </header>

        <div className="border-b border-slate-200/70 px-5 md:px-7">
          <div className="flex flex-wrap gap-6 overflow-x-auto py-4 text-sm font-medium text-slate-500">
            {detailTabs.map((tab, index) => (
              <div key={tab} className={`border-b-2 pb-3 ${index === 0 ? 'border-blue-500 text-blue-600' : 'border-transparent'}`}>
                {tab}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8 px-5 py-6 md:px-7">
          <DetailSection title="Personal Details">
            <DetailGrid>
              <DetailItem label="Unique Worker ID" value={employee.employeeCode} accent />
              <DetailItem label="Marital Status" value={employee.maritalStatus ?? 'Single'} />
              <DetailItem label="Employee Name" value={employee.name} />
              <DetailItem label="Date Of Joining" value={employee.doj} />
              <DetailItem label="Gender" value={employee.gender ?? 'Not set'} />
              <DetailItem label="Blood Group" value={employee.bloodGroup ?? 'Not set'} />
            </DetailGrid>
          </DetailSection>

          <DetailSection title="Contact Details">
            <DetailGrid>
              <DetailItem label="Email" value={employee.email} />
              <DetailItem label="Phone Number" value={employee.phone ?? 'Not set'} />
              <DetailItem label="Emergency Contact" value={employee.emergencyContact ?? 'Not set'} />
            </DetailGrid>
          </DetailSection>

          <DetailSection title="Permanent Address">
            <DetailGrid>
              <DetailItem label="Address Line" value={employee.address ?? 'Not set'} />
              <DetailItem label="State" value={employee.state ?? 'Not set'} />
              <DetailItem label="Country" value={employee.country ?? 'Not set'} />
              <DetailItem label="Pincode" value={employee.pincode ?? 'Not set'} />
              <DetailItem label="City" value={employee.city ?? employee.branch} />
            </DetailGrid>
          </DetailSection>

          <DetailSection title="Employment Details">
            <DetailGrid>
              <DetailItem label="Branch" value={employee.branch} />
              <DetailItem label="Designation" value={employee.designation} />
              <DetailItem label="Role" value={employee.role ?? employee.designation} />
              <DetailItem label="Salary" value={employee.salary ? `$${employee.salary}` : 'Not set'} />
              <DetailItem label="Payment Mode" value={employee.paymentMode ?? 'Bank'} />
              <DetailItem label="Status" value={employee.active ? 'Active' : 'Inactive'} accent={employee.active} />
            </DetailGrid>
          </DetailSection>
        </div>
      </section>
    </AdminShell>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-5 text-2xl font-bold text-slate-800">{title}</h2>
      {children}
    </section>
  );
}

function DetailGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

function DetailItem({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-sm font-semibold text-slate-400">{label}</div>
      <div className={`mt-2 text-base font-semibold ${accent ? 'text-blue-600' : 'text-slate-800'}`}>{value}</div>
    </div>
  );
}
