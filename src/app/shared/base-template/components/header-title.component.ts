import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header-title',
  templateUrl: './header-title.component.html'
})
export class HeaderTitleComponent implements OnInit {
  @Input() headerTitle: string;
  constructor() {}

  ngOnInit() {}
}
