"use client";
import React from 'react';

export default function EmployeeDashboardPage() {
  const [employee, setEmployee] = React.useState<any | null>(null);
  const [payroll, setPayroll] = React.useState<any[] | null>(null);
  const [selectedMonth, setSelectedMonth] = React.useState('2026-03');

  React.useEffect(() => {
    fetch('/mock-data/employees.json')
      .then((res) => res.json())
      .then((data) => setEmployee(data[0])); // Mock: first employee
    fetch('/mock-data/payroll.json')
      .then((res) => res.json())
      .then(setPayroll);
  }, []);

  const isLoading = !employee || !payroll;
  const payrollData = payroll?.filter((p) => p.employeeId === employee?.id && p.month === selectedMonth)[0];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-2xl p-8 bg-white dark:bg-gray-800 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Employee Dashboard</h2>
        {/* Employee Information Card */}
        {isLoading ? (
          <div className="mb-6 animate-pulse h-32 bg-blue-100 dark:bg-blue-900 rounded" />
        ) : (
          <div className="mb-6">
            <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded shadow">
              <div className="font-semibold">Employee Information</div>
              <div>Code: {employee.employeeCode}</div>
              <div>Date of Joining: {employee.doj}</div>
              <div>Date of Birth: {employee.dob}</div>
              <div>Branch: {employee.branch}</div>
              <div>Designation: {employee.designation}</div>
            </div>
          </div>
        )}
        {/* Payroll Information */}
        {isLoading ? (
          <div className="mb-6 animate-pulse h-24 bg-green-100 dark:bg-green-900 rounded" />
        ) : payrollData && (
          <div className="mb-6">
            <div className="bg-green-100 dark:bg-green-900 p-4 rounded shadow">
              <div className="font-semibold">Payroll Information</div>
              <div>Incentives: ${payrollData.incentives}</div>
              <div>Monthly Salary: ${payrollData.salary}</div>
              <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">Download Salary Slip (PDF)</button>
            </div>
          </div>
        )}
        {/* Payment Details */}
        {isLoading ? (
          <div className="mb-6 animate-pulse h-20 bg-yellow-100 dark:bg-yellow-900 rounded" />
        ) : payrollData && (
          <div className="mb-6">
            <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded shadow">
              <div className="font-semibold">Payment Details</div>
              {payrollData.paymentType === 'cash' ? (
                <div>Paid in Cash</div>
              ) : (
                <div>
                  <div>Bank Name: {payrollData.bankDetails?.bankName}</div>
                  <div>Account Number: {payrollData.bankDetails?.accountNumber}</div>
                  <div>IFSC: {payrollData.bankDetails?.ifsc}</div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Month Dropdown */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Select Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          >
            <option value="2026-03">March 2026</option>
            <option value="2026-02">February 2026</option>
            <option value="2026-01">January 2026</option>
          </select>
        </div>
      </div>
    </div>
  );
}
