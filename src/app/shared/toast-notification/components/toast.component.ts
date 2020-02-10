import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastNotificationService } from '../services/toast-notification.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  // tslint:disable-next-line:no-host-metadata-property
  host: { '[class.ngb-toasts]': 'true' }
})
export class ToastComponent implements OnInit {
  constructor(private router: Router, public fb: FormBuilder, public toastService: ToastNotificationService) {}

  ngOnInit() {}

  isTemplate(toast) {
    return toast.textOrTpl instanceof TemplateRef;
  }
}
