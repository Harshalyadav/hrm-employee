import { redirect } from 'next/navigation';

export default function EmployeesRedirectPage() {
  redirect('/employee/dashboard');
  return null;
}