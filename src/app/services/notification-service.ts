import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  toast = signal<{ message: string; type: 'success' | 'error' | 'info'; visible: boolean }>({
    message: '',
    type: 'info',
    visible: false,
  });

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toast.set({ message, type, visible: true });
    setTimeout(() => this.toast.set({ ...this.toast(), visible: false }), 4000);
  }

  close() {
    this.toast.set({ ...this.toast(), visible: false });
  }
}
