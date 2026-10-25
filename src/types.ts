export type SalaryBracket = '20 to 30 k' | '31 to 40k' | '41k plus';

export interface EmployeeRegistration {
  name: string;
  employeeId: string;
  age: number;
  salaryBracket: SalaryBracket;
  submittedAt: string;
}

export interface FormErrors {
  name?: string;
  employeeId?: string;
  age?: string;
  salaryBracket?: string;
}
