import { redirect } from 'next/navigation';

export default function EmployeeDetailRedirectPage() {
  redirect('/employee/dashboard');
  return null;
}