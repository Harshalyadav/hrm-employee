"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminShell from '../../../../components/AdminShell';
import { EmployeeRecord, getEmployeeById, upsertEmployee } from '../../../lib/employeeStore';

const initialState: EmployeeRecord = {
  id: '',
  name: '',
  email: '',
  employeeCode: '',
  dob: '',
  doj: '',
  branch: '',
  designation: '',
  active: true,
  phone: '',
  gender: '',
  bloodGroup: '',
  maritalStatus: '',
  emergencyContact: '',
  address: '',
  city: '',
  state: '',
  country: '',
  pincode: '',
  role: '',
  salary: '',
  paymentMode: 'Bank',
};

const sectionTabs = [
  'Personal Details',
  'Contact Details',
  'Permanent Address',
  'Employment Details',
  'Documents',
];

export default function AddEmployeePage() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get('id');

  useEffect(() => {
    if (id) {
      setEditMode(true);
      const employee = getEmployeeById(id);
      if (employee) {
        setForm(employee);
      }
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const employeeId = id ?? `emp-${Date.now()}`;
      const savedEmployee: EmployeeRecord = {
        ...form,
        id: employeeId,
        employeeCode: form.employeeCode || `EMP-${String(Date.now()).slice(-6)}`,
      };
      upsertEmployee(savedEmployee);
      router.push(`/employees/${savedEmployee.id}`);
    }, 800);
  };

  return (
    <AdminShell>
      <section className="rounded-[28px] bg-white/88 shadow-sm ring-1 ring-white/70">
        <header className="flex items-center justify-between border-b border-slate-200/70 px-5 py-5 md:px-7">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">{editMode ? 'Edit Employee' : 'Add Employee'}</h1>
            <p className="mt-1 text-sm text-slate-500">Create and manage employee records in a structured format.</p>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-500">×</button>
        </header>

        <div className="border-b border-slate-200/70 px-5 md:px-7">
          <div className="flex flex-wrap gap-6 overflow-x-auto py-4 text-sm font-medium text-slate-500">
            {sectionTabs.map((tab, index) => (
              <div key={tab} className={`border-b-2 pb-3 ${index === 0 ? 'border-blue-500 text-blue-600' : 'border-transparent'}`}>
                {tab}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 px-5 py-6 md:px-7">
          <section>
            <h2 className="mb-5 text-2xl font-bold text-slate-800">Personal Details</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Employee Name*" name="name" value={form.name} onChange={handleChange} placeholder="Enter employee name" />
              <SelectField label="Gender" name="gender" value={form.gender ?? ''} onChange={handleChange} options={['Male', 'Female', 'Other']} />
              <Field label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} />
              <SelectField label="Blood Group" name="bloodGroup" value={form.bloodGroup ?? ''} onChange={handleChange} options={['A+', 'B+', 'O+', 'AB+']} />
              <SelectField label="Marital Status" name="maritalStatus" value={form.maritalStatus ?? ''} onChange={handleChange} options={['Single', 'Married', 'Divorced']} />
              <Field label="Unique Worker ID" name="employeeCode" value={form.employeeCode} onChange={handleChange} placeholder="Enter worker ID" />
            </div>
          </section>

          <section>
            <h2 className="mb-5 text-2xl font-bold text-slate-800">Contact Details</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Phone" name="phone" value={form.phone ?? ''} onChange={handleChange} placeholder="+91 0000000000" />
              <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="name@company.com" />
              <Field label="Emergency Contact" name="emergencyContact" value={form.emergencyContact ?? ''} onChange={handleChange} placeholder="Emergency contact" />
            </div>
          </section>

          <section>
            <h2 className="mb-5 text-2xl font-bold text-slate-800">Permanent Address</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <TextAreaField label="Address Line" name="address" value={form.address ?? ''} onChange={handleChange} placeholder="Enter address" />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="City" name="city" value={form.city ?? ''} onChange={handleChange} placeholder="Enter city" />
                <Field label="State" name="state" value={form.state ?? ''} onChange={handleChange} placeholder="Enter state" />
                <Field label="Country" name="country" value={form.country ?? ''} onChange={handleChange} placeholder="Enter country" />
                <Field label="Pincode" name="pincode" value={form.pincode ?? ''} onChange={handleChange} placeholder="Enter pincode" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-5 text-2xl font-bold text-slate-800">Employment Details</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <SelectField label="Select Role" name="role" value={form.role ?? ''} onChange={handleChange} options={['HR Manager', 'Admin', 'Software Engineer', 'Product Manager', 'QA Analyst']} />
              <SelectField label="Branch" name="branch" value={form.branch} onChange={handleChange} options={['New York', 'San Francisco', 'London', 'Dubai']} />
              <Field label="Date of Joining" name="doj" type="date" value={form.doj} onChange={handleChange} />
              <Field label="Designation" name="designation" value={form.designation} onChange={handleChange} placeholder="Enter designation" />
              <Field label="Basic Salary" name="salary" value={form.salary ?? ''} onChange={handleChange} placeholder="Enter salary" />
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-600">Payment Mode</label>
                <div className="grid grid-cols-3 rounded-2xl bg-slate-100 p-1 text-sm font-semibold text-slate-500">
                  {['Cash', 'Cheque', 'Bank'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, paymentMode: mode }))}
                      className={`rounded-xl px-4 py-2 transition ${form.paymentMode === mode ? 'bg-[linear-gradient(180deg,#1695ff,#2167ff)] text-white shadow-md' : ''}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 pt-8">
                <input id="active" name="active" type="checkbox" checked={form.active} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 text-blue-600" />
                <label htmlFor="active" className="text-sm font-semibold text-slate-600">Mark employee as active</label>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200/70 pt-6">
            <button type="button" onClick={() => router.push('/employees')} className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-200">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="rounded-2xl bg-[linear-gradient(180deg,#1695ff,#2167ff)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200/60 transition hover:scale-[1.01] disabled:opacity-70">
              {loading ? (editMode ? 'Saving...' : 'Creating...') : (editMode ? 'Save Changes' : 'Create Employee')}
            </button>
          </div>
        </form>
      </section>
    </AdminShell>
  );
}

interface BaseFieldProps {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

function Field({ label, name, value, placeholder, onChange, type = 'text' }: BaseFieldProps & { type?: string }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-slate-600">{label}</label>
      <input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none ring-2 ring-transparent transition focus:border-blue-300 focus:ring-blue-100" />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }: BaseFieldProps & { options: string[] }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-slate-600">{label}</label>
      <select id={name} name={name} value={value} onChange={onChange} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none ring-2 ring-transparent transition focus:border-blue-300 focus:ring-blue-100">
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

function TextAreaField({ label, name, value, placeholder, onChange }: BaseFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-slate-600">{label}</label>
      <textarea id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} rows={4} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none ring-2 ring-transparent transition focus:border-blue-300 focus:ring-blue-100" />
    </div>
  );
}
