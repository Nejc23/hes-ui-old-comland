import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localeDate'
})
export class LocaleDatePipeMock implements PipeTransform {
  constructor() {}
  public transform(value) {
    return value;
  }
}
