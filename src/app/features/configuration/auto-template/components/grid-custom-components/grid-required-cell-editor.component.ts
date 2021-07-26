import { ICellEditorAngularComp } from '@ag-grid-community/angular';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-grid-required-cell-editor',
  templateUrl: './grid-required-cell-editor.component.html'
})
export class GridRequiredCellEditorComponent implements ICellEditorAngularComp {
  public params: any;
  public form: FormGroup;
  private formName = '';

  constructor(private formBuilder: FormBuilder) {}

  // called on init
  agInit(params: any): void {
    this.params = params;
    this.formName = params.formName;

    this.form = this.params.context.forma;
    this.form.get(this.formName).setValue(params.value);
    this.form.get('ruleId').setValue(params.data.autoTemplateRuleId);
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    return true;
  }

  get nameProperty() {
    return this.formName;
  }

  getValue(): any {
    return this.form.get(this.formName).value;
  }
}
