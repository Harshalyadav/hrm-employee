import { redirect } from 'next/navigation';

export default function LoginRedirectPage() {
  redirect('/employee/login');
  return null;
}