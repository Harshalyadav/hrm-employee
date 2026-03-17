import { redirect } from 'next/navigation';

export default function AddEmployeeRedirectPage() {
  redirect('/employee/dashboard');
  return null;
}