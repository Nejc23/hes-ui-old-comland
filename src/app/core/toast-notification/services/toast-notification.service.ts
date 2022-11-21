import { Injectable, TemplateRef } from '@angular/core';

export enum TypeCode {
  default = 'default',
  info = 'info',
  success = 'success',
  wait = 'wait',
  error = 'error',
  warning = 'warning'
}

@Injectable({ providedIn: 'root' })
export class ToastNotificationService {
  toasts: any[] = [];
  private defaultTitle = '';
  private defaultTimeout = 5000;

  constructor() {}

  defaultOptions(className: string) {
    return {
      delay: this.defaultTimeout,
      classname: className
    } as any;
  }

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  successToast(textOrTpl: string | TemplateRef<any>) {
    const options = this.defaultOptions('bg-success text-light');
    this.toasts.push({ textOrTpl, ...options });
  }

  errorToast(textOrTpl: string | TemplateRef<any>) {
    const options = this.defaultOptions('bg-danger text-light');
    this.toasts.push({ textOrTpl, ...options });
  }

  warningToast(textOrTpl: string | TemplateRef<any>) {
    const options = this.defaultOptions('bg-warning text-light');
    this.toasts.push({ textOrTpl, ...options });
  }

  infoToast(textOrTpl: string | TemplateRef<any>) {
    const options = this.defaultOptions('bg-info text-light');
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clearToasts() {
    this.toasts.length = 0;
  }
}
