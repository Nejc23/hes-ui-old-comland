import { Injectable } from '@angular/core';
import { formatDate } from '@progress/kendo-angular-intl';
import { encodeBase64, saveAs } from '@progress/kendo-file-saver';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExportHelper {
  constructor() {}

  exportToCSV(
    data: Array<any>,
    dataFields: Array<string>,
    headerColumns: Array<string>,
    fileName: string,
    delimiter: string = ',',
    lineSeparator: string = '\n'
  ) {
    if (fileName.length == 0) {
      fileName = 'data_' + moment().format(environment.dateTimeFileFormat);
    }
    if (!fileName.endsWith('.csv')) {
      fileName += '.csv';
    }

    // Prepare content
    const content = data.map((item) => {
      return dataFields
        .map((prop) => {
          if (prop == 'timestamp' && item[prop]) {
            const dateTime = new Date(item[prop]);
            return `${formatDate(dateTime, environment.dateTimeFormat)}`;
          } else {
            return item[prop]?.toString() ?? '';
          }
        })
        .join(delimiter);
    });

    // Save content as csv file.
    const dataURI = 'data:text/plain;base64,' + encodeBase64([headerColumns.join(',')].concat(content).join(lineSeparator));
    saveAs(dataURI, fileName);
  }
}
