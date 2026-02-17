export interface UploadPayrollResponse {
  id: string;
  content: string;
  createdAt: Date;
  paymentDate: Date;
  templateCode: number;
  totalAmount: number;
  recordCount: number;
  agreementNumber: number;
  fileName: string;
  internalCode: string;
}
