import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appWidgetSettingsForm]'
})
export class WidgetSettingsFormDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
