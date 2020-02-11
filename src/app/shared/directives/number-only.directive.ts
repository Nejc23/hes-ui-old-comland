import { Directive, ElementRef, HostListener, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormGroup } from '@angular/forms';

@Directive({
  selector: '[appNumberOnly]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberOnlyDirective),
      multi: true
    }
  ]
})
export class NumberOnlyDirective {
  @Input() form: FormGroup;

  constructor(private el: ElementRef) {}

  /**  Dovoli vnos znakov: 0-9 | , | . | TAB | BACKSPACE | DELETE | PuščicaLevo | PuščicaDesno */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): boolean {
    this.form.markAsDirty(); // IMPORTANT: Mark form as dirty if something was pressed

    let keyAllowed = false;

    const allowedInput: string[] = new Array(
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'Tab',
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight'
    );
    for (const i of allowedInput) {
      if (event.key === i) {
        keyAllowed = true;
      }
    }
    return keyAllowed;
  }
}
