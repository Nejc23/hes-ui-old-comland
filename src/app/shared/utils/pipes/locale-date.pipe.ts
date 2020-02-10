import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localeDate'
})
export class LocaleDatePipe implements PipeTransform {
  constructor() {}
  public transform(value): any {
    // TODO: finish this
    // return moment(value).format(this.legacyDate.getDateFormat());
  }
}
