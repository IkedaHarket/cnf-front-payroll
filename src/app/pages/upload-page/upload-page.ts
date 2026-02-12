import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationService, PayrollService } from '@services/index';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-upload-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './upload-page.html',
  styleUrl: './upload-page.css',
})
export class UploadPage {
  private payrollService = inject(PayrollService);

  // Signals for reactive state
  isLoading = signal(false);
  selectedFile: File | null = null;
  isDragging = false;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Drag & Drop handlers
  onDragOver(e: Event) {
    e.preventDefault();
    this.isDragging = true;
  }
  onDragLeave(e: Event) {
    e.preventDefault();
    this.isDragging = false;
  }
  onDrop(e: any) {
    e.preventDefault();
    this.isDragging = false;
    if (e.dataTransfer.files.length > 0) {
      this.selectedFile = e.dataTransfer.files[0];
    }
  }

  clearFile() {
    this.selectedFile = null;
  }

  onSubmit() {
    if (!this.selectedFile) return;

    this.isLoading.set(true);

    this.payrollService
      .uploadPayroll(this.selectedFile)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => alert(res.message), // In real app, use Toast Service
        error: (err) => alert('Error: ' + err.message),
      });
  }
}
