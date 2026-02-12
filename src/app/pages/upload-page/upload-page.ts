import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NotificationService, PayrollService } from '@services/index';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-upload-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-page.html',
})
export class UploadPage {
  private payrollService = inject(PayrollService);
  private notificationService = inject(NotificationService);

  isLoading = signal(false);
  selectedFile = signal<File | null>(null);
  isDragging = signal(false);

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.validateAndSetFile(input.files[0]);
    }
    input.value = ''; // Reset para permitir re-selección
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
    if (files && files.length > 0) {
      this.validateAndSetFile(files[0]);
    }
  }

  private validateAndSetFile(file: File) {
    // Validación estricta de extensión para Banco Estado
    if (!file.name.toLowerCase().endsWith('.txt')) {
      this.notificationService.showError('Formato no permitido. Solo se aceptan archivos .txt');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // Límite de 10MB
      this.notificationService.showError('El archivo es demasiado pesado (máx 10MB)');
      return;
    }

    this.selectedFile.set(file);
    this.notificationService.showSuccess('Archivo cargado correctamente');
  }

  clearFile() {
    this.selectedFile.set(null);
  }

  onSubmit() {
    const file = this.selectedFile();
    if (!file) return;

    this.isLoading.set(true);

    this.payrollService
      .uploadPayroll(file)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Nómina enviada exitosamente');
          this.clearFile();
        },
        error: (err) => this.notificationService.showError('Error en el envío: ' + err.message),
      });
  }
}
