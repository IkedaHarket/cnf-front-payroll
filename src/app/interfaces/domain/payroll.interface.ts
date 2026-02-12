export interface Payroll {
  id: string;
  internalCode: string;
  sentDate: string;
  agreement: string;
  amount: number;
  status: 'sent' | 'processed' | 'error';
}
