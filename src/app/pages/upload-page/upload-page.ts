// src/app/pages/upload-page/upload-page.ts
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

  // Exponemos el estado del servicio al template
  uploadState = this.payrollService.uploadState;

  // Estados locales solo para UI
  selectedFile = signal<File | null>(null);
  isDragging = signal(false);

  constructor() {
    // Efecto reactivo para notificaciones automáticas según el estado
    effect(() => {
      const state = this.uploadState();
      if (state.status === 'success') {
        this.notificationService.showSuccess('Nómina procesada exitosamente');
        this.selectedFile.set(null);
      } else if (state.status === 'error') {
        this.notificationService.showError(`Error al procesar la nómina: ${state.error}`);
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
