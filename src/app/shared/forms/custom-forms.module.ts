import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextComponent } from './components/input-text/input-text.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormErrorComponent } from './components/form-error/form-error.component';
import { InputCheckboxComponent } from './components/input-checkbox/input-checkbox.component';
import { InputDatepickerComponent } from './components/input-datepicker/input-datepicker.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InputToggleComponent } from './components/input-toggle/input-toggle.component';
import { InputTextareaComponent } from './components/input-textarea/input-textarea.component';
import { InputRadioComponent } from './components/input-radio/input-radio.component';
import { CustomFormErrorsComponent } from './components/custom-form-errors/custom-form-errors.component';
import { DefaultFormElementComponent } from './components/default-form-element/default-form-element.component';
import { SelectInputComponent } from './components/select-input/select-input.component';
import { TimepickerComponent } from './components/timepicker/timepicker.component';
import { InputSelectComponent } from './components/input-select/input-select.component';
import { InputDateTimeRangePickerComponent } from './components/input-datetime-range-picker/input-datetime-range-picker.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { InputSearcherComponent } from './components/input-searcher/input-searcher.component';
import { InputTagComponent } from './components/input-tag/input-tag.component';
import { TagInputModule } from 'ngx-chips';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    InputTextComponent,
    FormErrorComponent,
    InputCheckboxComponent,
    InputDatepickerComponent,
    InputDateTimeRangePickerComponent,
    InputToggleComponent,
    InputTextareaComponent,
    InputRadioComponent,
    CustomFormErrorsComponent,
    DefaultFormElementComponent,
    SelectInputComponent,
    TimepickerComponent,
    InputSelectComponent,
    InputSearcherComponent,
    InputTagComponent
  ],
  declarations: [
    InputTextComponent,
    FormErrorComponent,
    InputCheckboxComponent,
    InputDatepickerComponent,
    InputDateTimeRangePickerComponent,
    InputToggleComponent,
    InputTextareaComponent,
    InputRadioComponent,
    CustomFormErrorsComponent,
    DefaultFormElementComponent,
    SelectInputComponent,
    TimepickerComponent,
    InputSelectComponent,
    InputSearcherComponent,
    InputTagComponent
  ],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgbModule, TagInputModule, NgxDaterangepickerMd.forRoot()]
})
export class CustomFormsModule {
  static forRoot(): ModuleWithProviders<CustomFormsModule> {
    return {
      ngModule: CustomFormsModule,
      providers: []
    };
  }
}
