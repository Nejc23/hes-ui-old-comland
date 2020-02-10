import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localeDecimal'
})
export class LocaleDecimalPipeMock implements PipeTransform {
  constructor() {}

  public transform(value) {
    return value;
  }
}
