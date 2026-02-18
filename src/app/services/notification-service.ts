import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  isClosing?: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _toasts = signal<Toast[]>([]);
  public readonly toasts = this._toasts.asReadonly();

  show(message: string, type: ToastType = 'info') {
    const id = Date.now();
    const newToast: Toast = { id, message, type };
    this._toasts.update((items) => [...items, newToast]);
    setTimeout(() => this.remove(id), 8000);
  }

  showSuccess(message: string) {
    this.show(message, 'success');
  }
  showError(message: string) {
    this.show(message, 'error');
  }

  remove(id: number) {
    this._toasts.update((items) => items.map((t) => (t.id === id ? { ...t, isClosing: true } : t)));

    setTimeout(() => {
      this._toasts.update((items) => items.filter((t) => t.id !== id));
    }, 300);
  }
}
