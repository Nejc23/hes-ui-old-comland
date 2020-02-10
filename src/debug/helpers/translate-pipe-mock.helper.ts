import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translate'
})
export class TranslatePipeMock implements PipeTransform {
  constructor() {}
  transform(value: any) {
    return value;
  }
}
