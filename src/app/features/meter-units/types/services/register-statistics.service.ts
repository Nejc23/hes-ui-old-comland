import { Injectable } from '@angular/core';
import { RegisterValue } from 'src/app/core/repository/interfaces/data-processing/profile-definitions-for-device.interface';
import { RegisterStatistics } from '../../registers/interfaces/data-processing-request.interface';

@Injectable({
  providedIn: 'root'
})
export class RegisterStatisticsService {
  constructor() {}

  getRegisterStatistics(registerValues: RegisterValue[], normalizedData: boolean): RegisterStatistics {
    let dataField = 'valueWithUnit';
    if (normalizedData) {
      dataField = 'normValueWithUnit';
    }
    if (registerValues == null || registerValues.length === 0) {
      return null;
    }

    const values = registerValues
      .filter((f) => f[dataField]?.value && !isNaN(Number(f[dataField]?.value)))
      .map((r) => Number(r[dataField]?.value));
    if (values && values.length > 0) {
      const avg = values.reduce((a, b) => a + b) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);

      return {
        averageValue: avg,
        minValue: registerValues.find((r) => Number(r[dataField]?.value) === min),
        maxValue: registerValues.find((r) => Number(r[dataField]?.value) === max)
      };
    } else {
      return null;
    }
  }
}
