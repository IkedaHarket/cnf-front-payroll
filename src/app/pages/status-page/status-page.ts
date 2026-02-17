import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Payroll } from '@interfaces/domain';
import { PayrollService } from '@services/payroll-service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-status-page',
  imports: [CommonModule],
  templateUrl: './status-page.html',
  styleUrl: './status-page.css',
})
export class StatusPage {
  private payrollService = inject(PayrollService);

  isLoading = signal(true);
  data = signal<Payroll[]>([]);

  loadData() {
    // this.payrollService
    //   .getHistory()
    //   .pipe(finalize(() => this.isLoading.set(false)))
    //   .subscribe({
    //     next: (res) => {
    //       if (res.success) {
    //         this.data.set(res.data); // Extraemos la data del sobre DataWithStatus
    //       }
    //     },
    //     error: () => this.data.set([]),
    //   });
  }
}
