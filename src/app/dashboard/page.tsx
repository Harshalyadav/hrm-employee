import { redirect } from 'next/navigation';

export default function DashboardRedirectPage() {
  redirect('/employee/dashboard');
  return null;
}