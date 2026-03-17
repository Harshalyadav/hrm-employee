import { EmployeeRecord, getEmployees } from './employeeStore';

const SESSION_KEY = 'hrms-employee-session';
const PENDING_EMAIL_KEY = 'hrms-employee-pending-email';

export const MOCK_OTP_CODE = '123456';

export function findEmployeeByEmail(email: string) {
  if (!email) {
    return null;
  }

  return getEmployees().find((employee) => employee.email.toLowerCase() === email.trim().toLowerCase()) ?? null;
}

export function setPendingEmployeeEmail(email: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(PENDING_EMAIL_KEY, email.trim().toLowerCase());
}

export function getPendingEmployeeEmail() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(PENDING_EMAIL_KEY) ?? '';
}

export function clearPendingEmployeeEmail() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(PENDING_EMAIL_KEY);
}

export function setAuthenticatedEmployee(employee: EmployeeRecord) {
  if (typeof window === 'undefined') {
    return;
  }

  const session = {
    id: employee.id,
    email: employee.email,
    name: employee.name,
    role: employee.designation || employee.role || 'Employee',
  };

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.localStorage.setItem('userEmail', session.email);
  window.localStorage.setItem('userName', session.name);
  window.localStorage.setItem('userRole', session.role);
}

export function getAuthenticatedEmployee() {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as { id: string; email: string; name: string; role: string };
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function clearAuthenticatedEmployee() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem('userEmail');
  window.localStorage.removeItem('userName');
  window.localStorage.removeItem('userRole');
  clearPendingEmployeeEmail();
}
