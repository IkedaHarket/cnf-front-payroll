export interface Settlement {
  id: string;
  paymentDate: string;
  amount: number;
  status: 'A' | 'AP' | 'PC';
  details: string;
}
