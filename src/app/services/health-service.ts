// src/app/services/health-service.ts
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { timer, map, catchError, throwError } from 'rxjs';
import { ApiResponse, HealthCheckResponse } from '../interfaces/api';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HealthService {
  private readonly _http = inject(HttpClient);
  private readonly apiUrl = `${environment.api.url}payroll`;

  private readonly _pollTimer = toSignal(timer(0, 30000));

  public readonly systemHealth = rxResource({
    params: () => this._pollTimer(),
    stream: () =>
      this._http.get<ApiResponse<HealthCheckResponse>>(`${this.apiUrl}/health`).pipe(
        map((res) => {
          if (!res.success) throw new Error(res.message);
          return res.data;
        }),
        catchError((err: HttpErrorResponse) => {
          const msg = (err.error as ApiResponse<any>)?.message || 'Error de conexión';
          return throwError(() => new Error(msg));
        }),
      ),
  });

  public readonly currentStatus = signal<HealthCheckResponse>({
    backend: false,
    bancoEstado: false,
  });
}
