import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appWidgetGridItem]'
})
export class WidgetGridItemDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
