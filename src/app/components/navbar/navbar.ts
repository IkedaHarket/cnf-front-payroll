// src/app/components/navbar/navbar.ts
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, of } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { HealthService } from '@services/health-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  standalone: true,
})
export class NavbarComponent {
  private readonly _healthService = inject(HealthService);

  public readonly status = toSignal(
    interval(30000).pipe(
      startWith(0),
      switchMap(() => this._healthService.checkStatus()),
      map((res) => res.data ?? { backend: false, bancoEstado: false }),
      catchError(() => of({ backend: false, bancoEstado: false })),
    ),
    { initialValue: { backend: false, bancoEstado: false } },
  );
}
