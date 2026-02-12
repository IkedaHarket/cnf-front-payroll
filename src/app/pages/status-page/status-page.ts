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
  payrollService = inject(PayrollService);
  isLoading = signal(true);
  data = signal<Payroll[]>([]);

  constructor() {
    this.loadData();
  }

  loadData() {
    this.payrollService
      .getHistory()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((res) => this.data.set(res));
  }
}
