export interface Payroll {
  id: string;
  internalCode: string;
  sentDate: Date;
  agreement: number;
  amount: number;
  status: 'sent' | 'processed' | 'error';
}
