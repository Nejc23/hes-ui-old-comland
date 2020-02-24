import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActionFormStaticTextService } from '../services/action-form-static-text.service';

@Component({
  selector: 'app-action-form',
  templateUrl: './action-form.component.html'
})
export class ActionFormComponent implements OnInit {
  form: FormGroup;

  @Output() refresh: EventEmitter<boolean> = new EventEmitter();
  @Output() columnsChange: EventEmitter<boolean> = new EventEmitter();
  @Output() search = new EventEmitter<string>();

  constructor(private i18n: I18n, public fb: FormBuilder, public staticTextService: ActionFormStaticTextService) {}

  ngOnInit() {
    this.form = this.createForm();
  }

  insertedValue($event: string) {
    this.search.emit($event);
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

  onFilter() {}

  onColumns() {
    this.columnsChange.emit();
  }

  onRefresh() {
    this.refresh.emit();
  }
}
