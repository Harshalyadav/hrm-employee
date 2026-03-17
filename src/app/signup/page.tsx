import { redirect } from 'next/navigation';

export default function SignupRedirectPage() {
  redirect('/employee/login');
  return null;
}