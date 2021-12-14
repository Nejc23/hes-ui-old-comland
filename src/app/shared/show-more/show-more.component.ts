import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-show-more',
  templateUrl: './show-more.component.html',
  styleUrls: ['./show-more.component.scss']
})
export class ShowMoreComponent {
  @Input() opened = false;

  constructor() {}

  toggle() {
    this.opened = !this.opened;
  }
}
