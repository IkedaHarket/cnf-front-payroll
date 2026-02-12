import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  toast = signal<{ message: string; type: ToastType; visible: boolean }>({
    message: '',
    type: 'info',
    visible: false,
  });

  private timeoutId: any;

  show(message: string, type: ToastType = 'info') {
    // Limpiar timer previo para evitar cierres inesperados
    if (this.timeoutId) clearTimeout(this.timeoutId);

    this.toast.set({ message, type, visible: true });

    this.timeoutId = setTimeout(() => {
      this.close();
    }, 4000);
  }

  showSuccess(message: string) {
    this.show(message, 'success');
  }

  showError(message: string) {
    this.show(message, 'error');
  }

  close() {
    this.toast.update((current) => ({ ...current, visible: false }));
  }
}
