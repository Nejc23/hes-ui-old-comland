import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

export interface FormData {
  name: string;
  required: boolean;
  control: AbstractControl;
}

@Component({
  selector: 'app-card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.scss']
})
export class CardItemComponent implements OnInit, OnChanges {
  @Input() title = '';
  @Input() buttonLabel = '';
  @Input() withEdit = false;
  @Input() form: FormGroup;
  @Input() paginationLimit;

  @Output() buttonClickEvent = new EventEmitter<boolean>();
  initLimit = 0;

  controls: Array<FormData> = [];
  private PAGINATION_INCREMENT = 4;

  constructor() {}

  ngOnInit(): void {
    this.initLimit = this.paginationLimit;
  }

  ngOnChanges() {
    if (this.form) {
      Object.keys(this.form.controls).forEach((control: string) => {
        const typedControl: AbstractControl = this.form.controls[control];
        const validator = typedControl.validator && typedControl.validator({} as AbstractControl);
        this.controls.push({
          name: control,
          required: validator && validator.required,
          control: typedControl
        });
        // should log the form controls value and be typed correctly
      });
    }
  }

  isRequired(formData: FormData) {
    if (formData.required) {
      return 'tw-bg-[#FAFBFC]'; // todo add to config
    } else return '';
  }

  showMoreItems() {
    this.paginationLimit += this.PAGINATION_INCREMENT;
  }

  showLessItems() {
    this.paginationLimit = this.initLimit;
  }

  onButtonClicked() {
    this.buttonClickEvent.emit(true);
  }
}
