import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiResponse, UploadPayrollResponse } from '../interfaces/api';
import { DataWithStatus } from '@interfaces/domain';

@Injectable({ providedIn: 'root' })
export class PayrollService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api.url}payroll`;

  public uploadState = signal<DataWithStatus<UploadPayrollResponse>>(DataWithStatus.idle());

  uploadPayroll(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    this.uploadState.set(DataWithStatus.loading(this.uploadState().data));

    this.http.post<ApiResponse<UploadPayrollResponse>>(this.apiUrl, formData).subscribe({
      next: (res) => {
        if (res.success) {
          this.uploadState.set(DataWithStatus.success(res.data));
        } else {
          this.uploadState.set(DataWithStatus.error(res.message));
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        const apiError = err.error as ApiResponse<null>;
        console.log({ apiError });
        this.uploadState.set(DataWithStatus.error(apiError?.message || 'Error de conexión'));
      },
    });
  }

  clearState() {
    this.uploadState.set(DataWithStatus.idle());
  }
}
