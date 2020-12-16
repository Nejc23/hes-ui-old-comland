import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { MonitorObjects, ResponseCommonRegisterGroup } from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';

@Injectable({
  providedIn: 'root'
})
export class PlcMeterSetLimiterService {
  constructor() {}

  getListOfRegisterDefinitionNames(res: ResponseCommonRegisterGroup[]) {
    const registerDefList = res.map(
      result2 => _.assign({ value: result2.name, id: result2.groupId })
      // result2.registerDefinitions.map(d => _.assign({ value: d.name, id: d.registerDefinitionId }))
    );
    // const nameList = _.flatMap(registerDefList, nameObj => _.map(nameObj, objVal => objVal));
    return _.orderBy(_.uniqWith(registerDefList, _.isEqual), d => d.value, 'asc');
  }
}
