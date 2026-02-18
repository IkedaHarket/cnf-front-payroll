// src/app/services/health-service.ts
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { of, tap, catchError, map } from 'rxjs'; // Asegúrate de importar tap y map
import { ApiResponse, HealthCheckResponse } from '../interfaces/api';
import { environment } from '../../environments/environment';
import { DataWithStatus } from '@interfaces/domain';

@Injectable({
  providedIn: 'root',
})
export class HealthService {
  private readonly _http = inject(HttpClient);
  private readonly apiUrl = `${environment.api.url}payroll`;

  public readonly systemHealth = signal<DataWithStatus<HealthCheckResponse>>(DataWithStatus.idle());

  checkStatus() {
    this.systemHealth.set(DataWithStatus.loading(this.systemHealth().data));

    return this._http.get<ApiResponse<HealthCheckResponse>>(`${this.apiUrl}/health`).pipe(
      map((res) => {
        if (res.success) {
          return DataWithStatus.success(res.data);
        }
        return DataWithStatus.error<HealthCheckResponse>(res.message);
      }),
      tap((state) => {
        this.systemHealth.set(state);
      }),
      catchError((err: HttpErrorResponse) => {
        const apiError = err.error as ApiResponse<null>;
        const errorState = DataWithStatus.error<HealthCheckResponse>(
          apiError?.message || 'No se pudo contactar al servicio de salud',
        );
        this.systemHealth.set(errorState);
        return of(errorState);
      }),
    );
  }
}
