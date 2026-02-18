import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { environment } from '../../environments/environment';
import { ApiResponse, UploadPayrollResponse } from '../interfaces/api';
import { catchError, map, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PayrollService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api.url}payroll`;

  private fileToUpload = signal<File | null>(null);

  public uploadResource = rxResource({
    params: () => this.fileToUpload() ?? undefined,
    stream: ({ params: file }) => {
      const formData = new FormData();
      formData.append('file', file);

      return this.http.post<ApiResponse<UploadPayrollResponse>>(this.apiUrl, formData).pipe(
        map((res) => {
          if (!res.success) throw new Error(res.message);
          return res.data;
        }),
        catchError((err: HttpErrorResponse) => {
          const apiError = err.error as ApiResponse<null>;
          const errorMessage = apiError?.message || 'Error con el servidor';
          return throwError(() => new Error(errorMessage));
        }),
      );
    },
  });

  uploadPayroll(file: File) {
    this.fileToUpload.set(file);
  }

  clearState() {
    this.fileToUpload.set(null);
  }
}
