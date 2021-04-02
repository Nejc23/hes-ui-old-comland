import { ChartsModule } from '@progress/kendo-angular-charts';
import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextComponent } from './components/input-text/input-text.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormErrorComponent } from './components/form-error/form-error.component';
import { InputCheckboxComponent } from './components/input-checkbox/input-checkbox.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { InputToggleComponent } from './components/input-toggle/input-toggle.component';
import { InputTextareaComponent } from './components/input-textarea/input-textarea.component';
import { InputRadioComponent } from './components/input-radio/input-radio.component';
import { CustomFormErrorsComponent } from './components/custom-form-errors/custom-form-errors.component';
import { DefaultFormElementComponent } from './components/default-form-element/default-form-element.component';
import { SelectInputComponent } from './components/select-input/select-input.component';
import { InputSelectComponent } from './components/input-select/input-select.component';
import { InputSearcherComponent } from './components/input-searcher/input-searcher.component';
import { InputTagComponent } from './components/input-tag/input-tag.component';
import { InputMultiselectComponent } from './components/input-multiselect/input-multiselect.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { InputCheckboxGridComponent } from './components/input-checkbox/input-checkbox-grid.component';
import { InputSwitchComponent } from './components/input-switch/input-switch.component';
import { InputNumericComponent } from './components/input-numeric/input-numeric.component';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { DateTimePickerComponent } from './components/datetime-picker/datetime-picker.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { FileSelectComponent } from './components/file-select/file-select.component';
import { SelectDropdownComponent } from './components/select-dropdown/select-dropdown.component';
import { ProgressBarModule } from '@progress/kendo-angular-progressbar';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { PopupModule } from '@progress/kendo-angular-popup';
import { TabStripModule } from '@progress/kendo-angular-layout';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    InputTextComponent,
    FormErrorComponent,
    InputCheckboxComponent,
    InputCheckboxGridComponent,
    InputToggleComponent,
    InputTextareaComponent,
    InputRadioComponent,
    CustomFormErrorsComponent,
    DefaultFormElementComponent,
    SelectInputComponent,
    SelectDropdownComponent,
    InputSelectComponent,
    InputSearcherComponent,
    InputTagComponent,
    InputMultiselectComponent,
    InputSwitchComponent,
    InputNumericComponent,
    DropDownsModule,
    UploadsModule,
    InputsModule,
    DateInputsModule,
    TimePickerComponent,
    DateTimePickerComponent,
    FileUploadComponent,
    FileSelectComponent,
    TabStripModule,
    ChartsModule,
    TextBoxModule,
    PopupModule
  ],
  declarations: [
    InputTextComponent,
    FormErrorComponent,
    InputCheckboxComponent,
    InputCheckboxGridComponent,
    InputToggleComponent,
    InputTextareaComponent,
    InputRadioComponent,
    CustomFormErrorsComponent,
    DefaultFormElementComponent,
    SelectInputComponent,
    SelectDropdownComponent,
    InputSelectComponent,
    InputSearcherComponent,
    InputTagComponent,
    InputSwitchComponent,
    InputNumericComponent,
    InputMultiselectComponent,
    TimePickerComponent,
    DateTimePickerComponent,
    FileUploadComponent,
    FileSelectComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    BsDropdownModule.forRoot(),
    DropDownsModule,
    InputsModule,
    DateInputsModule,
    UploadsModule,
    TabStripModule,
    ChartsModule,
    ProgressBarModule,
    TextBoxModule,
    PopupModule
  ]
})
export class CustomFormsModule {
  static forRoot(): ModuleWithProviders<CustomFormsModule> {
    return {
      ngModule: CustomFormsModule,
      providers: []
    };
  }
}
