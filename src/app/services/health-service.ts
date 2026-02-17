import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DataWithStatus, HealthCheckResponse } from '@interfaces/api';
import { environment } from 'src/environments/environment';
import { HealthStatus } from '@interfaces/domain';

@Injectable({
  providedIn: 'root',
})
export class HealthService {
  private readonly _http = inject(HttpClient);
  private readonly apiUrl = `${environment.api.url}payroll`;

  public readonly systemHealth = signal<DataWithStatus<HealthStatus | null>>({
    success: false,
    data: null,
    loading: false,
    error: false,
  });

  checkStatus(): Observable<DataWithStatus<HealthStatus | null>> {
    this.systemHealth.update((s) => ({ ...s, loading: true, error: false }));

    return this._http.get<HealthCheckResponse>(`${this.apiUrl}/health`).pipe(
      map((res) => {
        this.systemHealth.set({
          loading: false,
          error: false,
          data: res,
          success: true,
        });
        return this.systemHealth();
      }),
      catchError((err) => this._processError(err, this.systemHealth)),
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
}
