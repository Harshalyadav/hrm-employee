import employeesSeed from '../../mock-data/employees.json';

export type EmployeeRecord = {
  id: string;
  name: string;
  email: string;
  employeeCode: string;
  dob: string;
  doj: string;
  branch: string;
  designation: string;
  active: boolean;
  phone?: string;
  gender?: string;
  bloodGroup?: string;
  maritalStatus?: string;
  emergencyContact?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  role?: string;
  salary?: string;
  paymentMode?: string;
};

const STORAGE_KEY = 'hrms-employees';

const seedEmployees: EmployeeRecord[] = (employeesSeed as EmployeeRecord[]).map((employee, index) => ({
  ...employee,
  phone: employee.phone ?? `+91 9000${index + 1}2345`,
  gender: employee.gender ?? (index % 2 === 0 ? 'Male' : 'Female'),
  bloodGroup: employee.bloodGroup ?? ['A+', 'B+', 'O+', 'AB+'][index % 4],
  maritalStatus: employee.maritalStatus ?? (index % 2 === 0 ? 'Married' : 'Single'),
  emergencyContact: employee.emergencyContact ?? `+91 9800${index + 1}6789`,
  address: employee.address ?? `${120 + index} Main Street`,
  city: employee.city ?? employee.branch,
  state: employee.state ?? 'California',
  country: employee.country ?? 'USA',
  pincode: employee.pincode ?? `90${index + 1}10`,
  role: employee.role ?? (index === 0 ? 'HR Manager' : 'Admin'),
  salary: employee.salary ?? `${4500 + index * 700}`,
  paymentMode: employee.paymentMode ?? 'Bank',
}));

function cloneSeedEmployees() {
  return seedEmployees.map((employee) => ({ ...employee }));
}

export function getEmployees(): EmployeeRecord[] {
  if (typeof window === 'undefined') {
    return cloneSeedEmployees();
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const seeded = cloneSeedEmployees();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  try {
    return JSON.parse(stored) as EmployeeRecord[];
  } catch {
    const seeded = cloneSeedEmployees();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

export function saveEmployees(employees: EmployeeRecord[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
}

export function getEmployeeById(id: string) {
  return getEmployees().find((employee) => employee.id === id) ?? null;
}

export function upsertEmployee(employee: EmployeeRecord) {
  const employees = getEmployees();
  const existingIndex = employees.findIndex((current) => current.id === employee.id);

  if (existingIndex >= 0) {
    employees[existingIndex] = employee;
  } else {
    employees.unshift(employee);
  }

  saveEmployees(employees);
  return employee;
}

export function removeEmployee(id: string) {
  const employees = getEmployees().filter((employee) => employee.id !== id);
  saveEmployees(employees);
}
