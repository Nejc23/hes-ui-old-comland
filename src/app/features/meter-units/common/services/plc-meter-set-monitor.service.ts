import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { MonitorObjects, ResponseCommonRegisterGroup } from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';

@Injectable({
  providedIn: 'root'
})
export class PlcMeterSetMonitorService {
  constructor() {}

  getListOfRegisterDefinitionNames(res: ResponseCommonRegisterGroup[]) {
    const registerDefList = res.map((result) => result.registerDefinitions.map((d) => d.name));
    const nameList = _.flatMap(registerDefList, (nameObj) => _.map(nameObj, (objVal) => ({ name: objVal })));
    return _.orderBy(_.uniqWith(nameList, _.isEqual), (d) => d.name, 'asc');
  }

  setForm(items: any): FormGroup {
    // set form
    const group = {};
    items.forEach((inputTemplate) => {
      group[inputTemplate.name] = new FormControl('');
    });
    return new FormGroup(group);
  }

  checkAtLeastOneThresholdExists(form: FormGroup, listOfFields: ResponseCommonRegisterGroup[]): boolean {
    if (form && form.valid && listOfFields && listOfFields.length > 0) {
      for (const element of listOfFields) {
        if (form.get(element.name).value) {
          return true;
        }
      }
    }
    return false;
  }

  fillMonitorObjectDataFromForm(form: FormGroup, listOfFields: ResponseCommonRegisterGroup[]): MonitorObjects[] {
    const data = [];
    if (form && form.valid && listOfFields && listOfFields.length > 0) {
      listOfFields.forEach((element) => {
        if (form.get(element.name).value) {
          // get just fields with values
          data.push({ name: element.name, threshold: form.get(element.name).value });
        }
      });
    }
    return data;
  }
}
