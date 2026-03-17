"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminShell from '../../../components/AdminShell';
import { EmployeeRecord, getEmployees, removeEmployee } from '../../lib/employeeStore';

type StatusFilter = 'all' | 'active' | 'inactive';
type SortKey = 'name-asc' | 'name-desc' | 'date-newest' | 'date-oldest' | 'role-asc';

function SearchIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="M13 13l4 4" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20h9" strokeLinecap="round" />
      <path d="M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4 12.5-12.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 6h18" strokeLinecap="round" />
      <path d="M8 6V4h8v2" strokeLinecap="round" />
      <path d="M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('');
  const [designation, setDesignation] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('date-newest');
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const itemsPerPage = 5;

  useEffect(() => {
    setEmployees(getEmployees());
  }, []);

  const branches = useMemo(() => Array.from(new Set(employees.map((employee) => employee.branch))), [employees]);
  const designations = useMemo(() => Array.from(new Set(employees.map((employee) => employee.designation))), [employees]);

  const filtered = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch = !search || [employee.name, employee.email, employee.employeeCode, employee.phone ?? '', employee.role ?? '']
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesBranch = !branch || employee.branch === branch;
      const matchesDesignation = !designation || employee.designation === designation;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && employee.active) ||
        (statusFilter === 'inactive' && !employee.active);

      return matchesSearch && matchesBranch && matchesDesignation && matchesStatus;
    });
  }, [branch, designation, employees, search, statusFilter]);

  const sortedEmployees = useMemo(() => {
    const records = [...filtered];

    records.sort((left, right) => {
      switch (sortKey) {
        case 'name-asc':
          return left.name.localeCompare(right.name);
        case 'name-desc':
          return right.name.localeCompare(left.name);
        case 'date-oldest':
          return new Date(left.doj).getTime() - new Date(right.doj).getTime();
        case 'role-asc':
          return (left.role ?? left.designation).localeCompare(right.role ?? right.designation);
        case 'date-newest':
        default:
          return new Date(right.doj).getTime() - new Date(left.doj).getTime();
      }
    });

    return records;
  }, [filtered, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedEmployees.length / itemsPerPage));

  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, sortedEmployees]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, branch, designation, statusFilter, sortKey]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((employee) => employee.active).length;
  const inactiveEmployees = totalEmployees - activeEmployees;

  const handleView = (id: string) => router.push(`/employees/${id}`);
  const handleEdit = (id: string) => router.push(`/employees/add?id=${id}`);
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      removeEmployee(id);
      setEmployees(getEmployees());
    }
  };

  const pageStart = sortedEmployees.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const pageEnd = Math.min(currentPage * itemsPerPage, sortedEmployees.length);

  return (
    <AdminShell>
      <section className="space-y-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">Employees</h1>
            <p className="mt-2 text-sm text-slate-500">Stay informed about employees</p>
          </div>
          <div className="flex items-center gap-3 self-start rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200/70">
            <div className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-500">November 2025</div>
            <button
              className="grid h-11 w-11 place-items-center rounded-2xl bg-[linear-gradient(180deg,#1695ff,#2167ff)] text-xl text-white shadow-lg shadow-blue-300/40 transition hover:scale-[1.02]"
              onClick={() => router.push('/employees/add')}
              aria-label="Create employee"
            >
              +
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200/60">
            <div className="text-[2.25rem] font-extrabold leading-none text-blue-500">{String(totalEmployees).padStart(2, '0')}</div>
            <div className="mt-2 text-sm font-semibold text-slate-700">Employees</div>
          </div>
          <div className="rounded-[24px] bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200/60">
            <div className="text-[2.25rem] font-extrabold leading-none text-emerald-500">{String(activeEmployees).padStart(2, '0')}</div>
            <div className="mt-2 text-sm font-semibold text-slate-700">Active</div>
          </div>
          <div className="rounded-[24px] bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200/60">
            <div className="text-[2.25rem] font-extrabold leading-none text-fuchsia-500">{String(inactiveEmployees).padStart(2, '0')}</div>
            <div className="mt-2 text-sm font-semibold text-slate-700">Inactive</div>
          </div>
        </div>

        <div className="rounded-[28px] bg-white/90 p-4 shadow-sm ring-1 ring-white/70 md:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              {(['active', 'inactive', 'all'] as StatusFilter[]).map((item) => {
                const label = item === 'all' ? 'All' : item === 'active' ? 'Active' : 'Inactive';
                const selected = statusFilter === item;
                return (
                  <button
                    key={item}
                    className={`rounded-2xl px-5 py-2 text-sm font-semibold transition ${selected ? 'bg-[linear-gradient(180deg,#1695ff,#2167ff)] text-white shadow-lg shadow-blue-200/60' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    onClick={() => setStatusFilter(item)}
                  >
                    {label}
                  </button>
                );
              })}
              <div className="flex min-w-[240px] items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-slate-400 ring-1 ring-slate-200/70">
                <SearchIcon />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search employees"
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={sortKey}
                onChange={(event) => setSortKey(event.target.value as SortKey)}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-500 shadow-sm ring-1 ring-slate-200/70 outline-none transition hover:text-blue-600"
              >
                <option value="date-newest">Sort: Newest</option>
                <option value="date-oldest">Sort: Oldest</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
                <option value="role-asc">Role</option>
              </select>
              <button
                className="rounded-2xl bg-[linear-gradient(180deg,#1695ff,#2167ff)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200/60 transition hover:scale-[1.01]"
                onClick={() => router.push('/employees/add')}
              >
                Create New Employee
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Filters:</span>
            <select
              value={branch}
              onChange={(event) => setBranch(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none"
            >
              <option value="">All branches</option>
              {branches.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <select
              value={designation}
              onChange={(event) => setDesignation(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none"
            >
              <option value="">All roles</option>
              {designations.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="mt-5 overflow-hidden rounded-[22px] border border-slate-200/70">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white text-left">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Emp Code</th>
                    <th className="px-5 py-4">Employee</th>
                    <th className="px-5 py-4">Phone</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Created</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-500">
                        No employees match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedEmployees.map((employee) => (
                      <tr key={employee.id} className="border-t border-slate-100 text-sm text-slate-700">
                        <td className="px-5 py-5 font-bold text-blue-600">{employee.employeeCode}</td>
                        <td className="px-5 py-5">
                          <div className="font-semibold text-slate-800">{employee.name}</div>
                          <div className="mt-1 text-slate-500">{employee.email}</div>
                        </td>
                        <td className="px-5 py-5">{employee.phone}</td>
                        <td className="px-5 py-5">
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${employee.active ? 'border-fuchsia-300 bg-fuchsia-50 text-fuchsia-600' : 'border-slate-200 bg-slate-100 text-slate-500'}`}>
                            {employee.role ?? employee.designation}
                          </span>
                        </td>
                        <td className="px-5 py-5 text-slate-500">{employee.doj}</td>
                        <td className="px-5 py-5">
                          <div className="flex justify-end gap-2">
                            <button className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-500 transition hover:bg-indigo-100" onClick={() => handleView(employee.id)} aria-label="View employee">
                              <EyeIcon />
                            </button>
                            <button className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-500 transition hover:bg-amber-100" onClick={() => handleEdit(employee.id)} aria-label="Edit employee">
                              <PencilIcon />
                            </button>
                            <button className="grid h-9 w-9 place-items-center rounded-xl bg-rose-50 text-rose-500 transition hover:bg-rose-100" onClick={() => handleDelete(employee.id)} aria-label="Delete employee">
                              <TrashIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <div>
              Showing {pageStart} to {pageEnd} of {sortedEmployees.length} entries
            </div>
            <div className="flex items-center gap-2 self-end">
              <button
                className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-400 transition hover:bg-slate-200 disabled:opacity-50"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  className={`grid h-9 w-9 place-items-center rounded-xl text-sm font-semibold transition ${page === currentPage ? 'bg-[linear-gradient(180deg,#1695ff,#2167ff)] text-white shadow-md shadow-blue-200/60' : 'bg-white text-slate-500 ring-1 ring-slate-200/70 hover:text-blue-600'}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-400 transition hover:bg-slate-200 disabled:opacity-50"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
