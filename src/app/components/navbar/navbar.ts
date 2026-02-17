import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HealthService } from '@services/index';
import { catchError, interval, map, of, startWith, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
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
