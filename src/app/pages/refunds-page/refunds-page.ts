import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Settlement } from '@interfaces/domain';
import { PayrollService } from '@services/index';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-refunds-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './refunds-page.html',
  styleUrl: './refunds-page.css',
})
export class RefundsPage {
  private payrollService = inject(PayrollService);

  isLoading = signal(false);
  data = signal<Settlement[]>([]);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    // Simulamos paso de filtros
    // this.payrollService
    //   .getSettlements({})
    //   .pipe(finalize(() => this.isLoading.set(false)))
    //   .subscribe((res) => this.data.set(res));
  }
}
