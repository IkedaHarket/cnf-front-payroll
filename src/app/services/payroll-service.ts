import { Injectable } from '@angular/core';
import { ApiResponse } from '@interfaces/api';
import { Payroll, Settlement } from '@interfaces/domain';
import { Observable, of, timer } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PayrollService {
  // Simulate file upload
  uploadPayroll(file: File): Observable<ApiResponse<null>> {
    return timer(2000).pipe(
      // 2s network delay
      map(() => {
        return {
          success: true,
          data: null,
          message: 'Nómina cargada exitosamente al servidor seguro.',
        };
      }),
    );
  }

  // Get history
  getHistory(): Observable<Payroll[]> {
    const mockData: Payroll[] = [
      {
        id: '1',
        internalCode: 'NOM-2026-001',
        sentDate: '2026-02-12',
        agreement: 'Proveedores',
        amount: 14500000,
        status: 'sent',
      },
      {
        id: '2',
        internalCode: 'NOM-2026-002',
        sentDate: '2026-02-11',
        agreement: 'Pensiones',
        amount: 8500000,
        status: 'processed',
      },
      {
        id: '3',
        internalCode: 'NOM-2026-003',
        sentDate: '2026-02-10',
        agreement: 'Honorarios',
        amount: 2300000,
        status: 'error',
      },
    ];
    return of(mockData).pipe(delay(800));
  }

  // Get Settlements (Updated Mock)
  getSettlements(filters: any): Observable<Settlement[]> {
    const mockData: Settlement[] = [
      {
        id: '8821',
        paymentDate: '2026-02-12',
        amount: 120000,
        status: 'A',
        details: 'Abono en cuenta rut exitoso',
      },
      {
        id: '8822',
        paymentDate: '2026-02-12',
        amount: 45000,
        status: 'PC',
        details: 'Cuenta destino bloqueada por banco',
      },
      {
        id: '8823',
        paymentDate: '2026-02-11',
        amount: 890000,
        status: 'A',
        details: 'Pago masivo procesado',
      },
      {
        id: '8824',
        paymentDate: '2026-02-10',
        amount: 2500000,
        status: 'AP',
        details: 'Fondos insuficientes parciales',
      },
      {
        id: '8825',
        paymentDate: '2026-02-10',
        amount: 12500,
        status: 'A',
        details: 'Pago servicio externo',
      },
    ];
    // Simulamos un delay un poco mayor para ver el loader
    return of(mockData).pipe(delay(1200));
  }
}
