import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-action-form',
  templateUrl: './action-form.component.html'
})
export class ActionFormComponent implements OnInit {
  form: FormGroup;

  @Output() refresh: EventEmitter<boolean> = new EventEmitter();

  constructor(private i18n: I18n, public fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.createForm();
  }

  get searchProperty() {
    return 'content';
  }
  createForm(): FormGroup {
    return this.fb.group({
      ['content']: ''
    });
  }
  nameOf(arg0: string) {
    throw new Error('Method not implemented.');
  }

  onSearch() {}

  onFilter() {}

  onColumns() {}

  onRefresh() {
    this.refresh.emit();
  }
}
