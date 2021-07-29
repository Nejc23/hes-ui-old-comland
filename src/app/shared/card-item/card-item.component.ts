import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

export interface IFormData {
  name: string;
  control: AbstractControl;
}

@Component({
  selector: 'app-card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.scss']
})
export class CardItemComponent implements OnInit, OnChanges {
  @Input() withEdit = false;
  @Input() form: FormGroup;
  controls: Array<IFormData> = [];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.form) {
      debugger;
      Object.keys(this.form.controls).forEach((control: string) => {
        debugger;
        const typedControl: AbstractControl = this.form.controls[control];
        this.controls.push({
          name: control,
          control: typedControl
        });
        console.log(typedControl);
        // should log the form controls value and be typed correctly
      });
    }
  }
}
