import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-title',
  templateUrl: './header-title.component.html'
})
export class HeaderTitleComponent {
  @Input() headerTitle: string;
  constructor() {}
}
