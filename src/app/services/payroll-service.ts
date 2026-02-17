import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { DataWithStatus, UploadPayrollResponse } from '@interfaces/api';
import { Payroll, Settlement } from '@interfaces/domain';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PayrollService {
  private readonly apiUrl = `${environment.api.url}payroll`;

  private readonly _http = inject(HttpClient);

  private readonly newPayroll = signal<DataWithStatus<Payroll | null>>({
    success: false,
    data: null,
    loading: true,
    error: false,
  });

  uploadPayroll(file: File): Observable<DataWithStatus<Payroll | null>> {
    const formData = new FormData();
    formData.append('file', file);

    this.newPayroll.update((state) => ({ ...state, loading: true, error: false }));

    return this._http.post<UploadPayrollResponse>(`${this.apiUrl}`, formData).pipe(
      map((res) => {
        this.newPayroll.set({
          loading: false,
          error: false,
          success: true,
          data: {
            id: res.id,
            internalCode: res.internalCode,
            agreement: res.agreementNumber,
            amount: res.totalAmount,
            sentDate: res.createdAt,
            status: 'sent',
          },
        });
        return this.newPayroll();
      }),
      catchError((err) => this._processError(err, this.newPayroll)),
    );
  }

  private _processError<T>(
    error: HttpErrorResponse,
    targetSignal: WritableSignal<DataWithStatus<T | null>>,
  ): Observable<DataWithStatus<T | null>> {
    const errorRes: DataWithStatus<null> = {
      success: false,
      data: null,
      message: error.error?.message || 'Error de conexión con el servicio de salud',
      loading: false,
      error: true,
    };

    targetSignal.set({ ...errorRes });

    return of(errorRes);
  }

  getSettlements(filters: any): Observable<DataWithStatus<Settlement[]>> {
    return this._http.post<DataWithStatus<Settlement[]>>(`${this.apiUrl}/get-settlements`, filters);
  }

  // Get history
  getHistory(): Observable<Payroll[]> {
    const mockData: Payroll[] = [
      {
        id: '1',
        internalCode: 'NOM-2026-001',
        sentDate: new Date('2026-02-10'),
        agreement: 123,
        amount: 14500000,
        status: 'sent',
      },
      {
        id: '2',
        internalCode: 'NOM-2026-002',
        sentDate: new Date('2026-02-10'),
        agreement: 123,
        amount: 8500000,
        status: 'processed',
      },
      {
        id: '3',
        internalCode: 'NOM-2026-003',
        sentDate: new Date('2026-02-10'),
        agreement: 123,
        amount: 2300000,
        status: 'error',
      },
    ];
    return of(mockData).pipe(delay(800));
  }
}
