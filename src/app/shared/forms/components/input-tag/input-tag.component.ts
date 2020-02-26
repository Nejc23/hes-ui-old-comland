import { Component, OnInit, Input, ViewChild, HostListener } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { TagInputComponent } from 'ngx-chips';

@Component({
  selector: 'app-input-tag',
  templateUrl: './input-tag.component.html'
})
export class InputTagComponent implements OnInit {
  // required
  @Input() form: FormGroup;
  @Input() property: string;

  // optional
  @Input() label: string;
  @Input() autocompleteItemsAsObjects: any = [];

  @ViewChild('container', { static: true }) container;
  @ViewChild('statusTag', { static: true }) tagInput: TagInputComponent;

  controlId: string;
  constructor(private formUtils: FormsUtilsService) {
    document.addEventListener('click', this.offClickHandler.bind(this));
  }

  offClickHandler(event: any) {
    if (!this.container.nativeElement.contains(event.target)) {
      // check click origin
      this.tagInput.dropdown.hide();
    }
  }
  ngOnInit() {
    if (!this.form) {
      throw Error('InputTextComponent - form input missing.');
    }
    if (!this.property) {
      throw Error('InputTextComponent - property input missing.');
    }
  }

  get formControl(): AbstractControl {
    return this.form.get(this.property);
  }

  get required(): boolean {
    return this.formUtils.hasFormControlRequiredField(this.formControl);
  }

  showErrors(): boolean {
    return this.formUtils.shouldInputShowErrors(this.formControl);
  }
}
