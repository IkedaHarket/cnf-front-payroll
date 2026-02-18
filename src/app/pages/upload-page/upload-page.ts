import { CommonModule } from '@angular/common';
import { Component, inject, signal, effect } from '@angular/core';
import { NotificationService, PayrollService } from '@services/index';

@Component({
  selector: 'app-upload-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-page.html',
})
export class UploadPage {
  private payrollService = inject(PayrollService);
  private notificationService = inject(NotificationService);

  uploadResource = this.payrollService.uploadResource;
  selectedFile = signal<File | null>(null);
  isDragging = signal(false);

  constructor() {
    effect(() => {
      const status = this.uploadResource.status();
      console.log({ status, value: this.uploadResource.value() });
      if (status === 'resolved' && this.uploadResource.value()) {
        this.notificationService.showSuccess('Nómina procesada exitosamente');
        this.selectedFile.set(null);
        this.payrollService.clearState();
      }

      if (status === 'error') {
        const error = this.uploadResource.error();
        if (error) {
          this.notificationService.showError(`Error: ${error.message}`);
        }
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.validateAndSetFile(input.files[0]);
    }
    input.value = '';
  }

  onDragOver(e: DragEvent) {
    e.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(e: DragEvent) {
    e.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragging.set(false);
    const files = e.dataTransfer?.files;
    if (files?.length) {
      this.validateAndSetFile(files[0]);
    }
  }

  private validateAndSetFile(file: File) {
    this.payrollService.clearState();
    if (!file.name.toLowerCase().endsWith('.txt')) {
      this.notificationService.showError('Solo se aceptan archivos .txt');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.notificationService.showError('El archivo excede los 10MB');
      return;
    }
    this.selectedFile.set(file);
  }

  clearFile() {
    this.selectedFile.set(null);
    this.payrollService.clearState();
  }

  onSubmit() {
    const file = this.selectedFile();
    if (file) {
      this.payrollService.uploadPayroll(file);
    }
  }
}
