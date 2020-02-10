import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormsUtilsService } from '../../services/forms-utils.service';

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html'
})
export class TimepickerComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  @Input() property: string;
  @Output() valueChange = new EventEmitter();

  subscription: Subscription;
  constructor(private config: NgbTimepickerConfig, private formUtils: FormsUtilsService) {
    this.config.spinners = false;
  }

  ngOnInit() {
    if (!this.form) {
      throw Error('TimePicker - form input missing.');
    }
    if (!this.property) {
      throw Error('TimePicker - property input missing.');
    }
    this.subscription = this.form.get(this.property).valueChanges.subscribe(value => this.onFormChange<any>(value));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onFormChange<T>(value: T) {
    return this.valueChange.emit(value);
  }

  get formControl() {
    return this.form.get(this.property);
  }

  showErrors(): boolean {
    return this.formUtils.shouldInputShowErrors(this.formControl);
  }
}
